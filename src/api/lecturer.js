// Lecturer Profile API Service
const API_BASE_URL = "http://127.0.0.1:8000";

// Get authentication token from session storage
const getAuthToken = () => {
    return sessionStorage.getItem("token");
};

// Get authenticated headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
};

// Get lecturer profile data
export const getLecturerProfile = async (lecturerId) => {
    try {
        console.log("🔄 Fetching lecturer profile for ID:", lecturerId);

        const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
            } else if (response.status === 404) {
                throw new Error("Profil bilgileri bulunamadı.");
            } else {
                throw new Error(`Profil bilgileri alınamadı (${response.status})`);
            }
        }

        const profileData = await response.json();
        console.log("✅ Lecturer profile fetched successfully:", profileData);

        return profileData;
    } catch (error) {
        console.error("❌ Error fetching lecturer profile:", error);
        throw error;
    }
};

// Update lecturer profile data
export const updateLecturerProfile = async (lecturerId, profileData) => {
    try {
        console.log("🔄 Updating lecturer profile for ID:", lecturerId);
        console.log("📝 Profile data to update:", profileData);

        // If it's a mock user ID, return mock updated data
        if (lecturerId === "mock-user-id") {
            console.log("📋 Using mock profile update");
            return {
                id: "mock-user-id",
                first_name: profileData.first_name || "MEHMET NURİ",
                last_name: profileData.last_name || "ÖĞÜT",
                title: profileData.title || "Öğr. Gör.",
                email: "mehmetnuri.ogut@cbu.edu.tr",
                phone: profileData.phone || "+90 236 201 1163",
                profile_photo: profileData.profile_photo || null,
                department: {
                    id: "mock-dept-id",
                    name: "ENDÜSTRİYEL KALIPÇILIK",
                    faculty: {
                        name: "MAKİNE VE METAL TEKNOLOJİLERİ",
                        university: {
                            name: "MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU"
                        }
                    }
                },
                department_id: "mock-dept-id",
                created_at: new Date().toISOString()
            };
        }

        // Prepare the data according to API specification
        const updateData = {
            title: profileData.title,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            phone: profileData.phone,
            ...(profileData.profile_photo && { profile_photo: profileData.profile_photo })
        };

        const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                throw new Error(`Profil güncellenemedi (${response.status})`);
            }

            if (response.status === 401) {
                throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
            } else if (response.status === 403) {
                throw new Error("Bu işlem için yetkiniz bulunmuyor.");
            } else if (response.status === 404) {
                throw new Error("Profil bulunamadı.");
            } else {
                // Handle field validation errors
                let errorMessage = "Profil güncellenemedi";
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (typeof errorData === 'object') {
                    const fieldErrors = Object.entries(errorData).map(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            return `${field}: ${errors.join(', ')}`;
                        }
                        return `${field}: ${errors}`;
                    });
                    errorMessage = fieldErrors.join('; ');
                }
                throw new Error(errorMessage);
            }
        }

        const updatedProfile = await response.json();
        console.log("✅ Lecturer profile updated successfully:", updatedProfile);

        return updatedProfile;
    } catch (error) {
        console.error("❌ Error updating lecturer profile:", error);
        throw error;
    }
};

// Upload profile photo (if needed as separate endpoint)
export const uploadProfilePhoto = async (lecturerId, photoFile) => {
    try {
        console.log("🔄 Uploading profile photo for lecturer ID:", lecturerId);

        const formData = new FormData();
        formData.append('profile_photo', photoFile);

        const token = getAuthToken();
        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/lecturer_data/lecturers/${lecturerId}/upload-photo/`, {
            method: "POST",
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
            } else if (response.status === 413) {
                throw new Error("Dosya boyutu çok büyük. Lütfen daha küçük bir fotoğraf seçin.");
            } else {
                throw new Error(`Fotoğraf yüklenemedi (${response.status})`);
            }
        }

        const result = await response.json();
        console.log("✅ Profile photo uploaded successfully:", result);

        return result.profile_photo || result.url;
    } catch (error) {
        console.error("❌ Error uploading profile photo:", error);
        throw error;
    }
};

// Get current user info from session
export const getCurrentUser = () => {
    try {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log("📋 Current user from session:", user);
            return user;
        }

        // Check if there's a token but no user data
        const token = sessionStorage.getItem("token");
        if (token) {
            console.warn("⚠️ Token found but no user data in session");
        }

        return null;
    } catch (error) {
        console.error("❌ Error parsing user data from session:", error);
        return null;
    }
};

// Update current user info in session
export const updateCurrentUser = (userData) => {
    try {
        sessionStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User data updated in session:", userData);
    } catch (error) {
        console.error("❌ Error updating user data in session:", error);
    }
};

// Transform API response to component format
export const transformApiProfileToComponent = (apiProfile) => {
    return {
        id: apiProfile.id,
        name: `${apiProfile.first_name} ${apiProfile.last_name}`,
        firstName: apiProfile.first_name,
        lastName: apiProfile.last_name,
        title: apiProfile.title,
        email: apiProfile.email,
        phone: apiProfile.phone,
        profilePhoto: apiProfile.profile_photo,

        // Department and institutional info
        department: apiProfile.department?.name || "",
        departmentId: apiProfile.department_id,
        faculty: apiProfile.department?.faculty?.name || "",
        university: apiProfile.department?.faculty?.university?.name || "",
        school: apiProfile.department?.faculty?.university?.name || "",

        // Additional fields for compatibility
        webUrl: "", // Not provided by API
        otherDetails: "", // Not provided by API

        // Metadata
        createdAt: apiProfile.created_at
    };
};

// Transform component data to API format
export const transformComponentProfileToApi = (componentProfile) => {
    return {
        title: componentProfile.title,
        first_name: componentProfile.firstName,
        last_name: componentProfile.lastName,
        phone: componentProfile.phone,
        // Note: email and department_id are typically not updatable
        // profile_photo will be handled separately if it's a file
    };
};

export default {
    getLecturerProfile,
    updateLecturerProfile,
    uploadProfilePhoto,
    getCurrentUser,
    updateCurrentUser,
    transformApiProfileToComponent,
    transformComponentProfileToApi
};