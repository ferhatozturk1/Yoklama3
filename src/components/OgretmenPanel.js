import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Chip, 
  AppBar,
  Toolbar,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  School, 
  Add, 
  Groups, 
  Person,
  ExitToApp,
  PlayArrow,
  Stop,
  Visibility,
  Class,
  CheckCircle,
  Schedule,
  Upload,
  CloudUpload,
  FileDownload,
  Delete,
  Edit,
  MoreVert,
  CalendarToday,
  AccessTime,
  Home,
  Today,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

const OgretmenPanel = () => {
  // Navigation state
  const [currentSection, setCurrentSection] = useState('ana-sayfa');
  const [userProfile] = useState({
    name: 'Dr. Ayşe Kaya',
    email: 'ayse.kaya@universite.edu.tr',
    phone: '+90 555 123 4567',
    title: 'Doktor Öğretim Üyesi',
    school: 'Teknik Üniversite',
    department: 'Matematik Bölümü',
    biography: 'Matematik alanında 15 yıllık deneyime sahip öğretim üyesi.',
    profilePhoto: null
  });

  // Courses state
  const [dersler, setDersler] = useState([
    {
      id: 1,
      name: 'Matematik',
      code: 'MAT101',
      class: '10-A',
      schedule: {
        pazartesi: [{ startTime: '09:00', endTime: '10:00', room: 'A101' }],
        çarşamba: [{ startTime: '14:00', endTime: '15:00', room: 'A101' }],
        cuma: [{ startTime: '10:00', endTime: '11:00', room: 'A101' }]
      },
      totalWeeks: 15,
      currentWeek: 8
    },
    {
      id: 2,
      name: 'Matematik',
      code: 'MAT101',
      class: '10-B',
      schedule: {
        salı: [{ startTime: '11:00', endTime: '12:00', room: 'A102' }],
        perşembe: [{ startTime: '13:00', endTime: '14:00', room: 'A102' }]
      },
      totalWeeks: 15,
      currentWeek: 8
    }
  ]);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [schoolDays] = useState([1, 2, 3, 4, 5]); // Pazartesi-Cuma
  const [holidays] = useState([
    new Date('2025-01-01'), // Yılbaşı
    new Date('2025-04-23'), // 23 Nisan
    new Date('2025-05-01'), // İşçi Bayramı
    new Date('2025-05-19'), // Gençlik ve Spor Bayramı
    new Date('2025-08-30'), // Zafer Bayramı
    new Date('2025-10-29'), // Cumhuriyet Bayramı
  ]);

  const [yoklamalar, setYoklamalar] = useState([
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
    }
  ]);

  const [ogrenciler, setOgrenciler] = useState([
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

  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openStudentListDialog, setOpenStudentListDialog] = useState(false);
  const [openTelafiDialog, setOpenTelafiDialog] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [yoklamaSuresi, setYoklamaSuresi] = useState(5); // dakika
  const [kalanSure, setKalanSure] = useState(0);
  const [aktifYoklama, setAktifYoklama] = useState(null);
  const [qrTimer, setQrTimer] = useState(null);
  const [countdownTimer, setCountdownTimer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [telafiDetails, setTelafiDetails] = useState({
    ders: 'Matematik',
    sinif: '10-A',
    hafta: '',
    tarih: '',
    baslangicSaat: '',
    bitisSaat: ''
  });
  const [newYoklama, setNewYoklama] = useState({
    ders: "Matematik",
    sinif: "",
    tarih: new Date().toISOString().split('T')[0],
    baslangicSaat: "",
    bitisSaat: ""
  });

  // Cleanup timer'ları component unmount olduğunda
  useEffect(() => {
    return () => {
      if (qrTimer) clearInterval(qrTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [qrTimer, countdownTimer]);

  const handleYoklamaBasla = () => {
    setOpenDialog(true);
  };

  const handleYoklamaOlustur = () => {
    const yeniYoklama = {
      id: yoklamalar.length + 1,
      ders: newYoklama.ders,
      sinif: newYoklama.sinif,
      tarih: newYoklama.tarih,
      saat: `${newYoklama.baslangicSaat}-${newYoklama.bitisSaat}`,
      durum: "aktif",
      katilimci: 0,
      toplamOgrenci: ogrenciler.filter(o => o.sinif === newYoklama.sinif).length
    };
    
    setYoklamalar([...yoklamalar, yeniYoklama]);
    setAktifYoklama(yeniYoklama);
    setOpenDialog(false);
    setOpenQRDialog(true);
    
    // QR kod yoklamasını başlat
    startQRYoklama(yeniYoklama);
    
    setNewYoklama({
      ders: "Matematik",
      sinif: "",
      tarih: new Date().toISOString().split('T')[0],
      baslangicSaat: "",
      bitisSaat: ""
    });
  };

  // QR kod yoklamasını başlat
  const startQRYoklama = (yoklama) => {
    const totalSeconds = yoklamaSuresi * 60;
    setKalanSure(totalSeconds);
    
    // İlk QR kodu oluştur
    generateQRCode(yoklama);
    
    // Her 3 saniyede bir yeni QR kod oluştur
    const qrInterval = setInterval(() => {
      generateQRCode(yoklama);
    }, 3000);
    
    // Geri sayım timer'ı
    const countdown = setInterval(() => {
      setKalanSure(prev => {
        if (prev <= 1) {
          clearInterval(qrInterval);
          clearInterval(countdown);
          endQRYoklama();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setQrTimer(qrInterval);
    setCountdownTimer(countdown);
  };

  // QR kod oluştur
  const generateQRCode = async (yoklama) => {
    try {
      const timestamp = Date.now();
      const qrData = {
        yoklamaId: yoklama.id,
        ders: yoklama.ders,
        sinif: yoklama.sinif,
        timestamp: timestamp,
        validUntil: timestamp + 3000 // 3 saniye geçerli
      };
      
      const qrString = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a237e',
          light: '#ffffff'
        }
      });
      
      setQrCode(qrString);
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
    }
  };

  // QR yoklamayı sonlandır
  const endQRYoklama = () => {
    if (qrTimer) clearInterval(qrTimer);
    if (countdownTimer) clearInterval(countdownTimer);
    
    setOpenQRDialog(false);
    setQrCode('');
    setKalanSure(0);
    
    // Yoklamayı tamamlandı olarak işaretle
    if (aktifYoklama) {
      setYoklamalar(prev => prev.map(y => 
        y.id === aktifYoklama.id ? { ...y, durum: "tamamlandi" } : y
      ));
    }
    
    setSnackbar({
      open: true,
      message: 'Yoklama tamamlandı!',
      severity: 'success'
    });
    
    setAktifYoklama(null);
  };

  // Süre formatı
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleYoklamaDurdur = (id) => {
    setYoklamalar(yoklamalar.map(y => 
      y.id === id ? { ...y, durum: "tamamlandi" } : y
    ));
  };

  // Excel/CSV dosyası yükleme
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Veriyi uygun formata dönüştür
        const yeniOgrenciler = jsonData.map((row, index) => ({
          id: ogrenciler.length + index + 1,
          ad: row['Ad'] || row['ad'] || '',
          soyad: row['Soyad'] || row['soyad'] || '',
          no: row['No'] || row['no'] || row['Numara'] || '',
          sinif: row['Sınıf'] || row['sinif'] || row['Sinif'] || '',
          email: row['Email'] || row['email'] || row['E-posta'] || ''
        }));

        setOgrenciler([...ogrenciler, ...yeniOgrenciler]);
        setSnackbar({
          open: true,
          message: `${yeniOgrenciler.length} öğrenci başarıyla yüklendi!`,
          severity: 'success'
        });
        setOpenUploadDialog(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Dosya okuma hatası! Lütfen doğru format kullanın.',
          severity: 'error'
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Excel dosyası indirme (şablon)
  const downloadTemplate = () => {
    const templateData = [
      { Ad: 'Örnek', Soyad: 'Öğrenci', No: '1001', Sinif: '10-A', Email: 'ornek@email.com' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Öğrenci Listesi');
    XLSX.writeFile(wb, 'ogrenci_listesi_sablonu.xlsx');
    
    setSnackbar({
      open: true,
      message: 'Şablon dosyası indirildi!',
      severity: 'success'
    });
  };

  // Öğrenci listesini Excel olarak dışa aktar
  const exportStudentList = () => {
    const ws = XLSX.utils.json_to_sheet(
      ogrenciler.map(o => ({
        'Ad': o.ad,
        'Soyad': o.soyad,
        'No': o.no,
        'Sınıf': o.sinif,
        'Email': o.email
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Öğrenci Listesi');
    XLSX.writeFile(wb, `ogrenci_listesi_${new Date().toLocaleDateString('tr-TR')}.xlsx`);
    
    setSnackbar({
      open: true,
      message: 'Öğrenci listesi dışa aktarıldı!',
      severity: 'success'
    });
  };

  // Öğrenci silme
  const deleteStudent = (id) => {
    setOgrenciler(ogrenciler.filter(o => o.id !== id));
    setSnackbar({
      open: true,
      message: 'Öğrenci silindi!',
      severity: 'success'
    });
    setAnchorEl(null);
  };

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

  // Telafi ders işlevleri
  const handleTelafiOpen = () => {
    setOpenTelafiDialog(true);
  };

  const handleTelafiClose = () => {
    setOpenTelafiDialog(false);
    setTelafiDetails({
      ders: 'Matematik',
      sinif: '10-A',
      hafta: '',
      tarih: '',
      baslangicSaat: '',
      bitisSaat: ''
    });
  };

  const generateWeekOptions = () => {
    const weeks = [];
    const currentDate = new Date();
    
    // Son 4 hafta ve önümüzdeki 4 hafta
    for (let i = -4; i <= 4; i++) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekLabel = `${weekStart.toLocaleDateString('tr-TR')} - ${weekEnd.toLocaleDateString('tr-TR')}`;
      const weekValue = `hafta-${i + 5}`; // 1-9 arası değer
      
      weeks.push({ value: weekValue, label: weekLabel });
    }
    
    return weeks;
  };

  const handleTelafiStart = () => {
    if (!telafiDetails.hafta || !telafiDetails.tarih || !telafiDetails.baslangicSaat || !telafiDetails.bitisSaat) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm alanları doldurun!',
        severity: 'error'
      });
      return;
    }

    const saat = `${telafiDetails.baslangicSaat}-${telafiDetails.bitisSaat}`;
    const yeniTelafi = {
      id: Date.now(),
      ders: telafiDetails.ders,
      sinif: telafiDetails.sinif,
      tarih: new Date(telafiDetails.tarih).toLocaleDateString('tr-TR'),
      saat: saat,
      durum: 'aktif',
      katilimci: 0,
      toplamOgrenci: ogrenciler.filter(o => o.sinif === telafiDetails.sinif).length,
      tip: 'telafi',
      hafta: telafiDetails.hafta
    };

    setYoklamalar([...yoklamalar, yeniTelafi]);
    
    const weekLabel = generateWeekOptions().find(w => w.value === telafiDetails.hafta)?.label || telafiDetails.hafta;
    setSnackbar({
      open: true,
      message: `${weekLabel} için telafi yoklaması başlatıldı!`,
      severity: 'success'
    });
    
    handleTelafiClose();
  };

  // Devamsızlık hesaplama utility fonksiyonu
  const getDevamsizlikBilgisi = (devamsizlik, toplamDers) => {
    const yuzde = ((devamsizlik / toplamDers) * 100).toFixed(1);
    let chipColor = 'success';
    if (yuzde > 10) chipColor = 'error';
    else if (yuzde > 5) chipColor = 'warning';
    
    return { yuzde, chipColor };
  };

  // Calendar utility functions
  const isSchoolDay = (date) => {
    const dayOfWeek = date.getDay();
    return schoolDays.includes(dayOfWeek);
  };

  const isHoliday = (date) => {
    return holidays.some(holiday => 
      holiday.toDateString() === date.toDateString()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCurrentClass = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('tr-TR', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const ders of dersler) {
      if (ders.schedule[currentDay]) {
        for (const schedule of ders.schedule[currentDay]) {
          const [startHour, startMin] = schedule.startTime.split(':').map(Number);
          const [endHour, endMin] = schedule.endTime.split(':').map(Number);
          const startTime = startHour * 60 + startMin;
          const endTime = endHour * 60 + endMin;

          if (currentTime >= startTime && currentTime <= endTime) {
            return { ...ders, currentSchedule: schedule };
          }
        }
      }
    }
    return null;
  };

  const generateCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
      if (current > lastDay && current.getDay() === 0) break;
    }

    return calendar;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Öğretmen Paneli
          </Typography>

          {/* Navigation Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => setCurrentSection('ana-sayfa')}
              sx={{
                backgroundColor: currentSection === 'ana-sayfa' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              Ana Sayfa
            </Button>
            <Button
              color="inherit"
              startIcon={<Groups />}
              onClick={() => setCurrentSection('ogrenci-islerim')}
              sx={{
                backgroundColor: currentSection === 'ogrenci-islerim' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              Öğrenci İşlerim
            </Button>
            <Button
              color="inherit"
              startIcon={<Class />}
              onClick={() => setCurrentSection('derslerim')}
              sx={{
                backgroundColor: currentSection === 'derslerim' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              Derslerim
            </Button>
            <Button
              color="inherit"
              startIcon={<CheckCircle />}
              onClick={() => setCurrentSection('yoklama')}
              sx={{
                backgroundColor: currentSection === 'yoklama' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              Yoklama
            </Button>
          </Box>

          {/* Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setCurrentSection('profilim')}
              sx={{
                backgroundColor: currentSection === 'profilim' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Avatar
                src={userProfile.profilePhoto}
                alt={userProfile.name}
                sx={{ width: 32, height: 32 }}
              >
                {userProfile.name.charAt(0)}
              </Avatar>
            </IconButton>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Profilim
            </Typography>
          </Box>

          <Button color="inherit" startIcon={<ExitToApp />}>
            Çıkış
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* Ana Sayfa */}
        {currentSection === 'ana-sayfa' && (
          <>
            {/* Hoşgeldin Mesajı */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                mb: 4, 
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                borderRadius: 3,
                color: 'white'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Hoşgeldin Dr. Ayşe Kaya! 👩‍🏫
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Bugün {new Date().toLocaleDateString('tr-TR')} - Sınıflarınızı yönetin ve yoklama alın
              </Typography>
            </Paper>

            {/* Şu Anki Ders */}
            {getCurrentClass() && (
              <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#e8f5e8', borderLeft: '4px solid #4caf50' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  🎯 Şu Anki Ders
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  {getCurrentClass().name} - {getCurrentClass().class}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ⏰ {getCurrentClass().currentSchedule.startTime} - {getCurrentClass().currentSchedule.endTime}
                  {getCurrentClass().currentSchedule.room && ` | 📍 ${getCurrentClass().currentSchedule.room}`}
                </Typography>
              </Paper>
            )}

            <Grid container spacing={4}>
              {/* Takvim */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      📅 Takvim
                    </Typography>
                    <Box>
                      <IconButton onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}>
                        <ArrowBack />
                      </IconButton>
                      <Typography variant="h6" component="span" sx={{ mx: 2 }}>
                        {calendarDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                      </Typography>
                      <IconButton onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}>
                        <ArrowForward />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Calendar Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
                    {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
                      <Typography key={day} variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', p: 1 }}>
                        {day}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                    {generateCalendar().flat().map((date, index) => {
                      const isCurrentMonth = date.getMonth() === calendarDate.getMonth();
                      const isSchool = isSchoolDay(date) && !isHoliday(date);
                      const isTodayDate = isToday(date);

                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            textAlign: 'center',
                            borderRadius: 1,
                            cursor: 'pointer',
                            backgroundColor: isTodayDate 
                              ? '#1a237e' 
                              : isSchool 
                                ? '#e8f5e8' 
                                : '#f5f5f5',
                            color: isTodayDate 
                              ? 'white' 
                              : isCurrentMonth 
                                ? 'text.primary' 
                                : 'text.secondary',
                            opacity: isCurrentMonth ? 1 : 0.5,
                            '&:hover': {
                              backgroundColor: isTodayDate ? '#1a237e' : '#e0e0e0'
                            }
                          }}
                        >
                          <Typography variant="body2">
                            {date.getDate()}
                          </Typography>
                          {isTodayDate && (
                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                              BUGÜN
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#e8f5e8', borderRadius: 0.5 }} />
                      <Typography variant="caption">Okul Günü</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#f5f5f5', borderRadius: 0.5 }} />
                      <Typography variant="caption">Tatil</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#1a237e', borderRadius: 0.5 }} />
                      <Typography variant="caption">Bugün</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Hızlı Erişim */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
                  🚀 Hızlı Erişim
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        borderLeft: '4px solid #2196f3',
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                      }}
                      onClick={() => setCurrentSection('derslerim')}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Class sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                        <Typography variant="body2" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                          Derslerim
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        bgcolor: '#fff3e0', 
                        borderLeft: '4px solid #ff9800',
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                      }}
                      onClick={() => setCurrentSection('ogrenci-islerim')}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Groups sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                        <Typography variant="body2" color="#f57c00" sx={{ fontWeight: 'bold' }}>
                          Öğrenciler
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        bgcolor: '#e8f5e8', 
                        borderLeft: '4px solid #4caf50',
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                      }}
                      onClick={() => setCurrentSection('yoklama')}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <CheckCircle sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                        <Typography variant="body2" color="#2e7d32" sx={{ fontWeight: 'bold' }}>
                          Yoklama
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        bgcolor: '#fce4ec', 
                        borderLeft: '4px solid #e91e63',
                        cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                      }}
                      onClick={() => setOpenUploadDialog(true)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <CloudUpload sx={{ fontSize: 32, color: '#e91e63', mb: 1 }} />
                        <Typography variant="body2" color="#c2185b" sx={{ fontWeight: 'bold' }}>
                          Dosya Yükle
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        {/* Derslerim Bölümü */}
        {currentSection === 'derslerim' && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
              📚 Derslerim
            </Typography>

            <Grid container spacing={3}>
              {dersler.map((ders) => (
                <Grid item xs={12} md={6} key={ders.id}>
                  <Card elevation={3} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
                        {ders.name} ({ders.code})
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
                        Sınıf: {ders.class}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        📅 Haftalık Program:
                      </Typography>
                      
                      {Object.entries(ders.schedule).map(([day, schedules]) => (
                        <Box key={day} sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            <strong>{day}:</strong> {schedules.map(s => 
                              `${s.startTime}-${s.endTime}${s.room ? ` (${s.room})` : ''}`
                            ).join(', ')}
                          </Typography>
                        </Box>
                      ))}

                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2">
                          📊 Hafta: {ders.currentWeek}/{ders.totalWeeks}
                        </Typography>
                        <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, mt: 1 }}>
                          <Box 
                            sx={{ 
                              width: `${(ders.currentWeek / ders.totalWeeks) * 100}%`, 
                              bgcolor: '#1a237e', 
                              height: 8, 
                              borderRadius: 1 
                            }} 
                          />
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        color="success"
                        startIcon={<PlayArrow />}
                        onClick={() => {
                          setNewYoklama({...newYoklama, ders: ders.name, sinif: ders.class});
                          handleYoklamaBasla();
                        }}
                        sx={{ mr: 1 }}
                      >
                        Yoklama Başlat
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        startIcon={<CalendarToday />}
                        onClick={() => {
                          setTelafiDetails({...telafiDetails, ders: ders.name, sinif: ders.class});
                          handleTelafiOpen();
                        }}
                      >
                        Telafi Ders
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Öğrenci İşlerim Bölümü */}
        {currentSection === 'ogrenci-islerim' && (
          <>
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
                  onClick={() => setOpenUploadDialog(true)}
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
                    borderLeft: '4px solid #2196f3',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                  }}
                  onClick={() => setOpenStudentListDialog(true)}
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
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                // Set selected student for actions
                              }}
                            >
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
          </>
        )}

        {/* Yoklama Bölümü */}
        {currentSection === 'yoklama' && (
          <>
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
                      
                      {yoklama.tip === 'telafi' && yoklama.hafta && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          📌 Telafi Haftası: {generateWeekOptions().find(w => w.value === yoklama.hafta)?.label || yoklama.hafta}
                        </Typography>
                      )}
                      
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
          </>
        )}

        {/* Profilim Bölümü */}
        {currentSection === 'profilim' && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
              👤 Profilim
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={userProfile.profilePhoto}
                    alt={userProfile.name}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  >
                    {userProfile.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {userProfile.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {userProfile.title}
                  </Typography>
                  <Button variant="outlined" startIcon={<Edit />}>
                    Fotoğraf Değiştir
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Kişisel Bilgiler
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ad Soyad"
                        value={userProfile.name}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Unvan"
                        value={userProfile.title}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="E-posta"
                        value={userProfile.email}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Telefon"
                        value={userProfile.phone}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Okul"
                        value={userProfile.school}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Bölüm"
                        value={userProfile.department}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Biyografi"
                        value={userProfile.biography}
                        fullWidth
                        multiline
                        rows={4}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<Edit />}>
                      Düzenle
                    </Button>
                    <Button variant="outlined">
                      Şifre Değiştir
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Hızlı Aksiyonlar - Sadece Ana Sayfa dışında gizli */}
        {currentSection === 'ana-sayfa' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#e8f5e8', 
                borderLeft: '4px solid #4caf50',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
              onClick={handleYoklamaBasla}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <PlayArrow sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" color="#2e7d32" sx={{ fontWeight: 'bold' }}>
                  Yeni Yoklama Başlat
                </Typography>
                <Typography variant="body2" color="#2e7d32">
                  Sınıfınız için yoklama oluşturun
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#fce4ec', 
                borderLeft: '4px solid #e91e63',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
              onClick={handleTelafiOpen}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CalendarToday sx={{ fontSize: 48, color: '#e91e63', mb: 2 }} />
                <Typography variant="h6" color="#c2185b" sx={{ fontWeight: 'bold' }}>
                  Telafi Ders
                </Typography>
                <Typography variant="body2" color="#c2185b">
                  Haftalık telafi yoklaması başlatın
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#fff3e0', 
                borderLeft: '4px solid #ff9800',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
              onClick={() => setOpenUploadDialog(true)}
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
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={2} 
              sx={{ 
                bgcolor: '#e3f2fd', 
                borderLeft: '4px solid #2196f3',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
              }}
              onClick={() => setOpenStudentListDialog(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Groups sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                <Typography variant="h6" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                  Öğrenci Yönetimi
                </Typography>
                <Typography variant="h3" color="#1976d2" sx={{ fontWeight: 'bold' }}>
                  {ogrenciler.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ana sayfa dışında yoklama listesi gösterme */}
        {currentSection === 'ana-sayfa' && (
        <Grid container spacing={4}>
          {/* Aktif Yoklamalar */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>
              📋 Yoklamalarım
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
                      
                      {yoklama.tip === 'telafi' && yoklama.hafta && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          📌 Telafi Haftası: {generateWeekOptions().find(w => w.value === yoklama.hafta)?.label || yoklama.hafta}
                        </Typography>
                      )}
                      
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
          </Grid>

          {/* Öğrenci Listesi */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                👥 Öğrenci Listesi
              </Typography>
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={() => setOpenStudentListDialog(true)}
              >
                Tümünü Gör
              </Button>
            </Box>

            <Paper elevation={2} sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List>
                {ogrenciler.slice(0, 5).map((ogrenci, index) => {
                  const { yuzde, chipColor } = getDevamsizlikBilgisi(ogrenci.devamsizlik, ogrenci.toplamDers);
                  return (
                    <React.Fragment key={ogrenci.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#1a237e' }}>
                            {ogrenci.ad[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {ogrenci.ad} {ogrenci.soyad}
                              </Typography>
                              <Chip 
                                label={`%${yuzde}`}
                                color={chipColor}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </Box>
                          }
                          secondary={`${ogrenci.no} - ${ogrenci.sinif} • ${ogrenci.devamsizlik}/${ogrenci.toplamDers} devamsızlık`}
                        />
                      </ListItem>
                      {index < Math.min(ogrenciler.length, 5) - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
                {ogrenciler.length > 5 && (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary" align="center">
                            +{ogrenciler.length - 5} öğrenci daha...
                          </Typography>
                        }
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
        )}
      </Container>

      {/* Yoklama Oluşturma Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Yoklama Oluştur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Ders"
                fullWidth
                value={newYoklama.ders}
                onChange={(e) => setNewYoklama({...newYoklama, ders: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sınıf"
                fullWidth
                placeholder="Örn: 10-A"
                value={newYoklama.sinif}
                onChange={(e) => setNewYoklama({...newYoklama, sinif: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tarih"
                type="date"
                fullWidth
                value={newYoklama.tarih}
                onChange={(e) => setNewYoklama({...newYoklama, tarih: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Başlangıç Saati"
                type="time"
                fullWidth
                value={newYoklama.baslangicSaat}
                onChange={(e) => setNewYoklama({...newYoklama, baslangicSaat: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bitiş Saati"
                type="time"
                fullWidth
                value={newYoklama.bitisSaat}
                onChange={(e) => setNewYoklama({...newYoklama, bitisSaat: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Yoklama Süresi</InputLabel>
                <Select
                  value={yoklamaSuresi}
                  onChange={(e) => setYoklamaSuresi(e.target.value)}
                  label="Yoklama Süresi"
                >
                  <MenuItem value={3}>3 Dakika</MenuItem>
                  <MenuItem value={5}>5 Dakika</MenuItem>
                  <MenuItem value={10}>10 Dakika</MenuItem>
                  <MenuItem value={15}>15 Dakika</MenuItem>
                  <MenuItem value={20}>20 Dakika</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button 
            onClick={handleYoklamaOlustur} 
            variant="contained"
            disabled={!newYoklama.sinif || !newYoklama.baslangicSaat || !newYoklama.bitisSaat}
          >
            Yoklamayı Başlat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dosya Yükleme Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudUpload sx={{ mr: 2, color: '#ff9800' }} />
            Öğrenci Listesi Yükle
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Excel veya CSV dosyası seçin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Dosya formatı: Ad, Soyad, No, Sınıf, Email sütunları olmalı
            </Typography>
            
            <input
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                size="large"
                sx={{ mb: 2, mr: 2 }}
              >
                Dosya Seç
              </Button>
            </label>
            
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              size="large"
              onClick={downloadTemplate}
              sx={{ mb: 2 }}
            >
              Şablon İndir
            </Button>

            <Typography variant="caption" display="block" color="text.secondary">
              Desteklenen formatlar: .xlsx, .xls, .csv
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Öğrenci Listesi Dialog */}
      <Dialog open={openStudentListDialog} onClose={() => setOpenStudentListDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Öğrenci Listesi Yönetimi</Typography>
            <Box>
              <Button
                startIcon={<FileDownload />}
                onClick={exportStudentList}
                sx={{ mr: 1 }}
              >
                Dışa Aktar
              </Button>
              <Button
                startIcon={<CloudUpload />}
                variant="contained"
                onClick={() => {
                  setOpenStudentListDialog(false);
                  setOpenUploadDialog(true);
                }}
              >
                Yükle
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Ad Soyad</strong></TableCell>
                  <TableCell><strong>Öğrenci No</strong></TableCell>
                  <TableCell><strong>Sınıf</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Devamsızlık</strong></TableCell>
                  <TableCell align="center"><strong>İşlemler</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ogrenciler.map((ogrenci) => {
                  const { yuzde, chipColor } = getDevamsizlikBilgisi(ogrenci.devamsizlik, ogrenci.toplamDers);
                  return (
                    <TableRow key={ogrenci.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: '#1a237e', mr: 2, width: 32, height: 32 }}>
                            {ogrenci.ad[0]}
                          </Avatar>
                          {ogrenci.ad} {ogrenci.soyad}
                        </Box>
                      </TableCell>
                      <TableCell>{ogrenci.no}</TableCell>
                      <TableCell>
                        <Chip label={ogrenci.sinif} size="small" color="primary" />
                      </TableCell>
                      <TableCell>{ogrenci.email}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`%${yuzde}`}
                            color={chipColor}
                            size="small"
                            sx={{ fontWeight: 'bold', minWidth: 60 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {ogrenci.devamsizlik}/{ogrenci.toplamDers}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => setAnchorEl(e.currentTarget)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => setAnchorEl(null)}
                        >
                          <MenuItem onClick={() => setAnchorEl(null)}>
                            <Edit sx={{ mr: 1 }} fontSize="small" />
                            Düzenle
                          </MenuItem>
                          <MenuItem onClick={() => deleteStudent(ogrenci.id)} sx={{ color: 'error.main' }}>
                            <Delete sx={{ mr: 1 }} fontSize="small" />
                            Sil
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentListDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Telafi Yoklama Dialog */}
      <Dialog open={openTelafiDialog} onClose={handleTelafiClose} maxWidth="sm" fullWidth>
        <DialogTitle>Telafi Yoklaması Oluştur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Ders"
                fullWidth
                value={telafiDetails.ders}
                onChange={(e) => setTelafiDetails({...telafiDetails, ders: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sınıf"
                fullWidth
                placeholder="Örn: 10-A"
                value={telafiDetails.sinif}
                onChange={(e) => setTelafiDetails({...telafiDetails, sinif: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Hafta</InputLabel>
                <Select
                  value={telafiDetails.hafta}
                  onChange={(e) => setTelafiDetails({...telafiDetails, hafta: e.target.value})}
                  label="Hafta"
                >
                  {generateWeekOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tarih"
                type="date"
                fullWidth
                value={telafiDetails.tarih}
                onChange={(e) => setTelafiDetails({...telafiDetails, tarih: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Başlangıç Saati"
                type="time"
                fullWidth
                value={telafiDetails.baslangicSaat}
                onChange={(e) => setTelafiDetails({...telafiDetails, baslangicSaat: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bitiş Saati"
                type="time"
                fullWidth
                value={telafiDetails.bitisSaat}
                onChange={(e) => setTelafiDetails({...telafiDetails, bitisSaat: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTelafiClose}>İptal</Button>
          <Button 
            onClick={handleTelafiStart} 
            variant="contained"
            disabled={!telafiDetails.hafta || !telafiDetails.tarih || !telafiDetails.baslangicSaat || !telafiDetails.bitisSaat}
          >
            Yoklamayı Başlat
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Kod Yoklama Dialog */}
      <Dialog 
        open={openQRDialog} 
        onClose={() => {}} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              QR Kod Yoklama - {aktifYoklama?.ders} ({aktifYoklama?.sinif})
            </Typography>
            <Chip 
              label={formatTime(kalanSure)} 
              color="primary" 
              size="large"
              sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
              Öğrenciler QR Kodu Okutarak Yoklamaya Katılabilir
            </Typography>
            
            {qrCode && (
              <Box sx={{ mb: 3 }}>
                <img 
                  src={qrCode} 
                  alt="QR Kod" 
                  style={{ 
                    maxWidth: '300px', 
                    height: 'auto',
                    border: '4px solid #1a237e',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }} 
                />
              </Box>
            )}
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              QR kod her 3 saniyede bir yenileniyor
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {aktifYoklama?.katilimci || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Katılan Öğrenci
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {aktifYoklama?.toplamOgrenci || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Öğrenci
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={endQRYoklama} 
            variant="contained" 
            color="error"
            size="large"
            startIcon={<Stop />}
          >
            Yoklamayı Sonlandır
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OgretmenPanel;
