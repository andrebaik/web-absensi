export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
