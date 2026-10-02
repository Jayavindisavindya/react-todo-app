import { useNavigate } from 'react-router'

function Home() {
  const navigate = useNavigate()

  return (
    <main className="page home-page">
      <h1>My To-Do App</h1>
      <p>Plan your day, organize your tasks, and track your progress.</p>

      <button type="button" onClick={() => navigate('/tasks')}>
        Open My Tasks
      </button>
    </main>
  )
}

export default Home