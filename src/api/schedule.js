// Temizlenmiş Schedule API - Sadece kullanılan fonksiyonlar
import { refreshToken } from './auth';

export const API_BASE_URL = 'http://127.0.0.1:8000';

// Lecturer lectures: /lecturer_data/lecturers/lectures/lecturer_id/ - Derslerim.js'de kullanılıyor
export async function fetchDepartmentLectures(lecturerId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/lecturers/lectures/${lecturerId}/`;
  
  // İlk deneme
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  
  // Token expired ise yenilemeyi dene
  if (res.status === 401 && accessToken) {
    console.log('🔄 Token expired, trying to refresh...');
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        // Yeni token ile tekrar dene
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
        console.log('✅ Token refreshed and retry successful');
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      throw new Error(`Authentication failed: ${refreshError.message}`);
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Department lectures failed ${res.status}: ${text}`);
  }
  
  const jsonData = await res.json();
  console.log('📚 DERSLERIM: API Response from fetchDepartmentLectures:', jsonData);
  return jsonData;
}

// 1. Öğretmenin derslerini al - lecturers/lectures/{lecturer_id}/ - buildWeeklyScheduleNew tarafından kullanılıyor
export async function fetchLecturerLecturesNew(lecturerId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/lecturers/lectures/${lecturerId}/`;
  console.log('🎯 fetchLecturerLecturesNew URL:', url);
  
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (res.status === 401 && accessToken) {
    console.log('🔄 Token expired, trying to refresh...');
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        // Yeni token ile tekrar dene
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
        console.log('✅ Token refreshed and retry successful');
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      throw new Error(`Authentication failed: ${refreshError.message}`);
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Lecturer lectures failed ${res.status}: ${text}`);
  }
  
  const jsonData = await res.json();
  console.log('🎯 ANASAYFA: API Response from fetchLecturerLecturesNew:', jsonData);
  return jsonData;
}

// 2. Bir dersin şubelerini al - sections/lecture/{lecture_id}/ - buildWeeklyScheduleNew tarafından kullanılıyor
export async function fetchLectureSections(lectureId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/sections/lecture/${lectureId}/`;
  console.log('🎯 fetchLectureSections URL:', url);
  
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (res.status === 401 && accessToken) {
    console.log('🔄 Token expired, trying to refresh...');
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
    }
  }
  
  // 404 durumunda boş array döndür (şube yoksa normal)
  if (res.status === 404) {
    console.warn(`⚠️ Ders ${lectureId} için şube bulunamadı (bu normal olabilir)`);
    return [];
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Lecture sections failed ${res.status}: ${text}`);
  }
  return res.json();
}

// 3. Bir şubenin saatlerini al - hours/section/{section_id}/ - buildWeeklyScheduleNew tarafından kullanılıyor
export async function fetchSectionHoursNew(sectionId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/hours/section/${sectionId}/`;
  console.log('🎯 fetchSectionHoursNew URL:', url);
  
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (res.status === 401 && accessToken) {
    console.log('🔄 Token expired, trying to refresh...');
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
    }
  }
  
  // 404 durumunda boş array döndür
  if (res.status === 404) {
    console.warn(`⚠️ Şube ${sectionId} için saat bulunamadı`);
    return [];
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Section hours failed ${res.status}: ${text}`);
  }
  return res.json();
}

// Ana fonksiyon: Öğretmenin haftalık ders programını oluştur - AnaSayfa.js'de kullanılıyor
export const buildWeeklyScheduleNew = async (lecturerId, accessToken) => {
  try {
    console.log('🎯 YENİ ENDPOINT ZİNCİRİ: Haftalık ders programı oluşturuluyor...');
    console.log('👨‍🏫 Lecturer ID:', lecturerId);
    console.log('🔑 Access Token var mı?', !!accessToken);

    // Lecturer ID formatını kontrol et
    if (!lecturerId) {
      throw new Error('Lecturer ID eksik!');
    }

    // UUID formatı kontrolü (basit)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(lecturerId)) {
      console.warn('⚠️ Lecturer ID UUID formatında değil:', lecturerId);
      throw new Error(`Geçersiz Lecturer ID formatı: ${lecturerId}`);
    }

    // 1. Öğretmenin derslerini al
    console.log('📚 1. ADIM: Öğretmenin dersleri çekiliyor...');
    const lecturesResponse = await fetchLecturerLectures(lecturerId, accessToken);
    console.log('📚 API Response:', lecturesResponse);
    
    // Response'u diziye çevir - Derslerim.js ile uyumlu format
    const toArray = (data) => {
      console.log('🔄 toArray - Input data:', data);
      
      if (!data) return [];
      
      // Yeni API formatı: { sections: [...] } - Derslerim.js ile aynı
      if (data.sections && Array.isArray(data.sections)) {
        console.log('📋 New API format detected in toArray - converting sections to lectures');
        const lectures = data.sections.map(section => ({
          ...section.lecture, // lecture bilgileri
          section_id: section.id, // section ID'si ekliyoruz
          section_number: section.section_number,
          // Schedule için gerekli formatlar
          id: section.lecture.id,
          name: section.lecture.explicit_name || section.lecture.name,
          code: section.lecture.code,
          lecturer: data.lecturer || 'Öğretim Görevlisi',
        }));
        console.log('✅ Converted sections to lectures for schedule:', lectures);
        return lectures;
      }
      
      // Eski format backward compatibility
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.lectures)) return data.lectures;
      if (Array.isArray(data?.data)) return data.data;
      if (typeof data === 'object' && data.id) return [data];
      return [];
    };

    const lectures = toArray(lecturesResponse);
    console.log('📖 Normalleştirilmiş öğretmen dersleri (sayı: ' + lectures.length + '):', lectures);

    if (lectures.length === 0) {
      console.warn('⚠️ Öğretmenin hiç dersi bulunamadı!');
      return { Pazartesi: [], Salı: [], Çarşamba: [], Perşembe: [], Cuma: [], Cumartesi: [], Pazar: [] };
    }

    // Gün ismi normalleştirme
    const dayMapping = {
      'monday': 'Pazartesi',
      'tuesday': 'Salı', 
      'wednesday': 'Çarşamba',
      'thursday': 'Perşembe',
      'friday': 'Cuma',
      'saturday': 'Cumartesi',
      'sunday': 'Pazar',
      'pazartesi': 'Pazartesi',
      'salı': 'Salı',
      'çarşamba': 'Çarşamba', 
      'perşembe': 'Perşembe',
      'cuma': 'Cuma',
      'cumartesi': 'Cumartesi',
      'pazar': 'Pazar'
    };

    const weeklySchedule = { Pazartesi: [], Salı: [], Çarşamba: [], Perşembe: [], Cuma: [], Cumartesi: [], Pazar: [] };

    // 2. Her lecture (section) için saatlerini çek
    for (const lecture of lectures) {
      try {
        console.log(`📚 2. ADIM: Lecture ${lecture.id} (${lecture.name}) section ${lecture.section_id} için saatler çekiliyor...`);
        
        // Lecture zaten section bilgisini içeriyor, ayrı section çekmeye gerek yok
        if (!lecture.section_id) {
          console.warn(`⚠️ Lecture ${lecture.id} için section_id bulunamadı! Genel ders bilgisi ekleniyor...`);
          
          // Section ID yoksa da en azından ders bilgisini gösterelim (saat bilgisi olmadan)
          const fallbackEntry = {
            lecture: lecture.name || 'Bilinmeyen Ders',
            lecturer: lecture.lecturer || 'Bilinmeyen Öğretim Görevlisi',
            time: 'Saat atanmamış',
            room: 'Sınıf atanmamış',
            building: 'Bina atanmamış',
            lectureId: lecture.id,
            sectionId: lecture.section_id
          };
          
          // Tüm günlere ekle (genel ders bilgisi olarak)
          weeklySchedule['Pazartesi'].push(fallbackEntry);
          console.log(`⚠️ Fallback ders bilgisi eklendi:`, fallbackEntry);
          continue;
        }

        // 3. Section'ın saatlerini çek
        try {
          console.log(`⏰ 3. ADIM: Section ${lecture.section_id} saatleri çekiliyor...`);
          
          const hoursResponse = await fetchSectionHours(lecture.section_id, accessToken);
          const hours = toArray(hoursResponse);
          console.log(`⏰ Section ${lecture.section_id} saatleri (sayı: ${hours.length}):`, hours);

          if (hours.length === 0) {
            console.warn(`⚠️ Section ${lecture.section_id} için saat bulunamadı!`);
            continue;
          }

          // 4. Saatleri haftalık programa ekle
          for (const hour of hours) {
            const dayName = dayMapping[hour.day?.toLowerCase()] || hour.day;
            
            if (weeklySchedule[dayName]) {
              const scheduleEntry = {
                lecture: lecture.name || 'Bilinmeyen Ders',
                lectureCode: lecture.code || 'DERS',
                lectureDisplay: `${lecture.name || 'DERS'}-${lecture.code || '000'}`, // "CENG-140" formatı
                lecturer: lecture.lecturer || 'Öğretim Görevlisi',
                time: hour.time_start && hour.time_end ? `${hour.time_start.substring(0,5)} - ${hour.time_end.substring(0,5)}` : 'Saat atanmamış',
                room: hour.classroom_name || 'Sınıf Bilgisi Yok',
                building: hour.building_name || 'Bina Bilgisi Yok',
                lectureId: lecture.id,
                sectionId: lecture.section_id,
                hourId: hour.id
              };
              
              weeklySchedule[dayName].push(scheduleEntry);
              console.log(`✅ ${dayName} gününe ders eklendi:`, scheduleEntry);
            } else {
              console.warn(`⚠️ Geçersiz gün ismi: ${hour.day}`);
            }
          }

        } catch (hourError) {
          console.error(`❌ Section ${lecture.section_id} saatleri işlenirken hata:`, hourError);
        }

      } catch (lectureError) {
        console.error(`❌ Lecture ${lecture.id} işlenirken hata:`, lectureError);
      }
    }

    console.log('✅ Final haftalık program:', weeklySchedule);
    return weeklySchedule;

  } catch (error) {
    console.error('❌ buildWeeklyScheduleNew hatası:', error);
    throw error;
  }
};

// Yeni API fonksiyonları - Ders güncelleme için
// 1. Öğretmenin tüm derslerini getir (section bilgileri ile)
export async function fetchLecturerLectures(lecturerId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/lecturers/lectures/${lecturerId}/`;
  
  console.log('🎯 DERS GÜNCELLEME: fetchLecturerLectures URL:', url);
  console.log('🎯 DERS GÜNCELLEME: lecturerId:', lecturerId);
  console.log('🎯 DERS GÜNCELLEME: accessToken var mı:', !!accessToken);
  
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  
  console.log('🎯 DERS GÜNCELLEME: HTTP Status:', res.status);
  console.log('🎯 DERS GÜNCELLEME: Response OK:', res.ok);
  
  // Token expired ise yenilemeyi dene
  if (res.status === 401 && accessToken) {
    console.log('🔄 DERS GÜNCELLEME: Token expired, trying to refresh...');
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
        console.log('✅ DERS GÜNCELLEME: Token refreshed and retry successful');
      }
    } catch (refreshError) {
      console.error('❌ DERS GÜNCELLEME: Token refresh failed:', refreshError);
      throw new Error(`Authentication failed: ${refreshError.message}`);
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('❌ DERS GÜNCELLEME: API Error:', res.status, text);
    throw new Error(`Lecturer lectures failed ${res.status}: ${text}`);
  }
  
  const jsonData = await res.json();
  console.log('🎯 DERS GÜNCELLEME: API Response:', jsonData);
  console.log('🎯 DERS GÜNCELLEME: Response Type:', typeof jsonData);
  console.log('🎯 DERS GÜNCELLEME: Is Array:', Array.isArray(jsonData));
  
  return jsonData;
}

// 2. Section'ın saatlerini getir
export async function fetchSectionHours(sectionId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/hours/section/${sectionId}/`;
  
  let res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  
  // Token expired ise yenilemeyi dene
  if (res.status === 401 && accessToken) {
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
        });
      }
    } catch (refreshError) {
      throw new Error(`Authentication failed: ${refreshError.message}`);
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Section hours failed ${res.status}: ${text}`);
  }
  
  return await res.json();
}

// 3. Saat güncelle
export async function updateHour(hourId, hourData, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/hours/${hourId}/`;
  
  let res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(hourData),
  });
  
  // Token expired ise yenilemeyi dene
  if (res.status === 401 && accessToken) {
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        const newTokens = await refreshToken(refreshTokenValue);
        sessionStorage.setItem('token', newTokens.access);
        
        res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.access}`,
          },
          body: JSON.stringify(hourData),
        });
      }
    } catch (refreshError) {
      throw new Error(`Authentication failed: ${refreshError.message}`);
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Update hour failed ${res.status}: ${text}`);
  }
  
  return await res.json();
}
