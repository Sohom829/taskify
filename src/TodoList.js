import {
  faAdd,
  faDownload,
  faFileImport,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";

import "./TodoList.css";

function TodoList({ todos, addTodo, deleteTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importedTodos, setImportedTodos] = useState([]);
  const fileInput = useRef(null);

  const saveTodos = () => {
    const data = JSON.stringify(todos);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "todos.json";
    link.click();
  };

  const importTodos = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedTodos = JSON.parse(event.target.result);
      const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const newTodos = [...existingTodos, ...importedTodos];
      setImportedTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addTodo(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <input
            className="title-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="desc-input"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">
          {<FontAwesomeIcon icon={faAdd} />} Add
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.description}
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              {<FontAwesomeIcon icon={faTrash} />}
            </button>
          </li>
        ))}
      </ul>
      <button className="save-btn" onClick={saveTodos}>
        {<FontAwesomeIcon icon={faDownload} />} Save
      </button>
      <input
        type="file"
        ref={fileInput}
        onChange={importTodos}
        style={{ display: "none" }}
      />
      <button className="import-btn" onClick={() => fileInput.current.click()}>
        {<FontAwesomeIcon icon={faFileImport} />} Import
      </button>
      {importedTodos.length > 0 && (
        <ul>
          {importedTodos.map((todo) => (
            <li key={todo.id}>
              {todo.title} - {todo.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
