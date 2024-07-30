"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo, fetchTodos, addTodo, updateTodo, deleteTodo } from "./service";

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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        There is an error
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        It is Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1
        className="text-xl"
        style={{ marginBottom: "20px", marginTop: "250px" }}
      >
        TODOS
      </h1>
      <div className="flex flex-col ">
        {todosData?.slice(0, 5).map((todo) => (
          <div className="flex" key={todo.id}>
            <h2 style={{ width: "150px" }}>{" " + todo.title}</h2>
            <button
              onClick={() => handleEditTodo(todo)}
              style={{ marginLeft: "20px" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              style={{ marginLeft: "20px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New Todo"
        style={{
          color: "black",
          marginBottom: "20px",
          marginTop: "20px",
          height: "30px",
          width: "250px",
        }}
      />
      <button
        onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "5px",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        {editingTodo ? "Update Todo" : "Add Todo"}
      </button>
    </main>
  );
}
