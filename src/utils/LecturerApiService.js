import axios from 'axios';

/**
 * Lecturer API Service
 * ODTÜ Yoklama Backend API entegrasyonu için servis sınıfı
 */
class LecturerApiService {
  constructor() {
    // API base URL ve konfigürasyon
    this.baseURL = 'http://127.0.0.1:8000/lecturer_data';
    
    // Axios instance oluştur
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Session için
      timeout: 10000, // 10 saniye timeout
    });

    // Request interceptor - her istekte çalışır
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - her yanıtta çalışır
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Response Error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Hata yönetimi
   */
  handleError(error) {
    if (error.response) {
      // Server yanıt verdi ama hata kodu döndü
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.detail || 'Geçersiz veri gönderildi');
        case 401:
          return new Error('Yetkilendirme hatası. Lütfen giriş yapın.');
        case 403:
          return new Error('Bu işlem için yetkiniz yok');
        case 404:
          return new Error('Aranan kaynak bulunamadı');
        case 500:
          // 500 hatalarında daha detaylı mesaj ver
          if (data && typeof data === 'string' && data.includes('duplicate key')) {
            return new Error('Bu bilgi zaten kullanımda. Lütfen farklı bir değer deneyin.');
          }
          return new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        default:
          return new Error(data.detail || `HTTP ${status} hatası`);
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      return new Error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
    } else {
      // İstek hazırlanırken hata oluştu
      return new Error(error.message || 'Bilinmeyen bir hata oluştu');
    }
  }

  // ==================== GET ENDPOINTS ====================

  /**
   * Tüm üniversiteleri getir
   */
  async getUniversities() {
    try {
      const response = await this.api.get('/universities/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli üniversitenin fakültelerini getir
   */
  async getFaculties(universityId) {
    try {
      const response = await this.api.get(`/faculties/${universityId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli fakültenin departmanlarını getir
   */
  async getDepartments(facultyId) {
    try {
      const response = await this.api.get(`/departments/${facultyId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli üniversitenin binalarını getir
   */
  async getBuildings(universityId) {
    try {
      const response = await this.api.get(`/buildings/${universityId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli binanın sınıflarını getir
   */
  async getClassrooms(buildingId) {
    try {
      const response = await this.api.get(`/classrooms/${buildingId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli departmanın derslerini getir
   */
  async getLectures(departmentId) {
    try {
      const response = await this.api.get(`/lectures/${departmentId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli dersin section'larını getir
   */
  async getSectionsByLecture(lectureId) {
    try {
      const response = await this.api.get(`/sections/lecture/${lectureId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli section'ın detayını getir
   */
  async getSectionDetail(sectionId) {
    try {
      const response = await this.api.get(`/sections/${sectionId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli section'ın saatlerini getir
   */
  async getHoursBySection(sectionId) {
    try {
      const response = await this.api.get(`/hours/section/${sectionId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Belirli saatin detayını getir
   */
  async getHourDetail(hourId) {
    try {
      const response = await this.api.get(`/hours/${hourId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Öğretmen profil bilgilerini getir
   */
  async getLecturerProfile(lecturerId) {
    try {
      const response = await this.api.get(`/lecturers/${lecturerId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== POST ENDPOINTS ====================

  /**
   * Yeni öğretmen kaydı
   */
  async lecturerSignup(signupData) {
    try {
      const response = await this.api.post('/lecturers/signup/', signupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Öğretmen girişi
   */
  async lecturerLogin(email, password) {
    try {
      const response = await this.api.post('/lecturers/login/', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Öğretmen çıkışı
   */
  async lecturerLogout(email) {
    try {
      const response = await this.api.post('/lecturers/logout/', {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Yeni section oluşturma
   */
  async createSection(lectureId, sectionData) {
    try {
      const response = await this.api.post(`/sections/lecture/${lectureId}/`, sectionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Yeni saat oluşturma
   */
  async createHour(sectionId, hourData) {
    try {
      const response = await this.api.post(`/hours/section/${sectionId}/`, hourData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== PUT ENDPOINTS ====================

  /**
   * Öğretmen profil güncelleme
   */
  async updateLecturerProfile(lecturerId, profileData) {
    try {
      const response = await this.api.put(`/lecturers/${lecturerId}/`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Section güncelleme
   */
  async updateSection(sectionId, sectionData) {
    try {
      const response = await this.api.put(`/sections/${sectionId}/`, sectionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Saat güncelleme
   */
  async updateHour(hourId, hourData) {
    try {
      const response = await this.api.put(`/hours/${hourId}/`, hourData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * API bağlantısını test et
   */
  async testConnection() {
    try {
      const response = await this.api.get('/universities/');
      return { success: true, message: 'API bağlantısı başarılı' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Sistem ID'lerini getir (test için)
   */
  getSystemIds() {
    return {
      university_id: "d4eb3bb2-b63e-4d83-b0e6-a0fe13f512e7",
      faculty_id: "c2b5af33-8904-4a65-928d-8cdfb24efa40",
      department_id: "1599f007-573e-468e-816d-202e5701a8be",
      building_id: "0610400f-fbb6-447e-8f5e-507b962c9145",
      classroom_id: "00528919-0caf-4056-9812-fea1bda7219a",
      lecture_id: "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
      section_id: "18a4581d-c6a9-4cda-9ce3-10af9cd2ddb4",
      hour_id: "0106a87a-6270-4369-b909-ea08061daa30",
      lecturer_id: "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc"
    };
  }

  /**
   * Test kullanıcılarını getir
   */
  getTestUsers() {
    return [
      {
        name: "Prof. Dr. Göktürk Üçoluk",
        email: "ucoluk@ceng.metu.edu.tr",
        password: "ucoluk.1234"
      },
      {
        name: "Prof. Dr. İsmail Şengör Altıngövde",
        email: "altingovde@ceng.metu.edu.tr",
        password: "altingovde.1234"
      },
      {
        name: "Dr. Onur Tolga Şehitoğlu",
        email: "onur@ceng.metu.edu.tr",
        password: "onur.1234"
      },
      {
        name: "Prof. Dr. İsmail Hakkı Toroslu",
        email: "toroslu@ceng.metu.edu.tr",
        password: "toroslu.1234"
      },
      {
        name: "Prof. Dr. Murathan Manguoğlu",
        email: "mangu@ceng.metu.edu.tr",
        password: "mangu.1234"
      },
      {
        name: "Assoc. Prof. Dr. Şeyda Ertekin",
        email: "ertekin@ceng.metu.edu.tr",
        password: "ertekin.1234"
      },
      {
        name: "Prof. Dr. Pınar Karagöz",
        email: "karagoz@ceng.metu.edu.tr",
        password: "karagoz.1234"
      }
    ];
  }

  /**
   * Günleri getir
   */
  getDays() {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }
}

// Singleton instance oluştur
const lecturerApiService = new LecturerApiService();

export default lecturerApiService;