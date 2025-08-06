// API Base URL
const API_BASE_URL = "http://127.0.0.1:8000";

// Üniversite listesini getir
export const getUniversities = async () => {
  try {
    const possibleEndpoints = [
      `${API_BASE_URL}/lecturer_data/universities/`,
      `${API_BASE_URL}/universities/`,
      `${API_BASE_URL}/api/universities/`,
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
      `${API_BASE_URL}/faculties/${universityId}/`,
      `${API_BASE_URL}/api/faculties/${universityId}/`,
      `${API_BASE_URL}/lecturer_data/faculties/?university=${universityId}`,
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
      `${API_BASE_URL}/departments/${facultyId}/`,
      `${API_BASE_URL}/api/departments/${facultyId}/`,
      `${API_BASE_URL}/lecturer_data/departments/?faculty=${facultyId}`,
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

// login işlemi
export const loginLecturer = async (formData) => {
  console.log("Login API çağrısı:", { username: formData.username, password: "***" }); // Debug için
  
  const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: formData.username, password: formData.password }) // Backend username bekliyor
  });

  console.log("Login API yanıt durumu:", response.status); // Debug için

  if (!response.ok) {
    let errorData;
    let textResponse;
    
    try {
      // İlk önce text olarak al
      textResponse = await response.text();
      console.error("Login API raw yanıtı:", textResponse);
      
      // Sonra JSON parse etmeyi dene
      try {
        errorData = JSON.parse(textResponse);
        console.error("Login API JSON hata detayı:", errorData);
      } catch (parseError) {
        console.error("Login JSON parse edilemedi:", textResponse);
        throw new Error(`Giriş başarısız (${response.status}): Server hatası`);
      }
    } catch (textError) {
      console.error("Login response text alınamadı:", textError);
      throw new Error(`Giriş başarısız (${response.status}): Response okunamadı`);
    }
    
    // Hata mesajını daha anlaşılır hale getir
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
  console.log("Login başarılı, API yanıtı:", result); // Debug için
  return result;  // access + refresh token
};

// kayıt işlemi
export const registerLecturer = async (formData) => {
  console.log("API'ye gönderilen veri:", formData); // Debug için
  console.log("Department ID (auth.js):", formData.department_id); // Debug için
  
  const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  console.log("API yanıt durumu:", response.status); // Debug için

  if (!response.ok) {
    let errorData;
    let textResponse;
    
    try {
      // İlk önce text olarak al
      textResponse = await response.text();
      console.error("API raw yanıtı:", textResponse);
      
      // Sonra JSON parse etmeyi dene
      try {
        errorData = JSON.parse(textResponse);
        console.error("API JSON hata detayı:", errorData);
      } catch (parseError) {
        console.error("JSON parse edilemedi, raw text:", textResponse);
        throw new Error(`Server error (${response.status}): ${textResponse.substring(0, 200)}`);
      }
    } catch (textError) {
      console.error("Response text alınamadı:", textError);
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
  const response = await fetch("http://127.0.0.1:8000/lecturer_data/lecturers/login/refresh/", {
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
