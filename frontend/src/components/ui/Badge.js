const COLORS = {
  novo:      'bg-gray-100 text-gray-700',
  contatado: 'bg-blue-50 text-blue-700',
  visita:    'bg-amber-50 text-amber-700',
  fechado:   'bg-green-50 text-green-700',
  perdido:   'bg-orange-50 text-orange-700',
  ativo:     'bg-green-50 text-green-800',
  inativo:   'bg-amber-50 text-amber-800',
}

export default function Badge({ status, children }) {
  const classes = COLORS[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${classes}`}>
      {children}
    </span>
  )
}