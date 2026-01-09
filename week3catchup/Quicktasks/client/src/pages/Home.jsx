import {useState, useEffect} from 'react';
import TaskList from '../components/TaskList';
import {getTasks, createTask, updateTask, deleteTask} from '../services/api';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const res = await getTasks();
        setTasks(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        // Check for duplicate task
        const taskExists = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        if (taskExists) {
            setError('This task already exists!');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        const res = await createTask({text, completed: false});
        setTasks((prev) => [...prev, res.data]);
        setText('');
        setError('');
    };

    const handleToggle = async (id) => {
        const task = tasks.find((t) => t._id === id);
        const res = await updateTask(id, { ...task, completed: !task.completed });
        setTasks((prev) =>
            prev.map((t) => (t._id === id ? res.data : t))
        );
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
    };

    const getFilteredTasks = () => {
        switch(filter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();
    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.filter(t => !t.completed).length;

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        QuickTasks
                    </h1>
                    <p className="text-gray-500">Stay productive and organized</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm font-semibold">Total</p>
                        <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
                        <p className="text-gray-500 text-sm font-semibold">Active</p>
                        <p className="text-3xl font-bold text-orange-600">{activeCount}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm font-semibold">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleAdd} className="mb-6">
                    <div className="flex gap-2 bg-white rounded-lg shadow-lg overflow-hidden">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 px-6 py-4 outline-none text-gray-800 placeholder-gray-400"
                            placeholder="Add a new task..."
                        />
                        <button 
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 font-semibold hover:shadow-lg transition-all duration-200"
                        >
                            Add
                        </button>
                    </div>
                    {error && (
                        <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}
                </form>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {['all', 'active', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                                filter === f
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tasks List */}
                {filteredTasks.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center shadow-md">
                        <div className="text-5xl mb-4">📝</div>
                        <p className="text-gray-400 text-lg">
                            {filter === 'completed' && 'No completed tasks yet'}
                            {filter === 'active' && 'No active tasks. Great job! 🎉'}
                            {filter === 'all' && 'No tasks yet. Add one to get started!'}
                        </p>
                    </div>
                ) : (
                    <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
};

export default Home;