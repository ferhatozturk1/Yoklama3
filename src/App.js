import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GirisYap from './components/GirisYap';
import OgretmenKayit from './components/OgretmenKayit';
import MainPortal from './components/MainPortal';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './utils/routes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public routes - Token gerekmez */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/giris-yap" element={<GirisYap />} />
        <Route path="/kayit" element={<OgretmenKayit />} />
        
        {/* Legacy public routes */}
        <Route path="/giris" element={<Navigate to="/giris-yap" replace />} />
        <Route path="/ogretmen-kayit" element={<Navigate to="/kayit" replace />} />
        
        {/* Protected routes - Token gerekli */}
        <Route 
          path="/panel" 
          element={
            <ProtectedRoute>
              <Navigate to={ROUTES.ANA_SAYFA} replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/portal/*" 
          element={
            <ProtectedRoute>
              <MainPortal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ogretmen-panel" 
          element={
            <ProtectedRoute>
              <Navigate to={ROUTES.ANA_SAYFA} replace />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback - Bilinmeyen route'lar için landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;