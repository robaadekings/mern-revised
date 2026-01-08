export default function Task({ id, title, completed, onToggle }) {
    return(
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-2">
            <span className={ completed ? "line-through text-gray-500" : "" }>
                {title}
            </span>
            <button
                onClick={() => onToggle && onToggle(id)}
                className={`px-3 py-1 rounded ${completed ? 'bg-green-200' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {completed ? 'Undo' : 'Done'}
            </button>

        </div>
    );

    
}