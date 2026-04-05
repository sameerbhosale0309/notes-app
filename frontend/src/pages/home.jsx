import { useEffect, useState } from 'react';
import api from '../services/api';
import SubjectCard from '../components/subjectcard';

function Home() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data);
      } catch (error) {
        console.error('error fetching subjects', error);
      }
    };

    fetchSubjects();
  }, []);

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
          simple, clean access to all semester notes.
        </div>
      </aside>

      <main className="main-content fade-up">
        <header className="hero">
          <div className="hero-badge">semester 2 resource hub</div>

          <h1>
            organized notes for every
            <br />
            subject in one place
          </h1>

          <p>
            choose a subject, open the notes, preview them instantly, and download
            what you need without logging in.
          </p>
        </header>

        <section className="content-section">
          <div className="section-header">
            <h2>subjects</h2>
            <span>{subjects.length} available</span>
          </div>

          <div className="subjects-grid">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;