import Card from './Card'

export default function MetricCard({ label, value }) {
  return (
    <Card>
      <p className="text-sm text-text-secondary mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  )
}