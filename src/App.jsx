// Root component — wraps the app with routing and authentication context providers
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
