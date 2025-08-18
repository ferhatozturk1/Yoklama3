import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  LinearProgress,
  Badge,
  TextField,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack,
  School,
  LocationOn,
  Groups,
  Assessment,
  CloudUpload,
  FileDownload,
  CheckCircle,
  Refresh,
  CalendarToday,
  InsertDriveFile,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  Add,
  Schedule,
  Group,
  Person,
} from "@mui/icons-material";
import ÖğrenciDetay from "./ÖğrenciDetay";
import { useAuth } from "../contexts/AuthContext";

const DersDetay = ({ ders, onBack }) => {
  const { accessToken } = useAuth();
  
  // Ders null ise early return yap
  if (!ders) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Ders bilgisi yükleniyor...
          </Typography>
          <Button 
            variant="outlined" 
            onClick={onBack} 
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Geri Dön
          </Button>
        </Box>
      </Container>
    );
  }

  // Dialog states
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openYoklamaYenileDialog, setOpenYoklamaYenileDialog] = useState(false);

  // Report states
  const [reportType, setReportType] = useState('');
  const [selectedReportClass, setSelectedReportClass] = useState('');
  const [selectedReportStudent, setSelectedReportStudent] = useState('');
  const [availableClasses] = useState([
    'MATH113/1 - A Sınıfı',
    'MATH113/2 - B Sınıfı', 
    'MATH113/3 - C Sınıfı'
  ]);
  const [availableStudents] = useState([
    { id: '2021001', name: 'Ahmet Yılmaz', class: 'MATH113/1' },
    { id: '2021002', name: 'Ayşe Kaya', class: 'MATH113/1' },
    { id: '2021003', name: 'Mehmet Demir', class: 'MATH113/2' },
    { id: '2021004', name: 'Fatma Şahin', class: 'MATH113/2' },
    { id: '2021005', name: 'Ali Özkan', class: 'MATH113/3' }
  ]);

  // Student list states
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("list");
  const [canEdit, setCanEdit] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Student detail states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  // Add student dialog state
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    department: "",
  });

  // API states for student list
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // API fonksiyonu - öğrenci listesini çekmek için
  const fetchStudentList = async () => {
    if (!ders?.section_id) {
      setStudentsError('Section ID bulunamadı');
      return;
    }

    console.log('Ders objesi:', ders);
    console.log('Section ID:', ders.section_id);

    setStudentsLoading(true);
    setStudentsError(null);

    try {
      // Farklı endpoint formatlarını dene
      const endpoints = [
        `http://127.0.0.1:8000/yoklama_data/student_list/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/yoklama_data/student_list/${ders.section_id}/`,
        `http://127.0.0.1:8000/student_data/student_list/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/student_data/student_list/${ders.section_id}/`,
        `http://127.0.0.1:8000/api/yoklama_data/student_list/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/api/student_data/student_list/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/yoklama_data/students/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/student_data/students/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/yoklama/student_list/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/yoklama/students/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/course/students/section_id/${ders.section_id}/`,
        `http://127.0.0.1:8000/section/students/${ders.section_id}/`,
      ];
      
      let response = null;
      let successUrl = null;
      
      // Her endpoint'i sırayla dene
      for (const url of endpoints) {
        try {
          console.log('Denenen URL:', url);
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            successUrl = url;
            console.log('Başarılı URL:', successUrl);
            break;
          } else {
            console.log(`${url} - Status: ${response.status}`);
          }
        } catch (err) {
          console.log(`${url} - Error: ${err.message}`);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Tüm endpoint'ler denendi, hiçbiri çalışmadı. Son status: ${response?.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug için
      // API response'unda students array'i içinde öğrenciler var
      setStudents(data.students || []);
    } catch (error) {
      console.error('Öğrenci listesi alınırken hata:', error);
      setStudentsError('Öğrenci listesi alınırken bir hata oluştu');
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Event handlers
  const handleYoklamaYenile = () => {
    setOpenYoklamaYenileDialog(true);
  };

  const handleConfirmYoklamaYenile = () => {
    setOpenYoklamaYenileDialog(false);
    // Burada yoklama yenileme işlemi yapılacak
  };

  const handleTelafiDers = () => {
    // Telafi ders işlemi
  };

  const handleStudentList = () => {
    setOpenStudentDialog(true);
    fetchStudentList(); // API çağrısını yap
  };

  const handleFileManagement = () => {
    setOpenFileDialog(true);
  };

  const handleGenerateReport = () => {
    setReportType('');
    setSelectedReportClass('');
    setSelectedReportStudent('');
    setOpenReportDialog(true);
  };

  // Rapor türü seçimi
  const handleReportTypeSelect = (type) => {
    setReportType(type);
    if (type === 'class') {
      setSelectedReportStudent(''); // Öğrenci seçimini sıfırla
    } else if (type === 'student') {
      setSelectedReportClass(''); // Sınıf seçimini sıfırla
    }
  };

  // Rapor oluşturma işlemi
  const handleCreateReport = () => {
    if (reportType === 'class' && !selectedReportClass) {
      alert('Lütfen bir sınıf seçin!');
      return;
    }
    if (reportType === 'student' && !selectedReportStudent) {
      alert('Lütfen bir öğrenci seçin!');
      return;
    }

    // Rapor verilerini hazırla
    const reportData = {
      type: reportType,
      course: ders?.name || 'Seçili Ders',
      dateRange: `${new Date().toLocaleDateString('tr-TR')} - ${new Date().toLocaleDateString('tr-TR')}`,
      class: reportType === 'class' ? selectedReportClass : availableStudents.find(s => s.id === selectedReportStudent)?.class,
      student: reportType === 'student' ? availableStudents.find(s => s.id === selectedReportStudent) : null,
      attendanceData: [] // Backend'den yoklama verisi gelecek
    };

    // TODO: Backend'den yoklama verilerini çek
    // const attendanceResponse = await fetch(`/api/attendance/${courseId}`, {
    //   headers: { 'Authorization': `Bearer ${accessToken}` }
    // });
    // reportData.attendanceData = await attendanceResponse.json();
    
    setOpenReportDialog(false);
    alert(`${reportType === 'class' ? 'Sınıf' : 'Öğrenci'} bazlı rapor başarıyla oluşturuldu!`);
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "not_taken":
        return "error";
      default:
        return "default";
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "pending":
        return "Beklemede";
      case "not_taken":
        return "Alınmadı";
      default:
        return "Bilinmiyor";
    }
  };

  const getSortedStudents = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortOrder === "asc") {
        return (a.name || '').localeCompare(b.name || '', "tr");
      } else {
        return (b.name || '').localeCompare(a.name || '', "tr");
      }
    });
    return sorted;
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleEditModeToggle = () => {
    if (canEdit) {
      setEditMode(!editMode);
    }
  };

  const checkEditPermission = () => {
    return canEdit;
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
    setOpenStudentDialog(false);
  };

  const handleBackFromStudentDetail = () => {
    setShowStudentDetail(false);
    setSelectedStudent(null);
    setOpenStudentDialog(true);
  };

  // Öğrenci ekleme fonksiyonları
  const handleAddStudent = () => {
    setOpenAddStudentDialog(true);
  };

  const handleCloseAddStudentDialog = () => {
    setOpenAddStudentDialog(false);
    setNewStudent({
      name: "",
      department: "",
    });
  };

  const handleStudentInputChange = (field, value) => {
    setNewStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveStudent = () => {
    const yeniOgrenci = {
      id: students.length + 1,
      name: newStudent.name,
      department: newStudent.department || "Matematik Bölümü",
      order: students.length + 1,
      attendance: 0,
      total: 0,
      rate: 0,
      lastAttendanceStatus: "Henüz Katılmadı",
      attendanceHistory: [],
    };

    setStudents((prev) => [...prev, yeniOgrenci]);
    handleCloseAddStudentDialog();
  };

  // Eğer öğrenci detayı gösteriliyorsa ÖğrenciDetay bileşenini render et
  if (showStudentDetail && selectedStudent) {
    return (
      <ÖğrenciDetay
        student={selectedStudent}
        course={ders}
        onBack={handleBackFromStudentDetail}
      />
    );
  }

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
        maxWidth: { xs: "100%", sm: "100%", md: "1200px", lg: "1400px", xl: "1800px" },
        mx: "auto"
      }}
    >
      {/* Compact Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          p: 1.5,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onBack}
            size="medium"
            sx={{ 
              bgcolor: "#1a237e", 
              color: "white",
              "&:hover": { 
                bgcolor: "#0d1b5e",
                transform: "scale(1.05)",
              },
              boxShadow: "0 2px 8px rgba(26, 35, 126, 0.3)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ArrowBack fontSize="medium" />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1a237e",
              lineHeight: 1,
              margin: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {ders?.name || 'Ders Bilgisi Yükleniyor...'}
          </Typography>
        </Box>
      </Box>

      {/* 3-Column Grid Layout */}
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 }}>
        {/* Left Column - Course Information */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Card
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <School sx={{ mr: 1, color: "#1976d2", fontSize: 20 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "1.1rem", mt: 1.2 }}
                >
                  Ders Bilgileri
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ fontSize: 16, color: "#666" }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {ders.code} - {ders.section}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: "#666" }} />
                  <Typography variant="body2">
                    {ders.building && ders.room 
                      ? `${ders.building} - ${ders.room}`
                      : "Konum bilgisi güncelleniyor..."
                    }
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Groups sx={{ fontSize: 16, color: "#666" }} />
                  <Typography variant="body2">
                    {ders.studentCount} öğrenci
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Weekly Schedule - Compact */}
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Schedule sx={{ mr: 1, color: "#1976d2", fontSize: 22 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                    mt: 1.2,
                  }}
                >
                  Haftalık Program
                </Typography>
              </Box>

              {ders.schedule && Object.keys(ders.schedule).length > 0 ? (
                Object.entries(ders.schedule).map(([day, times]) => (
                  <Box
                    key={day}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: "0.875rem",
                      }}
                    >
                      {day}:
                    </Typography>
                    {Array.isArray(times) ? (
                      times.map((timeSlot, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {timeSlot}
                        </Typography>
                      ))
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {times}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#fff3cd",
                    borderRadius: 1,
                    border: "1px solid #ffeaa7",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    {ders.scheduleText || "Ders saati atanmamış"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column - Attendance Status */}
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Card
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <CheckCircle sx={{ mr: 1, color: "#4caf50", fontSize: 22 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                    mt: 1.2,
                  }}
                >
                  Yoklama Durumu
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Son Durum:
                </Typography>
                <Chip
                  label={getAttendanceStatusText(ders.attendanceStatus)}
                  color={getAttendanceStatusColor(ders.attendanceStatus)}
                  size="small"
                />
              </Box>

              {ders.lastAttendance && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Son alınan:{" "}
                  {new Date(ders.lastAttendance).toLocaleDateString("tr-TR")}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Katılım Oranı:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#1976d2" }}
                >
                  %{ders.attendanceRate}
                </Typography>
              </Box>

              {/* Progress Indicator */}
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#e3f2fd",
                  borderRadius: 1,
                  mb: 2,
                  border: "1px solid #bbdefb",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 14, color: "#1976d2" }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                    >
                      Dönem İlerlemesi
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {ders.currentWeek}/{ders.totalWeeks}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(ders.currentWeek / ders.totalWeeks) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#1976d2",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  %{Math.round((ders.currentWeek / ders.totalWeeks) * 100)}{" "}
                  tamamlandı
                </Typography>
              </Box>


            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Quick Actions */}
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Card
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Assessment sx={{ mr: 1, color: "#1976d2", fontSize: 20 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "1.1rem", mt: 1.2 }}
                >
                  Hızlı İşlemler
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Groups />}
                  onClick={handleStudentList}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#4caf50",
                    "&:hover": { bgcolor: "#388e3c" },
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  Öğrenciler ({ders.studentCount})
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={handleFileManagement}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#ff9800",
                    "&:hover": { bgcolor: "#f57c00" },
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  Dosyalar ({ders.files?.length || 0})
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={handleGenerateReport}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#9c27b0",
                    "&:hover": { bgcolor: "#7b1fa2" },
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  Rapor Oluştur
                </Button>

                <Divider sx={{ my: 1 }} />

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleYoklamaYenile}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1976d2",
                      color: "white",
                    },
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  Yoklama Al
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={handleTelafiDers}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: "#9c27b0",
                    color: "#9c27b0",
                    "&:hover": {
                      bgcolor: "#9c27b0",
                      color: "white",
                    },
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  Telafi Ders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student List Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => {
          setOpenStudentDialog(false);
          setEditMode(false);
          setViewMode("list");
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              👥 Öğrenci Listesi - {ders?.name} ({ders?.code})
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={`${students.length} Öğrenci`}
                color="primary"
                size="small"
              />
              {checkEditPermission() && (
                <Chip
                  label={editMode ? "Düzenleme Modu" : "Görüntüleme Modu"}
                  color={editMode ? "warning" : "default"}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Control Panel - Compact */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              p: 1.5,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                Görünüm:
              </Typography>
              <Button
                variant={viewMode === "list" ? "contained" : "outlined"}
                size="small"
                onClick={() => handleViewModeChange("list")}
                startIcon={<Groups />}
                sx={{ textTransform: "none", minWidth: "auto", px: 1.5 }}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === "attendance" ? "contained" : "outlined"}
                size="small"
                onClick={() => handleViewModeChange("attendance")}
                startIcon={<CheckCircle />}
                sx={{ textTransform: "none", minWidth: "auto", px: 1.5 }}
              >
                Yoklama
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSortChange}
                sx={{ textTransform: "none", minWidth: "auto", px: 1.5 }}
              >
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </Button>

              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleAddStudent}
                startIcon={<Add />}
                sx={{ textTransform: "none", px: 1.5 }}
              >
                Öğrenci Ekle
              </Button>

              {checkEditPermission() && (
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  size="small"
                  color={editMode ? "warning" : "primary"}
                  onClick={handleEditModeToggle}
                  startIcon={<Edit />}
                  sx={{ textTransform: "none", px: 1.5 }}
                >
                  {editMode ? "Düzenlemeyi Bitir" : "Düzenle"}
                </Button>
              )}
            </Box>
          </Box>

          {/* Student List View - Compact Table */}
          {viewMode === "list" && (
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>
                      Öğrenci Adı
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>
                      Öğrenci No
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>Bölüm</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>
                      İşlemler
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedStudents().map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        "&:hover": { bgcolor: "#f8f9fa", cursor: "pointer" },
                        cursor: "pointer",
                      }}
                      onClick={() => handleStudentClick(student)}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: "#1a237e",
                              fontSize: "0.875rem",
                            }}
                          >
                            {(student.first_name || student.name || 'X').charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {`${student.first_name || ''} ${student.last_name || ''}`.trim() || student.name || 'İsimsiz Öğrenci'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.student_number || student.number || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {student.department_name || student.department || 'Bölüm belirtilmemiş'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStudentClick(student);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          {editMode && (
                            <>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Toplam: {students.length} öğrenci | Ort. Katılım: %
                {Math.round(
                  students.reduce((acc, s) => acc + s.rate, 0) / students.length
                )}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setOpenStudentDialog(false);
                  setEditMode(false);
                  setViewMode("list");
                }}
              >
                Kapat
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                size="small"
              >
                Excel'e Aktar
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add Student Dialog - Compact */}
      <Dialog
        open={openAddStudentDialog}
        onClose={handleCloseAddStudentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a237e" }}>
            👤 Yeni Öğrenci Ekle
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Öğrenci Adı Soyadı"
              value={newStudent.name}
              onChange={(e) => handleStudentInputChange("name", e.target.value)}
              sx={{ mb: 2 }}
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Öğrenci Numarası"
              value={newStudent.number}
              onChange={(e) =>
                handleStudentInputChange("number", e.target.value)
              }
              sx={{ mb: 2 }}
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Sınıf"
              value={newStudent.class}
              onChange={(e) =>
                handleStudentInputChange("class", e.target.value)
              }
              placeholder="Örn: 10-A"
              sx={{ mb: 2 }}
              size="small"
            />
            <TextField
              fullWidth
              label="Bölüm"
              value={newStudent.department}
              onChange={(e) =>
                handleStudentInputChange("department", e.target.value)
              }
              placeholder="Örn: Matematik Bölümü"
              sx={{ mb: 2 }}
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddStudentDialog} size="small">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStudent}
            disabled={!newStudent.name || !newStudent.number}
            sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
            size="small"
          >
            Öğrenciyi Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minHeight: "500px",
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Assessment sx={{ color: "#9c27b0", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Rapor Oluştur
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {ders?.name || 'Seçili Ders'} - Yoklama Raporu
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Rapor Türü Seçin
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: reportType === 'class' ? "2px solid #4F46E5" : "1px solid #e2e8f0",
                    bgcolor: reportType === 'class' ? "#f0f9ff" : "white",
                    transition: "all 0.2s ease",
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)"
                    }
                  }}
                  onClick={() => handleReportTypeSelect('class')}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Group
                      sx={{
                        fontSize: 40,
                        color: reportType === 'class' ? "#4F46E5" : "#64748b",
                        mb: 1
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: reportType === 'class' ? "#4F46E5" : "#1e293b",
                        mb: 1
                      }}
                    >
                      Sınıf Bazlı Rapor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seçili sınıfın tüm öğrencilerinin yoklama durumunu görüntüleyin
                    </Typography>
                  </Box>
                </Card>
              </Grid>


              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: reportType === 'student' ? "2px solid #10B981" : "1px solid #e2e8f0",
                    bgcolor: reportType === 'student' ? "#f0fdf4" : "white",
                    transition: "all 0.2s ease",
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)"
                    }
                  }}
                  onClick={() => handleReportTypeSelect('student')}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Person
                      sx={{
                        fontSize: 40,
                        color: reportType === 'student' ? "#10B981" : "#64748b",
                        mb: 1
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: reportType === 'student' ? "#10B981" : "#1e293b",
                        mb: 1
                      }}
                    >
                      Öğrenci Bazlı Rapor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Belirli bir öğrencinin detaylı yoklama geçmişini inceleyin
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sınıf Seçimi */}
          {reportType === 'class' && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Sınıf Seçin</InputLabel>
                <Select
                  value={selectedReportClass}
                  onChange={(e) => setSelectedReportClass(e.target.value)}
                  label="Sınıf Seçin"
                >
                  {availableClasses.map((className) => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Öğrenci Seçimi */}
          {reportType === 'student' && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Öğrenci Seçin</InputLabel>
                <Select
                  value={selectedReportStudent}
                  onChange={(e) => setSelectedReportStudent(e.target.value)}
                  label="Öğrenci Seçin"
                >
                  {availableStudents.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name || 'İsimsiz'} - {student.id} ({student.class})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Rapor Önizleme */}
          {reportType && (reportType === 'class' ? selectedReportClass : selectedReportStudent) && (
            <Box sx={{ 
              p: 2, 
              bgcolor: "#f8fafc", 
              borderRadius: "8px", 
              border: "1px solid #e2e8f0",
              mb: 2
            }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#1e293b" }}>
                📊 Rapor Önizleme
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Ders:</strong> {ders?.name || 'Seçili Ders'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Rapor Türü:</strong> {reportType === 'class' ? 'Sınıf Bazlı' : 'Öğrenci Bazlı'}
              </Typography>
              {reportType === 'class' && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Seçili Sınıf:</strong> {selectedReportClass}
                </Typography>
              )}
              {reportType === 'student' && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Seçili Öğrenci:</strong> {availableStudents.find(s => s.id === selectedReportStudent)?.name || 'Seçili öğrenci bulunamadı'}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Tarih Aralığı:</strong> Son 8 hafta
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "#f8fafc" }}>
          <Button
            onClick={() => setOpenReportDialog(false)}
            variant="outlined"
            sx={{
              borderColor: "#64748b",
              color: "#64748b",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleCreateReport}
            variant="contained"
            disabled={!reportType || (reportType === 'class' && !selectedReportClass) || (reportType === 'student' && !selectedReportStudent)}
            startIcon={<Assessment />}
            sx={{
              bgcolor: "#9c27b0",
              "&:hover": {
                bgcolor: "#7b1fa2",
              },
              "&:disabled": {
                bgcolor: "#e5e7eb",
                color: "#9ca3af"
              }
            }}
          >
            Rapor Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog - Compact */}
      <Dialog
        open={openYoklamaYenileDialog}
        onClose={() => setOpenYoklamaYenileDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Refresh sx={{ color: "#ff9800", fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a237e" }}>
              Yoklama Al
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            Bu işlem, <strong>{ders?.name || 'Bu ders'}</strong> dersi için mevcut tüm yoklama
            bilgilerini sıfırlayacaktır.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
            ⚠️ <strong>Dikkat:</strong> Bu ders için başka bir yoklama alınması durumunda, mevcut yoklama verileri silinecek ve bu işlem geri alınamaz.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Devam etmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenYoklamaYenileDialog(false)}
            variant="outlined"
            size="small"
          >
            İptal
          </Button>
          <Button
            onClick={handleConfirmYoklamaYenile}
            variant="contained"
            color="warning"
            startIcon={<Refresh />}
            size="small"
          >
            Evet, Yenile
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DersDetay;
