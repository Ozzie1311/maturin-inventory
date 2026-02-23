import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Inventory from './Inventory'
import Detail from './Detail'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={
            token ? (
              <Navigate to='/inventario' replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path='/inventario'
          element={
            token ? (
              <Inventory token={token} user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/inventario/:id'
          element={
            token ? (
              <Detail token={token} user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='*'
          element={<Navigate to={token ? '/inventario' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
