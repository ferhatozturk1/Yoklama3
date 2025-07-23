import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";

import DersDetay from "./DersDetay";

const Derslerim = () => {
  // View state - 'list' veya 'detail'
  const [currentView, setCurrentView] = useState("list");
  const [selectedDers, setSelectedDers] = useState(null);
  
  // Ders ekleme dialog state
// Ders ekleme dialog state
const [openAddDialog, setOpenAddDialog] = useState(false);
const [newDers, setNewDers] = useState({
  name: '',
  code: '',
  info: '',
  classroom: '',
  building: '',
  room: '',
  days: {
    pazartesi: false,
    salı: false,
    çarşamba: false,
    perşembe: false,
    cuma: false,
    cumartesi: false,
    pazar: false
  },
  times: {
    pazartesi: { start: '', end: '' },
    salı: { start: '', end: '' },
    çarşamba: { start: '', end: '' },
    perşembe: { start: '', end: '' },
    cuma: { start: '', end: '' },
    cumartesi: { start: '', end: '' },
    pazar: { start: '', end: '' }
  }
});

// Ders saati bilgilerini güncelleyerek, aynı gün için tekrar ders saati eklenmesini engelleme
const handleTimeChange = (day, startTime, endTime) => {
  if (!newDers.times[day].start && !newDers.times[day].end) {
    setNewDers((prevState) => {
      const updatedTimes = { ...prevState.times, [day]: { start: startTime, end: endTime } };
      return { ...prevState, times: updatedTimes };
    });
  }
};

// Gün seçimini işlemek için fonksiyon
const handleDayChange = (day) => {
  setNewDers((prevState) => {
    const updatedDays = { ...prevState.days, [day]: !prevState.days[day] };
    return { ...prevState, days: updatedDays };
  });
};

// JSX kısmında (günlerin seçimi ve saatlerin düzenlenmesi)
return (
  <div>
    <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
      <DialogTitle>Ders Ekle</DialogTitle>
      <DialogContent>
        <TextField
          label="Ders Adı"
          value={newDers.name}
          onChange={(e) => setNewDers({ ...newDers, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Ders Kodu"
          value={newDers.code}
          onChange={(e) => setNewDers({ ...newDers, code: e.target.value })}
          fullWidth
        />
        <TextField
          label="Ders Bilgisi"
          value={newDers.info}
          onChange={(e) => setNewDers({ ...newDers, info: e.target.value })}
          fullWidth
        />
        <TextField
          label="Sınıf"
          value={newDers.classroom}
          onChange={(e) => setNewDers({ ...newDers, classroom: e.target.value })}
          fullWidth
        />
        <TextField
          label="Bina"
          value={newDers.building}
          onChange={(e) => setNewDers({ ...newDers, building: e.target.value })}
          fullWidth
        />

        {/* Gün Seçimi */}
        <FormControlLabel
          control={
            <Checkbox
              checked={newDers.days.pazartesi}
              onChange={() => handleDayChange('pazartesi')}
            />
          }
          label="Pazartesi"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={newDers.days.salı}
              onChange={() => handleDayChange('salı')}
            />
          }
          label="Salı"
        />
        {/* Diğer günler aynı şekilde eklenebilir */}
        
        {/* Saat Seçimi */}
        {newDers.days.pazartesi && !newDers.times.pazartesi.start && (
          <div>
            <TextField
              label="Pazartesi Başlangıç Saati"
              value={newDers.times.pazartesi.start}
              onChange={(e) => handleTimeChange('pazartesi', e.target.value, newDers.times.pazartesi.end)}
            />
            <TextField
              label="Pazartesi Bitiş Saati"
              value={newDers.times.pazartesi.end}
              onChange={(e) => handleTimeChange('pazartesi', newDers.times.pazartesi.start, e.target.value)}
            />
          </div>
        )}
        
        {/* Salı saat bilgisi aynı şekilde */}
        {newDers.days.salı && !newDers.times.salı.start && (
          <div>
            <TextField
              label="Salı Başlangıç Saati"
              value={newDers.times.salı.start}
              onChange={(e) => handleTimeChange('salı', e.target.value, newDers.times.salı.end)}
            />
            <TextField
              label="Salı Bitiş Saati"
              value={newDers.times.salı.end}
              onChange={(e) => handleTimeChange('salı', newDers.times.salı.start, e.target.value)}
            />
          </div>
        )}
        
        {/* Diğer günler için aynı yapı tekrarlanır */}

        <Button onClick={handleSubmit}>Ders Ekle</Button>
      </DialogContent>
    </Dialog>
  </div>
);


  const [dersler, setDersler] = useState([
    {
      id: 1,
      name: "Matematik",
      code: "MAT113/3",
      section: "A1",
      sectionFull: "YP-A1",
      building: "A Blok",
      room: "A101",
      class: "10-A",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        pazartesi: [{ startTime: "08:40", endTime: "09:30", room: "A101" }],
        çarşamba: [{ startTime: "14:00", endTime: "14:50", room: "A101" }],
        cuma: [{ startTime: "10:00", endTime: "10:50", room: "A101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 32,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
    {
      id: 2,
      name: "İngilizce",
      code: "ENG101/8",
      section: "D101",
      sectionFull: "YP-D101",
      building: "D Blok",
      room: "D101",
      class: "10-B",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        salı: [{ startTime: "09:50", endTime: "10:40", room: "D101" }],
        perşembe: [{ startTime: "11:00", endTime: "11:50", room: "D101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 28,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
    {
      id: 3,
      name: "Bilgisayar Mühendisliği",
      code: "BMC3",
      section: "1",
      sectionFull: "Lab-1",
      building: "B Blok",
      room: "B205",
      class: "11-A",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        perşembe: [{ startTime: "11:00", endTime: "11:50", room: "B205" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 24,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
  ]);

  // Event handlers
  const handleDersClick = (ders) => {
    setSelectedDers(ders);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedDers(null);
  };

  const getDaysText = (schedule) => {
    return Object.keys(schedule).join(", ");
  };

  // Ders ekleme fonksiyonları
  const handleAddDers = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewDers({
      name: '',
      code: '',
      info: '',
      studentCount: '',
      classroom: '',
      building: '',
      room: '',
      days: {
        pazartesi: false,
        salı: false,
        çarşamba: false,
        perşembe: false,
        cuma: false,
        cumartesi: false,
        pazar: false
      },
      times: {
        pazartesi: { start: '', end: '' },
        salı: { start: '', end: '' },
        çarşamba: { start: '', end: '' },
        perşembe: { start: '', end: '' },
        cuma: { start: '', end: '' },
        cumartesi: { start: '', end: '' },
        pazar: { start: '', end: '' }
      }
    });
  };

  const handleInputChange = (field, value) => {
    setNewDers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayChange = (day, checked) => {
    setNewDers(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: checked
      }
    }));
  };

  const handleTimeChange = (day, timeType, value) => {
    setNewDers(prev => ({
      ...prev,
      times: {
        ...prev.times,
        [day]: {
          ...prev.times[day],
          [timeType]: value
        }
      }
    }));
  };

  const handleSaveDers = () => {
    // Seçili günleri schedule formatına çevir
    const schedule = {};
    Object.keys(newDers.days).forEach(day => {
      if (newDers.days[day] && newDers.times[day].start && newDers.times[day].end) {
        schedule[day] = [{
          startTime: newDers.times[day].start,
          endTime: newDers.times[day].end,
          room: newDers.room
        }];
      }
    });

    const yeniDers = {
      id: dersler.length + 1,
      name: newDers.name,
      code: newDers.code,
      section: "A1", // Varsayılan
      sectionFull: "YP-A1", // Varsayılan
      building: newDers.building,
      room: newDers.room,
      class: "10-A", // Varsayılan
      instructor: "Dr. Ayşe Kaya", // Varsayılan
      schedule: schedule,
      totalWeeks: 15,
      currentWeek: 1,
      studentCount: parseInt(newDers.studentCount) || 0,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
      info: newDers.info,
      classroom: newDers.classroom
    };

    setDersler(prev => [...prev, yeniDers]);
    handleCloseAddDialog();
  };

  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === "detail" && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1a237e" }}
        >
          📚 Derslerim
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDers}
          sx={{
            bgcolor: "#1a237e",
            "&:hover": { bgcolor: "#0d47a1" },
            borderRadius: 2,
            px: 3,
            py: 1.5
          }}
        >
          Ders Ekle
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
                borderRadius: 2,
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                {/* Ders Kodu */}
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#1a237e", mb: 1 }}
                >
                  {ders.code}
                </Typography>

                {/* Section */}
                <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
                  Section - {ders.section}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                  {ders.sectionFull}
                </Typography>

                {/* Katılım Oranı */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
                    {ders.attendanceRate > 0 ? 'Genel Katılım Oranı' : 'Henüz yoklama alınmadı'}
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `4px solid ${ders.attendanceRate >= 80 ? '#4caf50' : ders.attendanceRate >= 60 ? '#ff9800' : '#f44336'}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      bgcolor: ders.attendanceRate > 0 ? "#f8f9fa" : "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontWeight: "bold", 
                        color: ders.attendanceRate >= 80 ? '#4caf50' : ders.attendanceRate >= 60 ? '#ff9800' : ders.attendanceRate > 0 ? '#f44336' : '#999'
                      }}
                    >
                      %{ders.attendanceRate}
                    </Typography>
                  </Box>
                </Box>

                {/* Ders Bilgileri - Detaylı Format */}
                <Box sx={{ textAlign: "left", mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ders:</strong> {ders.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Günler:</strong> {getDaysText(ders.schedule)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Derslik:</strong> {ders.building} - {ders.room}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Öğrenci Sayısı:</strong> {ders.studentCount}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Yoklama Oranı:</strong> %{ders.attendanceRate}
                  </Typography>
                  {ders.info && (
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: '#666' }}>
                      {ders.info}
                    </Typography>
                  )}
                </Box>

                {/* Dersi Düzenle Butonu */}
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  sx={{
                    borderColor: "#1a237e",
                    color: "#1a237e",
                    "&:hover": {
                      borderColor: "#1a237e",
                      bgcolor: "rgba(26, 35, 126, 0.04)",
                    },
                  }}
                >
                  Dersi Düzenle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ders Ekleme Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            📚 Yeni Ders Ekle
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Temel Bilgiler */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ders Adı"
                  value={newDers.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Ders Kodu"
                  value={newDers.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ders Bilgileri"
                  value={newDers.info}
                  onChange={(e) => handleInputChange('info', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Derslik ve Öğrenci Bilgileri */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Öğrenci Sayısı"
                  value={newDers.studentCount}
                  onChange={(e) => handleInputChange('studentCount', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bina"
                  value={newDers.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Derslik"
                  value={newDers.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Günler ve Saatler */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Ders Günleri ve Saatleri
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(newDers.days).map((day) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newDers.days[day]}
                              onChange={(e) => handleDayChange(day, e.target.checked)}
                            />
                          }
                          label={day.charAt(0).toUpperCase() + day.slice(1)}
                          sx={{ mb: 1 }}
                        />
                        {newDers.days[day] && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              size="small"
                              type="time"
                              label="Başlangıç"
                              value={newDers.times[day].start}
                              onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              size="small"
                              type="time"
                              label="Bitiş"
                              value={newDers.times[day].end}
                              onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseAddDialog}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveDers}
            disabled={!newDers.name || !newDers.code}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
          >
            Dersi Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Derslerim;
