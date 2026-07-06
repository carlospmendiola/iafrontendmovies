// Register page — renders the signup form and delegates registration to useAuth()
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './Register.scss'

const Register = () => {
  const { signup, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    signup(name, email, password)
  }

  return (
    <main className="register">
      <form className="form register__form" onSubmit={handleSubmit}>
        <h1 className="register__title">Crear cuenta</h1>

        <div className="form__field">
          <label className="form__label" htmlFor="register-name">Nombre</label>
          <input
            className="form__input"
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="register-email">Email</label>
          <input
            className="form__input"
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="register-password">Contraseña</label>
          <input
            className="form__input"
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="form__error" role="alert">{error}</p>}

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Cargando…' : 'Registrarse'}
        </button>
      </form>
    </main>
  )
}

export default Register
