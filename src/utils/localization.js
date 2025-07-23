// Turkish localization constants for the profile system
export const turkishLabels = {
  // Profile sections
  profilePhoto: "Profil Fotoğrafı",
  emailInformation: "E-posta Bilgileri", 
  phoneNumber: "Telefon Numarası",
  compulsoryEducation: "Zorunlu Eğitim Bilgileri",
  otherDetails: "Diğer Detaylar",
  faculty: "Fakülte",
  department: "Bölüm",
  university: "Üniversite",
  
  // Form fields
  firstName: "Ad",
  lastName: "Soyad",
  email: "E-posta",
  phone: "Telefon",
  title: "Unvan",
  personalInfo: "Kişisel Bilgiler",
  educationInfo: "Eğitim Bilgileri",
  contactInfo: "İletişim Bilgileri",
  
  // Actions
  editProfile: "Profili Düzenle",
  saveProfile: "Profili Kaydet",
  cancel: "İptal",
  
  // File upload
  uploadPhoto: "Fotoğraf Yükle",
  changePhoto: "Fotoğrafı Değiştir",
  removePhoto: "Fotoğrafı Kaldır",
  dragDropText: "Fotoğrafı buraya sürükleyin veya tıklayın",
  fileTypeInfo: "JPG, PNG, GIF - Maksimum 5MB",
  
  // Validation messages
  requiredField: "Bu alan zorunludur.",
  invalidEmail: "Geçerli bir e-posta adresi girin.",
  invalidPhone: "Geçerli bir telefon numarası girin.",
  
  // File upload errors
  invalidFileType: "Geçersiz dosya türü. Lütfen JPG, PNG veya GIF formatında bir resim seçin.",
  fileTooLarge: "Dosya boyutu çok büyük. Maksimum 5MB boyutunda dosya yükleyebilirsiniz.",
  uploadFailed: "Dosya yükleme başarısız. Lütfen tekrar deneyin.",
  
  // API errors
  networkError: "Bağlantı hatası. İnternet bağlantınızı kontrol edin.",
  serverError: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
  validationError: "Girilen bilgiler geçersiz. Lütfen kontrol edin.",
  authError: "Yetkilendirme hatası. Lütfen tekrar giriş yapın.",
  notFoundError: "Profil bulunamadı.",
  
  // Loading states
  loading: "Yükleniyor...",
  saving: "Kaydediliyor...",
  profileLoading: "Profil bilgileri yükleniyor...",
  
  // Success messages
  profileSaved: "Profil başarıyla kaydedildi.",
  photoUploaded: "Fotoğraf başarıyla yüklendi.",
  
  // General
  profile: "Profil",
  myProfile: "Profilim",
  onlyVisibleHere: "Sadece bu ekranda görünür",
  yes: "Evet",
  no: "Hayır",
  ok: "Tamam",
  close: "Kapat",
  user: "Kullanıcı",
  
  // Accessibility
  profilePhotoOf: "Profil fotoğrafı:",
  currentProfilePhoto: "Mevcut profil fotoğrafı",
  noProfilePhoto: "Profil fotoğrafı yok"
};

// Hook for accessing localized text
export const useLocalization = () => {
  const t = (key) => {
    return turkishLabels[key] || key;
  };
  
  return { t, labels: turkishLabels };
};

// Direct access function for non-hook contexts
export const getLocalizedText = (key) => {
  return turkishLabels[key] || key;
};