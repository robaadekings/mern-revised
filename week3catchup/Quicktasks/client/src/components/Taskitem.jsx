const TaskItem = ({ task, ontoggle, ondelete }) => {

    return(
        <li className="flex justify-between items-center bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 animate-slideIn border-l-4 border-blue-400">
            <div className="flex items-center gap-4 flex-1">
                <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => ontoggle(task._id)}
                    className="w-6 h-6 cursor-pointer accent-blue-600 rounded"
                />
                <span 
                    className={`cursor-pointer flex-1 text-lg transition-all duration-200 ${
                        task.completed 
                            ? "line-through text-gray-400" 
                            : "text-gray-800 font-medium"
                    }`} 
                    onClick={() => ontoggle(task._id)}
                >
                    {task.text}
                </span>
            </div>
            <button 
                onClick={() => ondelete(task._id)} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-110"
            >
                Delete
            </button>
        </li>
    );
};

export default TaskItem;