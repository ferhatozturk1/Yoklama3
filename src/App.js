<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GirisYap from './components/GirisYap';
import OgretmenKayit from './components/OgretmenKayit';
import MainPortal from './components/MainPortal';
import { ROUTES } from './utils/routes';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<GirisYap />} />
      <Route path="/giris" element={<GirisYap />} />
      <Route path="/ogretmen-kayit" element={<OgretmenKayit />} />
      {/* Legacy route for backward compatibility */}
      <Route path="/ogretmen-panel" element={<Navigate to={ROUTES.ANA_SAYFA} replace />} />
      {/* New portal routes */}
      <Route path="/portal/*" element={<MainPortal />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GirisYap from './components/GirisYap';
import OgretmenKayit from './components/OgretmenKayit';
import MainPortal from './components/MainPortal';
import { ROUTES } from './utils/routes';
import { DersProvider } from './contexts/DersContext';

const App = () => (
  <DersProvider>
    <Router>
      <Routes>
        <Route path="/" element={<GirisYap />} />
        <Route path="/giris" element={<GirisYap />} />
        <Route path="/ogretmen-kayit" element={<OgretmenKayit />} />
        {/* Legacy route for backward compatibility */}
        <Route path="/ogretmen-panel" element={<Navigate to={ROUTES.ANA_SAYFA} replace />} />
        {/* New portal routes */}
        <Route path="/portal/*" element={<MainPortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </DersProvider>
);

export default App;
>>>>>>> b458935077ae6d999bd4305048ef9f3ae0601500
