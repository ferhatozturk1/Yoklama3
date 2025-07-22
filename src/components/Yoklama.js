import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip
} from '@mui/material';
import { Stop, Visibility } from '@mui/icons-material';

const Yoklama = () => {
  const [yoklamalar] = useState([
    {
      id: 1,
      ders: "Matematik",
      sinif: "10-A",
      tarih: "13.07.2025",
      saat: "10:00-11:00",
      durum: "aktif",
      katilimci: 25,
      toplamOgrenci: 30
    },
    {
      id: 2,
      ders: "Matematik",
      sinif: "10-B",
      tarih: "13.07.2025",
      saat: "14:00-15:00",
      durum: "beklemede",
      katilimci: 0,
      toplamOgrenci: 28
    },
    {
      id: 3,
      ders: "Matematik",
      sinif: "10-A",
      tarih: "12.07.2025",
      saat: "09:00-10:00",
      durum: "tamamlandi",
      katilimci: 28,
      toplamOgrenci: 30
    }
  ]);

  const getDurumColor = (durum) => {
    switch(durum) {
      case 'aktif': return 'success';
      case 'beklemede': return 'warning';
      case 'tamamlandi': return 'default';
      default: return 'default';
    }
  };

  const getDurumText = (durum) => {
    switch(durum) {
      case 'aktif': return 'Aktif';
      case 'beklemede': return 'Beklemede';
      case 'tamamlandi': return 'Tamamlandı';
      default: return durum;
    }
  };

  const handleYoklamaDurdur = (id) => {
    console.log('Yoklama durduruluyor:', id);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        ✅ Yoklama Yönetimi
      </Typography>

      <Grid container spacing={3}>
        {yoklamalar.map((yoklama) => (
          <Grid item xs={12} md={6} key={yoklama.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {yoklama.ders} - {yoklama.sinif}
                    {yoklama.tip === 'telafi' && (
                      <Chip 
                        label="TELAFİ" 
                        size="small" 
                        color="secondary" 
                        sx={{ ml: 1, fontWeight: 'bold' }} 
                      />
                    )}
                  </Typography>
                  <Chip 
                    label={getDurumText(yoklama.durum)} 
                    color={getDurumColor(yoklama.durum)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📅 {yoklama.tarih} | ⏰ {yoklama.saat}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  👥 {yoklama.katilimci}/{yoklama.toplamOgrenci} öğrenci katıldı
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 3, pt: 0 }}>
                {yoklama.durum === 'aktif' ? (
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth
                    startIcon={<Stop />}
                    onClick={() => handleYoklamaDurdur(yoklama.id)}
                  >
                    Yoklamayı Durdur
                  </Button>
                ) : (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    startIcon={<Visibility />}
                  >
                    Detayları Gör
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Yoklama;