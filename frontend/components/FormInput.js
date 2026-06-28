export default function FormInput({ label, value, onChange, type = 'text', error, textarea, ...props }){
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>{label}</div>}
      {textarea ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} {...props} style={{ width: '100%', padding: 8 }} />
      ) : (
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} {...props} style={{ padding: 8, width: '100%' }} />
      )}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </div>
  )
}
