import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLecturerProfile, refreshToken, getDepartments, getFaculties, getUniversities } from '../api/auth';

// JWT token decode helper (sadece payload'ı alır, imza doğrulaması yapmaz)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode hatası:', error);
    return null;
  }
};

// AuthContext oluştur
const AuthContext = createContext();

// AuthContext hook'u
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook AuthProvider içinde kullanılmalıdır');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshTokenState, setRefreshTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Session temizleme helper fonksiyonu
  const clearSession = () => {
    console.log('🧹 AuthContext - Oturum temizleniyor');
    setUser(null);
    setAccessToken(null);
    setRefreshTokenState(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
  };

  // Profile photo URL helper function
  const getProfilePhotoUrl = (photoPath) => {
    console.log('📸 AuthContext getProfilePhotoUrl çağrıldı:', photoPath);
    if (!photoPath) {
      console.log('❌ Photo path boş');
      return null;
    }
    if (photoPath.startsWith('http')) {
      console.log('✅ Zaten tam URL:', photoPath);
      return photoPath;
    }
    
    const fullUrl = `http://127.0.0.1:8000${photoPath}`;
    console.log('🔧 AuthContext - Tam URL oluşturuldu:', fullUrl);
    
    return fullUrl;
  };

  // Profil bilgilerini üniversite/fakülte/bölüm bilgileri ile genişlet
  const loadEnhancedProfile = async (profileData) => {
    try {
      let enhancedProfile = { ...profileData };
      
      if (profileData.department_id) {
        console.log('🔍 AuthContext - Department ID ile ek bilgiler çekiliyor:', profileData.department_id);
        
        try {
          console.log('🔍 AuthContext - Backend\'den üniversite/fakülte/bölüm bilgileri alınıyor...');
          
          // Timeout ile API çağrıları - 10 saniye
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API zaman aşımına uğradı')), 10000)
          );
          
          // 1. Tüm üniversiteleri al
          const universitiesResponse = await Promise.race([
            fetch(`http://127.0.0.1:8000/lecturer_data/universities/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken ? `Bearer ${accessToken}` : undefined
              }
            }),
            timeoutPromise
          ]);

          if (!universitiesResponse.ok) {
            throw new Error(`Universities API failed: ${universitiesResponse.status}`);
          }

          const universities = await universitiesResponse.json();
          console.log('✅ AuthContext - Üniversiteler alındı:', universities.length, 'adet');

          // 2. Her üniversite için fakültelerini ve bölümlerini kontrol et (maksimum 3 üniversite)
          let foundInfo = null;
          const maxUniversitiesToCheck = Math.min(universities.length, 3);

          for (let i = 0; i < maxUniversitiesToCheck && !foundInfo; i++) {
            const university = universities[i];
            
            try {
              const facultiesResponse = await Promise.race([
                fetch(`http://127.0.0.1:8000/lecturer_data/faculties/${university.id}/`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken ? `Bearer ${accessToken}` : undefined
                  }
                }),
                timeoutPromise
              ]);

              if (facultiesResponse.ok) {
                const faculties = await facultiesResponse.json();
                console.log(`🔍 AuthContext - ${university.name} - ${faculties.length} fakülte bulundu`);

                // Her fakülte için bölümleri kontrol et (maksimum 5 fakülte)
                const maxFacultiesToCheck = Math.min(faculties.length, 5);
                
                for (let j = 0; j < maxFacultiesToCheck && !foundInfo; j++) {
                  const faculty = faculties[j];
                  
                  try {
                    const departmentsResponse = await Promise.race([
                      fetch(`http://127.0.0.1:8000/lecturer_data/departments/${faculty.id}/`, {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": accessToken ? `Bearer ${accessToken}` : undefined
                        }
                      }),
                      timeoutPromise
                    ]);

                    if (departmentsResponse.ok) {
                      const departments = await departmentsResponse.json();
                      console.log(`🔍 AuthContext - ${faculty.name} - ${departments.length} bölüm bulundu`);

                      // Kullanıcının department_id'sini bul
                      const userDepartment = departments.find(dept => dept.id === profileData.department_id);
                      
                      if (userDepartment) {
                        foundInfo = {
                          university: university.name,
                          faculty: faculty.name,
                          department: userDepartment.name,
                          university_id: university.id,
                          faculty_id: faculty.id,
                          department_id: userDepartment.id
                        };
                        console.log('🎯 AuthContext - Kullanıcının bölümü bulundu!', {
                          university: foundInfo.university,
                          faculty: foundInfo.faculty,
                          department: foundInfo.department
                        });
                        break;
                      }
                    }
                  } catch (deptError) {
                    console.log(`⚠️ AuthContext - ${faculty.name} bölümleri alınamadı:`, deptError.message);
                  }
                }
              }
            } catch (facultyError) {
              console.log(`⚠️ AuthContext - ${university.name} fakülteleri alınamadı:`, facultyError.message);
            }
          }

          if (foundInfo) {
            // Backend'den alınan gerçek bilgileri kullan
            enhancedProfile.university = foundInfo.university;
            enhancedProfile.faculty = foundInfo.faculty;
            enhancedProfile.department = foundInfo.department;
            
            console.log('✅ AuthContext - Backend\'den gerçek akademik bilgiler alındı:', {
              university: enhancedProfile.university,
              faculty: enhancedProfile.faculty,
              department: enhancedProfile.department
            });
          } else {
            // Bulunamazsa varsayılan değerler
            enhancedProfile.department = `Bölüm ${profileData.department_id.substring(0, 8)}`;
            enhancedProfile.faculty = 'Celal Bayar Üniversitesi Fakültesi';
            enhancedProfile.university = 'Celal Bayar Üniversitesi';
            
            console.log('⚠️ AuthContext - Backend\'den bölüm bulunamadı, varsayılan değerler kullanılıyor');
          }
          
        } catch (apiError) {
          console.error('❌ AuthContext - API çağrısı hatası:', apiError);
          // API hatası durumunda varsayılan değerler
          enhancedProfile.department = `Bölüm ${profileData.department_id.substring(0, 8)}`;
          enhancedProfile.faculty = 'Celal Bayar Üniversitesi Fakültesi';
          enhancedProfile.university = 'Celal Bayar Üniversitesi';
        }
      } else {
        // Department_id yoksa varsayılan değerler
        enhancedProfile.department = 'Bölüm Bilgisi';
        enhancedProfile.faculty = 'Celal Bayar Üniversitesi Fakültesi';
        enhancedProfile.university = 'Celal Bayar Üniversitesi';
        console.log('⚠️ AuthContext - Department ID bulunamadı, varsayılan değerler atanıyor');
      }
      
      return enhancedProfile;
    } catch (error) {
      console.error('❌ AuthContext - Profil geliştirme hatası:', error);
      return {
        ...profileData,
        department: 'Bölüm Bilgisi',
        faculty: 'Celal Bayar Üniversitesi Fakültesi',
        university: 'Celal Bayar Üniversitesi'
      };
    }
  };

  // Sayfa yüklendiğinde sessionStorage'dan kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');
        const storedRefreshToken = sessionStorage.getItem('refreshToken');

        console.log('🔍 AuthContext - SessionStorage verileri kontrol ediliyor:');
        console.log('User:', storedUser);
        console.log('Token:', storedToken);
        console.log('RefreshToken:', storedRefreshToken);

        if (storedToken) {
          setAccessToken(storedToken);
          setRefreshTokenState(storedRefreshToken);

          if (storedUser) {
            // Kullanıcı verisi varsa direkt yükle
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ AuthContext - Kullanıcı oturumu yüklendi:', userData);
          } else {
            // Kullanıcı verisi yoksa token'dan lecturer_id'yi çıkarıp profil getir
            console.log('🔄 AuthContext - Token var ama kullanıcı verisi yok, profil getiriliyor...');
            try {
              // JWT token'dan lecturer_id'yi çıkar
              const decodedToken = decodeJWT(storedToken);
              console.log('🔍 AuthContext - JWT token decode edildi:', decodedToken);
              
              const lecturerId = decodedToken?.lecturer_id;
              if (!lecturerId) {
                console.error('❌ AuthContext - JWT token\'da lecturer_id bulunamadı');
                clearSession();
                return;
              }
              
              console.log('📋 AuthContext - Lecturer ID bulundu:', lecturerId);
              const profileData = await getLecturerProfile(lecturerId, storedToken);
              
              if (profileData) {
                // Profili ek bilgilerle genişlet
                const enhancedProfile = await loadEnhancedProfile(profileData);
                
                const userData = {
                  id: lecturerId,
                  lecturer_id: lecturerId,
                  first_name: enhancedProfile.first_name,
                  last_name: enhancedProfile.last_name,
                  email: enhancedProfile.email,
                  title: enhancedProfile.title,
                  phone: enhancedProfile.phone,
                  department_id: enhancedProfile.department_id,
                  department: enhancedProfile.department,
                  faculty: enhancedProfile.faculty,
                  university: enhancedProfile.university,
                  profile_photo: enhancedProfile.profile_photo,
                };
                
                setUser(userData);
                setIsAuthenticated(true);
                
                // SessionStorage'a da kaydet
                sessionStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ AuthContext - Geliştirilmiş profil token ile yüklendi:', userData);
              } else {
                console.log('⚠️ AuthContext - Profil getirilemedi, oturum sonlandırılıyor');
                clearSession();
              }
            } catch (error) {
              console.error('❌ AuthContext - Profil yükleme hatası:', error);
              clearSession();
            }
          }
        } else {
          console.log('⚠️ AuthContext - SessionStorage\'da token bulunamadı');
        }
      } catch (error) {
        console.error('❌ AuthContext - SessionStorage okuma hatası:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login fonksiyonu
  const login = async (loginData) => {
    try {
      console.log('🔐 AuthContext - Login işlemi başlatılıyor:', loginData);

      let token = null;
      let lecturerId = null;

      // Token'ları kaydet
      if (loginData.access || loginData.token) {
        token = loginData.access || loginData.token;
        setAccessToken(token);
        sessionStorage.setItem('token', token);
        console.log('🔑 AuthContext - Access token kaydedildi');
      }

      if (loginData.refresh) {
        setRefreshTokenState(loginData.refresh);
        sessionStorage.setItem('refreshToken', loginData.refresh);
        console.log('🔄 AuthContext - Refresh token kaydedildi');
      }

      // Lecturer ID'yi belirle
      if (loginData.lecturer_id) {
        lecturerId = loginData.lecturer_id;
      } else if (loginData.lecturer) {
        lecturerId = loginData.lecturer.id;
      }

      // Eğer lecturer_id varsa profil bilgilerini çek
      if (lecturerId && token) {
        console.log('📋 AuthContext - Profil bilgileri çekiliyor...', lecturerId);
        
        try {
          const profileData = await getLecturerProfile(lecturerId, token);
          
          if (profileData) {
            // Profili ek bilgilerle genişlet
            const enhancedProfile = await loadEnhancedProfile(profileData);
            
            const userData = {
              id: lecturerId,
              lecturer_id: lecturerId,
              first_name: enhancedProfile.first_name,
              last_name: enhancedProfile.last_name,
              email: enhancedProfile.email,
              title: enhancedProfile.title,
              phone: enhancedProfile.phone,
              department_id: enhancedProfile.department_id,
              department: enhancedProfile.department,
              faculty: enhancedProfile.faculty,
              university: enhancedProfile.university,
              profile_photo: enhancedProfile.profile_photo,
            };
            
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ AuthContext - Geliştirilmiş profil bilgileri ile kullanıcı kaydedildi:', userData);
          } else {
            // Profil çekilemezse en azından lecturer_id'yi kaydet
            const userData = {
              id: lecturerId,
              lecturer_id: lecturerId,
            };
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
            console.log('⚠️ AuthContext - Sadece lecturer_id kaydedildi:', userData);
          }
        } catch (profileError) {
          console.error('❌ AuthContext - Login sonrası profil yükleme hatası:', profileError);
          // Profil çekilemezse en azından lecturer_id'yi kaydet
          const userData = {
            id: lecturerId,
            lecturer_id: lecturerId,
          };
          setUser(userData);
          sessionStorage.setItem('user', JSON.stringify(userData));
          console.log('⚠️ AuthContext - Hata sonrası sadece lecturer_id kaydedildi:', userData);
        }
      }

      // Session'a kullanıcı bilgilerini kaydet (eğer lecturer objesi varsa - fallback)
      if (loginData.lecturer && !lecturerId) {
        const userData = loginData.lecturer;
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        console.log('� AuthContext - Lecturer objesi kaydedildi:', userData);
      }

      setIsAuthenticated(true);
      console.log('✅ AuthContext - Login başarılı');

      return loginData;
    } catch (error) {
      console.error('❌ AuthContext - Login hatası:', error);
      throw error;
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    console.log('🚪 AuthContext - Kullanıcı oturumu sonlandırılıyor');
    
    // clearSession helper fonksiyonunu kullan
    clearSession();
    
    console.log('✅ AuthContext - Oturum başarıyla sonlandırıldı');
    
    // Tüm sessionStorage'ı da temizle (ek güvenlik için)
    try {
      sessionStorage.clear();
      console.log('🧹 AuthContext - SessionStorage tamamen temizlendi');
    } catch (error) {
      console.error('❌ AuthContext - SessionStorage temizleme hatası:', error);
    }
  };

  // Profil bilgilerini API'den yükle
  const loadUserProfile = async (forceRefresh = false) => {
    console.log('🔄 === AUTHCONTEXT LOAD USER PROFILE BAŞLIYOR ===');
    console.log('📊 Parametreler:', { forceRefresh });
    
    if (!user || !accessToken) {
      console.warn('⚠️ === EKSIK BİLGİLER - AuthContext ===');
      console.warn('👤 User mevcut:', !!user);
      console.warn('🔑 AccessToken mevcut:', !!accessToken);
      console.warn('👤 User detay:', user);
      return null;
    }

    try {
      console.log('📋 === API ÇAĞRISI YAPILIYOR ===');
      console.log('👤 User ID:', user.id);
      console.log('🔑 Token mevcut:', !!accessToken);
      console.log('👤 Mevcut user bilgileri:', {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        title: user.title,
        phone: user.phone
      });

      const profileData = await getLecturerProfile(user.id, accessToken);
      
      console.log('✅ === API YANITI ALINDI ===');
      console.log('📊 Ham API Response:', profileData);

      // Profil bilgilerini formatlayarak döndür
      const formattedProfile = {
        id: profileData.id,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        title: profileData.title || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        department_id: profileData.department_id || '',
        profilePhoto: getProfilePhotoUrl(profileData.profile_photo),
        created_at: profileData.created_at || '',
      };
      
      console.log('🔧 === FORMATLANMIŞ PROFIL VERİSİ ===');
      console.log('📊 Formatted Profile:', formattedProfile);

      // Eğer force refresh ise kullanıcı bilgilerini güncelle
      if (forceRefresh) {
        console.log('🔄 Force refresh aktif, kullanıcı bilgileri güncelleniyor...');
        const updatedUser = {
          ...user,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          title: profileData.title,
          email: profileData.email,
          phone: profileData.phone,
        };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('🔄 AuthContext - Kullanıcı bilgileri güncellendi:', updatedUser);
      }

      console.log('✅ === PROFIL BAŞARIYLA DÖNDÜRÜLÜYOR ===');
      return formattedProfile;
    } catch (error) {
      console.error('❌ === PROFIL YÜKLEME HATASI - AuthContext ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Token süresi dolmuşsa refresh token ile yenile
      if (error.message.includes('401') || error.message.includes('token')) {
        try {
          await refreshAccessToken();
          // Tekrar dene
          return await loadUserProfile(forceRefresh);
        } catch (refreshError) {
          console.error('❌ AuthContext - Token yenileme hatası:', refreshError);
          clearSession();
          throw refreshError;
        }
      }
      
      throw error;
    }
  };

  // Access token'ı yenile
  const refreshAccessToken = async () => {
    if (!refreshTokenState) {
      throw new Error('Refresh token bulunamadı');
    }

    try {
      console.log('🔄 AuthContext - Token yenileniyor...');
      const response = await refreshToken(refreshTokenState);
      
      if (response.access) {
        setAccessToken(response.access);
        sessionStorage.setItem('token', response.access);
        console.log('✅ AuthContext - Token başarıyla yenilendi');
        return response.access;
      } else {
        throw new Error('Yeni token alınamadı');
      }
    } catch (error) {
      console.error('❌ AuthContext - Token yenileme hatası:', error);
      // logout fonksiyonu aşağıda tanımlanacak
      throw error;
    }
  };

  // User bilgilerini güncelle (profil fotoğrafı güncellemesi için)
  const updateUser = (updates) => {
    console.log('🔄 AuthContext - User bilgileri güncelleniyor:', updates);
    const updatedUser = {
      ...user,
      ...updates
    };
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ AuthContext - User güncellendi:', updatedUser);
  };

  // Context value
  const value = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    loadUserProfile,
    refreshAccessToken,
    setUser, // Profil güncelleme sonrası kullanıcı bilgilerini güncelleme için
    updateUser, // User bilgilerini güncelleme için
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
