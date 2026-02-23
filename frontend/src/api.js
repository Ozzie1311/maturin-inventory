import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

/* ── Auth ─────────────────────────────────── */
export const login = (data) => api.post('/api/users/login', data)
export const register = (data) => api.post('/api/users/register', data)

/* ── Equipment ────────────────────────────── */
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const getInventory = (token) => api.get('/inventario', authHeader(token))
export const getEquipment = (id, token) =>
  api.get(`/inventario/${id}`, authHeader(token))
export const createEquipment = (data, token) =>
  api.post('/inventario', data, authHeader(token))
export const updateEquipment = (id, data, token) =>
  api.put(`/inventario/${id}`, data, authHeader(token))
export const deleteEquipment = (id, token) =>
  api.delete(`/inventario/${id}`, authHeader(token))

export default api
