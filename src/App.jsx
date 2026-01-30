import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import ArtGallery from './components/ArtGallery';
import About from './components/About';
import Footer from './components/Footer';
import FloatingLogo from './components/FloatingLogo';
import Resume from './pages/Resume';
import Exhibits from './pages/Exhibits';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AddArtwork from './pages/AddArtwork';
import EditArtwork from './pages/EditArtwork';
import Artworks from './pages/Artworks';
import CVSettings from './pages/CVSettings';
import TimelineSettings from './pages/TimelineSettings';
import ExhibitsAdmin from './pages/ExhibitsAdmin';
import AddExhibit from './pages/AddExhibit';
import EditExhibit from './pages/EditExhibit';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-warm-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <FloatingLogo />
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
          <Route path="/admin/exhibits" element={
            <ProtectedRoute>
              <ExhibitsAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/exhibits/add" element={
            <ProtectedRoute>
              <AddExhibit />
            </ProtectedRoute>
          } />
          <Route path="/admin/exhibits/edit/:id" element={
            <ProtectedRoute>
              <EditExhibit />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
