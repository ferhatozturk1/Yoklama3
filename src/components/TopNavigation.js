import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  useMediaQuery
} from '@mui/material';
import {
  School,
  Home,
  Groups,
  Class,
  CheckCircle,
  Person,
  ExitToApp,
  Menu as MenuIcon
} from '@mui/icons-material';
import { NAVIGATION_ITEMS } from '../utils/routes';

const TopNavigation = ({ currentSection, userProfile, onSectionChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const getIcon = (iconName) => {
    const icons = {
      Home: <Home />,
      Groups: <Groups />,
      Class: <Class />,
      CheckCircle: <CheckCircle />,
      Person: <Person />
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
      onSectionChange('profilim');
    } else {
      navigate('/portal/profilim');
    }
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    navigate('/');
    handleProfileMenuClose();
  };

  const isActive = (itemKey) => {
    return currentSection === itemKey;
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
      <Toolbar>
        <School sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Öğretmen Paneli
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {NAVIGATION_ITEMS.map((item) => (
              <Button
                key={item.key}
                color="inherit"
                startIcon={getIcon(item.icon)}
                onClick={() => handleNavigation(item.path, item.key)}
                sx={{
                  backgroundColor: isActive(item.key) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
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
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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