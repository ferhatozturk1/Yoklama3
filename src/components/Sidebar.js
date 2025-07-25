import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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

const Sidebar = ({
  open,
  onToggle,
  isMobile,
  onNavigate,
}) => {

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
          py: 3,
          px: 2,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={cbuLogo}
          alt="CBU Logo"
          style={{
            maxWidth: "120px",
            maxHeight: "80px",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            marginBottom: "12px",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "white",
            letterSpacing: "2px",
            textAlign: "center",
            fontFamily: '"Inter", "Roboto", sans-serif',
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          M.C.B.Ü
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1, py: 0 }}>
        {/* Main Navigation Items */}
        {navigationItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              onClick={() => onNavigate && onNavigate(item.path)}
              sx={{
                py: 1.5,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {React.cloneElement(item.icon, {
                  sx: { color: "white", fontSize: 20 },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

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
