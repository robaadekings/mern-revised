import { useState } from 'react';
import Task from './components/Task';
import TaskForm from './components/TaskForm';

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    const newTask = { id: Date.now(), title, completed: false };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Task Dashboard</h1>
      <TaskForm onAdd={addTask} />
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet — add one above.</p>
      ) : (
        tasks.map((task) => <Task key={task.id} {...task} onToggle={toggleTask} />)
      )}
    </div>
  );
}