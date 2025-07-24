import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Badge,
  TextField
} from '@mui/material';
import { 
  ArrowBack,
  School, 
  LocationOn, 
  Person,
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
  Add
} from '@mui/icons-material';
import ÖğrenciDetay from './ÖğrenciDetay';

const DersDetay = ({ ders, onBack }) => {
  // Dialog states
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  
  // Student list states
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list');
  const [canEdit, setCanEdit] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Student detail states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  // Add student dialog state
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    number: '',
    class: '',
    department: ''
  });

  // Sample students data
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'Ahmet Yılmaz', 
      number: '2021001', 
      class: '10-A',
      department: 'Matematik Bölümü',
      order: 1,
      attendance: 23, 
      total: 25, 
      rate: 92,
      lastAttendanceStatus: 'Katıldı',
      attendanceHistory: [
        { date: '2025-07-22', status: 'Katıldı' },
        { date: '2025-07-21', status: 'Katıldı' },
        { date: '2025-07-20', status: 'Katılmadı' },
        { date: '2025-07-19', status: 'Katıldı' }
      ]
    },
    { 
      id: 2, 
      name: 'Ayşe Kaya', 
      number: '2021002', 
      class: '10-A',
      department: 'Matematik Bölümü',
      order: 2,
      attendance: 24, 
      total: 25, 
      rate: 96,
      lastAttendanceStatus: 'Katıldı',
      attendanceHistory: [
        { date: '2025-07-22', status: 'Katıldı' },
        { date: '2025-07-21', status: 'Katıldı' },
        { date: '2025-07-20', status: 'Katıldı' },
        { date: '2025-07-19', status: 'Katıldı' }
      ]
    }
  ]);

  // Event handlers
  const handleYoklamaYenile = () => {
    console.log('Yoklama yenileniyor');
  };

  const handleTelafiDers = () => {
    console.log('Telafi ders');
  };

  const handleStudentList = () => {
    setOpenStudentDialog(true);
  };

  const handleFileManagement = () => {
    setOpenFileDialog(true);
  };

  const handleGenerateReport = () => {
    setOpenReportDialog(true);
  };

  const getAttendanceStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'not_taken': return 'error';
      default: return 'default';
    }
  };

  const getAttendanceStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Beklemede';
      case 'not_taken': return 'Alınmadı';
      default: return 'Bilinmiyor';
    }
  };

  const getSortedStudents = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name, 'tr');
      } else {
        return b.name.localeCompare(a.name, 'tr');
      }
    });
    return sorted;
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
      name: '',
      number: '',
      class: '',
      department: ''
    });
  };

  const handleStudentInputChange = (field, value) => {
    setNewStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveStudent = () => {
    const yeniOgrenci = {
      id: students.length + 1,
      name: newStudent.name,
      number: newStudent.number,
      class: newStudent.class || '10-A',
      department: newStudent.department || 'Matematik Bölümü',
      order: students.length + 1,
      attendance: 0,
      total: 0,
      rate: 0,
      lastAttendanceStatus: 'Henüz Katılmadı',
      attendanceHistory: []
    };

    setStudents(prev => [...prev, yeniOgrenci]);
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
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Başlık ve Geri Butonu */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={onBack}
          sx={{ mr: 2, bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' } }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          {ders.name}
        </Typography>
        <IconButton sx={{ ml: 'auto' }}>
          <MoreVert />
        </IconButton>
      </Box>

      {/* Ders Bilgi Chipları */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
        <Chip 
          icon={<School />} 
          label={`${ders.code} - ${ders.section}`} 
          color="primary" 
          sx={{ bgcolor: '#2196f3', color: 'white' }}
        />
        <Chip 
          icon={<LocationOn />} 
          label={`${ders.building} ${ders.room}`} 
          color="secondary" 
          sx={{ bgcolor: '#9c27b0', color: 'white' }}
        />
        <Chip 
          icon={<Groups />} 
          label={`${ders.studentCount} Öğrenci`} 
          color="info" 
          sx={{ bgcolor: '#00bcd4', color: 'white' }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Sol Taraf - Ders Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InsertDriveFile sx={{ mr: 1, color: '#666' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  Ders Bilgileri
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon><School /></ListItemIcon>
                  <ListItemText 
                    primary="Ders Kodu" 
                    secondary={`${ders.code} - ${ders.section}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationOn /></ListItemIcon>
                  <ListItemText 
                    primary="Derslik" 
                    secondary={`${ders.building} - ${ders.room}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Person /></ListItemIcon>
                  <ListItemText 
                    primary="Öğretim Görevlisi" 
                    secondary={ders.instructor} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Groups /></ListItemIcon>
                  <ListItemText 
                    primary="Öğrenci Sayısı" 
                    secondary={`${ders.studentCount} öğrenci`} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Haftalık Program */}
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: '#2196f3' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  Haftalık Program
                </Typography>
              </Box>
              
              {Object.entries(ders.schedule).map(([day, schedules]) => (
                <Box key={day} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', mb: 1 }}>
                    {day}:
                  </Typography>
                  {schedules.map((s, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {s.startTime}-{s.endTime} ({s.room})
                    </Typography>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Taraf - Yoklama Durumu */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  Yoklama Durumu
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Son Yoklama Durumu:
                  </Typography>
                  <Chip 
                    label={getAttendanceStatusText(ders.attendanceStatus)}
                    color={getAttendanceStatusColor(ders.attendanceStatus)}
                    size="small"
                  />
                </Box>
                
                {ders.lastAttendance && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Son Yoklama: {new Date(ders.lastAttendance).toLocaleDateString('tr-TR')}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Genel Katılım Oranı: %{ders.attendanceRate}
                </Typography>

                {/* Yoklama Butonları */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleYoklamaYenile}
                    size="small"
                  >
                    YOKLAMAYI YENİLE
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    startIcon={<CalendarToday />}
                    onClick={handleTelafiDers}
                    size="small"
                  >
                    TELAFİ DERS
                  </Button>
                </Box>
              </Box>

              {/* Dönem İlerlemesi */}
              <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 4, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment sx={{ mr: 1, color: '#2196f3' }} />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Dönem İlerlemesi: {ders.currentWeek}/{ders.totalWeeks} Hafta
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(ders.currentWeek / ders.totalWeeks) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 6,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2196f3'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  %{Math.round((ders.currentWeek / ders.totalWeeks) * 100)} tamamlandı
                </Typography>
              </Box>

              {/* Ders Dosyaları */}
              <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InsertDriveFile sx={{ mr: 1, color: '#ff9800' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Ders Dosyaları
                    </Typography>
                  </Box>
                  <Badge badgeContent={ders.files?.length || 0} color="primary">
                    <InsertDriveFile />
                  </Badge>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {ders.files?.length || 0} dosya yüklendi
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alt Butonlar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<Groups />}
          onClick={handleStudentList}
          sx={{ minWidth: 150 }}
        >
          ÖĞRENCİ LİSTESİ
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CloudUpload />}
          onClick={handleFileManagement}
          sx={{ minWidth: 150 }}
        >
          DOSYA YÖNETİMİ
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Assessment />}
          onClick={handleGenerateReport}
          sx={{ minWidth: 150 }}
        >
          RAPOR OLUŞTUR
        </Button>
      </Box>

      {/* Öğrenci Listesi Dialog - Aynı detaylı dialog */}
      <Dialog 
        open={openStudentDialog} 
        onClose={() => {
          setOpenStudentDialog(false);
          setEditMode(false);
          setViewMode('list');
        }} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              👥 Öğrenci Listesi - {ders?.name} ({ders?.code})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
        
        <DialogContent>
          {/* Kontrol Paneli */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Görünüm:
              </Typography>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('list')}
                startIcon={<Groups />}
              >
                Öğrenci Listesi
              </Button>
              <Button
                variant={viewMode === 'attendance' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('attendance')}
                startIcon={<CheckCircle />}
              >
                Yoklama Görüntüle
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Sıralama:
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSortChange}
                startIcon={sortOrder === 'asc' ? <span>A-Z</span> : <span>Z-A</span>}
              >
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
              
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleAddStudent}
                startIcon={<Add />}
                sx={{ ml: 1 }}
              >
                Öğrenci Ekle
              </Button>
              
              {checkEditPermission() && (
                <Button
                  variant={editMode ? 'contained' : 'outlined'}
                  size="small"
                  color={editMode ? 'warning' : 'primary'}
                  onClick={handleEditModeToggle}
                  startIcon={<Edit />}
                >
                  {editMode ? 'Düzenlemeyi Bitir' : 'Listeyi Düzenle'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Öğrenci Listesi Görünümü */}
          {viewMode === 'list' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Sıra</strong></TableCell>
                    <TableCell><strong>Öğrenci Adı</strong></TableCell>
                    <TableCell><strong>Numara</strong></TableCell>
                    <TableCell><strong>Sınıf</strong></TableCell>
                    <TableCell><strong>Bölüm</strong></TableCell>
                    <TableCell><strong>Son Yoklama</strong></TableCell>
                    <TableCell><strong>Katılım Oranı</strong></TableCell>
                    <TableCell><strong>İşlemler</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedStudents().map((student, index) => (
                    <TableRow 
                      key={student.id} 
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9fa', cursor: 'pointer' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleStudentClick(student)}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a237e' }}>
                            {student.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {student.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.class}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {student.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.lastAttendanceStatus}
                          color={student.lastAttendanceStatus === 'Katıldı' ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`%${student.rate}`}
                            color={student.rate >= 80 ? 'success' : student.rate >= 60 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({student.attendance}/{student.total})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStudentClick(student);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          {editMode && (
                            <>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Delete />
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
        
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Toplam: {students.length} öğrenci | 
                Ortalama Katılım: %{Math.round(students.reduce((acc, s) => acc + s.rate, 0) / students.length)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => {
                setOpenStudentDialog(false);
                setEditMode(false);
                setViewMode('list');
              }}>
                Kapat
              </Button>
              <Button variant="outlined" startIcon={<FileDownload />}>
                Excel'e Aktar
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Öğrenci Ekleme Dialog */}
      <Dialog 
        open={openAddStudentDialog} 
        onClose={handleCloseAddStudentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            👤 Yeni Öğrenci Ekle
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Öğrenci Adı Soyadı"
              value={newStudent.name}
              onChange={(e) => handleStudentInputChange('name', e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Öğrenci Numarası"
              value={newStudent.number}
              onChange={(e) => handleStudentInputChange('number', e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Sınıf"
              value={newStudent.class}
              onChange={(e) => handleStudentInputChange('class', e.target.value)}
              placeholder="Örn: 10-A"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bölüm"
              value={newStudent.department}
              onChange={(e) => handleStudentInputChange('department', e.target.value)}
              placeholder="Örn: Matematik Bölümü"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseAddStudentDialog}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveStudent}
            disabled={!newStudent.name || !newStudent.number}
            sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
          >
            Öğrenciyi Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DersDetay;