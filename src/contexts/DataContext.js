import React, { createContext, useContext, useState, useEffect } from 'react';
import lecturerApiService from '../utils/LecturerApiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // Temel veriler
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [lectures, setLectures] = useState([]);

  // Ders ve section verileri
  const [sections, setSections] = useState([]);
  const [hours, setHours] = useState([]);
  const [lecturerSections, setLecturerSections] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({
    universities: false,
    faculties: false,
    departments: false,
    buildings: false,
    classrooms: false,
    lectures: false,
    sections: false,
    hours: false,
    lecturerSections: false
  });

  // Error states
  const [errors, setErrors] = useState({});

  // Sistem ID'leri
  const systemIds = lecturerApiService.getSystemIds();

  /**
   * Loading state'ini güncelle
   */
  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Error state'ini güncelle
   */
  const setErrorState = (key, error) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  /**
   * Error'ı temizle
   */
  const clearError = (key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  // ==================== FETCH FUNCTIONS ====================

  /**
   * Üniversiteleri getir
   */
  const fetchUniversities = async () => {
    // Zaten yüklenmişse tekrar yükleme
    if (universities.length > 0) {
      return universities;
    }

    try {
      setLoadingState('universities', true);
      clearError('universities');

      const data = await lecturerApiService.getUniversities();
      setUniversities(data);

      return data;
    } catch (error) {
      setErrorState('universities', error.message);
      throw error;
    } finally {
      setLoadingState('universities', false);
    }
  };

  /**
   * Fakülteleri getir
   */
  const fetchFaculties = async (universityId) => {
    // Zaten yüklenmişse tekrar yükleme
    if (faculties.length > 0) {
      return faculties;
    }

    try {
      setLoadingState('faculties', true);
      clearError('faculties');

      const data = await lecturerApiService.getFaculties(universityId);
      setFaculties(data);

      return data;
    } catch (error) {
      setErrorState('faculties', error.message);
      throw error;
    } finally {
      setLoadingState('faculties', false);
    }
  };

  /**
   * Departmanları getir
   */
  const fetchDepartments = async (facultyId) => {
    // Zaten yüklenmişse tekrar yükleme
    if (departments.length > 0) {
      return departments;
    }

    try {
      setLoadingState('departments', true);
      clearError('departments');

      const data = await lecturerApiService.getDepartments(facultyId);
      setDepartments(data);

      return data;
    } catch (error) {
      setErrorState('departments', error.message);
      throw error;
    } finally {
      setLoadingState('departments', false);
    }
  };

  /**
   * Binaları getir
   */
  const fetchBuildings = async (universityId) => {
    try {
      setLoadingState('buildings', true);
      clearError('buildings');

      const data = await lecturerApiService.getBuildings(universityId);
      setBuildings(data);

      return data;
    } catch (error) {
      setErrorState('buildings', error.message);
      throw error;
    } finally {
      setLoadingState('buildings', false);
    }
  };

  /**
   * Sınıfları getir
   */
  const fetchClassrooms = async (buildingId) => {
    try {
      setLoadingState('classrooms', true);
      clearError('classrooms');

      const data = await lecturerApiService.getClassrooms(buildingId);
      setClassrooms(data);

      return data;
    } catch (error) {
      // 404 hatalarını sessizce handle et
      if (error.message.includes('404') || error.message.includes('Not found')) {
        console.warn('Classrooms endpoint not found, skipping...');
        setClassrooms([]);
        return [];
      }
      setErrorState('classrooms', error.message);
      throw error;
    } finally {
      setLoadingState('classrooms', false);
    }
  };

  /**
   * Dersleri getir
   */
  const fetchLectures = async (departmentId) => {
    try {
      setLoadingState('lectures', true);
      clearError('lectures');

      const data = await lecturerApiService.getLectures(departmentId);
      setLectures(data);

      return data;
    } catch (error) {
      setErrorState('lectures', error.message);
      throw error;
    } finally {
      setLoadingState('lectures', false);
    }
  };

  /**
   * Belirli dersin section'larını getir
   */
  const fetchSectionsByLecture = async (lectureId) => {
    try {
      setLoadingState('sections', true);
      clearError('sections');

      const data = await lecturerApiService.getSectionsByLecture(lectureId);
      setSections(data);

      return data;
    } catch (error) {
      setErrorState('sections', error.message);
      throw error;
    } finally {
      setLoadingState('sections', false);
    }
  };

  /**
   * Belirli section'ın saatlerini getir
   */
  const fetchHoursBySection = async (sectionId) => {
    try {
      setLoadingState('hours', true);
      clearError('hours');

      const data = await lecturerApiService.getHoursBySection(sectionId);
      setHours(data);

      return data;
    } catch (error) {
      setErrorState('hours', error.message);
      throw error;
    } finally {
      setLoadingState('hours', false);
    }
  };

  /**
   * Öğretmenin tüm section'larını getir
   */
  const fetchLecturerSections = async () => {
    if (!user?.id) return;

    try {
      setLoadingState('lecturerSections', true);
      clearError('lecturerSections');

      // Önce departmanın derslerini getir
      const lecturesData = await lecturerApiService.getLectures(user.department_id);

      // Her ders için section'ları getir ve öğretmenin section'larını filtrele
      const allSections = [];

      for (const lecture of lecturesData) {
        try {
          const sectionsData = await lecturerApiService.getSectionsByLecture(lecture.id);
          const lecturerSectionsForLecture = sectionsData.filter(
            section => section.lecturer_id === user.id
          );

          // Her section için saatleri de getir
          for (const section of lecturerSectionsForLecture) {
            try {
              const hoursData = await lecturerApiService.getHoursBySection(section.id);
              section.hours = hoursData;
            } catch (error) {
              // Saat bilgileri alınamazsa boş array ver
              section.hours = [];
            }
          }

          allSections.push(...lecturerSectionsForLecture);
        } catch (error) {
          // 404 hatalarını sessizce handle et
          if (!error.message.includes('404') && !error.message.includes('Not found')) {
            console.error(`Lecture ${lecture.id} section'ları getirilemedi:`, error);
          }
        }
      }

      setLecturerSections(allSections);
      return allSections;
    } catch (error) {
      setErrorState('lecturerSections', error.message);
      console.error('fetchLecturerSections error:', error);
      return [];
    } finally {
      setLoadingState('lecturerSections', false);
    }
  };

  // ==================== CREATE FUNCTIONS ====================

  /**
   * Yeni section oluştur
   */
  const createSection = async (lectureId, sectionData) => {
    try {
      const response = await lecturerApiService.createSection(lectureId, sectionData);

      // Local state'i güncelle
      setSections(prev => [...prev, response]);

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Yeni saat oluştur
   */
  const createHour = async (sectionId, hourData) => {
    try {
      const response = await lecturerApiService.createHour(sectionId, hourData);

      // Local state'i güncelle
      setHours(prev => [...prev, response]);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // ==================== UPDATE FUNCTIONS ====================

  /**
   * Section güncelle
   */
  const updateSection = async (sectionId, sectionData) => {
    try {
      const response = await lecturerApiService.updateSection(sectionId, sectionData);

      // Local state'i güncelle
      setSections(prev =>
        prev.map(section =>
          section.id === sectionId ? { ...section, ...response } : section
        )
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Saat güncelle
   */
  const updateHour = async (hourId, hourData) => {
    try {
      const response = await lecturerApiService.updateHour(hourId, hourData);

      // Local state'i güncelle
      setHours(prev =>
        prev.map(hour =>
          hour.id === hourId ? { ...hour, ...response } : hour
        )
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Tüm temel verileri yükle
   */
  const loadInitialData = async () => {
    try {
      // Sadece gerekli verileri yükle
      if (universities.length === 0) {
        await fetchUniversities();
      }

      if (faculties.length === 0) {
        await fetchFaculties(systemIds.university_id);
      }

      if (departments.length === 0) {
        await fetchDepartments(systemIds.faculty_id);
      }

      if (buildings.length === 0) {
        await fetchBuildings(systemIds.university_id);
      }

      // Classrooms endpoint'i 404 veriyor, şimdilik kaldırıyoruz
      // if (classrooms.length === 0) {
      //   await fetchClassrooms(systemIds.building_id);
      // }

      if (user?.department_id && lectures.length === 0) {
        await fetchLectures(user.department_id);
      }
    } catch (error) {
      console.error('Initial data loading error:', error);
    }
  };

  /**
   * Belirli bir ders için tüm verileri getir
   */
  const loadLectureData = async (lectureId) => {
    try {
      const sectionsData = await fetchSectionsByLecture(lectureId);

      // Her section için saatleri getir
      for (const section of sectionsData) {
        await fetchHoursBySection(section.id);
      }

      return sectionsData;
    } catch (error) {
      console.error('Lecture data loading error:', error);
      throw error;
    }
  };

  /**
   * Cache'i temizle
   */
  const clearCache = () => {
    setUniversities([]);
    setFaculties([]);
    setDepartments([]);
    setBuildings([]);
    setClassrooms([]);
    setLectures([]);
    setSections([]);
    setHours([]);
    setLecturerSections([]);
    setErrors({});
  };

  // Kullanıcı değiştiğinde öğretmen section'larını yükle - sadece gerektiğinde
  useEffect(() => {
    if (user?.id && lecturerSections.length === 0) {
      fetchLecturerSections();
    } else if (!user?.id) {
      setLecturerSections([]);
    }
  }, [user?.id]);

  const value = {
    // Data
    universities,
    faculties,
    departments,
    buildings,
    classrooms,
    lectures,
    sections,
    hours,
    lecturerSections,

    // Loading states
    loading,

    // Error states
    errors,

    // Fetch functions
    fetchUniversities,
    fetchFaculties,
    fetchDepartments,
    fetchBuildings,
    fetchClassrooms,
    fetchLectures,
    fetchSectionsByLecture,
    fetchHoursBySection,
    fetchLecturerSections,

    // Create functions
    createSection,
    createHour,

    // Update functions
    updateSection,
    updateHour,

    // Utility functions
    loadInitialData,
    loadLectureData,
    clearCache,
    clearError,

    // System data
    systemIds,
    days: lecturerApiService.getDays(),
    testUsers: lecturerApiService.getTestUsers()
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;