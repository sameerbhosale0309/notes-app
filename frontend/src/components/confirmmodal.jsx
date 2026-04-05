function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-backdrop">
      <div className="confirm-modal">
        <div className="confirm-top">
          <h3>{title}</h3>
          <button className="confirm-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <p>{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
            cancel
          </button>
          <button className="confirm-btn confirm-btn-delete" onClick={onConfirm}>
            delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;