import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

type Task = {
  id: string
  text: string
  completed: boolean
}

const STORAGE_KEY = 'react-todo-app-tasks'

function loadTasks(): Task[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]'
    )

    if (!Array.isArray(saved)) return []

    return saved.filter(
      (task): task is Task =>
        task !== null &&
        typeof task === 'object' &&
        typeof task.id === 'string' &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean'
    )
  } catch {
    return []
  }
}

function Tasks() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [tasks])

  function clearEditor() {
    setText('')
    setEditingId(null)
  }

  function saveTask() {
    if (!text.trim()) return

    if (editingId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingId
            ? { ...task, text: text.trim() }
            : task
        )
      )
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
      }

      setTasks((previousTasks) => [...previousTasks, newTask])
    }

    clearEditor()
    inputRef.current?.focus()
  }

  function editTask(task: Task) {
    setText(task.text)
    setEditingId(task.id)
    inputRef.current?.focus()
  }

  function deleteTask(id: string) {
    if (!window.confirm('Delete this task?')) return

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    )

    if (editingId === id) clearEditor()
  }

  function toggleTask(id: string) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  return (
    <main className="page tasks-page">
      <button type="button" onClick={() => navigate('/')}>
        Back to Home
      </button>

      <h1>My Tasks</h1>
      <p>
        {tasks.length} total · {completedCount} completed ·{' '}
        {tasks.length - completedCount} remaining
      </p>

      {storageError && (
        <p role="alert">
          Your browser could not save your tasks.
          Keep this page open and copy any important tasks.
        </p>
      )}

      <label htmlFor="new-task" className="field-label">
        {editingId !== null ? 'Edit task' : 'New task'}
      </label>

      <form
        className="task-form"
        onSubmit={(event) => {
          event.preventDefault()
          saveTask()
        }}
      >
        <input
          ref={inputRef}
          id="new-task"
          type="text"
          placeholder="What do you need to do?"
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />

        <button type="submit" disabled={!text.trim()}>
          {editingId !== null ? 'Save Changes' : 'Add Task'}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="secondary-button"
            onClick={clearEditor}
          >
            Cancel
          </button>
        )}
      </form>

      {tasks.length === 0 ? (
        <p className="empty-message">
          No tasks yet. Add your first task above!
        </p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <label className="task-check">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>

              <div className="task-actions">
                <button
                  type="button"
                  className="secondary-button"
                  aria-label={`Edit task: ${task.text}`}
                  onClick={() => editTask(task)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete task: ${task.text}`}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Tasks