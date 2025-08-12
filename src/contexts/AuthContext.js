import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  const PROFILE_THROTTLE_MS = 30_000;

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
  const loadEnhancedProfile = async (profileData, currentAccessToken = null) => {
    console.log('🚀 === RAW PROFILE DATA ANALIZI ===');
    console.log('📊 Backend\'den gelen ham veri:', profileData);
    console.log('🔑 Current Access Token mevcut:', !!currentAccessToken);
    
    try {
      let enhancedProfile = { ...profileData };
      
      // Department ID kontrolü
      console.log('🔍 === KULLANICININ GERÇEK KAYIT BİLGİLERİ ===');
      console.log('🆔 User ID:', profileData.id);
      console.log('� First Name:', profileData.first_name);
      console.log('� Last Name:', profileData.last_name);
      console.log('� Email:', profileData.email);
      console.log('🏢 Department ID:', profileData.department_id);
      console.log('🏫 University (from backend):', profileData.university);
      console.log('🏛️ Faculty (from backend):', profileData.faculty);
      console.log('🏢 Department (from backend):', profileData.department);
      console.log('� === GERÇEK KAYIT BİLGİLERİ SONU ===')
      
      let foundInfo = null;
      
      if (profileData.department_id) {
        console.log('✅ AuthContext - Department ID BULUNDU! Ek bilgiler çekiliyor:', profileData.department_id);
        
        try {
          console.log('🔍 AuthContext - Backend\'den üniversite/fakülte/bölüm bilgileri aranıyor...');
          // 1. Tüm üniversiteleri al (auth.js fonksiyonunu kullan)
          console.log('🔍 AuthContext - getUniversities() çağrılıyor...');
          const universities = await getUniversities();
          console.log('✅ AuthContext - Üniversiteler API yanıtı:', universities);
          console.log('📊 Üniversite sayısı:', universities?.length || 0);
          console.log('🔍 Üniversite türü:', typeof universities);
          console.log('🔍 Array mi?:', Array.isArray(universities));

          // Üniversite array'inin dolu olup olmadığını kontrol et
          if (!universities || universities.length === 0) {
            console.error('❌ AuthContext - ÜNİVERSİTE LİSTESİ BOŞ VEYA HATA!');
            throw new Error('Üniversite listesi alınamadı');
          }

          // 2. Her üniversite için fakültelerini kontrol et
          for (const university of universities) {
            if (foundInfo) break;
            try {
              const faculties = await getFaculties(university.id);
              if (!faculties || faculties.length === 0) continue;
              // 3. Her fakülte için bölümleri kontrol et
              for (const faculty of faculties) {
                if (foundInfo) break;
                try {
                  const departments = await getDepartments(faculty.id);
                  if (!departments || departments.length === 0) continue;

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
                    break;
                  }
                } catch {}
              }
            } catch {}
          }

          if (foundInfo) {
            enhancedProfile.university = foundInfo.university;
            enhancedProfile.faculty = foundInfo.faculty;
            enhancedProfile.department = foundInfo.department;
            enhancedProfile.department_name = foundInfo.department;
            enhancedProfile.university_id = foundInfo.university_id;
            enhancedProfile.faculty_id = foundInfo.faculty_id;
            enhancedProfile.department_id = foundInfo.department_id;
          }
        } catch (apiError) {
          console.error('❌ ===== API ÇAĞRISI HATASI =====');
          console.error('❌ AuthContext - API çağrısı hatası:', apiError);
          // API hatası durumunda boş değerler
          enhancedProfile.university = '';
          enhancedProfile.faculty = '';
          enhancedProfile.department = '';
        }
      } else {
        // Department_id yoksa backend'den gelen ham veriyi kullan
        console.warn('⚠️ === DEPARTMENT ID YOK - HAM VERİ KULLANILIYOR ===');
        enhancedProfile.university = profileData.university || '';
        enhancedProfile.faculty = profileData.faculty || '';
        enhancedProfile.department = profileData.department || profileData.department_name || '';
        enhancedProfile.department_name = profileData.department_name || profileData.department || '';

        // Yalnızca departman adı varsa üniversite/fakülte/department_id'yi isimden çöz
        try {
          const targetDeptName = (enhancedProfile.department_name || enhancedProfile.department || '').toLowerCase();
          if (targetDeptName) {
            const universities = await getUniversities();
            for (const uni of (universities || [])) {
              const faculties = await getFaculties(uni.id);
              for (const fac of (faculties || [])) {
                const departments = await getDepartments(fac.id);
                const match = (departments || []).find(d => String(d.name).toLowerCase() === targetDeptName);
                if (match) {
                  enhancedProfile.university = enhancedProfile.university || uni.name;
                  enhancedProfile.faculty = enhancedProfile.faculty || fac.name;
                  enhancedProfile.department = match.name;
                  enhancedProfile.department_name = match.name;
                  enhancedProfile.department_id = enhancedProfile.department_id || match.id;
                  break;
                }
              }
              if (enhancedProfile.department_id) break;
            }
          }
        } catch {}
      }
      
      // Department ID'yi garanti altına al
      const candidateDepartmentId = profileData.department_id
        || (profileData.department && profileData.department.id)
        || (foundInfo && foundInfo.department_id)
        || enhancedProfile.department_id
        || resolveDepartmentId(profileData);
      if (!enhancedProfile.department_id && candidateDepartmentId) {
        enhancedProfile.department_id = candidateDepartmentId;
        console.log('🔧 AuthContext - department_id set edildi:', enhancedProfile.department_id);
      }
      
      // University ID'yi garanti altına al
      if (!enhancedProfile.university_id && enhancedProfile.department_id) {
        console.log('🔍 AuthContext - University ID eksik, department_id\'den çözmeye çalışılıyor...');
        try {
          const universities = await getUniversities();
          for (const university of (universities || [])) {
            const faculties = await getFaculties(university.id);
            for (const faculty of (faculties || [])) {
              const departments = await getDepartments(faculty.id);
              const matchDept = (departments || []).find(d => d.id === enhancedProfile.department_id);
              if (matchDept) {
                enhancedProfile.university_id = university.id;
                enhancedProfile.faculty_id = faculty.id;
                console.log('✅ AuthContext - University ID çözüldü:', university.id);
                break;
              }
            }
            if (enhancedProfile.university_id) break;
          }
        } catch (resolveError) {
          console.warn('⚠️ AuthContext - University ID çözülemedi:', resolveError);
        }
      }
      
      console.log('🏁 === HAM VERİ ANALİZİ TAMAMLANDI ===');
      console.log('📊 Final Enhanced Profile:', {
        id: enhancedProfile.id,
        first_name: enhancedProfile.first_name,
        last_name: enhancedProfile.last_name,
        email: enhancedProfile.email,
        department_id: enhancedProfile.department_id,
        department_name: enhancedProfile.department_name || enhancedProfile.department,
        university: enhancedProfile.university,
        university_id: enhancedProfile.university_id,
        faculty: enhancedProfile.faculty,
        faculty_id: enhancedProfile.faculty_id,
        department: enhancedProfile.department
      });
      console.log('🏁 ================================');
      
      return enhancedProfile;
    } catch (error) {
      console.error('❌ === PROFIL ANALİZİ HATASI ===');
      console.error('❌ Error:', error);
      console.error('❌ Stack:', error.stack);
      // Hata durumunda ham profil verisini döndür
      return {
        ...profileData,
        university: profileData.university || '',
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

        console.log('🔍 AuthContext - SessionStorage verileri kontrol ediliyor:');
        console.log('User:', storedUser);
        console.log('Token:', storedToken);
        console.log('RefreshToken:', storedRefreshToken);
        console.log('PendingDepartmentId:', pendingDepartmentId);

        if (storedToken) {
          setAccessToken(storedToken);
          setRefreshTokenState(storedRefreshToken);

          if (storedUser) {
            // Kullanıcı verisi varsa direkt yükle
            const userData = JSON.parse(storedUser);
            console.log('🔍 === SESSIONSTORE USER DETAYLI ANALİZ ===');
            console.log('👤 userData.id:', userData.id);
            console.log('🏢 userData.department_id:', userData.department_id);
            console.log('🏫 userData.university:', userData.university);
            console.log('🏛️ userData.faculty:', userData.faculty);
            console.log('🏢 userData.department:', userData.department);
            console.log('📧 userData.email:', userData.email);
            console.log('🔍 === SESSIONSTORE USER ANALİZ BİTİŞ ===');
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ AuthContext - Kullanıcı oturumu yüklendi:', userData);
          } else {
            // Kullanıcı verisi yoksa token'dan lecturer_id'yi çıkarıp profil getir
            console.log('🔄 AuthContext - Token var ama kullanıcı verisi yok, profil getiriliyor...');
            try {
              // JWT token'dan lecturer_id'yi çıkar
              const decodedToken = decodeJWT(storedToken);
              console.log('🔍 === SESSION LOAD - JWT TOKEN DECODE ===');
              console.log('📋 Decoded Token:', decodedToken);
              console.log('👤 Lecturer ID (token):', decodedToken?.lecturer_id);
              console.log('🏢 Department ID (token):', decodedToken?.department_id);
              console.log('📧 Email (token):', decodedToken?.email);
              console.log('⏰ Token expiry:', decodedToken?.exp ? new Date(decodedToken.exp * 1000) : 'YOK');
              console.log('🔍 === SESSION LOAD - JWT TOKEN DECODE BİTİŞ ===');
              
              const lecturerId = decodedToken?.lecturer_id;
              const tokenDepartmentId = decodedToken?.department_id;
              
              if (!lecturerId) {
                console.error('❌ AuthContext - JWT token\'da lecturer_id bulunamadı');
                clearSession();
                return;
              }
              
              console.log('📋 AuthContext - Session Load - Lecturer ID bulundu:', lecturerId);
              if (tokenDepartmentId) {
                console.log('📋 AuthContext - Session Load - Department ID (token\'dan):', tokenDepartmentId);
              } else {
                console.warn('⚠️ AuthContext - Session Load - Token\'da department_id yok');
              }
              const profileData = await getLecturerProfile(lecturerId, storedToken);
              
              if (profileData) {
                // Profili ek bilgilerle genişlet (token'ı da geç)
                const enhancedProfile = await loadEnhancedProfile(profileData, storedToken);
                const enhancedDeptId = resolveDepartmentId(enhancedProfile);
                const finalDepartmentId = pendingDepartmentId || tokenDepartmentId || enhancedDeptId;
                
                console.log('🔧 === DEPARTMENT ID PRİORİTE SEÇİMİ ===');
                console.log('🏢 Token\'dan department_id:', tokenDepartmentId);
                console.log('🏢 Profile\'dan department_id:', enhancedProfile.department_id);
                console.log('🏢 PendingDepartmentId:', pendingDepartmentId);
                console.log('✅ Final department_id:', finalDepartmentId);
                console.log('🔧 === DEPARTMENT ID PRİORİTE BİTİŞ ===');
                
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
        console.log('📋 AuthContext - Profil bilgileri çekiliyor...', lecturerId);
        
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
  const loadUserProfile = useCallback(async (forceRefresh = false) => {
    console.log('🔄 === AUTHCONTEXT LOAD USER PROFILE BAŞLIYOR ===');
    console.log('📊 Parametreler:', { forceRefresh });

    if (!user || !accessToken) {
      console.warn('⚠️ === EKSIK BİLGİLER - AuthContext ===');
      console.warn('👤 User mevcut:', !!user);
      console.warn('🔑 AccessToken mevcut:', !!accessToken);
      console.warn('👤 User detay:', user);
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

        const profileData = await getLecturerProfile(user.id, accessToken);
        console.log('✅ === API YANITI ALINDI ===');
        console.log('📊 Ham API Response:', profileData);

        // Profil bilgilerini ek bilgilerle genişlet
        let enhancedProfile = profileData;
        try {
          console.log('🔄 AuthContext - Profil ek bilgilerle genişletiliyor...');
          enhancedProfile = await loadEnhancedProfile(profileData, accessToken);
          console.log('✅ AuthContext - Enhanced profile oluşturuldu:', {
            university: enhancedProfile.university,
            faculty: enhancedProfile.faculty,
            department: enhancedProfile.department
          });
        } catch (enhanceError) {
          console.warn('⚠️ AuthContext - Profil genişletme hatası:', enhanceError.message);
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

      // Token süresi dolmuşsa refresh token ile yenile
      if (error.message.includes('401') || error.message.includes('token')) {
        try {
          await refreshAccessToken();
          // Tekrar dene (forceRefresh devre dışı, çünkü zaten yenilendi)
          return await loadUserProfile(forceRefresh);
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
  }, [user?.id, accessToken]);

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
