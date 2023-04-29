import {
  faAdd,
  faCancel,
  faDownload,
  faEdit,
  faFileImport,
  faListCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";

import "./TodoList.css";

function TodoList({ todos, addTodo, deleteTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importedTodos, setImportedTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
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
      const newTodos = [...existingTodos];
      let addedNewTodo = false;
      for (let i = 0; i < importedTodos.length; i++) {
        const newTodo = importedTodos[i];
        const isExisting = existingTodos.some(
          (todo) =>
            todo.id === newTodo.id &&
            todo.title === newTodo.title &&
            todo.description === newTodo.description
        );
        if (!isExisting) {
          newTodos.push(newTodo);
          addedNewTodo = true;
        }
      }
      if (addedNewTodo) {
        setImportedTodos(importedTodos);
        localStorage.setItem("todos", JSON.stringify(newTodos));
      } else {
        alert("Already have all the same todos.");
      }
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

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleSave = () => {
    const newTodo = { ...editingTodo, title, description };
    const newTodos = todos.map((todo) =>
      todo.id === editingTodo.id ? newTodo : todo
    );
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setEditingTodo(null);
    setTitle("");
    setDescription("");
  };

  const handleCancel = () => {
    setEditingTodo(null);
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
        <h1>{<FontAwesomeIcon icon={faListCheck} />} Todo list</h1>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id}>
              {editingTodo && editingTodo.id === todo.id ? (
                <li>
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
                  <button className="save-edit-btn" onClick={handleSave}>
                    {<FontAwesomeIcon icon={faEdit} />}
                  </button>
                  <button className="cancel-edit-btn" onClick={handleCancel}>
                    {<FontAwesomeIcon icon={faCancel} />}
                  </button>
                </li>
              ) : (
                <li>
                  <div className="todo-info">
                    <div className="todo-title">
                      {todo.title} - {todo.description}
                    </div>
                    <div className="btn">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(todo)}
                      >
                        {<FontAwesomeIcon icon={faEdit} />}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        {<FontAwesomeIcon icon={faTrash} />}
                      </button>
                    </div>
                  </div>
                </li>
              )}
            </div>
          ))
        ) : (
          <div className="n-todo">
            Yaaas queen, your <strong>to-do</strong> list is empty! Time to put
            your feet up, grab some wine, and celebrate this magical moment. Or,
            you know, you could always start a dance party in your living room.
            Just saying.
          </div>
        )}
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
        <div className="imported-todos">
          <h3>Imported Todos:</h3>
          {importedTodos.map((todo) => (
            <div key={todo.id}>
              <div className="todo-info">
                <div className="todo-title">{todo.title}</div>
                <div className="todo-desc">{todo.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p>Note: You need to refresh the page for seeing the edited todo.</p>
    </div>
  );
}

export default TodoList;
