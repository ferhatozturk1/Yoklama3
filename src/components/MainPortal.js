import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, useTheme, useMediaQuery, CircularProgress, Typography } from "@mui/material";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import AnaSayfa from "./AnaSayfa";
import DersDetay from "./DersDetay";
import DersVeDönemIslemleri from "./DersVeDönemIslemleri";
import DersKayit from "./DersKayit";
import DersEkleBirak from "./DersEkleBirak";
import DersGuncelle from "./DersGuncelle";
import Derslerim from "./Derslerim";
import Yoklama from "./Yoklama";
import Profilim from "./Profilim";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

const MainPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSemester, setSelectedSemester] = useState("2025-2026-Güz");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { loadInitialData } = useData();

  // Authentication kontrolü
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      navigate("/giris");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // İlk veri yükleme - sadece bir kez çalışsın
  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id]); // Sadece user ID değiştiğinde çalışsın

  // Loading durumu
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  // Kullanıcı giriş yapmamışsa
  if (!isAuthenticated()) {
    return null; // useEffect zaten yönlendirme yapacak
  }

  // Get current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes("/derslerim")) return "derslerim";
    if (path.includes("/yoklama")) return "yoklama";
    if (path.includes("/profilim")) return "profilim";
    return "ana-sayfa";
  };

  const handleSectionChange = (section) => {
    navigate(`/portal/${section}`);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };

  // Course management navigation handlers
  const handleCourseManagementNavigation = (section) => {
    navigate(`/portal/${section}`);
  };

  const handleBackToCourseManagement = () => {
    navigate("/portal/ders-ve-donem-islemleri");
  };

  const handleEditCourse = (course) => {
    // Navigate to course registration with course data for editing
    navigate("/portal/ders-kayit", { state: { editingCourse: course } });
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle navigation from AnaSayfa to DersDetay
  const handleNavigateToDetail = (page, courseData) => {
    if (page === "ders-detay") {
      setSelectedCourse(courseData);
      navigate("/portal/ders-detay");
    }
  };

  const handleBackFromDetail = () => {
    setSelectedCourse(null);
    navigate("/portal/ana-sayfa");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
        onNavigate={handleSectionChange}
      />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: isMobile
            ? "100%"
            : sidebarOpen
            ? "calc(100% - 280px)"
            : "100%",
          transition: "width 0.3s ease",
        }}
      >
        {/* Top Navigation */}
        <TopNavigation
          currentSection={getCurrentSection()}
          onSectionChange={handleSectionChange}
          selectedSemester={selectedSemester}
          onSemesterChange={handleSemesterChange}
          onSidebarToggle={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "background.default",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/portal/ana-sayfa" replace />}
            />
            <Route
              path="/ana-sayfa"
              element={
                <AnaSayfa
                  onSectionChange={handleSectionChange}
                  onNavigate={handleNavigateToDetail}
                  selectedSemester={selectedSemester}
                />
              }
            />
            <Route
              path="/ders-detay"
              element={
                <DersDetay
                  ders={selectedCourse}
                  onBack={handleBackFromDetail}
                />
              }
            />

            {/* Course Management Routes */}
            <Route
              path="/ders-ve-donem-islemleri"
              element={
                <DersVeDönemIslemleri
                  onNavigate={handleCourseManagementNavigation}
                  selectedSemester={selectedSemester}
                  onSemesterChange={handleSemesterChange}
                />
              }
            />
            <Route
              path="/ders-kayit"
              element={
                <DersKayit
                  onBack={handleBackToCourseManagement}
                  selectedSemester={selectedSemester}
                />
              }
            />
            <Route
              path="/ders-ekle-birak"
              element={
                <DersEkleBirak
                  onBack={handleBackToCourseManagement}
                  selectedSemester={selectedSemester}
                />
              }
            />
            <Route
              path="/ders-guncelle"
              element={
                <DersGuncelle
                  onBack={handleBackToCourseManagement}
                  onEditCourse={handleEditCourse}
                  selectedSemester={selectedSemester}
                />
              }
            />

            <Route path="/derslerim" element={<Derslerim selectedSemester={selectedSemester} />} />
            <Route path="/yoklama" element={<Yoklama />} />
            <Route
              path="/profilim"
              element={<Profilim />}
            />
            <Route
              path="*"
              element={<Navigate to="/portal/ana-sayfa" replace />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPortal;
