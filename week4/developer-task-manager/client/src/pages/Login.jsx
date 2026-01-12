import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const { login } = useAuth()
	const navigate = useNavigate()

	// Redirect to dashboard if already authenticated
	const { token } = useAuth()
	useEffect(() => {
		if (token) navigate('/dashboard')
	}, [token])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		try {
			await login(email, password)
			navigate('/dashboard')
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed')
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<div className="form-card">
				<div className="mb-4">
					<h2 className="text-2xl font-bold">Sign in</h2>
					<p className="text-sm text-muted mt-1">Welcome back — manage your day with clarity.</p>
				</div>
				{error && <div className="text-red-600 mb-2">{error}</div>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
					<input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
					<button className="btn-primary w-full">Sign in</button>
				</form>
				<p className="mt-4 text-sm">Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Create one</Link></p>
			</div>
		</div>
	)
}
