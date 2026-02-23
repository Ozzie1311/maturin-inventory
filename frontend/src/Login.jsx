import { useState } from 'react'
import { login as loginApi } from './api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(form)
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card} className='fade-in'>
        {/* Logo / branding */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
              <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
              <line x1='12' y1='22.08' x2='12' y2='12' />
            </svg>
          </div>
          <div>
            <h1 style={styles.brand}>Maturin Inventory</h1>
            <p style={styles.brandSub}>Sistema de gestión de equipos</p>
          </div>
        </div>

        <h2 style={styles.title}>Bienvenido de vuelta</h2>
        <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              id='email'
              name='email'
              type='email'
              required
              autoComplete='email'
              placeholder='tu@email.com'
              className='input'
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              id='password'
              name='password'
              type='password'
              required
              autoComplete='current-password'
              placeholder='••••••••'
              className='input'
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <circle cx='12' cy='12' r='10' />
                <line
                  x1='12'
                  y1='8'
                  x2='12'
                  y2='12'
                  stroke='white'
                  strokeWidth='2'
                />
                <line
                  x1='12'
                  y1='16'
                  x2='12.01'
                  y2='16'
                  stroke='white'
                  strokeWidth='2'
                />
              </svg>
              {error}
            </div>
          )}

          <button
            id='btn-login'
            type='submit'
            className='btn btn-primary'
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.miniSpinner} />
                Iniciando sesión…
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    background: '#0d0f14',
  },
  blob1: {
    position: 'absolute',
    top: '-120px',
    left: '-120px',
    width: '480px',
    height: '480px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-80px',
    right: '-80px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#13161e',
    border: '1px solid #252a38',
    borderRadius: '24px',
    padding: '40px 36px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    flexShrink: 0,
  },
  brand: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#f1f5f9',
    lineHeight: 1.2,
  },
  brandSub: { fontSize: '0.75rem', color: '#64748b', marginTop: '2px' },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '6px',
  },
  subtitle: { fontSize: '0.875rem', color: '#64748b', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '8px',
    color: '#f87171',
    padding: '10px 14px',
    fontSize: '0.85rem',
  },
  miniSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}
