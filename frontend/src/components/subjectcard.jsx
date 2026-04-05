import { Link } from 'react-router-dom';

function SubjectCard({ subject }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    e.currentTarget.style.setProperty('--mx', `${x}px`);
    e.currentTarget.style.setProperty('--my', `${y}px`);
  };

  return (
    <Link
      to={`/subject/${encodeURIComponent(subject.name)}`}
      className="subject-card"
      onMouseMove={handleMouseMove}
    >
      <span className="card-glow"></span>

      <div className="subject-card-top">
        <span className="subject-pill">subject</span>
      </div>

      <div className="subject-card-body">
        <h3>{subject.name}</h3>
        <p>{subject.code}</p>
      </div>

      <div className="subject-card-bottom">
        <span>view notes</span>
        <span>→</span>
      </div>
    </Link>
  );
}

export default SubjectCard;