import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLecturerProfile, refreshToken } from '../api/auth';

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
            // Kullanıcı verisi yoksa token ile profili getir
            console.log('🔄 AuthContext - Token var ama kullanıcı verisi yok, profil getiriliyor...');
            try {
              const profileData = await getLecturerProfile(storedToken);
              if (profileData) {
                const userData = {
                  id: profileData.id,
                  first_name: profileData.first_name,
                  last_name: profileData.last_name,
                  email: profileData.email,
                  title: profileData.title,
                  phone: profileData.phone,
                  department_id: profileData.department_id,
                  profile_photo: profileData.profile_photo,
                };
                
                setUser(userData);
                setIsAuthenticated(true);
                
                // SessionStorage'a da kaydet
                sessionStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ AuthContext - Profil token ile yüklendi:', userData);
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

      // Session'a kullanıcı bilgilerini kaydet
      if (loginData.lecturer) {
        const userData = loginData.lecturer;
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        console.log('👤 AuthContext - Kullanıcı bilgileri kaydedildi:', userData);
      }

      // Token'ları kaydet
      if (loginData.access || loginData.token) {
        const token = loginData.access || loginData.token;
        setAccessToken(token);
        sessionStorage.setItem('token', token);
        console.log('🔑 AuthContext - Access token kaydedildi');
      }

      if (loginData.refresh) {
        setRefreshTokenState(loginData.refresh);
        sessionStorage.setItem('refreshToken', loginData.refresh);
        console.log('🔄 AuthContext - Refresh token kaydedildi');
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
    if (!user || !accessToken) {
      console.warn('⚠️ AuthContext - Kullanıcı veya token bilgisi eksik');
      return null;
    }

    try {
      console.log('📋 AuthContext - Profil bilgileri yükleniyor...');
      console.log('User ID:', user.id);
      console.log('Token var:', !!accessToken);

      const profileData = await getLecturerProfile(user.id, accessToken);
      console.log('✅ AuthContext - Profil bilgileri API\'den alındı:', profileData);

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
        profilePhoto: profileData.profile_photo || null,
        created_at: profileData.created_at || '',
      };

      // Eğer force refresh ise kullanıcı bilgilerini güncelle
      if (forceRefresh) {
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
        console.log('🔄 AuthContext - Kullanıcı bilgileri güncellendi');
      }

      return formattedProfile;
    } catch (error) {
      console.error('❌ AuthContext - Profil yükleme hatası:', error);
      
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
