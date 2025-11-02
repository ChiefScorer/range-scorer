import { db } from '../db'
import { exportCsv } from '../utils/exportCsv'

export default function ExportButton() {
  const onExport = async () => {
    const rows = await db.scores.toArray()
    // shape rows for CSV
    const csvRows = rows.map(r => ({
      id: r.id,
      compId: r.compId,
      compName: r.compName,
      stage: r.stage,
      stringNo: r.stringNo,
      points: r.points,
      xCount: r.xCount,
      penalties: r.penalties,
      net: Math.max(0, r.points - r.penalties),
      createdAtISO: new Date(r.createdAt).toISOString()
    }))
    if (csvRows.length === 0) {
      alert('No data to export yet.')
      return
    }
    exportCsv(csvRows, 'range-scorer-scores.csv')
  }

  return (
    <button onClick={onExport} style={{padding:'10px 12px', border:'1px solid #cfd6de', borderRadius:10, background:'#fff', cursor:'pointer'}}>
      Export CSV
    </button>
  )
}