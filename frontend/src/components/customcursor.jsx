import { useEffect, useState } from 'react';

function CustomCursor() {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });

  useEffect(() => {
    let frame;

    const onMove = (e) => {
      const { clientX, clientY } = e;
      setMouse({ x: clientX, y: clientY });

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setRing({ x: clientX, y: clientY });
      });
    };

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div
        className="cursor-ring"
        style={{
          transform: `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          transform: `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </div>
  );
}

export default CustomCursor;