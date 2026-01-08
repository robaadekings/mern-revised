import { useState } from 'react';

export default function TaskForm({ onAdd }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim());
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex mb-4">
            <input
                className="flex-1 p-2 border rounded-l"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="New task"
            />

            <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
                Add
            </button>
        </form>
    );
}