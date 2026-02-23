---
description: Agregar exportación del inventario a Excel (.xlsx)
---

## Contexto

El inventario de equipos se muestra en `frontend/src/Inventory.jsx`.
Los datos se obtienen del endpoint `GET /inventario` (requiere token JWT).
La librería recomendada es `xlsx` (SheetJS), que funciona 100% en el navegador sin backend adicional.

## Pasos

### 1. Instalar la dependencia en el frontend

```bash
cd frontend
npm install xlsx
```

### 2. Crear una función utilitaria de exportación

Crear el archivo `frontend/src/utils/exportExcel.js`:

```js
import * as XLSX from 'xlsx'

export function exportToExcel(items, filename = 'inventario') {
  const rows = items.map((item) => ({
    Nombre: item.name,
    Categoría: item.category,
    Marca: item.brand || '',
    Modelo: item.model || '',
    'N° Serie': item.serialNumber || '',
    Estado: item.status,
    Ubicación: item.location || '',
    Stock: item.stock ?? 1,
    Observaciones: item.observations || '',
    'Creado el': item.createdAt
      ? new Date(item.createdAt).toLocaleString('es-VE')
      : '',
    Actualizado: item.updatedAt
      ? new Date(item.updatedAt).toLocaleString('es-VE')
      : '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario')

  // Ajustar ancho de columnas automáticamente
  const cols = Object.keys(rows[0] || {}).map((key) => ({
    wch:
      Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length)) + 2,
  }))
  ws['!cols'] = cols

  XLSX.writeFile(
    wb,
    `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  )
}
```

### 3. Importar y usar en Inventory.jsx

En `frontend/src/Inventory.jsx`, agregar:

```js
import { exportToExcel } from './utils/exportExcel'
```

Y agregar el botón en el `header`, junto al botón "Nuevo equipo":

```jsx
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
```

> **Nota:** Se pasa `filtered` (no `items`) para que el Excel respete los filtros activos de búsqueda/categoría/estado que el usuario haya aplicado.

### 4. (Opcional) Exportación desde el backend

Si en el futuro se prefiere generar el Excel desde el servidor (por ejemplo, con hojas adicionales, estilos corporativos o datos privados), se puede usar la librería `exceljs` en Node.js:

```bash
cd backend
npm install exceljs
```

Y crear un endpoint dedicado:

```
GET /inventario/export   ← devuelve el archivo .xlsx con header Content-Disposition
```

Para el caso actual (inventario simple), la solución 100% frontend con `xlsx` es suficiente y más eficiente.
