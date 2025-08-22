import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getLecturerProfile, refreshToken, getDepartments, getFaculties, getUniversities } from '../api/auth';
import axios from 'axios';

// JWT token decode helper (sadece payload'ı alır, imza doğrulaması yapmaz)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode hatası:', error);
    return null;
  }
};

// Helper: resolve department id from various shapes
const resolveDepartmentId = (src) => {
  if (!src) return undefined;
  return (
    src.department_id ||
    src.departmentId ||
    (src.department && (typeof src.department === 'string' ? src.department : src.department.id)) ||
    undefined
  );
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

  // De-dupe ve throttle için kullanılan ref'ler
  const isLoadingProfileRef = useRef(false);
  const lastProfileLoadTsRef = useRef(0);
  const lastProfileDataRef = useRef(null);
  const currentProfilePromiseRef = useRef(null);
  const accessTokenRef = useRef(null); // Güncel accessToken'a erişim için
  const PROFILE_THROTTLE_MS = 30_000;

  // Session temizleme helper fonksiyonu
  const clearSession = () => {
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
    if (!photoPath) {
      return null;
    }
    if (photoPath.startsWith('http')) {
      return photoPath;
    }

    const fullUrl = `http://127.0.0.1:8000${photoPath}`;
    return fullUrl;
  };

  // Profil bilgilerini üniversite/fakülte/bölüm bilgileri ile genişlet (basitleştirilmiş)
  const loadEnhancedProfile = async (profileData, currentAccessToken = null) => {
    try {
      console.log('🔍 loadEnhancedProfile - Raw profileData:', profileData);

      let enhancedProfile = { ...profileData };

      // Backend'den gelen university/faculty bilgilerini kontrol et
      const rawUniversity = profileData.university || profileData.school ||
        profileData.university_name || profileData.universityName;
      const rawFaculty = profileData.faculty || profileData.faculty_name ||
        profileData.facultyName;
      const rawDepartment = profileData.department || profileData.department_name ||
        profileData.departmentName;

      console.log('🏛️ University mapping:', {
        original: profileData.university,
        school: profileData.school,
        university_name: profileData.university_name,
        final: rawUniversity
      });

      console.log('🏫 Faculty mapping:', {
        original: profileData.faculty,
        faculty_name: profileData.faculty_name,
        final: rawFaculty
      });

      console.log('🏢 Department mapping:', {
        original: profileData.department,
        department_name: profileData.department_name,
        final: rawDepartment
      });

      // Enhanced profile oluştur
      enhancedProfile.university = rawUniversity || '';
      enhancedProfile.faculty = rawFaculty || '';
      enhancedProfile.department = rawDepartment || '';
      enhancedProfile.department_name = rawDepartment || '';
      enhancedProfile.department_id = profileData.department_id || profileData.departmentId || '';

      console.log('✅ Enhanced profile result:', {
        university: enhancedProfile.university,
        faculty: enhancedProfile.faculty,
        department: enhancedProfile.department,
        department_id: enhancedProfile.department_id
      });

      return enhancedProfile;
    } catch (error) {
      console.error('❌ Profil analizi hatası:', error);
      // Hata durumunda ham profil verisini döndür
      return {
        ...profileData,
        university: profileData.university || profileData.school || '',
        faculty: profileData.faculty || '',
        department: profileData.department || ''
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
        const pendingDepartmentId = sessionStorage.getItem('pendingDepartmentId') || null;

        if (storedToken) {
          setAccessToken(storedToken);
          setRefreshTokenState(storedRefreshToken);

          if (storedUser) {
            // Kullanıcı verisi varsa direkt yükle
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Kullanıcı verisi yoksa token'dan lecturer_id'yi çıkarıp profil getir
            try {
              // JWT token'dan lecturer_id'yi çıkar
              const decodedToken = decodeJWT(storedToken);
              const lecturerId = decodedToken?.lecturer_id;
              const tokenDepartmentId = decodedToken?.department_id;

              if (!lecturerId) {
                console.error('❌ AuthContext - JWT token\'da lecturer_id bulunamadı');
                clearSession();
                return;
              }

              const profileData = await getLecturerProfile(lecturerId, storedToken);

              if (profileData) {
                // Profili ek bilgilerle genişlet (token'ı da geç)
                const enhancedProfile = await loadEnhancedProfile(profileData, storedToken);
                const enhancedDeptId = resolveDepartmentId(enhancedProfile);
                const finalDepartmentId = pendingDepartmentId || tokenDepartmentId || enhancedDeptId;

                const userData = {
                  id: lecturerId,
                  lecturer_id: lecturerId,
                  first_name: enhancedProfile.first_name,
                  last_name: enhancedProfile.last_name,
                  email: enhancedProfile.email,
                  title: enhancedProfile.title,
                  phone: enhancedProfile.phone,
                  department_id: finalDepartmentId, // Token'dan veya profile'dan
                  departmentId: finalDepartmentId, // CamelCase
                  department_name: enhancedProfile.department_name || enhancedProfile.department || '',
                  department: enhancedProfile.department || enhancedProfile.department_name || '',
                  faculty: enhancedProfile.faculty,
                  university: enhancedProfile.university,
                  profile_photo: enhancedProfile.profile_photo,
                };

                setUser(userData);
                setIsAuthenticated(true);

                // SessionStorage'a da kaydet
                sessionStorage.setItem('user', JSON.stringify(userData));
                if (pendingDepartmentId) sessionStorage.removeItem('pendingDepartmentId');
              } else {
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

  // AccessToken değiştiğinde ref'i güncelle
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Otomatik token yenileme mekanizması
  useEffect(() => {
    if (!accessToken || !refreshTokenState) return;

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });

      failedQueue = [];
    };

    // Request interceptor - her istekte token ekle
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = accessTokenRef.current;
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - 401 hatalarında token yenile
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // Zaten yenileme yapılıyorsa kuyruğa ekle
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            console.log('🔄 Axios: Token süresi doldu, yenileniyor...');

            // refreshAccessToken fonksiyonunu çağır
            const response = await refreshToken(refreshTokenState);

            if (response.access) {
              const newToken = response.access;
              setAccessToken(newToken);
              sessionStorage.setItem('token', newToken);
              accessTokenRef.current = newToken;

              console.log('✅ Axios: Token başarıyla yenilendi');
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              throw new Error('Yeni token alınamadı');
            }
          } catch (refreshError) {
            console.error('❌ Axios: Token yenileme başarısız, kullanıcı çıkış yapılıyor');
            processQueue(refreshError, null);
            clearSession();
            // Kullanıcıyı login sayfasına yönlendir
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshTokenState]); // accessToken ve refreshToken değiştiğinde yeniden kur

  // Global fetch override - fetch kullanan yerler için otomatik token yenileme
  useEffect(() => {
    const originalFetch = window.fetch;
    let isRefreshingFetch = false;
    let fetchFailedQueue = [];

    const processFetchQueue = (error, token = null) => {
      fetchFailedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });

      fetchFailedQueue = [];
    };

    window.fetch = async (url, options = {}) => {
      // İlk istekte token ekle
      const token = accessTokenRef.current;
      if (token && !options.headers?.Authorization) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      try {
        const response = await originalFetch(url, options);

        // 401 hatası varsa token yenile
        if (response.status === 401 && !options._retry) {
          if (isRefreshingFetch) {
            // Zaten yenileme yapılıyorsa kuyruğa ekle
            return new Promise((resolve, reject) => {
              fetchFailedQueue.push({ resolve, reject });
            }).then(newToken => {
              options.headers.Authorization = `Bearer ${newToken}`;
              options._retry = true;
              return originalFetch(url, options);
            });
          }

          isRefreshingFetch = true;

          try {
            console.log('🔄 Fetch: Token süresi doldu, yenileniyor...');
            const newToken = await refreshAccessToken();
            processFetchQueue(null, newToken);

            // Yeni token ile tekrar dene
            options.headers.Authorization = `Bearer ${newToken}`;
            options._retry = true;
            return originalFetch(url, options);
          } catch (refreshError) {
            console.error('❌ Fetch: Token yenileme başarısız');
            processFetchQueue(refreshError, null);
            clearSession();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw refreshError;
          } finally {
            isRefreshingFetch = false;
          }
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, [accessToken, refreshTokenState]);

  // Login fonksiyonu
  const login = async (loginData) => {
    try {
      console.log('🔐 AuthContext - Login işlemi başlatılıyor:', loginData);

      let token = null;
      let lecturerId = null;
      const pendingDepartmentId = sessionStorage.getItem('pendingDepartmentId') || null;

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
        console.log('📋 AuthContext - Lecturer ID (loginData\'dan):', lecturerId);
      } else if (loginData.lecturer) {
        lecturerId = loginData.lecturer.id;
        console.log('📋 AuthContext - Lecturer ID (lecturer obj\'den):', lecturerId);
      } else if (token) {
        // Token'dan lecturer_id'yi çıkar
        console.log('🔍 AuthContext - Token\'dan lecturer_id çıkarılıyor...');
        try {
          const decodedToken = decodeJWT(token);
          console.log('🔍 === JWT TOKEN DECODE EDİLDİ ===');
          console.log('📋 Decoded Token:', decodedToken);
          console.log('👤 Lecturer ID (token):', decodedToken?.lecturer_id || decodedToken?.lecturerId);
          console.log('🏢 Department ID (token):', decodedToken?.department_id || decodedToken?.departmentId);
          console.log('📧 Email (token):', decodedToken?.email);
          console.log('⏰ Token expiry:', decodedToken?.exp ? new Date(decodedToken.exp * 1000) : 'YOK');
          console.log('🔍 === JWT TOKEN DECODE BİTİŞ ===');

          lecturerId = decodedToken?.lecturer_id || decodedToken?.lecturerId;
          if (lecturerId) {
            console.log('✅ AuthContext - Token\'dan lecturer_id alındı:', lecturerId);

            // Department ID varsa onu da al
            if (decodedToken?.department_id || decodedToken?.departmentId) {
              const tokenDept = decodedToken.department_id || decodedToken.departmentId;
              console.log('✅ AuthContext - Token\'dan department id alındı:', tokenDept);
              // LoginData'ya ekle ki profile çekerken kullanabilelim
              loginData.department_id = tokenDept;
              loginData.departmentId = tokenDept;
            } else {
              console.warn('⚠️ AuthContext - Token\'da department id bulunamadı');
            }
          } else {
            console.error('❌ AuthContext - Token\'da lecturer_id bulunamadı');
          }
        } catch (decodeError) {
          console.error('❌ AuthContext - JWT decode hatası:', decodeError);
        }
      }

      // Eğer lecturer_id varsa profil bilgilerini çek
      if (lecturerId && token) {
        try {
          const profileData = await getLecturerProfile(lecturerId, token);

          if (profileData) {
            // Profili ek bilgilerle genişlet (token'ı da geç)
            const enhancedProfile = await loadEnhancedProfile(profileData, token);
            // Department ID prioritesi: loginData > token > enhanced/profile shapes
            const enhancedDeptId = resolveDepartmentId(enhancedProfile);
            // Öncelik: pendingDepartmentId > loginData > token > enhanced
            const finalDepartmentId = pendingDepartmentId || loginData.department_id || loginData.departmentId || enhancedDeptId;

            console.log('🔧 === LOGIN - DEPARTMENT ID PRİORİTE SEÇİMİ ===');
            console.log('🏢 LoginData\'dan department_id:', loginData.department_id);
            console.log('🏢 Profile\'dan department_id:', enhancedProfile.department_id);
            console.log('🏢 PendingDepartmentId:', pendingDepartmentId);
            console.log('✅ Final department_id:', finalDepartmentId);
            console.log('🔧 === LOGIN - DEPARTMENT ID PRİORİTE BİTİŞ ===');

            const userData = {
              id: lecturerId,
              lecturer_id: lecturerId,
              first_name: enhancedProfile.first_name,
              last_name: enhancedProfile.last_name,
              email: enhancedProfile.email,
              title: enhancedProfile.title,
              phone: enhancedProfile.phone,
              department_id: finalDepartmentId, // Prioriteli department_id
              departmentId: finalDepartmentId, // CamelCase
              department_name: enhancedProfile.department_name || enhancedProfile.department || '',
              department: enhancedProfile.department || enhancedProfile.department_name || '',
              faculty: enhancedProfile.faculty,
              university: enhancedProfile.university,
              profile_photo: enhancedProfile.profile_photo,
            };

            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
            if (pendingDepartmentId) sessionStorage.removeItem('pendingDepartmentId');
          } else {
            // Profil çekilemezse en azından lecturer_id'yi kaydet
            const userData = {
              id: lecturerId,
              lecturer_id: lecturerId,
            };
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
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
  const loadUserProfile = useCallback(async (forceRefresh = false, retryCount = 0) => {
    if (!user || !accessToken) {
      return null;
    }

    // Aynı anda birden fazla çağrıyı birleştir (de-dupe)
    if (!forceRefresh && currentProfilePromiseRef.current) {
      return currentProfilePromiseRef.current;
    }

    // Throttle: çok sık çağrıları engelle (son 30 sn içinde çağrıldıysa önbelleği döndür)
    const now = Date.now();
    if (!forceRefresh && now - lastProfileLoadTsRef.current < PROFILE_THROTTLE_MS && lastProfileDataRef.current) {
      console.log('⏱️ Throttle aktif - önbellekteki profil verisi döndürülüyor');
      return lastProfileDataRef.current;
    }

    try {
      isLoadingProfileRef.current = true;
      const fetchPromise = (async () => {
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

        const profileData = await getLecturerProfile(user.id, accessTokenRef.current || accessToken);
        console.log('✅ === API YANITI ALINDI ===');
        console.log('📊 Ham API Response:', profileData);

        // Profil bilgilerini ek bilgilerle genişlet
        let enhancedProfile = profileData;
        try {
          enhancedProfile = await loadEnhancedProfile(profileData, accessTokenRef.current || accessToken);
        } catch (enhanceError) {
          // Hata olursa normal profil verisini kullan
          enhancedProfile = profileData;
        }

        const deptId = resolveDepartmentId(enhancedProfile);
        // Profil bilgilerini formatlayarak döndür
        const formattedProfile = {
          id: enhancedProfile.id,
          name: `${enhancedProfile.first_name || ''} ${enhancedProfile.last_name || ''}`.trim(),
          firstName: enhancedProfile.first_name || '',
          lastName: enhancedProfile.last_name || '',
          title: enhancedProfile.title || '',
          email: enhancedProfile.email || '',
          phone: enhancedProfile.phone || '',
          department_id: deptId || '',
          departmentId: deptId || '',
          departmentName: enhancedProfile.department_name || enhancedProfile.department || '',
          profilePhoto: getProfilePhotoUrl(enhancedProfile.profile_photo),
          created_at: enhancedProfile.created_at || '',
          university: enhancedProfile.university || '',
          universityName: enhancedProfile.university || '',
          faculty: enhancedProfile.faculty || '',
          facultyName: enhancedProfile.faculty || '',
          department: enhancedProfile.department || '',
        };

        console.log('🔧 === FORMATLANMIŞ PROFIL VERİSİ ===');
        console.log('📊 Formatted Profile:', formattedProfile);

        // Kullanıcı güncellemesini yalnızca gerçekten ihtiyaç varsa yap
        const needsUpdate = (
          forceRefresh ||
          !user.university ||
          !user.faculty ||
          !user.department ||
          user.first_name !== enhancedProfile.first_name ||
          user.last_name !== enhancedProfile.last_name ||
          user.title !== enhancedProfile.title ||
          user.email !== enhancedProfile.email ||
          user.phone !== enhancedProfile.phone ||
          user.department_id !== deptId ||
          user.departmentId !== deptId ||
          user.department_name !== enhancedProfile.department_name ||
          user.department !== enhancedProfile.department
        );

        if (needsUpdate) {
          console.log('🔄 === KULLANICI BİLGİLERİ GÜNCELLENİYOR ===');
          const updatedUser = {
            ...user,
            first_name: enhancedProfile.first_name,
            last_name: enhancedProfile.last_name,
            title: enhancedProfile.title,
            email: enhancedProfile.email,
            phone: enhancedProfile.phone,
            department_id: deptId,
            departmentId: deptId,
            department_name: enhancedProfile.department_name || enhancedProfile.department || '',
            department: enhancedProfile.department || enhancedProfile.department_name || '',
            university: enhancedProfile.university,
            universityName: enhancedProfile.university,
            faculty: enhancedProfile.faculty,
            facultyName: enhancedProfile.faculty,
          };
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('✅ AuthContext - Kullanıcı bilgileri güncellendi:', updatedUser);
        }

        // Throttle önbelleğini güncelle
        lastProfileLoadTsRef.current = Date.now();
        lastProfileDataRef.current = formattedProfile;
        return formattedProfile;
      })();

      currentProfilePromiseRef.current = fetchPromise;
      const result = await fetchPromise;
      return result;
    } catch (error) {
      console.error('❌ === PROFIL YÜKLEME HATASI - AuthContext ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Token süresi dolmuşsa refresh token ile yenile (max 1 defa)
      if ((error.message.includes('401') || error.message.includes('token')) && retryCount === 0) {
        try {
          await refreshAccessToken();
          // Tekrar dene (sadece bir kez)
          return await loadUserProfile(forceRefresh, retryCount + 1);
        } catch (refreshError) {
          console.error('❌ AuthContext - Token yenileme hatası:', refreshError);
          clearSession();
          throw refreshError;
        }
      }

      throw error;
    } finally {
      isLoadingProfileRef.current = false;
      currentProfilePromiseRef.current = null;
    }
  }, []); // Sadece mount olduğunda çalışır, token refresh döngüsünden kaçınır

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
    // department id normalize et
    const normalizedDeptId = resolveDepartmentId(updatedUser);
    if (normalizedDeptId) {
      updatedUser.department_id = normalizedDeptId;
      updatedUser.departmentId = normalizedDeptId;
    }
    // department_name normalize et
    if (!updatedUser.department_name && updatedUser.department) {
      updatedUser.department_name = updatedUser.department;
    }
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
