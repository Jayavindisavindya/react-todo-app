import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App