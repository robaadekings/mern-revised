import TaskItem from './Taskitem';

const TaskList = ({ tasks, onToggle, onDelete }) => {
    return (
        <ul className="space-y-3">
            {tasks.map((task) => (
                <TaskItem 
                    key={task._id} 
                    task={task} 
                    ontoggle={onToggle} 
                    ondelete={onDelete} 
                />
            ))}
        </ul>
    );
};

export default TaskList;
