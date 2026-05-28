import EventoCard from './evento-card'

export default function EventoGrid({ eventos }) {
  return (
    <div className="evento-grid">
      {eventos?.map((evento) => (
        <EventoCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}
