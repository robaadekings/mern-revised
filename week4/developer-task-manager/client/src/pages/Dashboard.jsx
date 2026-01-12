import { useEffect, useState } from 'react'
import API from '../services/api'
import TaskDialog from '../components/components/TaskDialog'
import TaskCard from '../components/components/ui/TaskCard'

export default function Dashboard() {
	const [tasks, setTasks] = useState([])
	const [loading, setLoading] = useState(true)

	const fetchTasks = async () => {
		setLoading(true)
		try {
			const res = await API.get('/tasks/me')
			setTasks(res.data.tasks || [])
		} catch (err) {
			console.error('Fetch tasks error:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { fetchTasks() }, [])

	const handleCreate = async (data) => {
		try {
			await API.post('/tasks', data)
			fetchTasks()
		} catch (err) {
			console.error('Create task error:', err)
		}
	}

	const toggleCompleted = async (id, completed) => {
		// optimistic update
		setTasks(prev => prev.map(t => t._id === id ? { ...t, completed } : t))
		try {
			await API.patch(`/tasks/${id}`, { completed })
		} catch (err) {
			console.error('Toggle complete error:', err)
			// revert on error
			fetchTasks()
		}
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-bold">Tasks</h1>
					<p className="text-sm text-muted mt-1">Manage your personal tasks — add, view and track progress.</p>
				</div>
				<div className="flex items-center gap-3">
					<TaskDialog onCreate={handleCreate} />
				</div>
			</div>

			{loading ? (
				<div className="text-center py-20">Loading...</div>
			) : (
				<div>
					{tasks.length === 0 ? (
						<div className="p-8 bg-white/80 dark:bg-gray-800 rounded shadow text-center">
							<h3 className="text-lg font-semibold">No tasks yet</h3>
							<p className="text-sm text-muted mt-2">Create your first task using the form above.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{tasks.map(t => (
								<TaskCard key={t._id} task={t} onToggle={toggleCompleted} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
