import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { 
  CloudUpload, 
  Groups, 
  FileDownload,
  MoreVert
} from '@mui/icons-material';

const OgrenciIslerim = () => {
  const [ogrenciler] = useState([
    { 
      id: 1, 
      ad: "Ahmet", 
      soyad: "Yılmaz", 
      no: "1001", 
      sinif: "10-A", 
      email: "ahmet@email.com",
      toplamDers: 25,
      katilanDers: 23,
      devamsizlik: 2
    },
    { 
      id: 2, 
      ad: "Ayşe", 
      soyad: "Kaya", 
      no: "1002", 
      sinif: "10-A", 
      email: "ayse@email.com",
      toplamDers: 25,
      katilanDers: 24,
      devamsizlik: 1
    },
    { 
      id: 3, 
      ad: "Mehmet", 
      soyad: "Özkan", 
      no: "1003", 
      sinif: "10-A", 
      email: "mehmet@email.com",
      toplamDers: 25,
      katilanDers: 20,
      devamsizlik: 5
    },
    { 
      id: 4, 
      ad: "Fatma", 
      soyad: "Demir", 
      no: "1004", 
      sinif: "10-B", 
      email: "fatma@email.com",
      toplamDers: 20,
      katilanDers: 18,
      devamsizlik: 2
    },
    { 
      id: 5, 
      ad: "Ali", 
      soyad: "Çelik", 
      no: "1005", 
      sinif: "10-B", 
      email: "ali@email.com",
      toplamDers: 20,
      katilanDers: 15,
      devamsizlik: 5
    }
  ]);

  const getDevamsizlikBilgisi = (devamsizlik, toplamDers) => {
    const yuzde = ((devamsizlik / toplamDers) * 100).toFixed(1);
    let chipColor = 'success';
    if (yuzde > 10) chipColor = 'error';
    else if (yuzde > 5) chipColor = 'warning';
    
    return { yuzde, chipColor };
  };

  const handleFileUpload = () => {
    console.log('Dosya yükleme işlemi');
  };

  const exportStudentList = () => {
    console.log('Öğrenci listesi dışa aktarma');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        👥 Öğrenci İşlerim
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              bgcolor: '#fff3e0', 
              borderLeft: '4px solid #ff9800',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={handleFileUpload}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CloudUpload sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" color="#f57c00" sx={{ fontWeight: 'bold' }}>
                Öğrenci Listesi Yükle
              </Typography>
              <Typography variant="body2" color="#f57c00">
                Excel/CSV dosyası yükleyin
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              bgcolor: '#e3f2fd', 
              borderLeft: '4px solid #2196f3'
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Groups sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
              <Typography variant="h6" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                Öğrenci Listesi
              </Typography>
              <Typography variant="h3" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                {ogrenciler.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={2} 
            sx={{ 
              bgcolor: '#e8f5e8', 
              borderLeft: '4px solid #4caf50',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
            }}
            onClick={exportStudentList}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <FileDownload sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" color="#2e7d32" sx={{ fontWeight: 'bold' }}>
                Listeyi Dışa Aktar
              </Typography>
              <Typography variant="body2" color="#2e7d32">
                Excel formatında indir
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Öğrenci Listesi Tablosu */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Ad Soyad</strong></TableCell>
                <TableCell><strong>Numara</strong></TableCell>
                <TableCell><strong>Sınıf</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Devamsızlık</strong></TableCell>
                <TableCell><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ogrenciler.map((ogrenci) => {
                const { yuzde, chipColor } = getDevamsizlikBilgisi(ogrenci.devamsizlik, ogrenci.toplamDers);
                return (
                  <TableRow key={ogrenci.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32 }}>
                          {ogrenci.ad[0]}
                        </Avatar>
                        {ogrenci.ad} {ogrenci.soyad}
                      </Box>
                    </TableCell>
                    <TableCell>{ogrenci.no}</TableCell>
                    <TableCell>{ogrenci.sinif}</TableCell>
                    <TableCell>{ogrenci.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`%${yuzde} (${ogrenci.devamsizlik}/${ogrenci.toplamDers})`}
                        color={chipColor}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default OgrenciIslerim;