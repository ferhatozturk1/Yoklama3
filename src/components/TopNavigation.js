<<<<<<< HEAD
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

  const TopNavigation = ({ currentSection, userProfile, onSectionChange, selectedSemester, onSemesterChange, onSidebarToggle, sidebarOpen, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

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
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'warning':
          return <WarningIcon sx={{ color: '#F39C12' }} />;
        case 'info':
          return <InfoIcon sx={{ color: '#3498DB' }} />;
        case 'success':
          return <CheckCircleIcon sx={{ color: '#27AE60' }} />;
        default:
          return <InfoIcon sx={{ color: '#3498DB' }} />;
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
        <Toolbar sx={{ 
          minHeight: isSmallScreen ? '56px !important' : '64px !important', 
          px: isSmallScreen ? 1.5 : 2,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Sidebar Toggle Button */}
          <IconButton
            color="inherit"
            onClick={onSidebarToggle}
            sx={{ 
              mr: isSmallScreen ? 1 : 2,
              zIndex: 2,
              p: isSmallScreen ? 1 : 1.25
            }}
          >
            <MenuIcon sx={{ 
              color: 'white',
              fontSize: isSmallScreen ? 20 : 24
            }} />
          </IconButton>

          {/* Desktop Layout */}
          {!isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
              <School sx={{ fontSize: 28, color: 'white' }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: 'white',
                  lineHeight: 1,
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
            <Box sx={{ 
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              maxWidth: 'calc(100vw - 140px)', // Reserve space for side buttons
              zIndex: 1
            }}>
              <School sx={{ 
                fontSize: 18, 
                color: 'white',
                flexShrink: 0
              }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: 'white',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
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
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isSmallScreen ? 0.75 : 1,
            ml: 'auto',
            zIndex: 2
          }}>
            {/* Notifications */}
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{ color: 'white' }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 3,
              sx: { 
                width: 320, 
                maxHeight: 400,
                mt: 1,
                '& .MuiMenuItem-root': {
                  py: 2,
                  px: 2,
                }
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #E9ECEF' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                Bildirimler
              </Typography>
            </Box>
            {notifications.map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={handleNotificationClose} 
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: '#F8F9FA',
                  }
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#2C3E50', mb: 0.5 }}>
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                      {notification.time}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
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
=======
  import React, { useState } from "react";
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
    FormControl,
    Select,
  } from "@mui/material";
  import {
    School,
    Home,
    Groups,
    Class,
    Person,
    ExitToApp,
    Menu as MenuIcon,
    CalendarToday,
  } from "@mui/icons-material";
  import { NAVIGATION_ITEMS } from "../utils/routes";

  const TopNavigation = ({ currentSection, userProfile, onSectionChange, selectedSemester, onSemesterChange }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    
    // Dönem seçenekleri
    const semesterOptions = [
      { value: '2025-2026-guz', label: '2025-2026 Güz' },
      { value: '2025-2026-bahar', label: '2025-2026 Bahar' },
      { value: '2024-2025-guz', label: '2024-2025 Güz' },
      { value: '2024-2025-bahar', label: '2024-2025 Bahar' }
    ];

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
      <AppBar position="static" sx={{ bgcolor: "#1a237e" }}>
        <Toolbar sx={{ minHeight: '64px !important', px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <School sx={{ fontSize: 32, color: 'white' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1.3rem",
                color: 'white',
                display: "flex",
                alignItems: "center",
                mt: 1.0,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => handleNavigation("/portal/ana-sayfa", "ana-sayfa")}
            >
              Akademik Personel
            </Typography>
            
            {/* Dönem Seçici - Daha görünür hale getir */}
            <Box sx={{ ml: 3 }}>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    height: '42px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.6)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255,255,255,0.8)',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                <Select
                  value={selectedSemester || '2025-2026-guz'}
                  onChange={(e) => onSemesterChange && onSemesterChange(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      py: 1,
                      pl: 2,
                      pr: 4,
                      color: 'white !important'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '& .MuiMenuItem-root': {
                          fontSize: '0.95rem',
                          py: 1.5,
                          '&:hover': {
                            bgcolor: '#f5f5f5'
                          },
                          '&.Mui-selected': {
                            bgcolor: '#e3f2fd',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: '#bbdefb'
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  {semesterOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <CalendarToday sx={{ mr: 1.5, fontSize: 20, color: '#1976d2' }} />
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {NAVIGATION_ITEMS.map((item) => (
                <Button
                  key={item.key}
                  color="inherit"
                  startIcon={getIcon(item.icon)}
                  onClick={() => handleNavigation(item.path, item.key)}
                  sx={{
                    backgroundColor: isActive(item.key)
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Profile Section */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
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
>>>>>>> b458935077ae6d999bd4305048ef9f3ae0601500
