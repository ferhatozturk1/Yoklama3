import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerLecturer, getUniversities, getFaculties, getDepartments } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  MenuItem,
  Fade,
  Grow,
  Switch,
  FormControlLabel,
  LinearProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  School,
  Person,
  Email,
  Lock,
  ArrowBack,
  PersonAdd,
  Visibility,
  VisibilityOff,
  DarkMode,
  LightMode,
  ArrowForward,
  LocationOn,
  Business,
  AccountBalance,
  CheckCircle,
} from "@mui/icons-material";

const OgretmenKayit = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    university: "",
    faculty: "",
    department_id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Backend'den gelen veriler
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Zaten login olduysa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      console.log("ℹ️ OgretmenKayit - Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor");
      navigate("/portal/ana-sayfa", { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Backend'den veri çekme
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);
        console.log("🔄 Üniversite listesi yükleniyor...");
        const univData = await getUniversities();
        setUniversities(univData);
        console.log("✅ Üniversiteler yüklendi:", univData);
      } catch (error) {
        console.error("❌ Üniversite listesi yüklenemedi:", error);
        setError("Üniversite listesi yüklenemedi. Lütfen sayfayı yenileyin.");
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchInitialData();
    return () => clearTimeout(timer);
  }, []);

  // Üniversite değiştiğinde fakülteleri yükle
  useEffect(() => {
    if (form.university) {
      const fetchFaculties = async () => {
        try {
          console.log("🔄 Fakülte listesi yükleniyor:", form.university);
          const facultyData = await getFaculties(form.university);
          setFaculties(facultyData);
          console.log("✅ Fakülteler yüklendi:", facultyData);
        } catch (error) {
          console.error("❌ Fakülte listesi yüklenemedi:", error);
          setFaculties([]);
        }
      };
      fetchFaculties();
    } else {
      setFaculties([]);
    }
  }, [form.university]);

  // Fakülte değiştiğinde departmanları yükle
  useEffect(() => {
    if (form.faculty) {
      const fetchDepartments = async () => {
        try {
          console.log("🔄 Departman listesi yükleniyor:", form.faculty);
          const deptData = await getDepartments(form.faculty);
          setDepartments(deptData);
          console.log("✅ Departmanlar yüklendi:", deptData);
        } catch (error) {
          console.error("❌ Departman listesi yüklenemedi:", error);
          setDepartments([]);
        }
      };
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [form.faculty]);

  const steps = ['Kişisel Bilgiler', 'Kurumsal Seçim', 'Hesap Bilgileri'];

  const titleOptions = [
    "Prof. Dr.",
    "Doç. Dr.", 
    "Dr. Öğr. Üyesi",
    "Öğr. Gör.",
    "Arş. Gör.",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: value };
      
      // Reset dependent fields
      if (name === 'university') {
        newForm.faculty = '';
        newForm.department_id = '';
        newForm.email = ''; // E-posta alanını da temizle
      } else if (name === 'faculty') {
        newForm.department_id = '';
      }
      
      return newForm;
    });
    setError("");
  };

  const validateEmail = (email) => {
    const selectedUniversity = universities.find(u => u.id === form.university);
    if (!selectedUniversity) {
      return "Lütfen önce üniversite seçin!";
    }
    
    // ODTÜ için e-posta uzantısı
    const requiredDomain = "@metu.edu.tr";
    if (!email.endsWith(requiredDomain)) {
      return `E-posta adresi ${requiredDomain} uzantısı ile bitmelidir!`;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Geçerli bir e-posta adresi girin!";
    }
    
    return null;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!form.title || !form.first_name || !form.last_name) {
          setError("Lütfen tüm kişisel bilgileri doldurun!");
          return false;
        }
        break;
      case 2:
        if (!form.university || !form.faculty || !form.department_id) {
          setError("Lütfen üniversite, fakülte ve departman seçin!");
          return false;
        }
        
        // Seçilen verilerin API'den geldiğinden emin ol
        const selectedUniversity = universities.find(u => u.id === form.university);
        const selectedFaculty = faculties.find(f => f.id === form.faculty);
        const selectedDepartment = departments.find(d => d.id === form.department_id);
        
        if (!selectedUniversity || !selectedFaculty || !selectedDepartment) {
          setError("Seçilen veriler geçersiz. Lütfen tekrar seçim yapın!");
          return false;
        }
        break;
      case 3:
        if (!form.email || !form.password || !form.confirmPassword) {
          setError("Lütfen tüm hesap bilgilerini doldurun!");
          return false;
        }
        
        const emailError = validateEmail(form.email);
        if (emailError) {
          setError(emailError);
          return false;
        }

        if (form.password !== form.confirmPassword) {
          setError("Şifreler eşleşmiyor!");
          return false;
        }

        if (form.password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır!");
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError("");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    // API verileri yüklenmemişse işlem yapma
    if (!form.university || !form.faculty || !form.department_id) {
      setError("Lütfen tüm alanları doldurun. Veriler yüklenene kadar bekleyin.");
      return;
    }

    // Seçilen verilerin veritabanında gerçekten var olduğunu kontrol et
    const selectedUniversity = universities.find(u => u.id === form.university);
    const selectedFaculty = faculties.find(f => f.id === form.faculty);
    const selectedDepartment = departments.find(d => d.id === form.department_id);

    if (!selectedUniversity || !selectedFaculty || !selectedDepartment) {
      setError("Seçilen veriler geçersiz. Lütfen tekrar seçim yapın.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Sadece veritabanından gelen gerçek verilerle form gönder
      const formDataForAPI = {
        title: form.title, // Ünvan bilgisini ekle
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        department_id: form.department_id // Gerçek seçilen department_id
      };

      console.log("Gönderilen veri (seçilen department_id ile):", formDataForAPI);
      console.log("Seçilen departman:", selectedDepartment);

      // Kayıt API çağrısı
      const response = await registerLecturer(formDataForAPI);
      
      console.log("API yanıtı:", response);
      
      setSuccess("🎉 Kayıt başarılı! E-posta adresinizi doğrulayın. Giriş sayfasına yönlendiriliyorsunuz...");
      
      // Başarılı kayıt sonrası giriş sayfasına yönlendir
      setTimeout(() => {
        navigate("/giris");
      }, 3000);
      
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setError(error.message || "Kayıt başarısız! Lütfen tekrar deneyin.");
    }
    
    setIsLoading(false);
  };

  const getSelectedName = (type, id) => {
    switch (type) {
      case 'university':
        return universities.find(u => u.id === id)?.name || '';
      case 'faculty':
        return faculties.find(f => f.id === id)?.name || '';
      case 'department':
        return departments.find(d => d.id === id)?.name || '';
      default:
        return '';
    }
  };

  // Modern ve düzgün input styles
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      height: "48px",
      background: darkMode
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      border: darkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(79, 70, 229, 0.15)",
      transition: "all 0.2s ease-in-out",
      "& fieldset": {
        border: "none",
      },
      "&:hover": {
        background: darkMode
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(255, 255, 255, 1)",
        border: darkMode
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "1px solid rgba(79, 70, 229, 0.25)",
        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
      },
      "&.Mui-focused": {
        background: darkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 1)",
        border: "2px solid #4F46E5",
        boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: darkMode ? "#ffffff" : "#1e293b",
      fontFamily: '"Inter", "Roboto", sans-serif',
      fontWeight: 500,
      fontSize: "15px",
      padding: "14px 16px 14px 8px",
      "&::placeholder": {
        color: darkMode
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(30, 41, 59, 0.5)",
        opacity: 1,
      },
    },
    "& .MuiInputAdornment-root": {
      marginLeft: "16px",
      marginRight: "12px",
    },
    "& .MuiInputAdornment-positionStart": {
      marginLeft: "14px",
      marginRight: "12px",
    },
    "& .MuiInputAdornment-positionEnd": {
      marginRight: "14px",
      marginLeft: "8px",
    },
  };

  const renderStep1 = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontWeight: 600,
          color: darkMode ? "#ffffff" : "#1e293b",
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Kişisel Bilgileriniz
      </Typography>
      
      <Grid container spacing={2}>
        {/* Ünvan */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              mb: 0.5,
              ml: 0.5,
            }}
          >
            Ünvan
          </Typography>
          <TextField
            name="title"
            select
            fullWidth
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ünvanınızı seçin"
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          >
            <MenuItem value="" disabled>
              Ünvanınızı seçin
            </MenuItem>
            {titleOptions.map((title) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Ad */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              mb: 0.5,
              ml: 0.5,
            }}
          >
            Ad
          </Typography>
          <TextField
            name="first_name"
            fullWidth
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="Adınız"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>

        {/* Soyad */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              mb: 0.5,
              ml: 0.5,
            }}
          >
            Soyad
          </Typography>
          <TextField
            name="last_name"
            fullWidth
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Soyadınız"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontWeight: 600,
          color: darkMode ? "#ffffff" : "#1e293b",
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Kurumsal Bilgileriniz
      </Typography>

      <Grid container spacing={2}>
        {/* Üniversite */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              mb: 0.5,
              ml: 0.5,
            }}
          >
            Üniversite
          </Typography>
          {form.university && (
            <Chip
              label={getSelectedName('university', form.university)}
              sx={{
                mb: 1,
                backgroundColor: "#4F46E5",
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
          <TextField
            name="university"
            select
            fullWidth
            value={form.university}
            onChange={handleChange}
            required
            placeholder="Üniversite seçin"
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalance
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          >
            <MenuItem value="" disabled>
              {loadingData ? "Üniversiteler yükleniyor..." : "Üniversite seçin"}
            </MenuItem>
            {!loadingData && universities.length === 0 && (
              <MenuItem value="" disabled>
                Üniversite listesi yüklenemedi
              </MenuItem>
            )}
            {universities.map((university) => (
              <MenuItem key={university.id} value={university.id}>
                {university.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Fakülte */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "14px",
              mb: 1,
              ml: 0.5,
            }}
          >
            Fakülte
          </Typography>
          {form.faculty && (
            <Chip
              label={getSelectedName('faculty', form.faculty)}
              sx={{
                mb: 1,
                backgroundColor: "#4F46E5",
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
          <TextField
            name="faculty"
            select
            fullWidth
            value={form.faculty}
            onChange={handleChange}
            required
            disabled={!form.university}
            placeholder="Fakülte seçin"
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          >
            <MenuItem value="" disabled>
              {loadingData ? "Fakülteler yükleniyor..." : "Fakülte seçin"}
            </MenuItem>
            {!loadingData && faculties.length === 0 && form.university && (
              <MenuItem value="" disabled>
                Fakülte listesi yüklenemedi
              </MenuItem>
            )}
            {faculties.map((faculty) => (
              <MenuItem key={faculty.id} value={faculty.id}>
                {faculty.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Departman */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "14px",
              mb: 1,
              ml: 0.5,
            }}
          >
            Departman
          </Typography>
          {form.department_id && (
            <Chip
              label={getSelectedName('department', form.department_id)}
              sx={{
                mb: 1,
                backgroundColor: "#4F46E5",
                color: "white",
                fontWeight: 500,
              }}
            />
          )}
          <TextField
            name="department_id"
            select
            fullWidth
            value={form.department_id}
            onChange={handleChange}
            required
            disabled={!form.faculty}
            placeholder="Departman seçin"
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          >
            <MenuItem value="" disabled>
              {loadingData ? "Departmanlar yükleniyor..." : "Departman seçin"}
            </MenuItem>
            {!loadingData && departments.length === 0 && form.faculty && (
              <MenuItem value="" disabled>
                Departman listesi yüklenemedi
              </MenuItem>
            )}
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontWeight: 600,
          color: darkMode ? "#ffffff" : "#1e293b",
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Hesap Bilgileriniz
      </Typography>

      <Grid container spacing={2}>
        {/* E-posta */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              mb: 0.5,
              ml: 0.5,
            }}
          >
            E-posta Adresi
          </Typography>
          {form.university && (
            <Typography
              variant="body2"
              sx={{
                color: "#4F46E5",
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 500,
                fontSize: "12px",
                mb: 1,
                ml: 0.5,
              }}
            >
              @metu.edu.tr uzantısı kullanınız
            </Typography>
          )}
          <TextField
            name="email"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            required
            placeholder={
              form.university 
                ? "ornek@metu.edu.tr"
                : "Üniversite seçtikten sonra e-posta giriniz"
            }
            disabled={!form.university}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>

        {/* Şifre */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "14px",
              mb: 1,
              ml: 0.5,
            }}
          >
            Şifre
          </Typography>
          <TextField
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Şifrenizi girin"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="medium"
                    sx={{
                      color: "#4F46E5",
                      opacity: 0.6,
                      "&:hover": {
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        opacity: 1,
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>

        {/* Şifre Tekrar */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500,
              fontSize: "14px",
              mb: 1,
              ml: 0.5,
            }}
          >
            Şifre Tekrar
          </Typography>
          <TextField
            name="confirmPassword"
            type={showPasswordConfirm ? "text" : "password"}
            fullWidth
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Şifrenizi tekrar girin"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock
                    sx={{
                      color: "#4F46E5",
                      fontSize: 20,
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    edge="end"
                    size="medium"
                    sx={{
                      color: "#4F46E5",
                      opacity: 0.6,
                      "&:hover": {
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        opacity: 1,
                      },
                    }}
                  >
                    {showPasswordConfirm ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
          : "linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5e35b1 75%, #7e57c2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        px: 2,
        position: "relative",
      }}
    >
      {/* Dark Mode Toggle */}
      <Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          icon={<LightMode sx={{ fontSize: 16 }} />}
          checkedIcon={<DarkMode sx={{ fontSize: 16 }} />}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#4F46E5" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#4F46E5" },
          }}
        />
      </Box>

      {/* Back Button */}
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/giris")}
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          Geri
        </Button>
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={showContent} timeout={1000}>
          <Box>
            {/* Main Title - Çok Kompakt */}
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  background: darkMode
                    ? "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Akademik Personel Kayıt
              </Typography>
            </Box>

            {/* Registration Card - Ultra Kompakt */}
            <Grow in={showContent} timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },  // Minimal padding
                  borderRadius: "16px",
                  background: darkMode
                    ? "rgba(30, 41, 59, 0.4)"
                    : "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: darkMode
                    ? "0 20px 40px -12px rgba(0, 0, 0, 0.5)"
                    : "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Header - Minimal */}
                <Box sx={{ textAlign: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 1,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      mb: 1,
                      boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    <PersonAdd sx={{ fontSize: 20, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      color: darkMode ? "#ffffff" : "#1e293b",
                      mb: 0.5,
                    }}
                  >
                    Kayıt Ol
                  </Typography>

                  {/* Progress - Kompakt */}
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.6)"
                          : "rgba(30, 41, 59, 0.6)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        mb: 0.5,
                        fontSize: "11px",
                      }}
                    >
                      Adım {currentStep} / 3
                    </Typography>
                    <Box sx={{ width: "100%", mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(currentStep / 3) * 100}
                        sx={{
                          height: 3,
                          borderRadius: 2,
                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#4F46E5",
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                    <Stepper
                      activeStep={currentStep - 1}
                      alternativeLabel
                      sx={{
                        "& .MuiStep-root": {
                          padding: 0,
                        },
                        "& .MuiStepLabel-label": {
                          color: darkMode
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(30, 41, 59, 0.5)",
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontSize: "10px",
                          fontWeight: 500,
                          mt: 0.5,
                          "&.Mui-active": {
                            color: "#4F46E5",
                            fontWeight: 600,
                          },
                          "&.Mui-completed": {
                            color: "#4F46E5",
                            fontWeight: 600,
                          },
                        },
                        "& .MuiStepIcon-root": {
                          color: darkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.2)",
                          fontSize: "1rem",
                          "&.Mui-active": {
                            color: "#4F46E5",
                          },
                          "&.Mui-completed": {
                            color: "#10B981",
                          },
                        },
                        "& .MuiStepIcon-text": {
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 600,
                          fontSize: "0.65rem",
                        },
                      }}
                    >
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </Box>

                {/* Form Content - Sabit Yükseklik */}
                <Box sx={{ minHeight: "220px" }}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </Box>

                {/* Error/Success Messages */}
                {error && (
                  <Fade in={!!error}>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: "12px",
                        background: darkMode
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(239, 68, 68, 0.05)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        "& .MuiAlert-message": {
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {success && (
                  <Fade in={!!success}>
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: "12px",
                        background: darkMode
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(16, 185, 129, 0.05)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        "& .MuiAlert-message": {
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        },
                      }}
                    >
                      {success}
                    </Alert>
                  </Fade>
                )}

                {/* Navigation Buttons - Kompakt */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1.5,  // Daha az margin
                  }}
                >
                  {currentStep > 1 ? (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      startIcon={<ArrowBack />}
                      sx={{
                        borderRadius: "8px",  // Daha küçük
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 600,
                        px: 2,  // Daha küçük padding
                        py: 1,
                        "&:hover": {
                          borderColor: "#4F46E5",
                          backgroundColor: darkMode
                            ? "rgba(79, 70, 229, 0.1)"
                            : "rgba(79, 70, 229, 0.05)",
                        },
                      }}
                    >
                      Geri
                    </Button>
                  ) : (
                    <Box />
                  )}

                  {currentStep < 3 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={
                        (currentStep === 2 && (!form.university || !form.faculty || !form.department_id)) ||
                        loadingData
                      }
                      endIcon={<ArrowForward />}
                      sx={{
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(79, 70, 229, 0.4)",
                        },
                        "&.Mui-disabled": {
                          background: "rgba(79, 70, 229, 0.4)",
                          color: "rgba(255, 255, 255, 0.6)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loadingData && currentStep === 2 ? "Veriler Yükleniyor..." : "Devam Et"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={isLoading || loadingData || !form.university || !form.faculty || !form.department_id}
                      startIcon={isLoading ? null : <CheckCircle />}
                      sx={{
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(16, 185, 129, 0.4)",
                        },
                        "&.Mui-disabled": {
                          background: "rgba(79, 70, 229, 0.4)",
                          color: "rgba(255, 255, 255, 0.6)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? "Kaydediliyor..." : loadingData ? "Veriler Yükleniyor..." : "Kaydol"}
                    </Button>
                  )}
                </Box>

                {/* Login Link */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    Zaten hesabınız var mı?{" "}
                    <Link
                      to="/giris"
                      style={{
                        color: "#4F46E5",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Giriş Yap
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Grow>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default OgretmenKayit;
