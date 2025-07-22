import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import AnaSayfa from './AnaSayfa';
import OgrenciIslerim from './OgrenciIslerim';
import Derslerim from './Derslerim';
import Yoklama from './Yoklama';
import Profilim from './Profilim';

const MainPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile] = useState({
    name: 'Dr. Ayşe Kaya',
    email: 'ayse.kaya@universite.edu.tr',
    phone: '+90 555 123 4567',
    title: 'Doktor Öğretim Üyesi',
    school: 'Teknik Üniversite',
    department: 'Matematik Bölümü',
    biography: 'Matematik alanında 15 yıllık deneyime sahip öğretim üyesi.',
    profilePhoto: '/default-avatar.png'
  });

  // Get current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/ogrenci-islerim')) return 'ogrenci-islerim';
    if (path.includes('/derslerim')) return 'derslerim';
    if (path.includes('/yoklama')) return 'yoklama';
    if (path.includes('/profilim')) return 'profilim';
    return 'ana-sayfa';
  };

  const handleSectionChange = (section) => {
    navigate(`/portal/${section}`);
  };

  return (
    <div>
      <TopNavigation 
        currentSection={getCurrentSection()}
        userProfile={userProfile}
        onSectionChange={handleSectionChange}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/portal/ana-sayfa" replace />} />
        <Route path="/ana-sayfa" element={<AnaSayfa onSectionChange={handleSectionChange} />} />
        <Route path="/ogrenci-islerim" element={<OgrenciIslerim />} />
        <Route path="/derslerim" element={<Derslerim />} />
        <Route path="/yoklama" element={<Yoklama />} />
        <Route path="/profilim" element={<Profilim userProfile={userProfile} />} />
        <Route path="*" element={<Navigate to="/portal/ana-sayfa" replace />} />
      </Routes>
    </div>
  );
};

export default MainPortal;