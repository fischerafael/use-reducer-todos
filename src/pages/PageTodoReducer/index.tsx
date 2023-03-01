import React, { useReducer, useState } from "react";

interface ITodo {
  id: string;
  description: string;
  isDone: boolean;
}

interface IAddTodo {
  type: "CREATE";
  payload: string;
}

type ITodoAction =
  | IAddTodo
  | { type: "UPDATE"; payload: string }
  | { type: "DELETE"; payload: string };

const initialState: ITodo[] = [];

// usecases
// queue
// another
// before
class TodoUseCases {
  constructor(private state: ITodo[]) {}

  add(description: string): ITodo[] {
    return [
      ...this.state,
      {
        id: new Date().toISOString(),
        isDone: false,
        description: description,
      },
    ];
  }

  update(id: string): ITodo[] {
    return this.state.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: !todo.isDone };
      }
      return todo;
    });
  }

  delete(id: string): ITodo[] {
    return this.state.filter((todo) => todo.id !== id);
  }
}

// reducer
const reducer = (state: ITodo[], action: ITodoAction): ITodo[] => {
  const todoUseCases = new TodoUseCases(state);

  if (action.type === "CREATE") {
    return todoUseCases.add(action.payload);
  }
  if (action.type === "UPDATE") {
    return todoUseCases.update(action.payload);
  }
  if (action.type === "DELETE") {
    return todoUseCases.delete(action.payload);
  }
  return state;
};

// codigo react
export const PageTodoReducer = () => {
  const [todos, dispatch] = useReducer(reducer, initialState);
  const [currentTodo, setCurrentTodo] = useState("");

  const handleAddTodo = () => {
    dispatch({ type: "CREATE", payload: currentTodo });
    setCurrentTodo("");
  };

  const handleUpdateTodo = (id: string) => {
    dispatch({ type: "UPDATE", payload: id });
  };

  const handleDeleteTodo = (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  };

  return (
    <div>
      <h1>Todo List with useReducer</h1>
      <input
        type="text"
        placeholder="New Todo"
        value={currentTodo}
        onChange={(e) => setCurrentTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.description}
            <button onClick={() => handleUpdateTodo(todo.id)}>
              {todo.isDone ? "Uncomplete" : "Complete"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
