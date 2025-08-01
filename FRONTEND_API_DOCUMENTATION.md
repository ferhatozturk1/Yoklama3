# 🎓 ODTÜ Yoklama Backend API Dokümantasyonu
## Frontend Geliştirme Rehberi

---

## 🚀 **Hızlı Başlangıç**

### **Server Bilgileri**
- **Base URL:** `http://127.0.0.1:8000`
- **API Prefix:** `lecturer_data`
- **Port:** `8000` (Açık kalacak)
- **Protocol:** HTTP
- **Content-Type:** `application/json`

### **Server Başlatma**
```bash
cd yoklama_backend
py manage.py runserver
```

---

## 🔐 **Güvenlik ve CORS**

### **CORS Ayarları**
- ✅ Tüm origin'lere açık (development için)
- ✅ CSRF koruması kapatıldı (API için)
- ✅ Credentials destekleniyor

### **Authentication**
- Session-based authentication
- Login/Logout endpoint'leri mevcut
- Şifre validation yok (frontend'de yapılabilir)

---

## 📋 **Tüm API Endpoint'leri**

### **🏫 GET Endpoints (Veri Çekme)**

#### **1. Üniversiteler**
```javascript
GET http://127.0.0.1:8000/lecturer_data/universities/

Response: [
  {
    "id": "d4eb3bb2-b63e-4d83-b0e6-a0fe13f512e7",
    "name": "Orta Doğu Tekni̇k Üni̇versi̇tesi̇"
  }
]
```

#### **2. Fakülteler**
```javascript
GET http://127.0.0.1:8000/lecturer_data/faculties/{university_id}/

Response: [
  {
    "id": "c2b5af33-8904-4a65-928d-8cdfb24efa40",
    "name": "Mühendislik Fakültesi",
    "university": {
      "id": "d4eb3bb2-b63e-4d83-b0e6-a0fe13f512e7",
      "name": "Orta Doğu Tekni̇k Üni̇versi̇tesi̇"
    }
  }
]
```

#### **3. Departmanlar**
```javascript
GET http://127.0.0.1:8000/lecturer_data/departments/{faculty_id}/

Response: [
  {
    "id": "1599f007-573e-468e-816d-202e5701a8be",
    "name": "Bilgisayar Mühendisliği (İngilizce)",
    "faculty": {
      "id": "c2b5af33-8904-4a65-928d-8cdfb24efa40",
      "name": "Mühendislik Fakültesi",
      "university": {
        "id": "d4eb3bb2-b63e-4d83-b0e6-a0fe13f512e7",
        "name": "Orta Doğu Tekni̇k Üni̇versi̇tesi̇"
      }
    }
  }
]
```

#### **4. Binalar**
```javascript
GET http://127.0.0.1:8000/lecturer_data/buildings/{university_id}/

Response: [
  {
    "id": "0610400f-fbb6-447e-8f5e-507b962c9145",
    "name": "B Blok",
    "department": {
      "id": "1599f007-573e-468e-816d-202e5701a8be",
      "name": "Bilgisayar Mühendisliği (İngilizce)",
      "faculty": {...},
      "university": {...}
    },
    "faculty": {...},
    "university": {...}
  }
]
```

#### **5. Sınıflar**
```javascript
GET http://127.0.0.1:8000/lecturer_data/classrooms/{building_id}/

Response: [
  {
    "id": "00528919-0caf-4056-9812-fea1bda7219a",
    "name": "YP-D103",
    "building": {
      "id": "0610400f-fbb6-447e-8f5e-507b962c9145",
      "name": "B Blok",
      "department": {...},
      "faculty": {...},
      "university": {...}
    },
    "class_location": {}
  }
]
```

#### **6. Dersler**
```javascript
GET http://127.0.0.1:8000/lecturer_data/lectures/{department_id}/

Response: [
  {
    "id": "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
    "name": "CENG",
    "code": "229",
    "explicit_name": "C Programming",
    "department": {
      "id": "1599f007-573e-468e-816d-202e5701a8be",
      "name": "Bilgisayar Mühendisliği (İngilizce)",
      "faculty": {...}
    }
  }
]
```

#### **7. Section'lar (Belirli Ders)**
```javascript
GET http://127.0.0.1:8000/lecturer_data/sections/lecture/{lecture_id}/

Response: [
  {
    "id": "18a4581d-c6a9-4cda-9ce3-10af9cd2ddb4",
    "section_number": "1",
    "lecture_id": "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
    "lecturer_id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc",
    "lecture": {...},
    "lecturer": {
      "id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc",
      "title": "Dr.",
      "first_name": "Test",
      "last_name": "Lecturer",
      "email": "test@metu.edu.tr",
      "department_id": "1599f007-573e-468e-816d-202e5701a8be",
      "phone": null,
      "profile_photo": null,
      "created_at": "2025-08-01T11:45:10.193091+03:00"
    }
  }
]
```

#### **8. Section Detayı**
```javascript
GET http://127.0.0.1:8000/lecturer_data/sections/{section_id}/
// Yukarıdaki ile aynı format, tek section döner
```

#### **9. Saatler (Section'a Göre)**
```javascript
GET http://127.0.0.1:8000/lecturer_data/hours/section/{section_id}/

Response: [
  {
    "id": "0106a87a-6270-4369-b909-ea08061daa30",
    "order": "1",
    "day": "Monday",
    "time_start": "09:40:00",
    "time_end": "10:30:00",
    "section_id": "18a4581d-c6a9-4cda-9ce3-10af9cd2ddb4",
    "classroom_id": "00528919-0caf-4056-9812-fea1bda7219a",
    "section": {...},
    "classroom": {...}
  }
]
```

#### **10. Saat Detayı**
```javascript
GET http://127.0.0.1:8000/lecturer_data/hours/{hour_id}/
// Yukarıdaki ile aynı format, tek saat döner
```

#### **11. Öğretmen Profili**
```javascript
GET http://127.0.0.1:8000/lecturer_data/lecturers/{lecturer_id}/

Response: {
  "id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc",
  "title": "Dr.",
  "first_name": "Test",
  "last_name": "Lecturer",
  "email": "test@metu.edu.tr",
  "department_id": "1599f007-573e-468e-816d-202e5701a8be",
  "phone": null,
  "profile_photo": null,
  "created_at": "2025-08-01T11:45:10.193091+03:00"
}
```

---

### **📝 POST Endpoints (Veri Oluşturma)**

#### **12. Öğretmen Kayıt**
```javascript
POST http://127.0.0.1:8000/lecturer_data/lecturers/signup/
Content-Type: application/json

Body: {
  "title": "Dr.",
  "first_name": "Ad",
  "last_name": "Soyad",
  "email": "email@metu.edu.tr",
  "department_id": "1599f007-573e-468e-816d-202e5701a8be",
  "password": "şifre123"
}

Response: {
  "id": "yeni-uuid",
  "title": "Dr.",
  "first_name": "Ad",
  "last_name": "Soyad",
  "department_id": "1599f007-573e-468e-816d-202e5701a8be",
  "created_at": "2025-08-01T12:00:00.000000+03:00"
}
```

#### **13. Öğretmen Giriş**
```javascript
POST http://127.0.0.1:8000/lecturer_data/lecturers/login/
Content-Type: application/json

Body: {
  "email": "email@metu.edu.tr",
  "password": "şifre123"
}

Response: {
  "Message": "login successful"
}
```

#### **14. Öğretmen Çıkış**
```javascript
POST http://127.0.0.1:8000/lecturer_data/lecturers/logout/
Content-Type: application/json

Body: {
  "email": "email@metu.edu.tr"
}

Response: {
  "message": "Logged out successfully"
}
```

#### **15. Section Oluşturma**
```javascript
POST http://127.0.0.1:8000/lecturer_data/sections/lecture/{lecture_id}/
Content-Type: application/json

Body: {
  "section_number": "3",
  "lecture_id": "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
  "lecturer_id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc"
}

Response: {
  "id": "yeni-uuid",
  "section_number": "3",
  "lecture_id": "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
  "lecturer_id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc",
  "lecture": {...},
  "lecturer": {...}
}
```

#### **16. Saat Oluşturma**
```javascript
POST http://127.0.0.1:8000/lecturer_data/hours/section/{section_id}/
Content-Type: application/json

Body: {
  "order": "1",
  "day": "Monday",
  "time_start": "09:40",
  "time_end": "10:30",
  "section_id": "18a4581d-c6a9-4cda-9ce3-10af9cd2ddb4",
  "classroom_id": "00528919-0caf-4056-9812-fea1bda7219a"
}

Response: {
  "id": "yeni-uuid",
  "order": "1",
  "day": "Monday",
  "time_start": "09:40:00",
  "time_end": "10:30:00",
  "section_id": "18a4581d-c6a9-4cda-9ce3-10af9cd2ddb4",
  "classroom_id": "00528919-0caf-4056-9812-fea1bda7219a",
  "section": {...},
  "classroom": {...}
}
```

---

### **✏️ PUT Endpoints (Veri Güncelleme)**

#### **17. Öğretmen Profil Güncelleme**
```javascript
PUT http://127.0.0.1:8000/lecturer_data/lecturers/{lecturer_id}/
Content-Type: application/json

Body: {
  "title": "Prof. Dr.",
  "first_name": "Güncellenmiş",
  "last_name": "Ad",
  "email_update": "yeni@email.com",
  "department_id": "1599f007-573e-468e-816d-202e5701a8be",
  "phone": "+905551234567"
}

Response: {
  "id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc",
  "title": "Prof. Dr.",
  "first_name": "Güncellenmiş",
  "last_name": "Ad",
  "email": "yeni@email.com",
  "department_id": "1599f007-573e-468e-816d-202e5701a8be",
  "phone": "+905551234567",
  "profile_photo": null,
  "created_at": "2025-08-01T11:45:10.193091+03:00"
}
```

#### **18. Section Güncelleme**
```javascript
PUT http://127.0.0.1:8000/lecturer_data/sections/{section_id}/
Content-Type: application/json

Body: {
  "section_number": "2",
  "lecture_id": "1526d6b6-cc20-4139-bcfb-bcb044ede01b",
  "lecturer_id": "08a3f6eb-4e36-40e6-b02c-eeb6bb4c6fbc"
}

// section_number zorunlu, diğerleri opsiyonel
```

#### **19. Saat Güncelleme**
```javascript
PUT http://127.0.0.1:8000/lecturer_data/hours/{hour_id}/
Content-Type: application/json

Body: {
  "order": "2",
  "day": "Tuesday",
  "time_start": "10:40",
  "time_end": "11:30",
  "classroom_id": "00528919-0caf-4056-9812-fea1bda7219a"
}

// section_id gönderilmesi zorunlu değil
```

---

## 🔑 **Test Kullanıcıları**

### **Hazır Öğretmen Hesapları**
```javascript
// Prof. Dr. Göktürk Üçoluk
{
  "email": "ucoluk@ceng.metu.edu.tr",
  "password": "ucoluk.1234"
}

// Prof. Dr. İsmail Şengör Altıngövde
{
  "email": "altingovde@ceng.metu.edu.tr",
  "password": "altingovde.1234"
}

// Dr. Onur Tolga Şehitoğlu
{
  "email": "onur@ceng.metu.edu.tr",
  "password": "onur.1234"
}

// Prof. Dr. İsmail Hakkı Toroslu
{
  "email": "toroslu@ceng.metu.edu.tr",
  "password": "toroslu.1234"
}

// Prof. Dr. Murathan Manguoğlu
{
  "email": "mangu@ceng.metu.edu.tr",
  "password": "mangu.1234"
}

// Assoc. Prof. Dr. Şeyda Ertekin
{
  "email": "ertekin@ceng.metu.edu.tr",
  "password": "ertekin.1234"
}

// Prof. Dr. Pınar Karagöz
{
  "email": "karagoz@ceng.metu.edu.tr",
  "password": "karagoz.1234"
}
```

---

## 📊 **Veri Yapıları ve ID'ler**

### **Mevcut Sistem ID'leri**
```javascript
const SYSTEM_IDS = {
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
```

### **Günler (Days)**
```javascript
const DAYS = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday"
];
```

### **Saat Formatı**
```javascript
// Gönderirken: "09:40"
// Alırken: "09:40:00"
const timeFormat = "HH:MM"; // 24 saat formatı
```

---

## 🛠️ **Frontend Entegrasyon Örnekleri**

### **Axios Kullanımı**
```javascript
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/lecturer_data';

// GET Request
const getUniversities = async () => {
  try {
    const response = await axios.get(`${API_BASE}/universities/`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST Request
const lecturerLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/lecturers/login/`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true // Session için
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
  }
};

// PUT Request
const updateLecturerProfile = async (lecturerId, profileData) => {
  try {
    const response = await axios.put(`${API_BASE}/lecturers/${lecturerId}/`, profileData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Update error:', error);
  }
};
```

### **Fetch API Kullanımı**
```javascript
const API_BASE = 'http://127.0.0.1:8000/lecturer_data';

// GET Request
const getUniversities = async () => {
  try {
    const response = await fetch(`${API_BASE}/universities/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST Request
const lecturerLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/lecturers/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Session için
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

---

## ⚠️ **Önemli Notlar**

### **Formatlar**
- **Saat:** `"09:40"` formatında gönder, `"09:40:00"` formatında gelir
- **Tarih:** ISO format `"2025-08-01T11:45:10.193091+03:00"`
- **UUID:** Tüm ID'ler UUID formatında
- **Phone:** `"+905551234567"` formatında

### **Nested Data Erişimi**
```javascript
// Response'dan nested data'ya erişim
const universityName = response.data.building.department.faculty.university.name;
const facultyId = response.data.department.faculty.id;
```

### **Error Handling**
```javascript
// Tipik error response'lar
{
  "detail": "Invalid credentials" // 401
}

{
  "detail": "Not found" // 404
}

{
  "field_name": ["Error message"] // 400 validation error
}
```

### **Session Management**
- Login sonrası session cookie otomatik set edilir
- Tüm request'lerde `withCredentials: true` kullan
- Logout ile session temizlenir

---

## 🚀 **Hızlı Test**

### **1. Server Kontrolü**
```bash
curl http://127.0.0.1:8000/
```

### **2. Universities Test**
```bash
curl http://127.0.0.1:8000/lecturer_data/universities/
```

### **3. Login Test**
```bash
curl -X POST http://127.0.0.1:8000/lecturer_data/lecturers/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"ucoluk@ceng.metu.edu.tr","password":"ucoluk.1234"}'
```

---

## 📞 **Destek**

- **Server Port:** 8000 (Açık kalacak)
- **CORS:** Tüm origin'lere açık
- **Debug Mode:** Aktif (Detaylı error mesajları)
- **Database:** PostgreSQL (Hazır data ile)

**Frontend geliştirme için her şey hazır! 🎯**