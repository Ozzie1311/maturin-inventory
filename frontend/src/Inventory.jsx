import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInventory, createEquipment, deleteEquipment } from './api'
import { exportToExcel } from './utils/exportExcel'

const CATEGORIES = [
  'Networking',
  'CCTV',
  'Perifericos',
  'Computación',
  'Telefonía',
]
const STATUSES = ['Disponible', 'En uso', 'Reparación', 'Dañado']

const EMPTY_FORM = {
  name: '',
  category: '',
  brand: '',
  model: '',
  serialNumber: '',
  status: 'Disponible',
  location: '',
  stock: 1,
}

function statusBadge(status) {
  const map = {
    Disponible: 'disponible',
    'En uso': 'en-uso',
    Reparación: 'reparacion',
    Dañado: 'danado',
  }
  return `badge badge-${map[status] || 'disponible'}`
}

function categoryBadge(cat) {
  const map = {
    Networking: 'networking',
    CCTV: 'cctv',
    Perifericos: 'perifericos',
    Computación: 'computacion',
    Telefonía: 'telefonia',
  }
  return `badge badge-${map[cat] || 'networking'}`
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function Inventory({ token, user, onLogout }) {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statFilter, setStatFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })
  const hideToast = useCallback(() => setToast(null), [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getInventory(token)
      setItems(res.data.data)
    } catch {
      showToast('Error al cargar el inventario', 'error')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const filtered = items.filter((i) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      i.name?.toLowerCase().includes(q) ||
      i.brand?.toLowerCase().includes(q) ||
      i.model?.toLowerCase().includes(q) ||
      i.serialNumber?.toLowerCase().includes(q)
    const matchCat = !catFilter || i.category === catFilter
    const matchStatus = !statFilter || i.status === statFilter
    return matchSearch && matchCat && matchStatus
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createEquipment(form, token)
      showToast('Equipo creado correctamente')
      setShowModal(false)
      setForm(EMPTY_FORM)
      load()
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al crear equipo', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteEquipment(id, token)
      showToast('Equipo eliminado')
      setConfirmId(null)
      load()
    } catch {
      showToast('Error al eliminar', 'error')
    }
  }

  const statsCount = (status) => items.filter((i) => i.status === status).length

  return (
    <div style={s.layout}>
      {/* ── Sidebar ────────────────────────────────── */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.logoIcon}>
            <svg
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
            </svg>
          </div>
          <span style={s.logoText}>Maturin</span>
        </div>

        <nav style={s.nav}>
          <div style={s.navItem_active}>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <rect x='2' y='3' width='7' height='7' />
              <rect x='15' y='3' width='7' height='7' />
              <rect x='2' y='14' width='7' height='7' />
              <rect x='15' y='14' width='7' height='7' />
            </svg>
            Inventario
          </div>
        </nav>

        <div style={s.sidebarFooter}>
          <div style={s.userChip}>
            <div style={s.avatar}>
              {user?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={s.userName}>{user?.nombre || 'Usuario'}</div>
              <div style={s.userRole}>
                {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
              </div>
            </div>
          </div>
          <button
            id='btn-logout'
            className='btn btn-ghost'
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '10px',
            }}
            onClick={onLogout}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <polyline points='16 17 21 12 16 7' />
              <line x1='21' y1='12' x2='9' y2='12' />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────── */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.pageTitle}>Inventario</h1>
            <p style={s.pageSubtitle}>{items.length} equipos en total</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id='btn-export-excel'
              className='btn btn-ghost'
              onClick={() => exportToExcel(filtered)}
              disabled={filtered.length === 0}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
              Exportar Excel
            </button>
            {user?.rol === 'admin' && (
              <button
                id='btn-new-equipment'
                className='btn btn-primary'
                onClick={() => setShowModal(true)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                >
                  <line x1='12' y1='5' x2='12' y2='19' />
                  <line x1='5' y1='12' x2='19' y2='12' />
                </svg>
                Nuevo equipo
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            {
              label: 'Disponibles',
              count: statsCount('Disponible'),
              color: '#22c55e',
            },
            { label: 'En uso', count: statsCount('En uso'), color: '#38bdf8' },
            {
              label: 'Reparación',
              count: statsCount('Reparación'),
              color: '#f59e0b',
            },
            { label: 'Dañados', count: statsCount('Dañado'), color: '#ef4444' },
          ].map((st) => (
            <div
              key={st.label}
              style={{ ...s.statCard, borderTopColor: st.color }}
            >
              <span style={{ ...s.statNum, color: st.color }}>{st.count}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={s.filters}>
          <div style={s.searchWrap}>
            <svg
              style={s.searchIcon}
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
            <input
              id='search-input'
              className='input'
              style={{ paddingLeft: '38px' }}
              placeholder='Buscar por nombre, marca, modelo…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            id='filter-category'
            className='input'
            style={s.select}
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value=''>Todas las categorías</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            id='filter-status'
            className='input'
            style={s.select}
            value={statFilter}
            onChange={(e) => setStatFilter(e.target.value)}
          >
            <option value=''>Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {(search || catFilter || statFilter) && (
            <button
              className='btn btn-ghost btn-sm'
              onClick={() => {
                setSearch('')
                setCatFilter('')
                setStatFilter('')
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Table */}
        <div style={s.tableWrap} className='fade-in'>
          {loading ? (
            <div className='spinner-wrap'>
              <div className='spinner' />
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>
              <svg
                width='48'
                height='48'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#475569'
                strokeWidth='1.5'
              >
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              <p>No se encontraron equipos</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {[
                    'Nombre',
                    'Categoría',
                    'Marca / Modelo',
                    'N° Serie',
                    'Estado',
                    'Stock',
                    'Ubicación',
                    '',
                  ].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item._id}
                    style={s.tr}
                    onClick={() => navigate(`/inventario/${item._id}`)}
                  >
                    <td style={s.td}>
                      <span style={s.itemName}>{item.name}</span>
                    </td>
                    <td style={s.td}>
                      <span className={categoryBadge(item.category)}>
                        {item.category}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.textPrimary}>{item.brand || '—'}</span>
                      {item.model && (
                        <span style={s.textMuted}> · {item.model}</span>
                      )}
                    </td>
                    <td style={s.td}>
                      <span style={s.mono}>{item.serialNumber || '—'}</span>
                    </td>
                    <td style={s.td}>
                      <span className={statusBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.stockPill}>{item.stock ?? 1}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.textMuted}>{item.location || '—'}</span>
                    </td>
                    <td
                      style={{ ...s.td, textAlign: 'right' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={s.rowActions}>
                        <button
                          className='btn btn-ghost btn-sm'
                          id={`btn-view-${item._id}`}
                          onClick={() => navigate(`/inventario/${item._id}`)}
                        >
                          Ver
                        </button>
                        {user?.rol === 'admin' && (
                          <button
                            className='btn btn-danger btn-sm'
                            id={`btn-delete-${item._id}`}
                            onClick={() => setConfirmId(item._id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <p style={s.resultCount}>
            Mostrando {filtered.length} de {items.length} equipos
          </p>
        )}
      </main>

      {/* ── Modal Nuevo Equipo ─────────────────────── */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2 style={s.modalTitle}>Nuevo equipo</h2>
              <button
                className='btn btn-ghost btn-sm'
                onClick={() => setShowModal(false)}
                style={{ padding: '6px 10px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={s.formGrid}>
                {[
                  {
                    name: 'name',
                    label: 'Nombre *',
                    type: 'text',
                    required: true,
                    placeholder: 'Ej: Switch 24 Puertos',
                  },
                  {
                    name: 'brand',
                    label: 'Marca',
                    type: 'text',
                    required: false,
                    placeholder: 'Ej: Reyee',
                  },
                  {
                    name: 'model',
                    label: 'Modelo',
                    type: 'text',
                    required: false,
                    placeholder: 'Ej: RG-NBS3100',
                  },
                  {
                    name: 'serialNumber',
                    label: 'N° Serie',
                    type: 'text',
                    required: false,
                    placeholder: 'Opcional',
                  },
                  {
                    name: 'location',
                    label: 'Ubicación',
                    type: 'text',
                    required: false,
                    placeholder: 'Ej: Depósito Central',
                  },
                  {
                    name: 'stock',
                    label: 'Stock',
                    type: 'number',
                    required: false,
                    placeholder: '1',
                  },
                ].map((f) => (
                  <div key={f.name} style={s.formField}>
                    <label style={s.formLabel}>{f.label}</label>
                    <input
                      id={`field-${f.name}`}
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      min={f.type === 'number' ? 0 : undefined}
                      placeholder={f.placeholder}
                      className='input'
                      value={form[f.name]}
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
                  <label style={s.formLabel}>Categoría *</label>
                  <select
                    id='field-category'
                    name='category'
                    required
                    className='input'
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    <option value=''>Seleccionar…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={s.formField}>
                  <label style={s.formLabel}>Estado</label>
                  <select
                    id='field-status'
                    name='status'
                    className='input'
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-ghost'
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  id='btn-submit-equipment'
                  type='submit'
                  className='btn btn-primary'
                  disabled={saving}
                >
                  {saving ? 'Guardando…' : 'Crear equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar Eliminar ───────────────── */}
      {confirmId && (
        <div className='modal-overlay' onClick={() => setConfirmId(null)}>
          <div
            className='modal'
            style={{ maxWidth: '380px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
              <div style={s.dangerIcon}>
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <polyline points='3 6 5 6 21 6' />
                  <path d='M19 6l-1 14H6L5 6' />
                  <path d='M10 11v6' />
                  <path d='M14 11v6' />
                  <path d='M9 6V4h6v2' />
                </svg>
              </div>
              <h3 style={{ color: '#f1f5f9', marginBottom: '8px' }}>
                ¿Eliminar equipo?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className='modal-footer'>
              <button
                className='btn btn-ghost'
                onClick={() => setConfirmId(null)}
              >
                Cancelar
              </button>
              <button
                id='btn-confirm-delete'
                className='btn btn-danger'
                onClick={() => handleDelete(confirmId)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ──────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0d0f14' },
  sidebar: {
    width: '220px',
    flexShrink: 0,
    background: '#13161e',
    borderRight: '1px solid #1e2230',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
    paddingLeft: '4px',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  logoText: { fontWeight: '700', fontSize: '1rem', color: '#f1f5f9' },
  nav: { flex: 1 },
  navItem_active: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(99,102,241,0.15)',
    color: '#818cf8',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  sidebarFooter: { marginTop: 'auto' },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: '#1a1e2a',
    borderRadius: '10px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#f1f5f9',
    lineHeight: 1.2,
  },
  userRole: { fontSize: '0.7rem', color: '#64748b' },

  main: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#f1f5f9' },
  pageSubtitle: { fontSize: '0.875rem', color: '#64748b', marginTop: '2px' },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  statCard: {
    background: '#13161e',
    border: '1px solid #1e2230',
    borderTop: '3px solid',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: { fontSize: '1.8rem', fontWeight: '800', lineHeight: 1 },
  statLabel: { fontSize: '0.75rem', color: '#64748b', fontWeight: '500' },

  filters: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchWrap: { position: 'relative', flex: 1, minWidth: '200px' },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#475569',
    pointerEvents: 'none',
  },
  select: { width: '180px', cursor: 'pointer' },

  tableWrap: {
    background: '#13161e',
    border: '1px solid #1e2230',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    background: '#0d0f14',
    borderBottom: '1px solid #1e2230',
  },
  tr: {
    borderBottom: '1px solid #1a1e2a',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  td: { padding: '13px 16px', fontSize: '0.875rem', verticalAlign: 'middle' },
  itemName: { fontWeight: '600', color: '#e2e8f0' },
  textPrimary: { color: '#cbd5e1' },
  textMuted: { color: '#475569', fontSize: '0.82rem' },
  mono: { fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.82rem' },
  stockPill: {
    background: '#1a1e2a',
    borderRadius: '6px',
    padding: '2px 10px',
    fontWeight: '700',
    color: '#cbd5e1',
    fontSize: '0.85rem',
  },
  rowActions: { display: 'flex', gap: '6px', justifyContent: 'flex-end' },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '60px 0',
    color: '#475569',
    fontSize: '0.9rem',
  },
  resultCount: { fontSize: '0.78rem', color: '#475569', textAlign: 'right' },

  modalTitle: { fontSize: '1.15rem', fontWeight: '700', color: '#f1f5f9' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  dangerIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(239,68,68,0.12)',
    border: '2px solid rgba(239,68,68,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#ef4444',
  },
}
