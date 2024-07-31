"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo, fetchTodos, addTodo, updateTodo, deleteTodo } from "./service";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const {
    data: todosData,
    isLoading,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, "id">) => addTodo(newTodo),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => [
        ...(oldData || []),
        newTodo,
      ]);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo: Todo) => updateTodo(updatedTodo),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) =>
        oldData?.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) =>
        oldData?.filter((todo) => todo.id !== id)
      );
    },
  });

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodoMutation.mutate({
        userId: 1,
        title: newTodo,
        completed: false,
      });
      setNewTodo("");
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
  };

  const handleUpdateTodo = () => {
    if (editingTodo && newTodo.trim()) {
      updateTodoMutation.mutate({
        ...editingTodo,
        title: newTodo,
      });
      setEditingTodo(null);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          There is an error
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 10,
        backgroundColor: "#F8F8F8",
        padding: "1px",
        paddingBottom: "10px",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "black", marginTop: "30px" }}
      >
        TODOS
      </Typography>
      <List style={{ color: "black" }}>
        {todosData?.slice(0, 5).map((todo) => (
          <ListItem key={todo.id} divider>
            <ListItemText primary={todo.title} />
            <IconButton
              style={{ marginRight: "14px" }}
              onClick={() => handleEditTodo(todo)}
              edge="end"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteTodo(todo.id)}
              edge="end"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="New Todo"
          variant="outlined"
          fullWidth
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
        >
          {editingTodo ? "Update Todo" : "Add Todo"}
        </Button>
      </Box>
    </Container>
  );
}
