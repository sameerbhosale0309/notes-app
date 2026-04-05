function NoteItem({ note }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    e.currentTarget.style.setProperty('--mx', `${x}px`);
    e.currentTarget.style.setProperty('--my', `${y}px`);
  };

  return (
    <div className="note-card" onMouseMove={handleMouseMove}>
      <span className="card-glow"></span>

      <div className="note-card-top">
        <span className="note-tag">note</span>
        <span className="note-date">
          {new Date(note.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="note-card-body">
        <h3>{note.title}</h3>
        <p>{note.description || 'no description available'}</p>
      </div>

      <div className="note-card-actions">
        <a href={note.file_url} target="_blank" rel="noreferrer" className="note-btn">
          preview
        </a>
        <a href={note.file_url} download className="note-btn note-btn-dark">
          download
        </a>
      </div>
    </div>
  );
}

export default NoteItem;