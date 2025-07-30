import React from "react";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Drawer,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import cbuLogo from "../theme/cbulogo.png";

const Sidebar = ({ open, onToggle, isMobile, onNavigate }) => {
  // Navigation items
  const navigationItems = [
    {
      key: "ana-sayfa",
      label: "Ana Sayfa",
      icon: <HomeIcon />,
      path: "ana-sayfa",
    },
    {
      key: "ders-ve-donem-islemleri",
      label: "Ders ve Dönem İşlemleri",
      icon: <ManageAccountsIcon />,
      path: "ders-ve-donem-islemleri",
    },
    {
      key: "derslerim",
      label: "Derslerim",
      icon: <ClassIcon />,
      path: "derslerim",
    },
    {
      key: "profilim",
      label: "Profilim",
      icon: <PersonIcon />,
      path: "profilim",
    },
  ];

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        backgroundColor: "#1a237e",
        color: "white",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
          px: 2,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={cbuLogo}
          alt="CBU Logo"
          style={{
            maxWidth: "100px",
            maxHeight: "60px",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            marginBottom: "8px",
          }}
        />
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "6px 16px",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              letterSpacing: "1px",
              textAlign: "center",
              fontFamily: '"Inter", "Roboto", sans-serif',
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Manisa Celal Bayar Üniversitesi
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1, py: 1, px: 0 }}>
        {/* Main Navigation Items */}
        {navigationItems.map((item) => {
          // Uzun metinler için özel yükseklik hesaplama
          const isLongText = item.label.length > 15;
          const minHeight = isLongText ? 44 : 36;

          return (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate && onNavigate(item.path)}
                sx={{
                  minHeight: minHeight,
                  px: 2.5,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateX(3px)",
                    transition: "all 0.2s ease-in-out",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {/* İkon Container */}
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    flexShrink: 0,
                    mt: 0.25, // Move icon down slightly
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: {
                      color: "white",
                      fontSize: 22,
                      display: "block",
                    },
                  })}
                </Box>

                {/* Metin Container */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 24,
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "white",
                      lineHeight: 1.1,
                      letterSpacing: "0.2px",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      whiteSpace: isLongText ? "normal" : "nowrap",
                      wordBreak: isLongText ? "break-word" : "normal",
                      mt: 0.5, // Move text down to align with icons
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // Return drawer for mobile, permanent sidebar for desktop
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? 280 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
