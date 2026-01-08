import {useState} from 'react';
import Task from './components/Task';

export default function App() {
  const[tasks, setTasks] = useState([
    {id: 1, title: "Learn React", completed: false},
    {id: 2, title: "Learn TailwindCSS", completed: true},
    {id: 3, title: "Build a To-Do App", completed: false},
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  }
}