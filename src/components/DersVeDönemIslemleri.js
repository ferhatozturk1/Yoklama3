import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
  School as SchoolIcon,
  LocationOn,
  Groups,
  CalendarToday,
  CheckCircle,
  Edit
} from "@mui/icons-material";

const DersVeDönemIslemleri = ({ onNavigate }) => {
  const [selectedTerm, setSelectedTerm] = useState("2025-2026 Güz");

  // Available terms
  const termOptions = [
    "2025-2026 Bahar",
    "2025-2026 Güz",
    "2024-2025 Bahar",
    "2024-2025 Güz",
    "2023-2024 Bahar",
    "2023-2024 Güz",
  ];
  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  // Güncel dönem kontrolü - sadece 2025-2026 dönemi aktif
  const isCurrentTerm = (term) => {
    return term.includes("2025-2026");
  };

  const isTermActive = isCurrentTerm(selectedTerm);
  // Real courses from current university schedule (2025-2026)
  const staticCourses = [
    {
      id: 1,
      name: "Matematik",
      code: "MRK 1116",
      section: "A1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: { çarşamba: [{ startTime: "08:40", endTime: "11:30", room: "Amfi-6" }] },
      studentCount: 45,
      attendanceStatus: "completed",
      attendanceRate: 88,
    },
    {
      id: 2,
      name: "Matematik",
      code: "IYS 1101",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi",
      schedule: { salı: [{ startTime: "08:40", endTime: "10:30", room: "Amfi" }] },
      studentCount: 38,
      attendanceStatus: "completed",
      attendanceRate: 92,
    },
    {
      id: 3,
      name: "Mesleki Matematik",
      code: "EKT 1117",
      section: "C1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: { çarşamba: [{ startTime: "11:45", endTime: "12:30", room: "Amfi-6" }] },
      studentCount: 32,
      attendanceStatus: "completed",
      attendanceRate: 84,
    },
    {
      id: 4,
      name: "Programlama",
      code: "IYS 1103",
      section: "Lab1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-7",
      schedule: {
        salı: [{ startTime: "16:15", endTime: "17:00", room: "Derslik-7" }],
        cuma: [{ startTime: "13:40", endTime: "15:30", room: "Bilgisayar Lab-2" }]
      },
      studentCount: 28,
      attendanceStatus: "completed",
      attendanceRate: 94,
    },
    {
      id: 5,
      name: "Akademik Yapay Zekaya Giriş",
      code: "SSD 3264",
      section: "A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Derslik",
      schedule: {
        perşembe: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }],
        cuma: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }]
      },
      studentCount: 22,
      attendanceStatus: "completed",
      attendanceRate: 91,
    },
    {
      id: 6,
      name: "Bilişim ve Bilgisayar Ağları Temelleri",
      code: "IYS 1107",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-8",
      schedule: { salı: [{ startTime: "11:45", endTime: "12:30", room: "Derslik-8" }] },
      studentCount: 35,
      attendanceStatus: "pending",
      attendanceRate: 85,
    },
    {
      id: 7,
      name: "Yapay Zeka ile Zenginleştirilmiş Proje Yönetimi",
      code: "USD 1165",
      section: "A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Amfi",
      schedule: {
        perşembe: [
          { startTime: "13:40", endTime: "15:30", room: "Amfi" },
          { startTime: "17:00", endTime: "17:45", room: "Amfi" }
        ]
      },
      studentCount: 18,
      attendanceStatus: "completed",
      attendanceRate: 89,
    },
    {
      id: 8,
      name: "Veri Toplama ve Analizi",
      code: "IYS 2103",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-6",
      schedule: { cuma: [{ startTime: "08:40", endTime: "10:30", room: "Derslik-6" }] },
      studentCount: 26,
      attendanceStatus: "completed",
      attendanceRate: 87,
    }
  ];

  const getDaysText = (schedule) => {
    return Object.keys(schedule).join(", ");
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'not_taken': return 'error';
      default: return 'default';
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Beklemede';
      case 'not_taken': return 'Alınmadı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* Minimal Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
        p: 1,
        bgcolor: 'white',
        borderRadius: 1,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#1a237e", fontSize: '1rem' }}
        >
          Ders ve Dönem İşlemleri
        </Typography>
      </Box>

      {/* Minimal Term Selection */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 1.5,
        p: 1,
        bgcolor: '#f8f9fa',
        borderRadius: 1
      }}>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a237e' }}>
          Aktif Dönem:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={selectedTerm}
            onChange={handleTermChange}
            sx={{
              fontSize: '0.8rem',
              '& .MuiSelect-select': {
                py: 0.5
              }
            }}
          >
            {termOptions.map((term) => (
              <MenuItem key={term} value={term} sx={{ fontSize: '0.8rem' }}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Layout: Left Sidebar + Right Course List */}
      <Grid container spacing={1.5}>
        {/* Left Sidebar - Ultra Minimal Action Cards */}
        <Grid item xs={12} md={2.5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {/* Ders Ekle Card - Ultra Minimal */}
            <Card
              sx={{
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                cursor: isTermActive ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: isTermActive ? 1 : 0.5,
                '&:hover': isTermActive ? {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                } : {}
              }}
              onClick={() => isTermActive && onNavigate && onNavigate("ders-kayit")}
            >
              <CardContent sx={{ p: 0.8, textAlign: 'center' }}>
                <Box sx={{
                  bgcolor: isTermActive ? 'rgba(33, 150, 243, 0.06)' : 'rgba(158, 158, 158, 0.06)',
                  borderRadius: 0.8,
                  p: 0.6,
                  mb: 0.5,
                  display: 'inline-flex'
                }}>
                  <AddCircleIcon sx={{ fontSize: 16, color: isTermActive ? '#2196f3' : '#9e9e9e' }} />
                </Box>
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  mb: 0.1,
                  color: isTermActive ? '#1a237e' : '#9e9e9e',
                  lineHeight: 1.2
                }}>
                  Ders Ekle
                </Typography>
                <Typography variant="caption" sx={{
                  fontSize: '0.65rem',
                  lineHeight: 1.1,
                  color: isTermActive ? 'text.secondary' : '#bdbdbd'
                }}>
                  {isTermActive ? 'Yeni ders tanımlama' : 'Sadece aktif dönemde'}
                </Typography>
              </CardContent>
            </Card>

            {/* Ders Güncelle Card - Ultra Minimal */}
            <Card
              sx={{
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                cursor: isTermActive ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: isTermActive ? 1 : 0.5,
                '&:hover': isTermActive ? {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                } : {}
              }}
              onClick={() => isTermActive && onNavigate && onNavigate("ders-guncelle")}
            >
              <CardContent sx={{ p: 0.8, textAlign: 'center' }}>
                <Box sx={{
                  bgcolor: isTermActive ? 'rgba(76, 175, 80, 0.06)' : 'rgba(158, 158, 158, 0.06)',
                  borderRadius: 0.8,
                  p: 0.6,
                  mb: 0.5,
                  display: 'inline-flex'
                }}>
                  <UpdateIcon sx={{ fontSize: 16, color: isTermActive ? '#4caf50' : '#9e9e9e' }} />
                </Box>
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  mb: 0.1,
                  color: isTermActive ? '#1a237e' : '#9e9e9e',
                  lineHeight: 1.2
                }}>
                  Ders Güncelle
                </Typography>
                <Typography variant="caption" sx={{
                  fontSize: '0.65rem',
                  lineHeight: 1.1,
                  color: isTermActive ? 'text.secondary' : '#bdbdbd'
                }}>
                  {isTermActive ? 'Ders bilgilerini güncelle' : 'Sadece aktif dönemde'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Side - Compact Course List */}
        <Grid item xs={12} md={9.5}>
          <Card sx={{ borderRadius: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon sx={{ color: '#1976d2', fontSize: 18 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Derslerim ({staticCourses.length})
                </Typography>
              </Box>

              {/* Compact Course Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, py: 0.5, fontSize: '0.8rem' }}>Ders Kodu</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 0.5, fontSize: '0.8rem' }}>Ders Adı</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 0.5, fontSize: '0.8rem' }}>Günler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staticCourses.map((ders) => (
                      <TableRow
                        key={ders.id}
                        sx={{
                          '&:hover': { bgcolor: '#f8f9fa' },
                          cursor: 'pointer'
                        }}
                      >
                        <TableCell sx={{ py: 0.3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '0.8rem', lineHeight: 1.2 }}>
                            {ders.code}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 0.3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem', lineHeight: 1.2, mb: 0.2 }}>
                            {ders.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <LocationOn sx={{ fontSize: 8, color: '#666' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1.1 }}>
                              {ders.building} - {ders.room}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 0.3 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                            {getDaysText(ders.schedule)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DersVeDönemIslemleri;
