export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = "http://localhost:3001/todos";

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const addTodo = async (newTodo: Omit<Todo, "id">): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const updateTodo = async (updatedTodo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const deleteTodo = async (id: number): Promise<number> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return id; // Return the ID of the deleted todo
};
