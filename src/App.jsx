import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages
import Header from './components/Header';
import Hero from './components/Hero';
import ArtGallery from './components/ArtGallery';
import About from './components/About';
import Footer from './components/Footer';
import Resume from './pages/Resume';

// Admin Pages
import Login from './pages/Login';
import Admin from './pages/Admin';
import Artworks from './pages/Artworks';
import AddArtwork from './pages/AddArtwork';
import EditArtwork from './pages/EditArtwork';
import CVSettings from './pages/CVSettings';
import TimelineSettings from './pages/TimelineSettings';

// Public Gallery Component
const PublicGallery = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ArtGallery />
        <About />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
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
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicGallery />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artworks"
            element={
              <ProtectedRoute>
                <Artworks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute>
                <AddArtwork />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <EditArtwork />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cv"
            element={
              <ProtectedRoute>
                <CVSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timeline"
            element={
              <ProtectedRoute>
                <TimelineSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
