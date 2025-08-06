import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import profilePhoto from "../assets/mno.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Card,
  CardContent,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  School,
  Home,
  Groups,
  Class,
  Person,
  ExitToApp,
  Menu as MenuIcon,
  AccessTime as ClockIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { NAVIGATION_ITEMS } from "../utils/routes";

const TopNavigation = ({
  currentSection,
  userProfile,
  onSectionChange,
  selectedSemester,
  onSemesterChange,
  onSidebarToggle,
  sidebarOpen,
  isMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { logout } = useAuth(); // AuthContext'ten logout fonksiyonunu al

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  const formatTime = (date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  const getIcon = (iconName) => {
    const icons = {
      Home: <Home />,
      Groups: <Groups />,
      Class: <Class />,
      Person: <Person />,
    };
    return icons[iconName] || <Home />;
  };

  const handleNavigation = (path, section) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      navigate(path);
    }
    setMobileMenuAnchor(null);
  };

  const handleProfileClick = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };



  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual theme switching
  };

  const handleProfileView = () => {
    if (onSectionChange) {
      onSectionChange("profilim");
    } else {
      navigate("/portal/profilim");
    }
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    console.log("🚪 TopNavigation - Çıkış işlemi başlatılıyor");
    
    // Profil menüsünü kapat
    handleProfileMenuClose();
    
    try {
      // AuthContext üzerinden logout yap (sessionStorage ve tüm state'leri temizler)
      logout();
      
      // Ek güvenlik için localStorage'ı da temizle
      localStorage.clear();
      console.log('🧹 TopNavigation - LocalStorage da temizlendi');
      
      // Tüm cookie'leri de temizle
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      console.log('🧹 TopNavigation - Cookies temizlendi');
      
    } catch (error) {
      console.error('❌ TopNavigation - Logout hatası:', error);
    }
    
    // Giriş sayfasına yönlendir
    navigate("/giris-yap");
    
    console.log("✅ TopNavigation - Çıkış işlemi tamamlandı");
  };

 

  const isActive = (itemKey) => {
    return currentSection === itemKey;
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1B2E6D" }}>
      <Toolbar
        sx={{
          minHeight: isSmallScreen ? "56px !important" : "64px !important",
          px: isSmallScreen ? 1.5 : 2,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Sidebar Toggle Button */}
        <IconButton
          color="inherit"
          onClick={onSidebarToggle}
          sx={{
            mr: isSmallScreen ? 1 : 2,
            zIndex: 2,
            p: isSmallScreen ? 1 : 1.25,
          }}
        >
          <MenuIcon
            sx={{
              color: "white",
              fontSize: isSmallScreen ? 20 : 24,
            }}
          />
        </IconButton>

        {/* Desktop Layout */}
        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
              height: "64px", // Toolbar yüksekliği ile aynı
            }}
          >
            <School 
              sx={{ 
                fontSize: 28, 
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }} 
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1.25rem",
                color: "white",
                lineHeight: "28px", // İkon boyutu ile aynı
                display: "flex",
                alignItems: "center",
                mt:1,

                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => handleNavigation("/portal/ana-sayfa", "ana-sayfa")}
            >
              Akademik Personel
            </Typography>
          </Box>
        )}

        {/* Mobile Layout - Centered Title */}
        {isSmallScreen && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              maxWidth: "calc(100vw - 140px)", // Reserve space for side buttons
              zIndex: 1,
              height: "56px", // Mobil toolbar yüksekliği
            }}
          >
            <School
              sx={{
                fontSize: 18,
                color: "white",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "white",
                lineHeight: "18px", // İkon boyutu ile aynı
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                height: "18px", // İkon boyutu ile aynı
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => handleNavigation("/portal/ana-sayfa", "ana-sayfa")}
            >
              Akademik Personel
            </Typography>
          </Box>
        )}

        {/* Right side components */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isSmallScreen ? 0.75 : 1,
            ml: "auto",
            zIndex: 2,
          }}
        >



          {/* Profile Avatar */}
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar
              src={userProfile?.profilePhoto || profilePhoto}
              alt={userProfile?.name || "Kullanıcı"}
              sx={{ width: 32, height: 32 }}
            >
              {userProfile?.name?.charAt(0) || "M"}
            </Avatar>
          </IconButton>
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => setMobileMenuAnchor(null)}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <MenuItem
              key={item.key}
              onClick={() => handleNavigation(item.path, item.key)}
              selected={isActive(item.key)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getIcon(item.icon)}
                {item.label}
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileView}>
            <Person sx={{ mr: 1 }} />
            Profili Görüntüle
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} />
            Çıkış Yap
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;
