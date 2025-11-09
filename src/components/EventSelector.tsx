import { EVENTS, type EventName } from '../constants/events'

export default function EventSelector({
  value,
  onChange
}: {
  value: EventName
  onChange: (v: EventName) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EventName)}
      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cfd6de' }}
      aria-label="Select event"
    >
      {EVENTS.map((ev) => (
        <option key={ev} value={ev}>{ev}</option>
      ))}
    </select>
  )
}