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
  } from "@mui/material";
  import {
    School,
    Home,
    Groups,
    Class,
    Person,
    ExitToApp,
    Menu as MenuIcon,
  } from "@mui/icons-material";
  import { NAVIGATION_ITEMS } from "../utils/routes";

  const TopNavigation = ({ currentSection, userProfile, onSectionChange, selectedSemester, onSemesterChange, onSidebarToggle, sidebarOpen, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

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
          {/* Sidebar Toggle Button */}
          <IconButton
            color="inherit"
            onClick={onSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

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
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => handleNavigation("/portal/ana-sayfa", "ana-sayfa")}
            >
              Akademik Personel
            </Typography>
          </Box>



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
