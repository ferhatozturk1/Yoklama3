import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GirisYap from './components/GirisYap';
import OgretmenKayit from './components/OgretmenKayit';
import MainPortal from './components/MainPortal';
import { ROUTES } from './utils/routes';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import './index.css';

const App = () => (
  <Router>
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Giriş ve Kayıt rotaları */}
          <Route path="/giris" element={<GirisYap />} />
          <Route path="/kayit" element={<OgretmenKayit />} />
          
          {/* Panel rotaları */}
          <Route path="/panel" element={<Navigate to={ROUTES.ANA_SAYFA} replace />} />
          <Route path="/portal/*" element={<MainPortal />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/ogretmen-kayit" element={<Navigate to="/kayit" replace />} />
          <Route path="/ogretmen-panel" element={<Navigate to={ROUTES.ANA_SAYFA} replace />} />
          
          {/* Ziyaretçi sayfası (Landing Page) rotaları - En sonda olmalı */}
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  </Router>
);

export default App;