const courseSchedule = {
  "Pazartesi": [
    { time: "09:00-09:45", course: "", status: "empty" },
    { time: "09:55-10:40", course: "Proje Danışmanlığı", status: "completed" },
    { time: "10:50-11:35", course: "Proje Danışmanlığı", status: "completed" },
    { time: "11:45-12:30", course: "Proje Danışmanlığı", status: "completed" },
    { time: "13:30-14:15", course: "Proje Danışmanlığı", status: "completed" },
    { time: "14:30-15:10", course: "Proje Danışmanlığı", status: "completed" },
    { time: "15:20-16:05", course: "Proje Danışmanlığı", status: "completed" },
    { time: "16:15-17:00", course: "", status: "empty" },
    { time: "17:00-17:45", course: "", status: "empty" },
    { time: "17:55-18:40", course: "", status: "empty" }
  ],
  "Salı": [
    { time: "09:00-09:45", course: "İYS1101 / DDE1109 - Matematik", status: "completed" },
    { time: "09:55-10:40", course: "", status: "empty" },
    { time: "10:50-11:35", course: "İYS1107 - Bilgisayar Ağları", status: "completed" },
    { time: "11:45-12:30", course: "İYS1107 - Bilgisayar Ağları", status: "completed" },
    { time: "13:30-14:15", course: "İYS1103 - Programlama", status: "completed" },
    { time: "14:30-15:10", course: "İYS1103 - Programlama", status: "completed" },
    { time: "15:20-16:05", course: "", status: "empty" },
    { time: "16:15-17:00", course: "", status: "empty" },
    { time: "17:00-17:45", course: "", status: "empty" },
    { time: "17:55-18:40", course: "", status: "empty" }
  ],
  "Çarşamba": [
    { time: "09:00-09:45", course: "MRK1115 / EKT1117 - Matematik", status: "completed" },
    { time: "09:55-10:40", course: "", status: "empty" },
    { time: "10:50-11:35", course: "Proje Danışmanlığı", status: "completed" },
    { time: "11:45-12:30", course: "Proje Danışmanlığı", status: "completed" },
    { time: "13:30-14:15", course: "Sağlıkta Yapay Zeka ve Proje Yönetimi", status: "completed" },
    { time: "14:30-15:10", course: "", status: "empty" },
    { time: "15:20-16:05", course: "", status: "empty" },
    { time: "16:15-17:00", course: "", status: "empty" },
    { time: "17:00-17:45", course: "", status: "empty" },
    { time: "17:55-18:40", course: "", status: "empty" }
  ],
  "Perşembe": [
    { time: "09:00-09:45", course: "Proje Danışmanlığı", status: "completed" },
    { time: "09:55-10:40", course: "", status: "empty" },
    { time: "10:50-11:35", course: "SSD2005 - Matematiksel Düşünme", status: "completed" },
    { time: "11:45-12:30", course: "SSD2005 - Matematiksel Düşünme", status: "completed" },
    { time: "13:30-14:15", course: "USD1165 - Proje Yönetimi", status: "completed" },
    { time: "14:30-15:10", course: "", status: "empty" },
    { time: "15:20-16:05", course: "", status: "empty" },
    { time: "16:15-17:00", course: "", status: "empty" },
    { time: "17:00-17:45", course: "", status: "empty" },
    { time: "17:55-18:40", course: "USD1165 - Proje Yönetimi", status: "active" }
  ],
  "Cuma": [
    { time: "09:00-09:45", course: "İYS2111 - Sosyal Sorumluluk", status: "upcoming" },
    { time: "09:55-10:40", course: "", status: "empty" },
    { time: "10:50-11:35", course: "İYS2103 - Veri Toplama ve Analizi", status: "upcoming" },
    { time: "11:45-12:30", course: "İYS2103 - Veri Toplama ve Analizi", status: "upcoming" },
    { time: "13:30-14:15", course: "İYS1103 - Programlama", status: "upcoming" },
    { time: "14:30-15:10", course: "SSD3264 - Akademik Yapay Zeka", status: "upcoming" },
    { time: "15:20-16:05", course: "", status: "empty" },
    { time: "16:15-17:00", course: "", status: "empty" },
    { time: "17:00-17:45", course: "", status: "empty" },
    { time: "17:55-18:40", course: "", status: "empty" }
  ]
};

// courseScheduleData for compatibility with existing components
export const courseScheduleData = {
  "2025-2026-guz": {
    pazartesi: {
      "09:00": { code: "", name: "", room: "", type: "" },
      "09:55": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "10:50": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "11:45": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "13:30": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "14:30": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "15:20": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "16:15": { code: "", name: "", room: "", type: "" },
      "17:00": { code: "", name: "", room: "", type: "" },
      "17:55": { code: "", name: "", room: "", type: "" }
    },
    sali: {
      "09:00": { code: "İYS1101/DDE1109", name: "Matematik", room: "Derslik-1", type: "ders" },
      "09:55": { code: "", name: "", room: "", type: "" },
      "10:50": { code: "İYS1107", name: "Bilgisayar Ağları", room: "Lab-1", type: "ders" },
      "11:45": { code: "İYS1107", name: "Bilgisayar Ağları", room: "Lab-1", type: "ders" },
      "13:30": { code: "İYS1103", name: "Programlama", room: "Lab-2", type: "ders" },
      "14:30": { code: "İYS1103", name: "Programlama", room: "Lab-2", type: "ders" },
      "15:20": { code: "", name: "", room: "", type: "" },
      "16:15": { code: "", name: "", room: "", type: "" },
      "17:00": { code: "", name: "", room: "", type: "" },
      "17:55": { code: "", name: "", room: "", type: "" }
    },
    carsamba: {
      "09:00": { code: "MRK1115/EKT1117", name: "Matematik", room: "Derslik-2", type: "ders" },
      "09:55": { code: "", name: "", room: "", type: "" },
      "10:50": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "11:45": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "13:30": { code: "", name: "Sağlıkta Yapay Zeka ve Proje Yönetimi", room: "Lab-3", type: "ders" },
      "14:30": { code: "", name: "", room: "", type: "" },
      "15:20": { code: "", name: "", room: "", type: "" },
      "16:15": { code: "", name: "", room: "", type: "" },
      "17:00": { code: "", name: "", room: "", type: "" },
      "17:55": { code: "", name: "", room: "", type: "" }
    },
    persembe: {
      "09:00": { code: "", name: "Proje Danışmanlığı", room: "Ofis", type: "danismanlik" },
      "09:55": { code: "", name: "", room: "", type: "" },
      "10:50": { code: "SSD2005", name: "Matematiksel Düşünme", room: "Derslik-3", type: "ders" },
      "11:45": { code: "SSD2005", name: "Matematiksel Düşünme", room: "Derslik-3", type: "ders" },
      "13:30": { code: "USD1165", name: "Proje Yönetimi", room: "Derslik-4", type: "ders" },
      "14:30": { code: "", name: "", room: "", type: "" },
      "15:20": { code: "", name: "", room: "", type: "" },
      "16:15": { code: "", name: "", room: "", type: "" },
      "17:00": { code: "", name: "", room: "", type: "" },
      "17:55": { code: "USD1165", name: "Proje Yönetimi", room: "Derslik-4", type: "ders" }
    },
    cuma: {
      "09:00": { code: "İYS2111", name: "Sosyal Sorumluluk", room: "Derslik-5", type: "ders" },
      "09:55": { code: "", name: "", room: "", type: "" },
      "10:50": { code: "İYS2103", name: "Veri Toplama ve Analizi", room: "Lab-4", type: "ders" },
      "11:45": { code: "İYS2103", name: "Veri Toplama ve Analizi", room: "Lab-4", type: "ders" },
      "13:30": { code: "İYS1103", name: "Programlama", room: "Lab-2", type: "ders" },
      "14:30": { code: "SSD3264", name: "Akademik Yapay Zeka", room: "Lab-5", type: "ders" },
      "15:20": { code: "", name: "", room: "", type: "" },
      "16:15": { code: "", name: "", room: "", type: "" },
      "17:00": { code: "", name: "", room: "", type: "" },
      "17:55": { code: "", name: "", room: "", type: "" }
    }
  }
};

// Course list for Derslerim component
export const courseList = {
  "2025-2026-guz": [
    {
      id: "iys1101",
      code: "İYS1101",
      name: "Matematik",
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 25,
      room: "Arşiv",
      schedule: {
        sali: [{ startTime: "09:00", endTime: "09:45", room: "Arşiv" }]
      }
    },
    {
      id: "dde1109",
      code: "DDE1109", 
      name: "Matematik",
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 30,
      room: "Arşiv",
      schedule: {
        sali: [{ startTime: "09:00", endTime: "09:45", room: "Arşiv" }]
      }
    },
    {
      id: "iys1107",
      code: "İYS1107",
      name: "Bilgisayar Ağları",
      section: "1", 
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 20,
      room: "Lab-1",
      schedule: {
        sali: [
          { startTime: "10:50", endTime: "11:35", room: "Lab-1" },
          { startTime: "11:45", endTime: "12:30", room: "Lab-1" }
        ]
      }
    },
    {
      id: "iys1103",
      code: "İYS1103",
      name: "Programlama",
      section: "1",
      credits: 4,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT", 
      studentCount: 22,
      room: "Lab-2",
      schedule: {
        sali: [
          { startTime: "13:30", endTime: "14:15", room: "Lab-2" },
          { startTime: "14:30", endTime: "15:10", room: "Lab-2" }
        ],
        cuma: [{ startTime: "13:30", endTime: "14:15", room: "Lab-2" }]
      }
    },
    {
      id: "mrk1115",
      code: "MRK1115",
      name: "Matematik",
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 28,
      room: "Derslik-3",
      schedule: {
        carsamba: [{ startTime: "09:00", endTime: "09:45", room: "Derslik-3" }]
      }
    },
    {
      id: "ekt1117",
      code: "EKT1117",
      name: "Matematik", 
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 26,
      room: "Derslik-3",
      schedule: {
        carsamba: [{ startTime: "09:00", endTime: "09:45", room: "Derslik-3" }]
      }
    },
    {
      id: "ssd2005",
      code: "SSD2005",
      name: "Matematiksel Düşünme",
      section: "1",
      credits: 2,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 24,
      room: "Derslik-1",
      schedule: {
        persembe: [
          { startTime: "10:50", endTime: "11:35", room: "Derslik-1" },
          { startTime: "11:45", endTime: "12:30", room: "Derslik-1" }
        ]
      }
    },
    {
      id: "usd1165",
      code: "USD1165", 
      name: "Proje Yönetimi",
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 18,
      room: "Derslik-2",
      schedule: {
        persembe: [
          { startTime: "13:30", endTime: "14:15", room: "Derslik-2" },
          { startTime: "17:55", endTime: "18:40", room: "Derslik-2" }
        ]
      }
    },
    {
      id: "ssd3264",
      code: "SSD3264",
      name: "Akademik Yapay Zeka",
      section: "1", 
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 21,
      room: "Lab-3",
      schedule: {
        cuma: [{ startTime: "14:30", endTime: "15:10", room: "Lab-3" }]
      }
    },
    {
      id: "iys2111",
      code: "İYS2111",
      name: "Sosyal Sorumluluk",
      section: "1",
      credits: 2,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 19,
      room: "Derslik-4",
      schedule: {
        cuma: [{ startTime: "09:00", endTime: "09:45", room: "Derslik-4" }]
      }
    },
    {
      id: "iys2103",
      code: "İYS2103", 
      name: "Veri Toplama ve Analizi",
      section: "1",
      credits: 3,
      instructor: "Öğr. Gör. Mehmet Nuri ÖĞÜT",
      studentCount: 23,
      room: "Lab-4",
      schedule: {
        cuma: [
          { startTime: "10:50", endTime: "11:35", room: "Lab-4" },
          { startTime: "11:45", endTime: "12:30", room: "Lab-4" }
        ]
      }
    }
  ]
};

export default courseSchedule;