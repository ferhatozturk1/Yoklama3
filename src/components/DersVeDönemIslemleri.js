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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Update as UpdateIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const DersVeDönemIslemleri = ({ onNavigate, selectedSemester, onSemesterChange }) => {
  const [selectedTerm, setSelectedTerm] = useState(selectedSemester || "2025-2026 Güz");

  // Available terms
  const termOptions = [
    "2023-2024 Güz",
    "2023-2024 Bahar",
    "2024-2025 Güz",
    "2024-2025 Bahar",
    "2025-2026 Güz",
    "2025-2026 Bahar",
  ];

  const handleTermChange = (event) => {
    const newTerm = event.target.value;
    setSelectedTerm(newTerm);
    if (onSemesterChange) {
      onSemesterChange(newTerm);
    }
  };

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
          borderRadius: "32px",
          color: "white",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  mb: 0.5
                }}
              >
                Ders ve Dönem İşlemleri
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.85,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                Ders tanımlama, kayıt ve güncelleme işlemlerini gerçekleştirin
              </Typography>
            </Box>
          </Box>

          {/* Sağ tarafta tarih/saat bilgisi */}
          <Box sx={{
            textAlign: 'right',
            display: { xs: 'none', sm: 'block' }
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                mb: 0.5
              }}
            >
              {new Date().toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: "0.875rem"
              }}
            >
              {new Date().toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                weekday: 'long'
              })}
            </Typography>
          </Box>
        </Box>


      </Paper>

      {/* Term Selection */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "24px",
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          border: "1px solid rgba(26, 35, 126, 0.08)"
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            borderRadius: '12px',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SchoolIcon sx={{ fontSize: 24, color: 'primary.main' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: "1.25rem"
            }}
          >
            Aktif Dönem Seçimi
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Dönem</InputLabel>
              <Select
                value={selectedTerm}
                label="Dönem"
                onChange={handleTermChange}
                sx={{
                  borderRadius: "16px",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "16px"
                  }
                }}
              >
                {termOptions.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{
          mt: 3,
          p: 2,
          backgroundColor: 'rgba(26, 35, 126, 0.05)',
          borderRadius: "16px",
          border: "1px solid rgba(26, 35, 126, 0.1)"
        }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Seçili dönem: <strong style={{ color: '#1a237e' }}>{selectedTerm}</strong> - Tüm ders işlemleri bu dönem için gerçekleştirilecektir.
          </Typography>
        </Box>
      </Paper>

      {/* Menu Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map((item, index) => (
          <Paper
            key={item.id}
            elevation={2}
            sx={{
              borderRadius: "24px",
              overflow: 'hidden',
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              border: "1px solid rgba(26, 35, 126, 0.08)",
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(26, 35, 126, 0.15)',
                borderColor: 'rgba(26, 35, 126, 0.2)'
              }
            }}
          >
            <ListItemButton
              onClick={item.action}
              sx={{
                py: 3,
                px: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <Box sx={{
                backgroundColor: item.id === 'ders-kayit' ? 'rgba(33, 150, 243, 0.1)' :
                  item.id === 'ders-ekle-birak' ? 'rgba(156, 39, 176, 0.1)' :
                    'rgba(76, 175, 80, 0.1)',
                borderRadius: '16px',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 56,
                height: 56
              }}>
                {React.cloneElement(item.icon, {
                  sx: { fontSize: 28 }
                })}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 0.5,
                    fontSize: "1.25rem"
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.5,
                    fontSize: "0.95rem"
                  }}
                >
                  {item.description}
                </Typography>
              </Box>

              {/* Ok işareti */}
              <Box sx={{
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                borderRadius: '12px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  →
                </Typography>
              </Box>
            </ListItemButton>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default DersVeDönemIslemleri;