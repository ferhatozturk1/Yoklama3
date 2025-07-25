import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Badge,
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
  Notifications as NotificationsIcon,
  AccessTime as ClockIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
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

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      message: "Matematik dersinde yoklama alınmadı",
      type: "warning",
      time: "2 saat önce",
    },
    {
      id: 2,
      message: "Yeni ders programı güncellendi",
      type: "info",
      time: "1 gün önce",
    },
    {
      id: 3,
      message: "Sistem güncellemesi mevcut",
      type: "info",
      time: "2 gün önce",
    },
  ];

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return <WarningIcon sx={{ color: "#F39C12" }} />;
      case "info":
        return <InfoIcon sx={{ color: "#3498DB" }} />;
      case "success":
        return <CheckCircleIcon sx={{ color: "#27AE60" }} />;
      default:
        return <InfoIcon sx={{ color: "#3498DB" }} />;
    }
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

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
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
    navigate("/");
    handleProfileMenuClose();
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
                height: "28px", // İkon boyutu ile aynı
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
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{ color: "white" }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: isSmallScreen ? "calc(100vw - 32px)" : 320,
                maxWidth: isSmallScreen ? 320 : "none",
                maxHeight: isSmallScreen ? "70vh" : 400,
                mt: 1,
                borderRadius: isSmallScreen ? "12px" : "8px",
                "& .MuiMenuItem-root": {
                  py: isSmallScreen ? 1.5 : 2,
                  px: isSmallScreen ? 1.5 : 2,
                  minHeight: isSmallScreen ? "auto" : "64px",
                },
              },
            }}
          >
            <Box sx={{ 
              p: isSmallScreen ? 1.5 : 2, 
              borderBottom: "1px solid #E9ECEF",
              background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)"
            }}>
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 600, 
                  color: "white",
                  fontSize: isSmallScreen ? "1rem" : "1.25rem"
                }}
              >
                Bildirimler
              </Typography>
            </Box>
            {notifications.map((notification, index) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationClose}
                divider={index < notifications.length - 1}
                sx={{
                  alignItems: "flex-start",
                  "&:hover": {
                    backgroundColor: "#F8F9FA",
                  },
                  "&:last-child": {
                    borderBottom: "none"
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isSmallScreen ? 32 : 40,
                  mt: 0.5
                }}>
                  {React.cloneElement(getNotificationIcon(notification.type), {
                    sx: { 
                      fontSize: isSmallScreen ? 18 : 20,
                      color: notification.type === "warning" ? "#F39C12" : 
                             notification.type === "success" ? "#27AE60" : "#3498DB"
                    }
                  })}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ 
                        fontWeight: 500, 
                        color: "#2C3E50", 
                        mb: 0.5,
                        fontSize: isSmallScreen ? "0.875rem" : "0.9375rem",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: "#7F8C8D",
                        fontSize: isSmallScreen ? "0.75rem" : "0.8125rem"
                      }}
                    >
                      {notification.time}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
            {notifications.length === 0 && (
              <Box sx={{ 
                p: isSmallScreen ? 2 : 3, 
                textAlign: "center",
                color: "#7F8C8D"
              }}>
                <Typography variant="body2">
                  Henüz bildirim bulunmuyor
                </Typography>
              </Box>
            )}
          </Menu>

          {/* Profile Avatar */}
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar
              src={userProfile.profilePhoto}
              alt={userProfile.name}
              sx={{ width: 32, height: 32 }}
            >
              {userProfile.name.charAt(0)}
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
