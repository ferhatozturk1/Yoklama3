import React, { createContext, useContext, useState } from 'react';

const DersContext = createContext();

export const useDersler = () => {
  const context = useContext(DersContext);
  if (!context) {
    throw new Error('useDersler must be used within a DersProvider');
  }
  return context;
};

export const DersProvider = ({ children }) => {
  const [dersler, setDersler] = useState([
    {
      id: 1,
      name: "Matematik",
      code: "MATH113",
      section: "3",
      sectionFull: "1.Ö-A1",
      building: "A Blok",
      room: "A101",
      class: "10-A",
      instructor: "Dr. Ayşe Kaya",
      teachingType: "1",
      schedule: {
        pazartesi: [{ startTime: "08:40", endTime: "09:30", room: "A101" }],
        çarşamba: [{ startTime: "14:00", endTime: "14:50", room: "A101" }],
        cuma: [{ startTime: "10:00", endTime: "10:50", room: "A101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 32,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 85,
      files: [],
      info: "Temel matematik dersi - 1. Öğretim"
    },
    {
      id: 2,
      name: "İngilizce",
      code: "ENG101",
      section: "8",
      sectionFull: "2.Ö-D101",
      building: "D Blok",
      room: "D101",
      class: "10-B",
      instructor: "Dr. Mehmet Yılmaz",
      teachingType: "2",
      schedule: {
        salı: [{ startTime: "18:00", endTime: "18:50", room: "D101" }],
        perşembe: [{ startTime: "19:00", endTime: "19:50", room: "D101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 28,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-23",
      attendanceRate: 92,
      files: [],
      info: "Temel İngilizce dersi - 2. Öğretim"
    },
    {
      id: 3,
      name: "Bilgisayar Mühendisliği",
      code: "BMC3",
      section: "1",
      sectionFull: "Karma-Lab1",
      building: "B Blok",
      room: "B205",
      class: "11-A",
      instructor: "Dr. Ali Veli",
      teachingType: "both",
      schedule: {
        salı: [
          { startTime: "11:00", endTime: "11:50", room: "B205" },
          { startTime: "20:00", endTime: "20:50", room: "B205" }
        ],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 24,
      attendanceStatus: "pending",
      lastAttendance: "2025-07-20",
      attendanceRate: 78,
      files: [],
      info: "Bilgisayar mühendisliği laboratuvarı - Her iki öğretim"
    },
  ]);

  // Ders koduna göre ders bulma fonksiyonu
  const getDersByCode = (code) => {
    return dersler.find(ders => {
      // "MATH113/3" formatından "MATH113" ve "3" ayır
      const [baseCode, section] = code.split('/');
      return ders.code === baseCode && ders.section === section;
    });
  };

  // ID'ye göre ders bulma fonksiyonu
  const getDersById = (id) => {
    return dersler.find(ders => ders.id === parseInt(id));
  };

  // Haftalık programa göre ders bulma fonksiyonu
  const getDersByScheduleInfo = (scheduleText) => {
    // "MATH113/3\nYP-A1" formatından ders kodunu çıkar
    const lines = scheduleText.split('\n');
    if (lines.length >= 1) {
      const code = lines[0].trim();
      return getDersByCode(code);
    }
    return null;
  };

  // Yeni ders ekleme
  const addDers = (newDers) => {
    const ders = {
      ...newDers,
      id: Math.max(...dersler.map(d => d.id)) + 1,
      totalWeeks: 15,
      currentWeek: 1,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    };
    setDersler(prev => [...prev, ders]);
    return ders;
  };

  // Ders güncelleme
  const updateDers = (id, updatedDers) => {
    setDersler(prev => prev.map(ders => 
      ders.id === id ? { ...ders, ...updatedDers } : ders
    ));
  };

  // Ders silme
  const deleteDers = (id) => {
    setDersler(prev => prev.filter(ders => ders.id !== id));
  };

  // Çakışma kontrolü fonksiyonu
  const checkTimeConflict = (newSchedule, excludeDersId = null) => {
    const conflicts = [];
    
    // Yeni ders programındaki her gün ve saat için kontrol et
    Object.entries(newSchedule).forEach(([day, timeSlots]) => {
      timeSlots.forEach(newSlot => {
        const newStart = timeToMinutes(newSlot.startTime);
        const newEnd = timeToMinutes(newSlot.endTime);
        
        // Mevcut dersleri kontrol et
        dersler.forEach(existingDers => {
          // Kendisi ile karşılaştırma yapma (güncelleme durumunda)
          if (excludeDersId && existingDers.id === excludeDersId) return;
          
          // Aynı gündeki derslerini kontrol et
          if (existingDers.schedule[day]) {
            existingDers.schedule[day].forEach(existingSlot => {
              const existingStart = timeToMinutes(existingSlot.startTime);
              const existingEnd = timeToMinutes(existingSlot.endTime);
              
              // Çakışma kontrolü
              if (
                (newStart < existingEnd && newEnd > existingStart) ||
                (existingStart < newEnd && existingEnd > newStart)
              ) {
                conflicts.push({
                  day,
                  newTime: `${newSlot.startTime}-${newSlot.endTime}`,
                  existingDers: existingDers.name,
                  existingCode: existingDers.code,
                  existingTime: `${existingSlot.startTime}-${existingSlot.endTime}`,
                  existingRoom: existingSlot.room
                });
              }
            });
          }
        });
      });
    });
    
    return conflicts;
  };

  // Saat formatını dakikaya çevir (karşılaştırma için)
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const value = {
    dersler,
    getDersByCode,
    getDersById,
    getDersByScheduleInfo,
    addDers,
    updateDers,
    deleteDers,
    checkTimeConflict,
  };

  return (
    <DersContext.Provider value={value}>
      {children}
    </DersContext.Provider>
  );
};