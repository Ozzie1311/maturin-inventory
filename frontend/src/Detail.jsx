import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEquipment, updateEquipment } from './api'

const CATEGORIES = [
  'Networking',
  'CCTV',
  'Perifericos',
  'Computación',
  'Telefonía',
]
const STATUSES = ['Disponible', 'En uso', 'Reparación', 'Dañado']

function statusColor(status) {
  return (
    {
      Disponible: '#22c55e',
      'En uso': '#38bdf8',
      Reparación: '#f59e0b',
      Dañado: '#ef4444',
    }[status] || '#94a3b8'
  )
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function Detail({ token, user, onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getEquipment(id, token)
        setItem(res.data.data)
        setForm(res.data.data)
      } catch {
        showToast('Error al cargar el equipo', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, token])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateEquipment(id, form, token)
      setItem(res.data.data)
      setEditing(false)
      showToast('Equipo actualizado correctamente')
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al actualizar', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div
        style={{
          background: '#0d0f14',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className='spinner' />
      </div>
    )

  if (!item)
    return (
      <div
        style={{
          background: '#0d0f14',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
        }}
      >
        Equipo no encontrado.
      </div>
    )

  const color = statusColor(item.status)

  return (
    <div style={s.page}>
      {/* ── Topbar ─────────────────────────────────── */}
      <div style={s.topbar}>
        <button
          id='btn-back'
          className='btn btn-ghost btn-sm'
          onClick={() => navigate('/inventario')}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polyline points='15 18 9 12 15 6' />
          </svg>
          Volver al inventario
        </button>
        <div style={s.topbarRight}>
          <div style={s.userChip}>
            <div style={s.avatar}>
              {user?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {user?.nombre}
            </span>
          </div>
          <button
            id='btn-logout'
            className='btn btn-ghost btn-sm'
            onClick={onLogout}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={s.content} className='fade-in'>
        {/* ── Hero card ──────────────────────────────── */}
        <div style={{ ...s.heroCard, borderTopColor: color }}>
          <div style={s.heroTop}>
            <div>
              <div style={s.categoryTag}>{item.category}</div>
              <h1 style={s.heroTitle}>{item.name}</h1>
              <p style={s.heroSub}>
                {item.brand}
                {item.model ? ` · ${item.model}` : ''}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px',
              }}
            >
              <div
                style={{
                  ...s.statusPill,
                  background: `${color}22`,
                  color,
                  border: `1px solid ${color}44`,
                }}
              >
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: color,
                  }}
                />
                {item.status}
              </div>
              <div style={s.stockBig}>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#f1f5f9',
                  }}
                >
                  {item.stock ?? 1}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  en stock
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Detail grid ────────────────────────────── */}
        <div style={s.grid}>
          {/* Info card */}
          <div style={s.infoCard}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Información del equipo</h2>
              {user?.rol === 'admin' && !editing && (
                <button
                  id='btn-edit'
                  className='btn btn-ghost btn-sm'
                  onClick={() => setEditing(true)}
                >
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {editing ? (
              <form
                onSubmit={handleSave}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {[
                  { name: 'name', label: 'Nombre', type: 'text' },
                  { name: 'brand', label: 'Marca', type: 'text' },
                  { name: 'model', label: 'Modelo', type: 'text' },
                  { name: 'serialNumber', label: 'N° Serie', type: 'text' },
                  { name: 'location', label: 'Ubicación', type: 'text' },
                  { name: 'stock', label: 'Stock', type: 'number' },
                  {
                    name: 'observations',
                    label: 'Observaciones',
                    type: 'text',
                  },
                ].map((f) => (
                  <div key={f.name} style={s.formField}>
                    <label style={s.formLabel}>{f.label}</label>
                    <input
                      id={`edit-${f.name}`}
                      type={f.type}
                      min={f.type === 'number' ? 0 : undefined}
                      className='input'
                      value={form[f.name] || ''}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          [f.name]:
                            f.type === 'number'
                              ? +e.target.value
                              : e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
                <div style={s.formField}>
                  <label style={s.formLabel}>Categoría</label>
                  <select
                    id='edit-category'
                    className='input'
                    value={form.category || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formField}>
                  <label style={s.formLabel}>Estado</label>
                  <select
                    id='edit-status'
                    className='input'
                    value={form.status || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    type='button'
                    className='btn btn-ghost'
                    onClick={() => {
                      setEditing(false)
                      setForm(item)
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    id='btn-save'
                    type='submit'
                    className='btn btn-primary'
                    disabled={saving}
                  >
                    {saving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={s.infoGrid}>
                {[
                  { label: 'Nombre', value: item.name },
                  { label: 'Categoría', value: item.category },
                  { label: 'Marca', value: item.brand || '—' },
                  { label: 'Modelo', value: item.model || '—' },
                  {
                    label: 'N° de serie',
                    value: item.serialNumber || '—',
                    mono: true,
                  },
                  { label: 'Ubicación', value: item.location || '—' },
                  { label: 'Stock', value: item.stock ?? 1 },
                  { label: 'Observaciones', value: item.observations || '—' },
                ].map((f) => (
                  <div key={f.label} style={s.infoRow}>
                    <span style={s.infoLabel}>{f.label}</span>
                    <span
                      style={
                        f.mono
                          ? {
                              ...s.infoValue,
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                            }
                          : s.infoValue
                      }
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamps card */}
          <div style={s.infoCard}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>Registro de fechas</h2>
            </div>
            <div style={s.infoGrid}>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Creado</span>
                <span style={s.infoValue}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString('es-VE')
                    : '—'}
                </span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Última actualización</span>
                <span style={s.infoValue}>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString('es-VE')
                    : '—'}
                </span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>ID de equipo</span>
                <span
                  style={{
                    ...s.infoValue,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#475569',
                    wordBreak: 'break-all',
                  }}
                >
                  {item._id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

const s = {
  page: {
    background: '#0d0f14',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '1px solid #1e2230',
    background: '#13161e',
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  userChip: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.8rem',
    flexShrink: 0,
  },

  content: {
    padding: '32px',
    maxWidth: '960px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  heroCard: {
    background: '#13161e',
    border: '1px solid #1e2230',
    borderTop: '3px solid',
    borderRadius: '16px',
    padding: '28px 32px',
  },
  heroTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
  },
  categoryTag: {
    display: 'inline-block',
    background: '#1a1e2a',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '0.72rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  },
  heroTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  heroSub: { fontSize: '0.9rem', color: '#64748b' },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '6px 14px',
    borderRadius: '99px',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  stockBig: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#1a1e2a',
    borderRadius: '12px',
    padding: '12px 24px',
  },

  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },

  infoCard: {
    background: '#13161e',
    border: '1px solid #1e2230',
    borderRadius: '14px',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: { fontSize: '0.95rem', fontWeight: '700', color: '#f1f5f9' },

  infoGrid: { display: 'flex', flexDirection: 'column', gap: '0' },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '11px 0',
    borderBottom: '1px solid #1a1e2a',
    gap: '16px',
  },
  infoLabel: {
    fontSize: '0.78rem',
    color: '#475569',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  infoValue: { fontSize: '0.875rem', color: '#cbd5e1', textAlign: 'right' },

  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  formLabel: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
}
