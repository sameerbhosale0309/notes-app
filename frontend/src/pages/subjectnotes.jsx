import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import NoteItem from '../components/noteitem';

function SubjectNotes() {
  const { subjectName } = useParams();
  const decodedSubject = decodeURIComponent(subjectName);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/notes/${decodedSubject}`);
        setNotes(res.data);
      } catch (error) {
        console.error('error fetching notes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [decodedSubject]);

  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-avatar"></div>
          <div>
            <h3>Padho Bacho!</h3>
            <p>developed by sameer*</p>
          </div>
        </div>

        <div className="sidebar-note">
          subject-wise notes with preview and download access.
        </div>
      </aside>

      <main className="main-content ">
        <div className="subject-header">
          <Link to="/" className="back-link">
            ← back to subjects
          </Link>

          <div className="subject-hero">
            <span className="hero-badge">subject notes</span>
            <h1>{decodedSubject}</h1>
            <p>
              all available notes for this subject. preview them online or download
              them for offline use.
            </p>
          </div>
        </div>

        <section className="content-section">
          <div className="section-header">
            <h2>notes</h2>
            <span>{notes.length} available</span>
          </div>

          {loading ? (
            <p className="empty-state">loading notes...</p>
          ) : notes.length > 0 ? (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <h3>no notes uploaded yet</h3>
              <p>check back later or upload notes from admin panel.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SubjectNotes;