import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import AnaSayfa from './AnaSayfa';
import DersDetay from './DersDetay';
import Derslerim from './Derslerim';
import Yoklama from './Yoklama';
import Profilim from './Profilim';
import { useDersler } from '../contexts/DersContext';

const MainPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getDersById } = useDersler();
  const [selectedSemester, setSelectedSemester] = useState('2025-2026-guz');
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
    if (path.includes('/derslerim')) return 'derslerim';
    if (path.includes('/ders/')) return 'ders-detay';
    if (path.includes('/yoklama')) return 'yoklama';
    if (path.includes('/profilim')) return 'profilim';
    return 'ana-sayfa';
  };

  const handleSectionChange = (section) => {
    navigate(`/portal/${section}`);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };

  // Ders detay wrapper bileşeni
  const DersDetayWrapper = () => {
    const { dersId } = useParams();
    const ders = getDersById(dersId);
    
    if (!ders) {
      return <Navigate to="/portal/ana-sayfa" replace />;
    }
    
    return (
      <DersDetay 
        ders={ders} 
        onBack={() => navigate('/portal/ana-sayfa')} 
      />
    );
  };

  return (
    <div>
      <TopNavigation 
        currentSection={getCurrentSection()}
        userProfile={userProfile}
        onSectionChange={handleSectionChange}
        selectedSemester={selectedSemester}
        onSemesterChange={handleSemesterChange}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/portal/ana-sayfa" replace />} />
        <Route path="/ana-sayfa" element={<AnaSayfa onSectionChange={handleSectionChange} selectedSemester={selectedSemester} />} />
        <Route path="/ders/:dersId" element={<DersDetayWrapper />} />
        <Route path="/derslerim" element={<Derslerim />} />
        <Route path="/yoklama" element={<Yoklama />} />
        <Route path="/profilim" element={<Profilim userProfile={userProfile} />} />
        <Route path="*" element={<Navigate to="/portal/ana-sayfa" replace />} />
      </Routes>
    </div>
  );
};

export default MainPortal;