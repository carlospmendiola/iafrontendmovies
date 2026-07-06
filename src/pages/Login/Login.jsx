// Login page — renders the login form and delegates authentication to useAuth()
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './Login.scss'

const Login = () => {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    login(email, password)
  }

  return (
    <main className="login">
      <form className="form login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Iniciar sesión</h1>

        <div className="form__field">
          <label className="form__label" htmlFor="login-email">Email</label>
          <input
            className="form__input"
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="login-password">Contraseña</label>
          <input
            className="form__input"
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="form__error" role="alert">{error}</p>}

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Cargando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}

export default Login
