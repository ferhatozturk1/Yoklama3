import React, { createContext, useContext, useState, useEffect } from 'react';
import lecturerApiService from '../utils/LecturerApiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Authentication durumunu kontrol et
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // LocalStorage'dan kullanıcı bilgilerini al
      const savedUser = localStorage.getItem('lecturer_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setError('Kullanıcı durumu kontrol edilemedi');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Kullanıcı girişi
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // API'ye giriş isteği gönder
      const response = await lecturerApiService.lecturerLogin(email, password);
      
      if (response.Message === 'login successful') {
        // Giriş başarılı, kullanıcı bilgilerini al
        // Email'den lecturer ID'sini bulmak için test kullanıcılarını kontrol et
        const testUsers = lecturerApiService.getTestUsers();
        const testUser = testUsers.find(u => u.email === email);
        
        if (testUser) {
          // Test kullanıcısı için mock data
          const userData = {
            id: lecturerApiService.getSystemIds().lecturer_id,
            email: email,
            name: testUser.name,
            title: testUser.name.split(' ')[0] + ' ' + testUser.name.split(' ')[1],
            first_name: testUser.name.split(' ').slice(2, -1).join(' '),
            last_name: testUser.name.split(' ').slice(-1)[0],
            department_id: lecturerApiService.getSystemIds().department_id,
            loginTime: new Date().toISOString()
          };
          
          setUser(userData);
          localStorage.setItem('lecturer_user', JSON.stringify(userData));
          
          return { success: true, user: userData };
        } else {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
      } else {
        throw new Error('Giriş başarısız');
      }
    } catch (error) {
      const errorMessage = error.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Kullanıcı kaydı
   */
  const register = async (signupData) => {
    try {
      setLoading(true);
      setError(null);

      // API'ye kayıt isteği gönder
      const response = await lecturerApiService.lecturerSignup(signupData);
      
      if (response.id) {
        // Kayıt başarılı, otomatik giriş yap
        const userData = {
          id: response.id,
          email: signupData.email,
          name: `${signupData.title} ${signupData.first_name} ${signupData.last_name}`,
          title: signupData.title,
          first_name: signupData.first_name,
          last_name: signupData.last_name,
          department_id: signupData.department_id,
          phone: signupData.phone || null,
          created_at: response.created_at,
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('lecturer_user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        throw new Error('Kayıt başarısız');
      }
    } catch (error) {
      const errorMessage = error.message || 'Kayıt olurken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Kullanıcı çıkışı
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      if (user?.email) {
        // API'ye çıkış isteği gönder
        await lecturerApiService.lecturerLogout(user.email);
      }
      
      // Local state'i temizle
      setUser(null);
      setError(null);
      localStorage.removeItem('lecturer_user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile local state'i temizle
      setUser(null);
      setError(null);
      localStorage.removeItem('lecturer_user');
      
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Kullanıcı profilini güncelle
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      // API'ye profil güncelleme isteği gönder
      const response = await lecturerApiService.updateLecturerProfile(user.id, profileData);
      
      if (response.id) {
        // Güncellenmiş kullanıcı bilgilerini state'e kaydet
        const updatedUser = {
          ...user,
          ...response,
          name: `${response.title} ${response.first_name} ${response.last_name}`,
          email: response.email || user.email
        };
        
        setUser(updatedUser);
        localStorage.setItem('lecturer_user', JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error('Profil güncellenemedi');
      }
    } catch (error) {
      let errorMessage = error.message || 'Profil güncellenirken bir hata oluştu';
      
      // Backend'den gelen özel hata mesajlarını handle et
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        errorMessage = 'Bu e-posta adresi zaten kullanımda. Lütfen farklı bir e-posta adresi deneyin.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hata mesajını temizle
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Kullanıcının giriş yapıp yapmadığını kontrol et
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Kullanıcının belirli bir role sahip olup olmadığını kontrol et
   */
  const hasRole = (role) => {
    if (!user) return false;
    
    // Title'a göre rol kontrolü
    const title = user.title?.toLowerCase() || '';
    
    switch (role) {
      case 'professor':
        return title.includes('prof');
      case 'doctor':
        return title.includes('dr');
      case 'assistant':
        return title.includes('öğr') || title.includes('assist');
      default:
        return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated,
    hasRole,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;