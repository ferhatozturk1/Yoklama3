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
