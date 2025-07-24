import React, { useState, useEffect } from "react";
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
  Alert,
  AlertTitle,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Edit,
  Add,
  Delete,
  Warning,
  AccessTime,
  School,
  Schedule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDersler } from "../contexts/DersContext";

import DersDetay from "./DersDetay";

const Derslerim = () => {
  const navigate = useNavigate();
  const { dersler, addDers, checkTimeConflict } = useDersler();

  // View state - 'list' veya 'detail'
  const [currentView, setCurrentView] = useState("list");
  const [selectedDers, setSelectedDers] = useState(null);

  // Ders ekleme dialog state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [newDers, setNewDers] = useState({
    name: "",
    code: "",
    info: "",
    classroom: "",
    building: "",
    room: "",
    teachingType: "", // 1. öğretim, 2. öğretim, her ikisi
    section: "",
    sectionFull: "",
    instructor: "",
    // Aynı güne birden fazla ders eklemek için array yapısı
    schedule: {
      pazartesi: [],
      salı: [],
      çarşamba: [],
      perşembe: [],
      cuma: [],
    },
  });

  // Event handlers
  const handleDersClick = (ders) => {
    navigate(`/portal/ders/${ders.id}`);
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
    setConflicts([]);
    setShowConflictWarning(false);
    setNewDers({
      name: "",
      code: "",
      info: "",
      classroom: "",
      building: "",
      room: "",
      teachingType: "",
      section: "",
      sectionFull: "",
      instructor: "",
      schedule: {
        pazartesi: [],
        salı: [],
        çarşamba: [],
        perşembe: [],
        cuma: [],
        cumartesi: [],
        pazar: [],
      },
    });
  };

  const handleInputChange = (field, value) => {
    setNewDers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aynı güne yeni ders saati ekleme
  const handleAddTimeSlot = (day) => {
    setNewDers((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: [
          ...prev.schedule[day],
          { startTime: "", endTime: "", room: prev.room },
        ],
      },
    }));
  };

  // Ders saati silme
  const handleRemoveTimeSlot = (day, index) => {
    setNewDers((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day].filter((_, i) => i !== index),
      },
    }));
  };

  // Ders saati güncelleme
  const handleTimeSlotChange = (day, index, field, value) => {
    setNewDers((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day].map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  // Çakışma kontrolü
  const checkForConflicts = () => {
    // Boş olmayan schedule'ları filtrele
    const scheduleToCheck = {};
    Object.entries(newDers.schedule).forEach(([day, slots]) => {
      const validSlots = slots.filter((slot) => slot.startTime && slot.endTime);
      if (validSlots.length > 0) {
        scheduleToCheck[day] = validSlots;
      }
    });

    if (Object.keys(scheduleToCheck).length > 0) {
      const foundConflicts = checkTimeConflict(scheduleToCheck);
      setConflicts(foundConflicts);
      setShowConflictWarning(foundConflicts.length > 0);
    } else {
      setConflicts([]);
      setShowConflictWarning(false);
    }
  };

  // Ders programı değiştiğinde çakışma kontrolü yap
  useEffect(() => {
    if (openAddDialog) {
      checkForConflicts();
    }
  }, [newDers.schedule, openAddDialog]);

  const handleSaveDers = () => {
    // Çakışma kontrolü yap
    const scheduleToCheck = {};
    Object.entries(newDers.schedule).forEach(([day, slots]) => {
      const validSlots = slots.filter((slot) => slot.startTime && slot.endTime);
      if (validSlots.length > 0) {
        scheduleToCheck[day] = validSlots;
      }
    });

    const foundConflicts = checkTimeConflict(scheduleToCheck);

    if (foundConflicts.length > 0) {
      setConflicts(foundConflicts);
      setShowConflictWarning(true);
      return; // Çakışma varsa kaydetme
    }

    // Öğretim türüne göre section bilgisini oluştur
    const getTeachingTypePrefix = (teachingType) => {
      switch (teachingType) {
        case "1":
          return "1.Ö";
        case "2":
          return "2.Ö";
        case "both":
          return "Karma";
        default:
          return "YP";
      }
    };

    const sectionPrefix = getTeachingTypePrefix(newDers.teachingType);
    const sectionValue = newDers.section || "A1";
    const sectionFull = `${sectionPrefix}-${sectionValue}`;

    const yeniDers = {
      id: Math.max(...dersler.map((d) => d.id), 0) + 1,
      name: newDers.name,
      code: newDers.code,
      section: sectionValue,
      sectionFull: sectionFull,
      building: newDers.building,
      room: newDers.room,
      class: "10-A", // Varsayılan
      instructor: newDers.instructor || "Dr. Ayşe Kaya",
      teachingType: newDers.teachingType,
      schedule: scheduleToCheck,
      totalWeeks: 15,
      currentWeek: 1,
      studentCount: 0, // Varsayılan değer
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
      info: newDers.info,
      classroom: newDers.classroom,
    };

    addDers(yeniDers);
    handleCloseAddDialog();
  };

  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === "detail" && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a237e" }}>
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
            py: 1.5,
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
                    {ders.attendanceRate > 0
                      ? "Genel Katılım Oranı"
                      : "Henüz yoklama alınmadı"}
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `4px solid ${
                        ders.attendanceRate >= 80
                          ? "#4caf50"
                          : ders.attendanceRate >= 60
                          ? "#ff9800"
                          : "#f44336"
                      }`,
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
                        color:
                          ders.attendanceRate >= 80
                            ? "#4caf50"
                            : ders.attendanceRate >= 60
                            ? "#ff9800"
                            : ders.attendanceRate > 0
                            ? "#f44336"
                            : "#999",
                      }}
                    >
                      %{ders.attendanceRate}
                    </Typography>
                  </Box>
                </Box>

                {/* Öğretim Türü Chip */}
                {ders.teachingType && (
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Chip
                      icon={<School />}
                      label={
                        ders.teachingType === "1"
                          ? "1. Öğretim"
                          : ders.teachingType === "2"
                          ? "2. Öğretim"
                          : ders.teachingType === "both"
                          ? "Her İki Öğretim"
                          : "Öğretim Türü"
                      }
                      color={
                        ders.teachingType === "1"
                          ? "primary"
                          : ders.teachingType === "2"
                          ? "secondary"
                          : "default"
                      }
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                )}

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
                    <strong>Öğretim Görevlisi:</strong> {ders.instructor}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Yoklama Oranı:</strong> %{ders.attendanceRate}
                  </Typography>
                  {ders.info && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, fontStyle: "italic", color: "#666" }}
                    >
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
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1a237e" }}
          >
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Ders Kodu"
                  value={newDers.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ders Bilgileri"
                  value={newDers.info}
                  onChange={(e) => handleInputChange("info", e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Derslik Bilgileri */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bina"
                  value={newDers.building}
                  onChange={(e) =>
                    handleInputChange("building", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Derslik"
                  value={newDers.room}
                  onChange={(e) => handleInputChange("room", e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Öğretim Türü ve Ek Bilgiler */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2, mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "#1a237e",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <School />
                    Öğretim Bilgileri
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="teaching-type-label">
                          Öğretim Türü
                        </InputLabel>
                        <Select
                          labelId="teaching-type-label"
                          value={newDers.teachingType}
                          label="Öğretim Türü"
                          onChange={(e) =>
                            handleInputChange("teachingType", e.target.value)
                          }
                        >
                          <MenuItem value="1">1. Öğretim</MenuItem>
                          <MenuItem value="2">2. Öğretim</MenuItem>
                          <MenuItem value="both">Her İkisi</MenuItem>
                        </Select>
                        <FormHelperText>
                          Dersin hangi öğretim türünde verildiğini seçin
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Bölüm/Sınıf"
                        value={newDers.section}
                        onChange={(e) =>
                          handleInputChange("section", e.target.value)
                        }
                        placeholder="Örn: A1, B2"
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Öğretim Görevlisi"
                        value={newDers.instructor}
                        onChange={(e) =>
                          handleInputChange("instructor", e.target.value)
                        }
                        placeholder="Örn: Dr. Ayşe Kaya"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Öğretim Türü Bilgi Kartları */}
                  {newDers.teachingType && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: "bold" }}
                      >
                        Seçilen Öğretim Türü:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {newDers.teachingType === "1" && (
                          <Chip
                            icon={<Schedule />}
                            label="1. Öğretim (08:00-17:00)"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {newDers.teachingType === "2" && (
                          <Chip
                            icon={<Schedule />}
                            label="2. Öğretim (17:00-22:00)"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {newDers.teachingType === "both" && (
                          <>
                            <Chip
                              icon={<Schedule />}
                              label="1. Öğretim (08:00-17:00)"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              icon={<Schedule />}
                              label="2. Öğretim (17:00-22:00)"
                              color="secondary"
                              variant="outlined"
                            />
                          </>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {newDers.teachingType === "1" &&
                          "Bu ders sadece 1. öğretim saatlerinde verilecektir."}
                        {newDers.teachingType === "2" &&
                          "Bu ders sadece 2. öğretim saatlerinde verilecektir."}
                        {newDers.teachingType === "both" &&
                          "Bu ders hem 1. hem de 2. öğretim saatlerinde verilebilir."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Çakışma Uyarısı */}
              {showConflictWarning && conflicts.length > 0 && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Warning />
                        Ders Saati Çakışması Tespit Edildi!
                      </Box>
                    </AlertTitle>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Aşağıdaki ders saatleri mevcut derslerle çakışmaktadır:
                    </Typography>
                    {conflicts.map((conflict, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 1,
                          p: 1,
                          bgcolor: "#ffebee",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          📅{" "}
                          {conflict.day.charAt(0).toUpperCase() +
                            conflict.day.slice(1)}{" "}
                          - {conflict.newTime}
                        </Typography>
                        <Typography variant="caption" color="error">
                          ⚠️ Çakışan Ders: {conflict.existingDers} (
                          {conflict.existingCode}) - {conflict.existingTime} -{" "}
                          {conflict.existingRoom}
                        </Typography>
                      </Box>
                    ))}
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontStyle: "italic" }}
                    >
                      Lütfen ders saatlerini değiştirin veya çakışan dersleri
                      kontrol edin.
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {/* Günler ve Saatler */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: "#1a237e" }}>
                  Ders Günleri ve Saatleri
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                  Her gün için birden fazla ders saati ekleyebilirsiniz. "+"
                  butonuna tıklayarak aynı güne yeni saat ekleyin.
                </Typography>

                <Grid container spacing={2}>
                  {Object.keys(newDers.schedule).map((day) => (
                    <Grid item xs={12} key={day}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#1a237e",
                              textTransform: "capitalize",
                            }}
                          >
                            {day}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleAddTimeSlot(day)}
                            sx={{ minWidth: "auto" }}
                          >
                            Saat Ekle
                          </Button>
                        </Box>

                        {newDers.schedule[day].length === 0 ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            Bu gün için henüz ders saati eklenmemiş. "Saat Ekle"
                            butonuna tıklayın.
                          </Typography>
                        ) : (
                          newDers.schedule[day].map((slot, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                mb: 1,
                                p: 1,
                                bgcolor: "#f8f9fa",
                                borderRadius: 1,
                              }}
                            >
                              <Chip
                                icon={<AccessTime />}
                                label={`Ders ${index + 1}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <TextField
                                size="small"
                                type="time"
                                label="Başlangıç"
                                value={slot.startTime}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    day,
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 120 }}
                              />
                              <TextField
                                size="small"
                                type="time"
                                label="Bitiş"
                                value={slot.endTime}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    day,
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 120 }}
                              />
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveTimeSlot(day, index)}
                                sx={{ ml: 1 }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          ))
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
          <Button onClick={handleCloseAddDialog}>İptal</Button>
          <Button
            variant="contained"
            onClick={handleSaveDers}
            disabled={
              !newDers.name ||
              !newDers.code ||
              !newDers.teachingType ||
              showConflictWarning ||
              Object.values(newDers.schedule).every(
                (slots) => slots.length === 0
              )
            }
            sx={{
              bgcolor: showConflictWarning ? "#f44336" : "#1a237e",
              "&:hover": {
                bgcolor: showConflictWarning ? "#d32f2f" : "#0d47a1",
              },
            }}
          >
            {showConflictWarning ? "Çakışma Var - Kaydedemez" : "Dersi Kaydet"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Derslerim;
