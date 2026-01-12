import { CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function TaskCard({ task, onToggle }) {
	const { _id, title, description, createdAt, completed } = task || {}

	return (
		<div className={`task-card ${completed ? 'opacity-90' : ''}`}>
				<div className="task-icon text-indigo-500">
					<CalendarDaysIcon className="w-6 h-6" />
				</div>

				<div className="flex-1">
					<div className="flex items-start justify-between gap-3">
						<div>
							<h3 className={`font-semibold text-lg ${completed ? 'line-through text-gray-400' : ''}`}>{title || 'Untitled task'}</h3>
							{description && <p className={`text-sm mt-1 ${completed ? 'text-gray-400' : 'text-muted'}`}>{description}</p>}
							{createdAt && <div className="text-xs text-gray-500 mt-2">{new Date(createdAt).toLocaleString()}</div>}
						</div>

						<div className="flex-shrink-0 flex flex-col items-end gap-2">
							<label className="inline-flex items-center gap-2 text-sm">
								<input aria-label="mark completed" type="checkbox" checked={!!completed} onChange={e => onToggle && onToggle(_id, e.target.checked)} />
								<span className="text-xs">Done</span>
							</label>
							<span className={`status-badge ${completed ? 'status-completed' : 'status-active'}`}>{completed ? 'Completed' : 'Active'}</span>
						</div>
					</div>
				</div>
			</div>
	)
}
