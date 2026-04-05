import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import ConfirmModal from '../components/confirmmodal';

function AdminUpload() {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    file: null,
  });

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error('error fetching subjects:', error);
    }
  };

  const fetchAllNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await api.get('/all-notes');
      setNotes(res.data);
    } catch (error) {
      console.error('error fetching notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchAllNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('file', formData.file);

    try {
      await api.post('/upload-note', data);
      toast.success('note uploaded successfully');

      setFormData({
        subject: '',
        title: '',
        description: '',
        file: null,
      });

      fetchAllNotes();
    } catch (error) {
      console.error('upload failed:', error);
      toast.error('upload failed');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedNoteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${selectedNoteId}`);
      toast.success('note deleted successfully');
      setShowDeleteModal(false);
      setSelectedNoteId(null);
      fetchAllNotes();
    } catch (error) {
  console.error('delete failed full error:', error);
  console.error('response data:', error?.response?.data);
  console.error('status:', error?.response?.status);
  toast.error(error?.response?.data?.error || 'delete failed');
}
  };

  return (
    <div className="page-shell">
      <ConfirmModal
        open={showDeleteModal}
        title="delete note"
        message="are you sure you want to delete this note? this action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedNoteId(null);
        }}
      />

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-avatar"></div>
          <div>
            <h3>sameer</h3>
            <p>admin panel</p>
          </div>
        </div>

        <div className="sidebar-note">
          upload notes, manage files, and remove content when needed.
        </div>
      </aside>

      <main className="main-content fade-up">
        <header className="hero">
          <div className="hero-badge">admin upload dashboard</div>
          <h1>manage all notes from one place</h1>
          <p>
            upload new notes, preview existing files, download them, and delete
            anything directly from this panel.
          </p>
        </header>

        <section className="admin-layout">
          <div className="admin-panel">
            <div className="panel-head">
              <h2>upload note</h2>
              <span>{subjects.length} subjects</span>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-field"
                required
              >
                <option value="">select subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="note title"
                value={formData.title}
                onChange={handleChange}
                className="form-field"
                required
              />

              <textarea
                name="description"
                placeholder="description"
                value={formData.description}
                onChange={handleChange}
                className="form-field form-textarea"
              />

              <input
                type="file"
                name="file"
                accept=".pdf"
                onChange={handleChange}
                className="form-field"
                required
              />

              <button type="submit" className="form-button">
                upload note
              </button>
            </form>
          </div>

          <div className="admin-notes-panel">
            <div className="panel-head">
              <h2>uploaded notes</h2>
              <span>{notes.length} notes</span>
            </div>

            {loadingNotes ? (
              <p className="empty-state">loading notes...</p>
            ) : notes.length === 0 ? (
              <div className="empty-state-box">
                <h3>no notes uploaded yet</h3>
                <p>your uploaded notes will appear here.</p>
              </div>
            ) : (
              <div className="admin-notes-grid">
                {notes.map((note) => (
                  <div key={note.id} className="admin-note-card">
                    <span className="card-glow"></span>

                    <div className="admin-note-top">
                      <span className="note-tag">{note.subject}</span>
                      <span className="note-date">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="note-card-body">
                      <h3>{note.title}</h3>
                      <p>{note.description || 'no description available'}</p>
                    </div>

                    <div className="admin-note-actions">
                      <a
                        href={note.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="note-btn"
                      >
                        preview
                      </a>
                      <a href={note.file_url} download className="note-btn note-btn-dark">
                        download
                      </a>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(note.id)}
                        className="delete-btn"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminUpload;