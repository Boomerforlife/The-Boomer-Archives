import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArchivePage from './pages/ArchivePage';
import ArticlePage from './pages/ArticlePage';
import PressRoom from './pages/PressRoom';
import MemberPage from './pages/MemberPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/read/:id" element={<ArticlePage />} />
        <Route path="/press-room" element={<PressRoom />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
