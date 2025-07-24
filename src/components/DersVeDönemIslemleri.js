import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Update as UpdateIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const DersVeDönemIslemleri = ({ onNavigate }) => {
  const menuItems = [
    {
      id: 'ders-kayit',
      title: 'Ders Kayıt',
      description: 'Yeni ders tanımlama ve kayıt işlemleri',
      icon: <AddCircleIcon color="primary" />,
      action: () => onNavigate('ders-kayit')
    },
    {
      id: 'ders-ekle-birak',
      title: 'Ders Ekle/Bırak',
      description: 'Mevcut dersleri ekleme ve çıkarma işlemleri',
      icon: <EditIcon color="secondary" />,
      action: () => onNavigate('ders-ekle-birak')
    },
    {
      id: 'ders-guncelle',
      title: 'Ders Güncelle',
      description: 'Kayıtlı ders bilgilerini güncelleme',
      icon: <UpdateIcon color="success" />,
      action: () => onNavigate('ders-guncelle')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SchoolIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                mb: 1
              }}
            >
              Ders ve Dönem İşlemleri
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Ders tanımlama, kayıt ve güncelleme işlemlerini gerçekleştirin
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Menu Items */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    py: 3,
                    px: 4,
                    '&:hover': {
                      backgroundColor: 'rgba(26, 35, 126, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          mb: 0.5
                        }}
                      >
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.5
                        }}
                      >
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default DersVeDönemIslemleri;