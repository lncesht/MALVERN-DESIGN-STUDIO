import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ArtGallery from './components/ArtGallery';
import About from './components/About';
import Footer from './components/Footer';
import Resume from './pages/Resume';
import Exhibits from './pages/Exhibits';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AddArtwork from './pages/AddArtwork';
import EditArtwork from './pages/EditArtwork';
import Artworks from './pages/Artworks';
import CVSettings from './pages/CVSettings';
import TimelineSettings from './pages/TimelineSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-warm-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <ArtGallery />
              <About />
              <Footer />
            </>
          } />
          <Route path="/resume" element={<Resume />} />
          <Route path="/exhibits" element={<Exhibits />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/artworks" element={
            <ProtectedRoute>
              <Artworks />
            </ProtectedRoute>
          } />
          <Route path="/admin/add" element={
            <ProtectedRoute>
              <AddArtwork />
            </ProtectedRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <ProtectedRoute>
              <EditArtwork />
            </ProtectedRoute>
          } />
          <Route path="/admin/cv-settings" element={
            <ProtectedRoute>
              <CVSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/timeline-settings" element={
            <ProtectedRoute>
              <TimelineSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
