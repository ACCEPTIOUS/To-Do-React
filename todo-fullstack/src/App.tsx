import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

function App() {
  const [task, setTask] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");

  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo(): void {
    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  }

  function toggleTodo(id: number): void {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: number): void {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function clearAllTodos(): void {
    setTodos([]);
  }

  const remainingTasks = todos.filter((todo) => !todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#eaf1ff] flex items-center justify-center px-4">
      <section className="w-full max-w-[565px] min-h-[425px] bg-white rounded-2xl shadow-2xl px-8 py-9">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">My Tasks</h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Add a new task..."
            value={task}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTask(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            className="flex-1 h-[62px] rounded-xl border border-slate-300 px-5 text-lg text-slate-800 outline-none focus:border-violet-600"
          />

          <button
            onClick={addTodo}
            className="h-[62px] px-8 rounded-xl bg-violet-600 text-white text-lg font-semibold flex items-center gap-3 hover:bg-violet-700 transition"
          >
            <span className="text-3xl leading-none">+</span>
            Add
          </button>
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-700 text-base">
            {remainingTasks} tasks remaining
          </p>

          {todos.length > 0 && (
            <button
              onClick={clearAllTodos}
              className="text-sm text-red-500 font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex gap-3 mb-8">
          {(["all", "active", "completed"] as Filter[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === item
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {filteredTodos.length === 0 ? (
          <p className="text-center text-slate-400 text-lg mt-20">
            No tasks found.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5"
                  />

                  <span
                    className={`text-lg ${
                      todo.completed
                        ? "line-through text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 font-semibold hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;