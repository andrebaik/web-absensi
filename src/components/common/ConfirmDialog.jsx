export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-icon">⚠️</div>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={onCancel}>Batal</button>
          <button className="btn btn-danger" onClick={onConfirm}>Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}
