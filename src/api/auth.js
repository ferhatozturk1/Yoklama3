// API Base URL
const API_BASE_URL = "http://127.0.0.1:8000";

// Üniversite listesini getir
export const getUniversities = async () => {
  try {
    const possibleEndpoints = [
      `${API_BASE_URL}/lecturer_data/universities/`,
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const universities = await response.json();
          console.log(`Üniversiteler ${endpoint} adresinden alındı:`, universities);
          return universities;
        }
      } catch (endpointError) {
        console.log(`${endpoint} denendi, başarısız:`, endpointError.message);
      }
    }
    
    console.error("Hiçbir üniversite endpoint'i çalışmıyor");
    return [];
  } catch (error) {
    console.error("Üniversite listesi hatası:", error);
    return [];
  }
};

// Fakülte listesini getir (üniversiteye göre)
export const getFaculties = async (universityId) => {
  try {
    if (!universityId) {
      console.error("❌ Fakülte listesi için üniversite ID'si gerekli!");
      return [];
    }

    const possibleEndpoints = [
      `${API_BASE_URL}/lecturer_data/faculties/${universityId}/`,
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔄 Fakülte endpoint'i deneniyor: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const faculties = await response.json();
          console.log(`✅ Fakülteler ${endpoint} adresinden alındı:`, faculties);
          return Array.isArray(faculties) ? faculties : [];
        } else {
          console.log(`❌ ${endpoint} - Status: ${response.status}`);
        }
      } catch (endpointError) {
        console.log(`❌ ${endpoint} denendi, başarısız:`, endpointError.message);
      }
    }
    
    console.error(`❌ Üniversite ${universityId} için hiçbir fakülte endpoint'i çalışmıyor`);
    return [];
  } catch (error) {
    console.error("❌ Fakülte listesi genel hatası:", error);
    return [];
  }
};

// Departman listesini getir (fakülteye göre)
export const getDepartments = async (facultyId) => {
  try {
    if (!facultyId) {
      console.error("❌ Departman listesi için fakülte ID'si gerekli!");
      return [];
    }

    const possibleEndpoints = [
      `${API_BASE_URL}/lecturer_data/departments/${facultyId}/`,
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔄 Departman endpoint'i deneniyor: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const departments = await response.json();
          console.log(`✅ Departmanlar ${endpoint} adresinden alındı:`, departments);
          return Array.isArray(departments) ? departments : [];
        } else {
          console.log(`❌ ${endpoint} - Status: ${response.status}`);
        }
      } catch (endpointError) {
        console.log(`❌ ${endpoint} denendi, başarısız:`, endpointError.message);
      }
    }
    
    console.error(`❌ Fakülte ${facultyId} için hiçbir departman endpoint'i çalışmıyor`);
    return [];
  } catch (error) {
    console.error("❌ Departman listesi genel hatası:", error);
    return [];
  }
};

// Departman listesini getir (fakülteye göre)
export const getDepartmentsByFaculty = async (facultyId) => {
  const response = await fetch(`${API_BASE_URL}/lecturer_data/departments/faculty_id/${facultyId}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Departman listesi alınamadı ${response.status}: ${text}`);
  }
  return response.json();
};

// login işlemi
export const loginLecturer = async (loginData) => {
  console.log('🔐 === LOGIN API ÇAĞRISI ===');
  console.log('📤 Gönderilen data:', { username: loginData.username, password: '***' });
  
  const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      username: loginData.username, 
      password: loginData.password 
    })
  });

  console.log("📊 Login API yanıt durumu:", response.status);

  if (!response.ok) {
    let errorData;
    let textResponse;
    
    try {
      textResponse = await response.text();
      console.error("❌ Login API raw yanıtı:", textResponse);
      
      try {
        errorData = JSON.parse(textResponse);
        console.error("❌ Login API JSON hata detayı:", errorData);
      } catch (parseError) {
        console.error("❌ Login JSON parse edilemedi:", textResponse);
        throw new Error(`Giriş başarısız (${response.status}): Server hatası`);
      }
    } catch (textError) {
      console.error("❌ Login response text alınamadı:", textError);
      throw new Error(`Giriş başarısız (${response.status}): Response okunamadı`);
    }
    
    let errorMessage = "E-posta veya şifre hatalı";
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.non_field_errors) {
      errorMessage = errorData.non_field_errors[0] || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  console.log('✅ === LOGIN BAŞARILI ===');
  console.log('📋 Backend API yanıtı:', result);
  
  // JWT token'ı decode edip lecturer_id'yi göster
  if (result.access) {
    try {
      const tokenParts = result.access.split('.');
      if (tokenParts.length === 3) {
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        console.log('🔍 JWT Token decode edildi:', decodedToken);
        console.log('👤 Lecturer ID (JWT\'dan):', decodedToken.lecturer_id);
        console.log('📧 Email (JWT\'dan):', decodedToken.email);
        console.log('⏰ Token expiry:', new Date(decodedToken.exp * 1000));
        
        // Lecturer ID'yi response'a ekle (AuthContext için)
        result.lecturer_id = decodedToken.lecturer_id;
        result.email = decodedToken.email;
        
        console.log('🔧 Enhanced response (lecturer_id eklendi):', {
          access: result.access ? 'MEVCUT' : 'YOK',
          refresh: result.refresh ? 'MEVCUT' : 'YOK',
          lecturer_id: result.lecturer_id,
          email: result.email
        });
      }
    } catch (decodeError) {
      console.error('❌ JWT decode hatası:', decodeError);
    }
  }
  
  console.log('✅ Login fonksiyonu tamamlandı');
  return result;
};

// kayıt işlemi
export const registerLecturer = async (formData) => {
  console.log("🚀 REGISTER LECTURER - Başlatılıyor");
  console.log("📊 API'ye gönderilen veri:", formData);
  console.log("� Department Name (auth.js):", formData.department_name);
  console.log("📝 Form data keys:", Object.keys(formData));
  console.log("📝 Form data values:", Object.values(formData));
  
  // Gerekli alanları kontrol et
  const requiredFields = ['email_send', 'password', 'department_id'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    console.error("❌ Eksik alanlar:", missingFields);
    throw new Error(`Eksik alanlar: ${missingFields.join(', ')}`);
  }
  
  console.log("✅ Tüm gerekli alanlar mevcut");

  // Backend'in beklediği formata uygun hale getir
  const apiData = {
    ...formData,
    // Department_id'yi string olarak gönder (UUID)
    department_id: formData.department_id,
    // Email'i küçük harfe çevir
    email_send: formData.email_send?.toLowerCase().trim() || '',
    // Boş alanları temizle
    title: formData.title?.trim() || '',
    first_name: formData.first_name?.trim() || '',
    last_name: formData.last_name?.trim() || ''
  };

  console.log("🔧 API'ye gönderilecek temizlenmiş veri:", apiData);
  
  const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(apiData)
  });

  console.log("📡 API yanıt durumu:", response.status);
  console.log("📡 API yanıt headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let errorData;
    let textResponse;
    
    try {
      // İlk önce text olarak al
      textResponse = await response.text();
      console.error("🔴 API raw yanıtı:", textResponse);
      
      // HTML yanıt ise (Django error page)
      if (textResponse.includes('<!DOCTYPE html>')) {
        console.error("🔴 Server HTML hata sayfası döndü");
        console.error("🔴 Full HTML response:", textResponse.substring(0, 1000));
        
        // HTML'den hata tipini çıkarmaya çalış
        const titleMatch = textResponse.match(/<title>(.*?)<\/title>/);
        const errorType = titleMatch ? titleMatch[1] : 'Server Error';
        
        // HTML'den daha fazla bilgi çıkarmaya çalış
        const h1Match = textResponse.match(/<h1>(.*?)<\/h1>/);
        const errorDetail = h1Match ? h1Match[1] : '';
        
        // Exception value'yu bul
        const exceptionMatch = textResponse.match(/Exception Value:.*?<pre[^>]*>(.*?)<\/pre>/s);
        const exceptionValue = exceptionMatch ? exceptionMatch[1].trim() : '';
        
        // Eğer KeyError varsa onu yakala
        if (textResponse.includes('KeyError')) {
          const keyErrorMatch = textResponse.match(/KeyError.*?['"](.*?)['"]/) || 
                               textResponse.match(/KeyError: (.*?)(?:<|$)/) ||
                               textResponse.match(/'([^']+)' key not found/) ||
                               textResponse.match(/KeyError.*?at\s+(\w+)/);
          const missingKey = keyErrorMatch ? keyErrorMatch[1] : 'bilinmeyen alan';
          console.error("🔴 KeyError detected - Eksik alan:", missingKey);
          console.error("🔴 Exception value:", exceptionValue);
          throw new Error(`Backend'de eksik alan hatası: '${missingKey}' alanı bulunamadı. Lütfen bu alanı ekleyin.`);
        }
        
        let errorMessage = `Server hatası (${response.status}): ${errorType}`;
        if (errorDetail && errorDetail !== errorType) {
          errorMessage += ` - ${errorDetail}`;
        }
        if (exceptionValue) {
          errorMessage += ` - Detay: ${exceptionValue}`;
        }
        errorMessage += " - Lütfen gönderilen verileri kontrol edin";
        
        throw new Error(errorMessage);
      }
      
      // JSON parse etmeyi dene
      try {
        errorData = JSON.parse(textResponse);
        console.error("🔴 API JSON hata detayı:", errorData);
      } catch (parseError) {
        console.error("🔴 JSON parse edilemedi, raw text:", textResponse);
        throw new Error(`Server error (${response.status}): ${textResponse.substring(0, 300)}`);
      }
    } catch (textError) {
      console.error("🔴 Response text alınamadı:", textError);
      // Eğer textError zaten bizim attığımız Error ise, onu re-throw et
      if (textError.message.includes('Server hatası') || textError.message.includes('Backend\'de eksik')) {
        throw textError;
      }
      throw new Error(`Server error (${response.status}): Response okunamadı`);
    }
    
    // Hata mesajını daha anlaşılır hale getir
    let errorMessage = "Kayıt başarısız";
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === 'object') {
      // Field validation errors
      const fieldErrors = Object.entries(errorData).map(([field, errors]) => {
        if (Array.isArray(errors)) {
          return `${field}: ${errors.join(', ')}`;
        }
        return `${field}: ${errors}`;
      });
      errorMessage = fieldErrors.join('; ');
    }
    
    throw new Error(errorMessage);
  }

  return await response.json();
};

// access token yenileme
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/login/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh: refreshToken })
  });

  if (!response.ok) {
    throw new Error("Token yenileme başarısız");
  }

  return await response.json(); // yeni access token gelir
};

// Öğretmen profil bilgilerini getir
export const getLecturerProfile = async (lecturerId, accessToken) => {
  try {
    console.log(`🔄 Profil bilgileri getiriliyor - Lecturer ID: ${lecturerId}`);
    
    const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    console.log("Profil API yanıt durumu:", response.status);

    if (!response.ok) {
      let errorData;
      let textResponse;
      
      try {
        textResponse = await response.text();
        console.error("Profil API raw yanıtı:", textResponse);
        
        try {
          errorData = JSON.parse(textResponse);
          console.error("Profil API JSON hata detayı:", errorData);
        } catch (parseError) {
          console.error("Profil JSON parse edilemedi:", textResponse);
          throw new Error(`Profil bilgileri alınamadı (${response.status}): Server hatası`);
        }
      } catch (textError) {
        console.error("Profil response text alınamadı:", textError);
        throw new Error(`Profil bilgileri alınamadı (${response.status}): Response okunamadı`);
      }
      
      let errorMessage = "Profil bilgileri alınamadı";
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      throw new Error(errorMessage);
    }

    const profileData = await response.json();
    console.log("✅ Profil bilgileri başarıyla alındı:", profileData);
    return profileData;
  } catch (error) {
    console.error("❌ Profil bilgileri alma hatası:", error);
    throw error;
  }
};

// Öğretmen profil bilgilerini güncelle
export const updateLecturerProfile = async (lecturerId, profileData, accessToken) => {
  try {
    console.log(`🔄 Profil güncelleniyor - Lecturer ID: ${lecturerId}`, profileData);
    
    const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(profileData)
    });

    console.log("Profil güncelleme API yanıt durumu:", response.status);

    if (!response.ok) {
      let errorData;
      let textResponse;
      
      try {
        textResponse = await response.text();
        console.error("Profil güncelleme API raw yanıtı:", textResponse);
        
        try {
          errorData = JSON.parse(textResponse);
          console.error("Profil güncelleme API JSON hata detayı:", errorData);
        } catch (parseError) {
          console.error("Profil güncelleme JSON parse edilemedi:", textResponse);
          throw new Error(`Profil güncellenemedi (${response.status}): Server hatası`);
        }
      } catch (textError) {
        console.error("Profil güncelleme response text alınamadı:", textError);
        throw new Error(`Profil güncellenemedi (${response.status}): Response okunamadı`);
      }
      
      let errorMessage = "Profil güncellenemedi";
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'object') {
        // Field validation errors
        const fieldErrors = Object.entries(errorData).map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(', ')}`;
          }
          return `${field}: ${errors}`;
        });
        errorMessage = fieldErrors.join('; ');
      }
      
      throw new Error(errorMessage);
    }

    const updatedProfile = await response.json();
    console.log("✅ Profil başarıyla güncellendi:", updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("❌ Profil güncelleme hatası:", error);
    throw error;
  }
};

// Profil fotoğrafı yükle
export const uploadProfilePhoto = async (lecturerId, photoFile, accessToken) => {
  try {
    console.log(`📸 Profil fotoğrafı yükleme geçici olarak devre dışı - Lecturer ID: ${lecturerId}`);
    
    // Backend endpoint'i henüz mevcut değil, geçici olarak başarılı yanıt döndür
    return {
      success: true,
      message: "Profil fotoğrafı yükleme özelliği geçici olarak devre dışı",
      profile_photo: null
    };
    
    /* Backend hazır olduğunda bu kısım aktif edilecek
    const formData = new FormData();
    formData.append('profile_photo', photoFile);
    
    const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/upload_photo/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Profil fotoğrafı yüklenemedi (${response.status})`);
    }

    const result = await response.json();
    console.log("✅ Profil fotoğrafı başarıyla yüklendi:", result);
    return result;
    */
  } catch (error) {
    console.error("❌ Profil fotoğrafı yükleme hatası:", error);
    throw error;
  }
};

// Profil fotoğrafını sil
export const deleteProfilePhoto = async (lecturerId, accessToken) => {
  try {
    console.log(`🗑️ Profil fotoğrafı silme geçici olarak devre dışı - Lecturer ID: ${lecturerId}`);
    
    // Backend endpoint'i henüz mevcut değil, geçici olarak başarılı yanıt döndür
    return {
      success: true,
      message: "Profil fotoğrafı silme özelliği geçici olarak devre dışı"
    };
    
    /* Backend hazır olduğunda bu kısım aktif edilecek
    const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/delete_photo/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Profil fotoğrafı silinemedi (${response.status})`);
    }

    const result = await response.json();
    console.log("✅ Profil fotoğrafı başarıyla silindi:", result);
    return result;
    */
  } catch (error) {
    console.error("❌ Profil fotoğrafı silme hatası:", error);
    throw error;
  }
};
