import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

import { useLocalization } from "../utils/localization";
import { useFormValidation } from "../utils/validation";
import { debounce } from "../utils/debounce";
import { updateLecturerProfile, uploadProfilePhoto, deleteProfilePhoto, getUniversities, getFaculties, getDepartments } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

const Profilim = ({
  userProfile: initialUserProfile,
  onProfileUpdate,
}) => {
  const { t } = useLocalization();
  const { user, accessToken, loadUserProfile, setUser, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  
  // Profile photo URL helper function
  const getProfilePhotoUrl = (photoPath) => {
    console.log('📸 Profilim getProfilePhotoUrl çağrıldı:', photoPath);
    if (!photoPath) {
      console.log('❌ Photo path boş');
      return null;
    }
    if (photoPath.startsWith('http')) {
      console.log('✅ Zaten tam URL:', photoPath);
      return photoPath;
    }
    
    const fullUrl = `http://127.0.0.1:8000${photoPath}`;
    console.log('🔧 Profilim - Tam URL oluşturuldu:', fullUrl);
    
    return fullUrl;
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isPhotoDeleted, setIsPhotoDeleted] = useState(false); // Fotoğraf silinme durumu
  const [saveMessage, setSaveMessage] = useState("");
  const [userProfile, setUserProfile] = useState(initialUserProfile || null);
  const [apiError, setApiError] = useState("");
  const [showApiError, setShowApiError] = useState(false);

  // Birden fazla kez çalışmayı engellemek için ref
  const hasFetchedProfileRef = useRef(false);

  // Test API fonksiyonlarını sadece development ortamında çalıştır
  const isDev = process.env.NODE_ENV !== 'production';

  // Test API fonksiyonu - Üniversite/Fakülte/Bölüm verilerini test et
  const testApiConnections = async () => {
    console.log('🧪 === API BAĞLANTI TESTİ BAŞLIYOR ===');
    try {
      // 1. Üniversite listesi test et
      console.log('🧪 Üniversite listesi getiriliyor...');
      const universities = await getUniversities();
      console.log('🧪 Üniversite listesi sonucu:', universities);
      
      if (universities && universities.length > 0) {
        const firstUniversity = universities[0];
        console.log('🧪 İlk üniversite:', firstUniversity);
        
        // 2. Fakülte listesi test et
        console.log('🧪 Fakülte listesi getiriliyor...', firstUniversity.id);
        const faculties = await getFaculties(firstUniversity.id);
        console.log('🧪 Fakülte listesi sonucu:', faculties);
        
        if (faculties && faculties.length > 0) {
          const firstFaculty = faculties[0];
          console.log('🧪 İlk fakülte:', firstFaculty);
          
          // 3. Bölüm listesi test et
          console.log('🧪 Bölüm listesi getiriliyor...', firstFaculty.id);
          const departments = await getDepartments(firstFaculty.id);
          console.log('🧪 Bölüm listesi sonucu:', departments);
          
          console.log('✅ Tüm API çağrıları başarılı!');
          return {
            universities,
            faculties,
            departments,
            success: true
          };
        }
      }
    } catch (error) {
      console.error('❌ API test hatası:', error);
      return { success: false, error: error.message };
    }
  };

  // GERÇEK KULLANICI VERİSİNİ TEST ET
  const testRealUserData = async () => {
    console.log('🔍 === GERÇEK KULLANICI VERİSİ TESTİ ===');
    console.log('👤 Current User:', user);
    console.log('🔑 Access Token mevcut:', !!accessToken);
    
    if (user && user.id && accessToken) {
      try {
        // Backend'den direkt ham veriyi çek
        const response = await fetch(`http://127.0.0.1:8000/lecturer_data/lecturers/${user.id}/`, {
          method: "GET",
         
        });
        
        if (response.ok) {
          const rawUserData = await response.json();
          console.log('🔍 === BACKEND\'DEN GELEN HAM VERİ ===');
          console.log('🆔 ID:', rawUserData.id);
          console.log('👤 Ad:', rawUserData.first_name);
          console.log('👤 Soyad:', rawUserData.last_name);
          console.log('📧 Email:', rawUserData.email);
          console.log('🏢 Department ID:', rawUserData.department_id);
          console.log('🏫 University (raw):', rawUserData.university);
          console.log('🏛️ Faculty (raw):', rawUserData.faculty);
          console.log('🏢 Department (raw):', rawUserData.department);
          console.log('📅 Oluşturulma tarihi:', rawUserData.created_at);
          console.log('📷 Profil foto:', rawUserData.profile_photo);
          console.log('🔍 === HAM VERİ BİTİŞ ===');
          return rawUserData;
        } else {
          console.error('❌ Backend\'den veri çekilemedi:', response.status);
        }
      } catch (error) {
        console.error('❌ Ham veri test hatası:', error);
      }
    } else {
      console.warn('⚠️ Kullanıcı bilgileri eksik:', {
        hasUser: !!user,
        hasUserId: !!(user && user.id),
        hasToken: !!accessToken
      });
    }
  };

  console.log("🔍 === PROFILIM COMPONENT DEBUG BAŞLANGIÇ ===");
  console.log("👤 AuthContext'ten gelen user:", user);
  console.log("🔑 AuthContext'ten gelen accessToken:", accessToken ? "Mevcut" : "YOK");
  console.log("✅ isAuthenticated:", isAuthenticated);
  console.log("⏳ authLoading:", authLoading);
  console.log("⏳ isLoading (local):", isLoading);
  console.log("📄 initialUserProfile:", initialUserProfile);
  
  // User'daki önemli alanları detaylı kontrol et
  if (user) {
    console.log("🔍 === USER DETAYLI ANALİZ ===");
    console.log("👤 user.id:", user.id);
    console.log("🏢 user.department_id:", user.department_id);
    console.log("🏫 user.university:", user.university);
    console.log("🏛️ user.faculty:", user.faculty);
    console.log("🏢 user.department:", user.department);
    console.log("📧 user.email:", user.email);
    console.log("📞 user.phone:", user.phone);
    console.log("🎓 user.title:", user.title);
    console.log("👤 user.first_name:", user.first_name);
    console.log("👤 user.last_name:", user.last_name);
    console.log("🔍 === USER DETAYLI ANALİZ BİTİŞ ===");
  }
  
  console.log("🔍 === PROFILIM COMPONENT DEBUG BİTİŞ ===");

  // Profil bilgilerini AuthContext'ten yükle
  useEffect(() => {
    // Eğer zaten çekildiyse tekrar deneme
    if (hasFetchedProfileRef.current) return;

    // Gerekli bilgiler yoksa çalıştırma
    if (!user || !accessToken) return;

    hasFetchedProfileRef.current = true;

    const fetchUserProfile = async () => {
      console.log("🚀 === PROFIL YÜKLEME İŞLEMİ BAŞLIYOR ===");

      // Debug/test çağrılarını sadece dev modda yap
      if (isDev) {
        try { await testRealUserData(); } catch {}
        try { await testApiConnections(); } catch {}
      }

      if (initialUserProfile) {
        console.log("📦 InitialUserProfile mevcut, direkt kullanılıyor:", initialUserProfile);
        setUserProfile(initialUserProfile);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setApiError("");
        setShowApiError(false);

        console.log("📋 === API'DEN PROFIL BİLGİLERİ ÇEKİLİYOR ===");

        // Timeout ile profil yükleme - 15 saniye sonra timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profil yükleme zaman aşımına uğradı')), 15000)
        );

        const profileData = await Promise.race([
          loadUserProfile(false),
          timeoutPromise
        ]);

        if (profileData) {
          const correctedProfileData = {
            ...profileData,
            profilePhoto: getProfilePhotoUrl(profileData.profilePhoto)
          };
          setUserProfile(correctedProfileData);
        } else {
          setApiError("Profil bilgileri yüklenemedi");
          setShowApiError(true);
          const fallbackProfile = {
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Kullanıcı',
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            title: user.title || '',
            email: user.email || '',
            phone: user.phone || '',
            profilePhoto: getProfilePhotoUrl(user.profile_photo),
            department_id: user.department_id || '',
            university: user.university || '',
            faculty: user.faculty || '',
            department: user.department || ''
          };
          setUserProfile(fallbackProfile);
        }
      } catch (error) {
        console.error("❌ === PROFIL YÜKLEME HATASI ===");
        setApiError(error.message || "Profil bilgileri yüklenemedi");
        setShowApiError(true);
        const fallbackProfile = {
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Kullanıcı',
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          title: user.title || '',
          email: user.email || '',
          phone: user.phone || '',
          profilePhoto: getProfilePhotoUrl(user.profile_photo),
          department_id: user.department_id || '',
          university: user.university || '',
          faculty: user.faculty || '',
          department: user.department || ''
        };
        setUserProfile(fallbackProfile);
      } finally {
        setIsLoading(false);
        console.log("🏁 === PROFIL YÜKLEME İŞLEMİ TAMAMLANDI ===");
      }
    };

    fetchUserProfile();
  // Bu efekt sadece user.id ve token değişince tetiklensin, loadUserProfile (memoized) değişime dahil değil
  }, [user?.id, accessToken, initialUserProfile, isDev]);

  // Initialize form with user profile data - memoized to prevent recalculation
  const initialFormData = useMemo(
    () => {
      console.log('📋 === INITIAL FORM DATA DEBUG BAŞLANGIÇ ===');
      console.log('👤 User object:', user);
      console.log('📄 UserProfile object:', userProfile);
      console.log('🔍 User University/Faculty/Department:');
      console.log('  - user?.university:', user?.university);
      console.log('  - user?.faculty:', user?.faculty);
      console.log('  - user?.department:', user?.department);
      console.log('🔍 UserProfile University/Faculty/Department:');
      console.log('  - userProfile?.university:', userProfile?.university);
      console.log('  - userProfile?.faculty:', userProfile?.faculty);
      console.log('  - userProfile?.department:', userProfile?.department);
      console.log('  - userProfile?.school:', userProfile?.school);
      
      const formData = {
        title: user?.title || userProfile?.title || "",
        firstName: user?.first_name || userProfile?.firstName || "",
        lastName: user?.last_name || userProfile?.lastName || "",
        email: user?.email || userProfile?.email || "",
        phone: user?.phone || userProfile?.phone || "",
        // AuthContext'ten gelen yeni alanlar
        university: user?.university || userProfile?.school || userProfile?.university || "",
        faculty: user?.faculty || userProfile?.faculty || "",
        department: user?.department || userProfile?.department || "",
        webUrl: user?.web_url || userProfile?.webUrl || "",
        otherDetails: user?.other_details || userProfile?.otherDetails || "",
        profilePhoto: getProfilePhotoUrl(user?.profile_photo || userProfile?.profilePhoto),
      };
      
      console.log('🔧 === OLUŞTURULAN FORM DATA ===');
      console.log('🏫 formData.university:', formData.university);
      console.log('🏛️ formData.faculty:', formData.faculty);
      console.log('🏢 formData.department:', formData.department);
      console.log('📊 Tam formData:', formData);
      console.log('📋 === INITIAL FORM DATA DEBUG BİTİŞ ===');
      
      return formData;
    },
    [user, userProfile]
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(initialFormData);

  // Form verilerini AuthContext değişikliklerine göre güncelle
  useEffect(() => {
    if (user || userProfile) {
      console.log('🔄 === FORM RESET İŞLEMİ BAŞLIYOR ===');
      console.log('🔄 Profilim - Form verileri güncelleniyor:', { user, userProfile });
      console.log('🔍 User University/Faculty/Department:');
      console.log('  - user?.university:', user?.university);
      console.log('  - user?.faculty:', user?.faculty);
      console.log('  - user?.department:', user?.department);
      console.log('🔄 resetForm ÖNCESI - initialFormData:', initialFormData);
      console.log('🔄 resetForm ÖNCESI - values state:', values);
      
      resetForm(initialFormData);
      
      console.log('✅ resetForm SONRASI - Form resetlendi');
      console.log('🔄 === FORM RESET İŞLEMİ BİTTİ ===');
    }
  }, [user, userProfile, initialFormData, resetForm]);

  // TextField için ortak stil objesi
  const textFieldStyles = {
    "& .MuiInputBase-input": {
      fontWeight: 600, // Metni daha belirgin yap
      color: "#0f172a", // Çok koyu metin rengi
      fontSize: "1rem",
      letterSpacing: "0.01em",
    },
    "& .MuiInputBase-input:disabled": {
      WebkitTextFillColor: "#0f172a !important", // Disabled durumda da belirgin
      color: "#0f172a !important",
      fontWeight: 600,
      opacity: 1,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1",
      borderWidth: "1.5px", // Biraz daha kalın border
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#94a3b8",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1a237e",
      borderWidth: 2,
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600, // Label'ı daha belirgin yap
      color: "#374151",
      "&.Mui-focused": {
        color: "#1a237e",
        fontWeight: 600,
      },
    },
  };

  // All callbacks must be defined before early returns to follow Rules of Hooks
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setSaveMessage("");
  }, []);

  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
    console.log('🔄 CANCEL - resetForm ÖNCESI:', initialFormData);
    resetForm(initialFormData);
    console.log('✅ CANCEL - resetForm SONRASI');
    setUploadedPhoto(null);
    setPhotoPreview(null);
    setSaveMessage("");
  }, [initialFormData, resetForm]);

  const handlePhotoChange = useCallback((file, preview) => {
    setUploadedPhoto(file);
    setPhotoPreview(preview);
    setIsPhotoDeleted(false); // Yeni fotoğraf seçildiğinde silme işaretini kaldır
    console.log("📸 Yeni profil fotoğrafı seçildi:", file?.name);
  }, []);

  const handlePhotoRemove = useCallback(() => {
    setUploadedPhoto(null);
    setPhotoPreview(null);
    setIsPhotoDeleted(true); // Fotoğrafın silineceğini işaretle
    console.log("🗑️ Profil fotoğrafı silinmek üzere işaretlendi");
  }, []);

  const handleCloseApiError = useCallback(() => {
    setShowApiError(false);
  }, []);

  // Define the save function
  const saveProfile = async () => {
    if (!validateAll()) {
      return;
    }

    setIsSaving(true);
    setApiError("");

    try {
      if (!user || !accessToken) {
        throw new Error("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
      }

      // API'ye gönderilecek veriyi hazırla (yeni şemaya göre)
      const profileUpdateData = {
        title: values.title || userProfile.title || "",
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        department_id: userProfile.department_id || "", // Departman ID'si
        phone: values.phone || null,
        // Ek bilgiler
        university: values.university || "",
        faculty: values.faculty || "", 
        department: values.department || "",
      };

      console.log("🔄 Profil güncelleme verisi (yeni şema):", profileUpdateData);

      // Profil fotoğrafı silme işlemi (eğer işaretlenmişse ve yeni fotoğraf yok)
      if (isPhotoDeleted && !uploadedPhoto) {
        try {
          console.log("🗑️ Profil fotoğrafı siliniyor...");
          await deleteProfilePhoto(user.id, accessToken);
          console.log("✅ Profil fotoğrafı başarıyla silindi");
        } catch (photoError) {
          console.error("❌ Profil fotoğrafı silme hatası:", photoError);
          setApiError(photoError.message || "Profil fotoğrafı silinemedi");
          setShowApiError(true);
          return; // Hata durumunda işlemi durdur
        }
      }

      // Handle photo upload if there's a new photo
      if (uploadedPhoto) {
        try {
          console.log("� Fotoğraf yükleme işlemi başlatılıyor...");
          // Profil fotoğrafı yükleme API'si
          const photoResult = await uploadProfilePhoto(user.id, uploadedPhoto, accessToken);
          console.log("✅ Profil fotoğrafı başarıyla yüklendi:", photoResult);
        } catch (photoError) {
          console.error("Fotoğraf yükleme hatası:", photoError);
          setApiError(photoError.message || "Fotoğraf yüklenemedi");
          setShowApiError(true);
        }
      }

      // Gerçek API kullanarak profili güncelle
      const savedProfile = await updateLecturerProfile(
        user.id, 
        profileUpdateData, 
        accessToken
      );
      
      // Local state'i güncelle (yeni şemaya göre)
      const updatedUserProfile = {
        ...userProfile,
        id: savedProfile.id,
        name: `${savedProfile.first_name || values.firstName} ${savedProfile.last_name || values.lastName}`,
        firstName: savedProfile.first_name || values.firstName,
        lastName: savedProfile.last_name || values.lastName,
        title: savedProfile.title || values.title || userProfile.title,
        email: savedProfile.email || values.email,
        phone: savedProfile.phone || values.phone,
        department_id: savedProfile.department_id || userProfile.department_id,
        university: savedProfile.university || values.university || userProfile.university || "",
        faculty: savedProfile.faculty || values.faculty || userProfile.faculty || "",
        department: savedProfile.department || values.department || userProfile.department || "",
        profilePhoto: isPhotoDeleted && !uploadedPhoto ? null : 
                     uploadedPhoto ? getProfilePhotoUrl(savedProfile.profile_photo) :
                     userProfile.profilePhoto, // Değişiklik yoksa mevcut fotoğrafı koru
        created_at: savedProfile.created_at || userProfile.created_at,
      };
      
      setUserProfile(updatedUserProfile);
      
      // AuthContext'teki kullanıcı bilgilerini de güncelle
      const updatedUser = {
        first_name: savedProfile.first_name || values.firstName,
        last_name: savedProfile.last_name || values.lastName,
        title: savedProfile.title || values.title || user.title,
        email: savedProfile.email || values.email,
        phone: savedProfile.phone || values.phone,
        university: savedProfile.university || values.university || user.university || "",
        faculty: savedProfile.faculty || values.faculty || user.faculty || "",
        department: savedProfile.department || values.department || user.department || "",
        profile_photo: isPhotoDeleted ? null : (savedProfile.profile_photo || user.profile_photo),
      };
      
      // updateUser fonksiyonunu kullan ki tüm component'lar güncellensin
      updateUser(updatedUser);
      
      console.log("✅ Profil başarıyla güncellendi:", updatedUserProfile);
      console.log("�� AuthContext user güncellendi:", updatedUser);

      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedUserProfile);
      }

      setIsEditing(false);
      setSaveMessage("Profil başarıyla kaydedildi!");
      
      // Yüklenen fotoğraf ve preview'ı temizle
      setUploadedPhoto(null);
      setPhotoPreview(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("❌ Profil kaydetme hatası:", error);
      setApiError(error.message || t("serverError"));
      setShowApiError(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a memoized saveProfile function to prevent unnecessary recreations
  const memoizedSaveProfile = useCallback(saveProfile, [
    values,
    uploadedPhoto,
    photoPreview,
    userProfile,
    user,
    accessToken,
    onProfileUpdate,
    t,
    validateAll,
    setUser,
  ]);

  // Create a debounced version of the save function to prevent multiple rapid saves
  const handleSaveClick = useCallback(
    debounce(() => {
      memoizedSaveProfile();
    }, 300),
    [memoizedSaveProfile]
  );

  // Create refs for focus management
  const firstFieldRef = React.useRef(null);
  const editButtonRef = React.useRef(null);

  // Focus management for edit mode
  React.useEffect(() => {
    if (isEditing && firstFieldRef.current) {
      // Focus the first field when entering edit mode
      firstFieldRef.current.focus();
    }
  }, [isEditing]);

  // Early return after all hooks are called
  if (!userProfile || isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1a237e", mb: 4 }}
        >
          👤 {t("myProfile")}
        </Typography>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Profil yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Konsol gürültüsünü azaltmak için debug logları kapatıldı

  return (
          <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Tüm TextField'larda metin belirginliği için global style */}
        <style>
          {`
            .MuiInputBase-input {
              font-weight: 600 !important;
              color: #0f172a !important;
              font-size: 1rem !important;
            }
            .MuiInputBase-input:disabled {
              -webkit-text-fill-color: #0f172a !important;
              color: #0f172a !important;
              font-weight: 600 !important;
              opacity: 1 !important;
            }
            .MuiInputLabel-root {
              font-weight: 600 !important;
              color: #374151 !important;
            }
          `}
        </style>
      {/* Modern Page Title */}
      <Typography
        variant="h4"
        sx={{ 
          fontWeight: 600, 
          color: "#1a237e", 
          mb: 3,
          fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
          letterSpacing: "-0.02em",
        }}
        tabIndex="0"
        role="heading"
        aria-level="1"
      >
        👤 Profilim
      </Typography>

      {/* Success Message */}
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      {/* API Error Snackbar */}
      <Snackbar
        open={showApiError}
        autoHideDuration={6000}
        onClose={handleCloseApiError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseApiError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {apiError}
        </Alert>
      </Snackbar>

      {/* Loading Indicator - Profil Yüklenirken */}
      {isLoading ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            border: "1px solid rgba(26, 35, 126, 0.08)",
            boxShadow: "0 4px 20px rgba(26, 35, 126, 0.08)",
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2, color: "#1a237e" }} />
          <Typography variant="h6" sx={{ mb: 1, color: "#1a237e" }}>
            Profil yükleniyor...
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Lütfen bekleyin, verileriniz getiriliyor.
          </Typography>
          
          {/* Hata durumunda yeniden yükleme butonu */}
          {showApiError && (
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Sayfayı Yenile
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Normal profil UI'ı */}
          {/* Loading Indicator - Kayıt Edilirken */}
          {isSaving && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography>Kaydediliyor...</Typography>
            </Box>
          )}

      {/* Modern Card Layout */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          position: "relative",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
          border: "1px solid rgba(26, 35, 126, 0.08)",
          boxShadow: "0 4px 20px rgba(26, 35, 126, 0.08)",
        }}
      >
        {/* Profile Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2,
            mb: 2,
            mt: 1,
          }}
        >
          {/* Profile Photo */}
          <Box sx={{ textAlign: "center", flexShrink: 0 }}>
            <Avatar
              src={photoPreview || userProfile.profilePhoto || null}
              alt={"Profil fotoğrafı: " + (userProfile.name || "Kullanıcı")}
              sx={{
                width: 80,
                height: 80,
                fontSize: "2rem",
                bgcolor: "#1a237e",
              }}
              role="img"
              aria-label={
                "Profil fotoğrafı: " + (userProfile.name || "Kullanıcı")
              }
              onError={(e) => {
                console.error('❌ Profilim Avatar - Profil fotoğrafı yüklenemedi:', {
                  src: e.target.src,
                  originalPath: userProfile.profilePhoto,
                  error: e
                });
              }}
            >
              {userProfile.name
                ? userProfile.name.charAt(0).toUpperCase()
                : "?"}
            </Avatar>
          </Box>

          {/* Modern Profile Info */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-start" },
              minHeight: 80,
              gap: 0.5,
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                color: "#1a237e",
                textAlign: { xs: "center", sm: "left" },
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {isEditing
                ? `${values.firstName || ""} ${values.lastName || ""}`
                : userProfile.name || "Kullanıcı"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                textAlign: { xs: "center", sm: "left" },
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              {userProfile.title || ""}
            </Typography>
          </Box>

          {/* Edit/Save/Cancel Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditClick}
                disabled={isSaving}
                sx={{
                  background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "0 2px 8px rgba(26, 35, 126, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0d1642 0%, #1a237e 100%)",
                    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                ref={editButtonRef}
                aria-label="Profil Düzenle"
              >
                Düzenle
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  sx={{
                    background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "0 2px 8px rgba(26, 35, 126, 0.2)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0d1642 0%, #1a237e 100%)",
                      boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelClick}
                  disabled={isSaving}
                  sx={{
                    borderColor: "#cbd5e1",
                    color: "#64748b",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f8fafc",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  İptal
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Modern Form Fields */}
        <Grid container spacing={2.5}>
          {/* Ünvan Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ünvan"
              value={values.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
              sx={{
                ...textFieldStyles,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                },
              }}
              inputRef={isEditing ? firstFieldRef : null}
            />
          </Grid>

          {/* Ad Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ad"
              value={values.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
              sx={{
                ...textFieldStyles,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                },
              }}
            />
          </Grid>

          {/* Soyad Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Soyad"
              value={values.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* E-posta Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="E-posta"
              value={values.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
              inputProps={{
                type: "email",
              }}
            />
          </Grid>

          {/* Telefon Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cep Telefonu"
              value={values.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* Üniversite Field */}
          <Grid item xs={12} sm={6}>
            {console.log('🔍 === ÜNİVERSİTE TEXTFIELD RENDER DEBUG ===')}
            {console.log('  - values.university:', values.university)}
            {console.log('  - values objesi tamamı:', values)}
            {console.log('  - initialFormData.university:', initialFormData.university)}
            {console.log('  - user?.university:', user?.university)}
            {console.log('  - userProfile?.university:', userProfile?.university)}
            {console.log('🔍 =======================================')}
            <TextField
              label="Üniversite"
              value={values.university || ""}
              onChange={(e) => handleChange("university", e.target.value)}
              onBlur={() => handleBlur("university")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.university && !!errors.university}
              helperText={touched.university && errors.university}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* Fakülte Field */}
          <Grid item xs={12} sm={6}>
            {console.log('🔍 === FAKÜLTE TEXTFIELD RENDER DEBUG ===')}
            {console.log('  - values.faculty:', values.faculty)}
            {console.log('  - initialFormData.faculty:', initialFormData.faculty)}
            {console.log('  - user?.faculty:', user?.faculty)}
            {console.log('  - userProfile?.faculty:', userProfile?.faculty)}
            {console.log('🔍 ====================================')}
            <TextField
              label="Fakülte"
              value={values.faculty || ""}
              onChange={(e) => handleChange("faculty", e.target.value)}
              onBlur={() => handleBlur("faculty")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.faculty && !!errors.faculty}
              helperText={touched.faculty && errors.faculty}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

          {/* Bölüm Field */}
          <Grid item xs={12}>
            {console.log('🔍 === BÖLÜM TEXTFIELD RENDER DEBUG ===')}
            {console.log('  - values.department:', values.department)}
            {console.log('  - initialFormData.department:', initialFormData.department)}
            {console.log('  - user?.department:', user?.department)}
            {console.log('  - userProfile?.department:', userProfile?.department)}
            {console.log('🔍 ==============================')}
            <TextField
              label="Bölüm"
              value={values.department || ""}
              onChange={(e) => handleChange("department", e.target.value)}
              onBlur={() => handleBlur("department")}
              fullWidth
              variant="outlined"
              size="medium"
              disabled={!isEditing}
              error={touched.department && !!errors.department}
              helperText={touched.department && errors.department}
              InputProps={{
                readOnly: !isEditing,
                sx: {
                  borderRadius: 2,
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a237e",
                    borderWidth: 2,
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                  fontWeight: 500,
                  color: "#64748b",
                  "&.Mui-focused": {
                    color: "#1a237e",
                  },
                },
              }}
            />
          </Grid>

        </Grid>
      </Paper>
      </>
      )}
    </Container>
  );
};

// Wrap component with React.memo to prevent unnecessary re-renders
export default React.memo(Profilim);
