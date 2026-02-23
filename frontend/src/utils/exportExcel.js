import * as XLSX from 'xlsx'

/**
 * Exporta una lista de items a un archivo Excel (.xlsx)
 * @param {Array} items - Lista de equipos filtrados
 * @param {string} filename - Nombre base del archivo
 */
export function exportToExcel(items, filename = 'inventario_maturin') {
  if (!items || items.length === 0) return

  // Mapeamos los datos a nombres de columnas amigables en español
  const rows = items.map((item) => ({
    Nombre: item.name,
    Categoría: item.category,
    Marca: item.brand || '—',
    Modelo: item.model || '—',
    'N° Serie': item.serialNumber || '—',
    Estado: item.status,
    Ubicación: item.location || '—',
    Stock: item.stock ?? 1,
    Observaciones: item.observations || '—',
    'Fecha Registro': item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('es-VE')
      : '—',
    'Última Modif.': item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString('es-VE')
      : '—',
  }))

  // Creamos la hoja de cálculo
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Equipos')

  // Auto-ajustar ancho de las columnas
  const objectMaxLength = []
  rows.forEach((row) => {
    Object.keys(row).forEach((key, i) => {
      const value = row[key] ? row[key].toString() : ''
      objectMaxLength[i] = Math.max(
        objectMaxLength[i] || 0,
        value.length,
        key.length,
      )
    })
  })
  ws['!cols'] = objectMaxLength.map((w) => ({ wch: w + 2 }))

  // Descargar el archivo
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${date}.xlsx`)
}
