// Ders programı API fonksiyonları
import { refreshToken } from './auth';

export const API_BASE_URL = 'http://127.0.0.1:8000';

// Department lectures: /lecturer_data/lectures/{departmentId}/
export async function fetchDepartmentLectures(departmentId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/lectures/${departmentId}/`;
  console.log('🔗 fetchDepartmentLectures URL:', url);
  
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
    }
  }
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Department lectures failed ${res.status}: ${text}`);
  }
  return res.json();
}

// Lecturer lectures: /lecturer_data/lecturers/lectures/lecturer_id
export async function fetchLecturerLectures(lecturerId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/lecturers/lectures/${lecturerId}/`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Lecturer lectures failed ${res.status}: ${text}`);
  }
  return res.json();
}

// Section hours: /lecturer_data/hours/section/section_id/
export async function fetchSectionHours(sectionId, accessToken) {
  const url = `${API_BASE_URL}/lecturer_data/hours/section/${sectionId}/`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Section hours failed ${res.status}: ${text}`);
  }
  return res.json();
}

// Bir ders için sections'ları getir
export const getSectionsForLecture = async (lectureId, accessToken) => {
  try {
    console.log(`🔄 Ders sections'ları alınıyor - Lecture ID: ${lectureId}`);
    
    const response = await fetch(`${API_BASE_URL}/lecturer_data/sections/lecture/${lectureId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ Sections API yanıt vermiyor - Status: ${response.status}`);
      return [];
    }

    const sections = await response.json();
    console.log(`✅ Sections alındı:`, sections);
    return sections;
    
  } catch (error) {
    console.error(`❌ Sections alma hatası:`, error);
    return [];
  }
};

// Bir section için hours'ları getir
export const getHoursForSection = async (sectionId, accessToken) => {
  try {
    console.log(`🔄 Section hours'ları alınıyor - Section ID: ${sectionId}`);
    
    const response = await fetch(`${API_BASE_URL}/lecturer_data/hours/section/${sectionId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ Hours API yanıt vermiyor - Status: ${response.status}`);
      return [];
    }

    const hours = await response.json();
    console.log(`✅ Hours alındı:`, hours);
    return hours;
    
  } catch (error) {
    console.error(`❌ Hours alma hatası:`, error);
    return [];
  }
};

// Haftalık ders programını oluştur
// Parametre 3 (deptLecturesOrId): Bölüm dersleri dizisi YA DA departmentId (string)
export const buildWeeklySchedule = async (lectures, accessToken, deptLecturesOrId) => {
  try {
    console.log('🔄 Haftalık ders programı oluşturuluyor...');
    console.log('📚 Lectures received:', lectures);

    const toArray = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.lectures)) return data.lectures;
      if (Array.isArray(data?.items)) return data.items;
      if (typeof data === 'object') {
        const vals = Object.values(data);
        if (vals.length && vals.every(v => typeof v === 'object')) return vals;
      }
      return [];
    };

    // Bölüm derslerinden sectionId -> ders bilgisi haritası
    let departmentLectures = [];
    try {
      if (typeof deptLecturesOrId === 'string' && deptLecturesOrId) {
        const raw = await fetchDepartmentLectures(deptLecturesOrId, accessToken);
        departmentLectures = toArray(raw);
      } else if (deptLecturesOrId) {
        departmentLectures = toArray(deptLecturesOrId);
      }
    } catch (e) {
      console.warn('⚠️ Department lectures alınamadı:', e?.message || e);
    }

    const sectionIdToCourse = new Map();
    departmentLectures.forEach((lec) => {
      const courseName = lec?.explicit_name || lec?.name || lec?.course_name || 'Ders';
      const courseCode = lec?.code || lec?.course_code || 'DERS';
      const lectureId = lec?.id;
      const sections = Array.isArray(lec?.sections) ? lec.sections : [];
      sections.forEach((sec) => {
        const secId = sec?.id || sec?.section_id || sec?.sectionId;
        if (!secId) return;
        const sectionName = sec?.name || sec?.section || sec?.code || 'A1';
        sectionIdToCourse.set(String(secId), { courseName, courseCode, lectureId, sectionName });
      });
    });

    const turkishDayMap = {
      pazartesi: 'Pazartesi', salı: 'Salı', salli: 'Salı', sali: 'Salı',
      çarşamba: 'Çarşamba', carsamba: 'Çarşamba', carşamba: 'Çarşamba',
      perşembe: 'Perşembe', persembe: 'Perşembe', persemb: 'Perşembe',
      cuma: 'Cuma', cumartesi: 'Cumartesi', pazar: 'Pazar'
    };
    const mapDay = (d) => {
      if (!d && d !== 0) return 'Pazartesi';
      const s = String(d).toLowerCase();
      if (turkishDayMap[s]) return turkishDayMap[s];
      const eng = { monday: 'Pazartesi', tuesday: 'Salı', wednesday: 'Çarşamba', thursday: 'Perşembe', friday: 'Cuma', saturday: 'Cumartesi', sunday: 'Pazar' }[s];
      if (eng) return eng;
      const num = Number(s);
      if (!Number.isNaN(num)) {
        return { 1: 'Pazartesi', 2: 'Salı', 3: 'Çarşamba', 4: 'Perşembe', 5: 'Cuma', 6: 'Cumartesi', 0: 'Pazar' }[num] || 'Pazartesi';
      }
      return 'Pazartesi';
    };

    const normTime = (t) => {
      if (!t) return undefined;
      const m = String(t).match(/^(\d{2}):(\d{2})/);
      return m ? `${m[1]}:${m[2]}` : undefined;
    };

    const weeklySchedule = { Pazartesi: [], Salı: [], Çarşamba: [], Perşembe: [], Cuma: [], Cumartesi: [], Pazar: [] };
    const lecturesArray = toArray(lectures);

    const ensureSections = async (lecture) => {
      if (Array.isArray(lecture?.sections) && lecture.sections.length) return lecture.sections;
      try {
        const res = await fetch(`${API_BASE_URL}/lecturer_data/sections/lecture/${lecture.id}/`, {
          headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }
        });
        if (res.ok) {
          const data = await res.json();
          const sections = toArray(data);
          return sections;
        }
      } catch {}
      return [];
    };

    let filled = false;
    for (const lecture of lecturesArray) {
      const sections = await ensureSections(lecture);
      for (const sec of sections) {
        const secId = sec.id || sec.section_id || sec.sectionId;
        if (!secId) continue;
        try {
          const hours = await fetchSectionHours(secId, accessToken);
          const hoursArray = toArray(hours);
          for (const h of hoursArray) {
            const dayTr = mapDay(h.day || h.weekday || h.day_name || h.dayName || h.day_of_week);
            const start = normTime(h.start_time || h.startTime || h.start);
            const end = normTime(h.end_time || h.endTime || h.end);
            if (!start) continue;

            const mapped = sectionIdToCourse.get(String(secId));
            const courseName = mapped?.courseName || lecture.explicit_name || lecture.name || lecture.course_name || 'Ders';
            const courseCode = mapped?.courseCode || lecture.code || lecture.course_code || 'DERS';
            const sectionName = mapped?.sectionName || sec.name || sec.section || sec.code || 'A1';

            weeklySchedule[dayTr].push({
              id: `${lecture.id || 'lec'}-${secId}-${h.id || 'hour'}`,
              lectureId: mapped?.lectureId || lecture.id,
              sectionId: secId,
              hourId: h.id || 'hour',
              courseName,
              courseCode,
              sectionName,
              startTime: start,
              endTime: end || start,
              day: dayTr,
            });
            filled = true;
          }
        } catch (e) {
          console.warn('⚠️ Section hours alınamadı:', e?.message || e);
        }
      }
    }

    if (filled) {
      Object.keys(weeklySchedule).forEach(day => {
        weeklySchedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
      console.log('✅ Hours tabanlı haftalık program:', weeklySchedule);
      return weeklySchedule;
    }

    console.log('⚠️ Saat bilgisi bulunamadı, boş program döndürülüyor');
    return weeklySchedule;
  } catch (error) {
    console.error('❌ Haftalık ders programı oluşturma hatası:', error);
    return { Pazartesi: [], Salı: [], Çarşamba: [], Perşembe: [], Cuma: [], Cumartesi: [], Pazar: [] };
  }
};

// Helper function: Bitiş saatini hesapla
const getEndTime = (startTime) => {
  const [hour, minute] = startTime.split(':').map(Number);
  const endMinute = minute + 50; // 50 dakika ders
  
  if (endMinute >= 60) {
    return `${String(hour + 1).padStart(2, '0')}:${String(endMinute - 60).padStart(2, '0')}`;
  } else {
    return `${String(hour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  }
};

// Helper function: İngilizce gün adını Türkçe'ye çevir
const getDayNameInTurkish = (englishDay) => {
  const dayMapping = {
    'monday': 'Pazartesi',
    'tuesday': 'Salı',
    'wednesday': 'Çarşamba',
    'thursday': 'Perşembe',
    'friday': 'Cuma',
    'saturday': 'Cumartesi',
    'sunday': 'Pazar'
  };
  
  return dayMapping[englishDay?.toLowerCase()] || 'Pazartesi';
};

// Bugünkü dersleri getirir
export const getTodaysSchedule = (weeklySchedule) => {
  const today = new Date();
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const todayName = dayNames[today.getDay()];
  
  return weeklySchedule[todayName] || [];
};

// Yarınki dersleri getirir
export const getTomorrowsSchedule = (weeklySchedule) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const tomorrowName = dayNames[tomorrow.getDay()];
  
  return weeklySchedule[tomorrowName] || [];
};
