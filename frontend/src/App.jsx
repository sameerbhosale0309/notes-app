import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/home';
import SubjectNotes from './pages/subjectnotes';
import AdminUpload from './pages/adminupload';
import CustomCursor from './components/customcursor';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <CustomCursor />
      <Toaster
  position="top-right"
  toastOptions={{
    duration: 2200,
    style: {
      borderRadius: '16px',
      background: '#181818',
      color: '#fff',
      padding: '14px 16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
      fontSize: '14px',
    },
  }}
/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subject/:subjectName" element={<SubjectNotes />} />
        <Route path="/admin-upload" element={<AdminUpload />} />
      </Routes>
        <Analytics />
    </Router>
  );
}

export default App;