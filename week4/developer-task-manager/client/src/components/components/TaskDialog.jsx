import { useState } from 'react'

export default function TaskDialog({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title && !description) return
    await onCreate({ title, description })
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="input" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input" />
      <button className="btn-primary">Add</button>
    </form>
  )
}
