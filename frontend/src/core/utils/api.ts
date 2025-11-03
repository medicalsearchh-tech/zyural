
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const currentHost = window.location.hostname;
  // Development environments
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  // Production environment (when deployed)
  if (currentHost.includes('netlify.app') || currentHost.includes('vercel.app') || import.meta.env.PROD) {
    return 'https://elearning-node.onrender.com';
  }
  
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

type ValidationError = {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
};

// Standard API response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[]; 
}

// API request configuration
interface ApiRequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

// Main API request function
export const apiRequest = async <T = any>(
  endpoint: string, 
  options: ApiRequestConfig = {}
): Promise<ApiResponse<T>> => {
  const { requiresAuth = true, ...fetchOptions } = options;
  const token = localStorage.getItem('token');

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add authorization header if required and token exists
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle unauthorized responses
    if (response.status === 401 && requiresAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized - redirecting to login');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Convenience methods for different HTTP verbs
export const api = {
  // GET request
  get: <T = any>(endpoint: string, options: ApiRequestConfig = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  // POST request
  post: <T = any>(endpoint: string, body?: any, options: ApiRequestConfig = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  // PUT request
  put: <T = any>(endpoint: string, body?: any, options: ApiRequestConfig = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  // PATCH request
  patch: <T = any>(endpoint: string, body?: any, options: ApiRequestConfig = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  // DELETE request
  delete: <T = any>(endpoint: string, options: ApiRequestConfig = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Specific API functions for your endpoints
export const authApi = {
  // Get current user
  me: () => api.get<{ user: any }>('/api/auth/me'),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>('/api/auth/login', credentials, { requiresAuth: false }),

  // Register user
  register: (registerData: any) =>
    api.post<{ token: string; requiresOTPVerification: any; user: any }>('/api/auth/register', registerData, { requiresAuth: false }),

  // Verify OTP
  verifyOTP: (otpData: { email: string; otp: string }) =>
    api.post<{ token: string; user: any }>('/api/auth/verify-otp', otpData, { requiresAuth: false }),

  // Verify Email
  verifyEmail: (token: string) =>  api.post('/api/auth/verify-email', {token}, { requiresAuth: false }),

  // Resend OTP
  resendOTP: (emailData: { email: string }) =>
    api.post<{  message: string  }>('/api/auth/resend-otp', emailData, { requiresAuth: false }),

  // Forgot password
  forgotPassword: (emailData: { email: string }) =>
    api.post<{ message: string }>('/api/auth/forgot-password', emailData, { requiresAuth: false }),

  // Reset password
  resetPassword: (resetData: { token: string; password: string }) =>
    api.post<{ message: string }>('/api/auth/reset-password', resetData, { requiresAuth: false }),

  // Logout
  logout: () => api.post('/api/auth/logout'),
};

export const userApi = {
  // Get user profile
  getProfile: () => api.get('/api/users/profile'),

  // Update user profile
  updateProfile: (profileData: any) => api.put('/api/users/profile', profileData),

  // Upload avatar
  uploadAvatar: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.post('/api/users/change-password', passwordData),

  changeEmail: (data: { newEmail: string; currentPassword: string }) => api.post(`/api/users/change-email`, data),

  // Get dashboard data
  getDashboard: () => api.get('/api/users/dashboard'),
};

export const adminApi = {

  getAdminInstructors: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/instructors-list${queryString ? `?${queryString}` : ''}`);
  },

  updateInstructorStatus: (instructorId: string, status: string) => {
    return api.put(`/api/admin/instructors/${instructorId}/status`, { status });
  },

  deleteInstructor: (instructorId: any) => {
    return api.delete(`/api/admin/instructors/${instructorId}`);
  },

  getCourseRequests: (params?: { page?: number; limit?: number; search?: string; status?: string; instructor?: string;}) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.instructor) queryParams.append('instructor', params.instructor);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/admin/course-requests?${queryString}` : '/api/admin/course-requests';
    
    return api.get(url);
  },

  getCourseRequestDetails: (courseId: string) => api.get(`/api/admin/course-requests/${courseId}`),

  getCourseRequestsStats: () => api.get('/api/admin/course-requests/stats/overview'),

  reviewCourseRequest: (courseId: string, data: {
    action: 'approve' | 'reject' | 'request-changes';
    comments: string;
  }) => {
    return api.put(`/api/admin/course-requests/${courseId}/review`, data);
  },

  getUsersForMessage: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/users${queryString ? `?${queryString}` : ''}`);
  },
  
  getAdminStudents: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/students-list${queryString ? `?${queryString}` : ''}`);
  },

  updateStudentStatus: (data: { studentIds: string[], status: string }) => api.put('/api/admin/students/status', data),

  deleteStudents: (studentIds: string[]) => api.delete(`/api/admin/students?ids=${studentIds.join(',')}`),

  getStudentProgress: (params?: { page?: number; limit?: number; search?: string; filter?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.filter) queryParams.append('status', params.filter);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/admin/students/progress?${queryString}` : '/api/admin/students/progress';
    
    return api.get(url);
  },

  getStudentDetailedProgress: (studentId: string) => {
    return api.get(`/api/admin/students/${studentId}/progress/detailed`);
  },

  getAdminCourses: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/admin/allCourses?${queryString}` : '/api/admin/allCourses';
    
    return api.get(url);
  },

  // Publish course
  publishCourse: (courseId: string, data: { status: string }) => api.put(`/api/admin/courses/${courseId}/status`, data),

    // Get course by slug
  getAdminCourseBySlug: (slug: string) => api.get(`/api/admin/courses/${slug}`),

  getAdminCertificate: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/certificates${queryString ? `?${queryString}` : ''}`);
  },
    // Get all quizzes
  getAdminQuizzes: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/instructors/quiz${queryString ? `?${queryString}` : ''}`);
  },
}

export const instructorApi = {

  getDashboardStats: () =>  api.get('/api/instructor/dashboard/stats'),

  getRecentCourses: (limit?: number) => api.get(`/api/instructor/dashboard/recent-courses?limit=${limit || 5}`),

  getEarningsChart: (period?: string) => api.get(`/api/instructor/dashboard/earnings-chart?period=${period || 'year'}`),
  getQuickStats: () => api.get('/api/instructor/dashboard/quick-stats'),


  getEarningsTransactions: (params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/instructor/dashboard/transactions?${queryString}` : '/api/instructor/dashboard/transactions';
    
    return api.get(url);
  },

  getTransactionsSummary: () => api.get('/api/instructor/dashboard/transactions/summary')
}

export const studentDashboardApi = {

  getDashboardStats: () => api.get('/api/student/dashboard/stats'),

  // Get recently enrolled courses
  getRecentCourses: () => api.get('/api/student/dashboard/recent-courses'),

  // Get quiz progress
  getQuizProgress: () => api.get('/api/student/dashboard/quiz-progress'),

  // Get recent invoices
  getRecentInvoices: () => api.get('/api/student/dashboard/recent-invoices'),

  // Get active quiz (if any)
  getActiveQuiz: () => api.get('/api/student/dashboard/active-quiz'),

  // Toggle course favorite
  toggleFavorite: (courseId: string) => api.post(`/api/student/courses/${courseId}/favorite`),

  getCertificates: () => api.get('/api/student/dashboard/certificates'),
}

export const resumeCoursesApi = {
  // Get last studied course for redirection
  getLastCourse: () => api.get('/api/student/resume/courses'),
};

export const courseApi = {
  // Get all courses for student
  getCourses: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/courses${queryString ? `?${queryString}` : ''}`, { requiresAuth: false });
  },
  // Get course by slug for learning
  getCourseBySlug: (slug: string) => api.get(`/api/courses/${slug}`),


  //////////* Create course (instructor only) *///////////
  // Step 1: Create/Update Course Basics
  createNewCourse: async (courseData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: courseData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  updateCourseBasics: async (courseId: string, courseData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/basics`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: courseData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Step 2: Syllabus & Content Management
  getCourseSyllabus: (courseId: string) => api.get(`/api/courses/${courseId}/syllabus`),
  updateCourseSyllabus: (courseId?: string, syllabusData?: any) => 
    api.put(`/api/courses/${courseId}/syllabus`, syllabusData),
  
  // Section management
  createSection: (sectionData: any) => api.post('/api/courses/sections', sectionData),
  updateSection: (sectionId: string, sectionData: any) => 
    api.put(`/api/courses/sections/${sectionId}`, sectionData),
  deleteSection: (sectionId: string) => api.delete(`/api/courses/sections/${sectionId}`),
  
  // Lesson management
  createLesson: async (lessonData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: lessonData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create lesson error:', error); 
      throw error;
    }
  },
  // Upload course media (instructor only)
  uploadMedia: async (mediaData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: mediaData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  updateLesson: async (lessonId: string, lessonData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: lessonData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create lesson error:', error); 
      throw error;
    }
  },

  deleteLesson: (lessonId: string) => api.delete(`/api/courses/lessons/${lessonId}`),
  // Reorder lessons within a section
  reorderLessons: (sectionId: string, lessonIds: string[]) => api.put(`/api/sections/${sectionId}/lessons/reorder`, lessonIds),

  //Upload Syllabus Document
  uploadSyllabusDocument: async (courseId: string, formData: FormData, onUploadProgress?: (progressEvent: any) => void
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onUploadProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onUploadProgress({
              loaded: event.loaded,
              total: event.total
            });
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Open and send request
      xhr.open('POST', `${API_BASE_URL}/api/courses/${courseId}/upload-syllabus`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      // Don't set Content-Type - browser will set it with boundary for FormData
      
      xhr.send(formData);
    });
  },
  getSyllabusDocuments: (courseId: string) => api.get(`/api/courses/${courseId}/syllabus-documents`),
  deleteSyllabusDocument: (courseId: string, documentId: string) => api.delete(`/api/courses/${courseId}/syllabus-documents/${documentId}`),

  // Step 3: Accreditation Request
  updateAccreditation: async (courseId: string, accreditationData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/accreditation`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: accreditationData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create lesson error:', error);
      throw error;
    }
  },

  // Step 4: Pricing & Access
  getCoursePricing: (courseId: string) => api.get(`/api/courses/${courseId}/pricing`),
  updatePricing: (courseId: string, pricingData: any) => 
    api.put(`/api/courses/${courseId}/pricing`, pricingData),

  // Step 5: SEO & Compliance
  updateSEO: (courseId: string, seoData: any) => 
    api.put(`/api/courses/${courseId}/seo`, seoData),

  // Step 6: Submit for Review
  submitForReview: (courseId: string) => api.post(`/api/courses/${courseId}/submit-review`),
  resubmitForReview: (courseId: string) => api.post(`/api/courses/${courseId}/resubmit-review`),
  updateCourseStatus: (courseId: string, status: any) => api.put(`/api/courses/${courseId}/status`, {status}),
  //////////* Finish creating course (instructor only) *///////////


  // General course methods
  getCourseById: (courseId: string) => api.get(`/api/courses/in/${courseId}`),
  getCourseStatus: (courseId: string) => api.get(`/api/courses/${courseId}/status`),

  // Delete course (instructor only)
  deleteCourse: (courseId: string) => api.delete(`/api/courses/${courseId}`),

  // Get instructor courses (instructor only)
  getInstructorCourses: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/courses/instructor/mycourses?${queryString}` : '/api/courses/instructor/mycourses';
    
    return api.get(url);
  },

  // Get course by slug
  getInstructorCourseBySlug: (slug: string) => api.get(`/api/courses/instructor/mycourses/${slug}`),

  // Add course review
  addReview: (courseId: string, reviewData: any) =>
    api.post(`/api/courses/${courseId}/reviews`, reviewData),

  // Get section by ID
  getSection: (sectionId: string) => api.get(`/api/sections/${sectionId}`),

  // Get lesson by ID
  getLesson: (lessonId: string) => api.get(`/api/lessons/${lessonId}`),

  // Get lessons by section ID
  getLessonsBySection: (sectionId: string) => api.get(`/api/sections/${sectionId}/lessons`),

  // Bulk operations
  // Duplicate section
  duplicateSection: async (sectionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sections/${sectionId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Duplicate section error:', error);
      throw error;
    }
  },

  // Duplicate lesson
  duplicateLesson: async (lessonId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Duplicate lesson error:', error);
      throw error;
    }
  },

  getEnrolledCourses: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/courses/student/enrolled-courses${queryString ? `?${queryString}` : ''}`);
  },
  
  getEnrollmentStats: () => api.get(`/api/courses/student/enrollment-stats`),

  getInstructorStudents: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/courses/instructor/students-list${queryString ? `?${queryString}` : ''}`);
  },
    
};

// Quiz API for Instructor
export const quizApi = {
  // Create quiz
  create: (data: Record<string, any>) => 
    api.post('/api/instructors/quiz', data),

  // Get all quizzes
  getInstructorQuizzes: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/instructors/quiz${queryString ? `?${queryString}` : ''}`);
  },

  // Get quiz by ID
  getById: (courseId: string) => 
    api.get(`/api/instructors/quiz/course/${courseId}`),

  // Update quiz
  update: (quizId: string, data: Record<string, any>) => 
    api.put(`/api/instructors/quiz/${quizId}`, data),

  // Delete quiz
  delete: (quizId: string) => 
    api.delete(`/api/instructors/quiz/${quizId}`),

  // Get quiz results
  getResults: (quizId: string, params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/instructors/quiz/${quizId}/results${queryString ? `?${queryString}` : ''}`);
  },

  // Get instructor courses for dropdown
  getCourses: () => 
    api.get('/api/instructors/courses'),
};
// Question API for Instructor
export const questionApi = {
  // Create question
  create: (quizId: string, data: Record<string, any>) => 
    api.post(`/api/instructor/quiz/${quizId}/questions`, data),

  // Get all questions for a quiz
  getQuizQuestions: (quizId: string, params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/instructor/quiz/${quizId}/questions${queryString ? `?${queryString}` : ''}`);
  },

  // Get question by ID
  getById: (quizId: string, questionId: string) => 
    api.get(`/api/instructor/quiz/${quizId}/questions/${questionId}`),

  // Update question
  update: (quizId: string, questionId: string, data: Record<string, any>) => 
    api.put(`/api/instructor/quiz/${quizId}/questions/${questionId}`, data),

  // Delete question
  delete: (quizId: string, questionId: string) => 
    api.delete(`/api/instructor/quiz/${quizId}/questions/${questionId}`),

  // Reorder questions
  reorder: (quizId: string, questionIds: string[]) => 
    api.put(`/api/instructor/quiz/${quizId}/questions/reorder`, { questionIds }),
};

// Student Quiz API
export const studentQuizApi = {
  // Start a quiz
  startQuiz: (quizId: string) => api.post(`/api/quiz/${quizId}/start`),

  // Continue a quiz
  continueQuiz: (quizId: string) => api.post(`/api/quiz/${quizId}/continue`),

  // Submit an answer
  submitAnswer: (attemptId: string, data: Record<string, any>) => api.post(`/api/quiz/attempt/${attemptId}/answer`, data),

  // Submit/finish quiz
  submitQuiz: (attemptId: string) => api.post(`/api/quiz/attempt/${attemptId}/submit`),

  // Get quiz results
  getResults: (attemptId: string) => api.get(`/api/quiz/attempt/${attemptId}/results`),

  // Get quiz attempts history
  getQuizAttempts: (quizId: string) => api.get(`/api/quiz/${quizId}/attempts`),

  // Get attempt status
  getAttemptStatus: (attemptId: string) => api.get(`/api/quiz/attempt/${attemptId}/status`),

  // Cancel attempt
  cancelAttempt: (attemptId: string) => api.delete(`/api/quiz/attempt/${attemptId}`),

  // Get all my attempts (for dashboard)
  getMyAttempts: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/quiz/my-attempts${queryString ? `?${queryString}` : ''}`);
  }
};

export const enrollmentApi = {
  // Enroll in course
  enroll: (courseId: string) => api.post('/api/enrollments', { courseId }),

  // Get user enrollments
  getEnrollments: () => api.get('/api/enrollments'),
};

export const progressApi = {
  // Update lesson progress
  updateProgress: (progressData: any) => api.post('/api/progress', progressData),

  // Get course progress
  getCourseProgress: (courseId: string) => api.get(`/api/progress/course/${courseId}`),
};

export const certificateApi = {
  // ==================== TEMPLATE MANAGEMENT ====================
  
  // Get all certificate templates
  getTemplates: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/certificate-templates${queryString ? `?${queryString}` : ''}`);
  },

  // Get single template by ID
  getTemplate: (id: string) => api.get(`/api/admin/certificate-templates/${id}`),

  // Create new certificate template
  createTemplate: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/certificate-templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Update certificate template
  updateTemplate: async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/certificate-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Update template with JSON data
  updateTemplateJson: (id: string, data: any) => api.put(`/api/admin/certificate-templates/${id}`, data),

  // Delete certificate template
  deleteTemplate: (id: string) => api.delete(`/api/admin/certificate-templates/${id}`),

  // Duplicate certificate template
  duplicateTemplate: (id: string, data: any = {}) => api.post(`/api/admin/certificate-templates/${id}/duplicate`, data),

  // ==================== TEMPLATE DESIGN BUILDER ====================

  // Update template design
  updateTemplateDesign: (id: string, designData: any) => api.put(`/api/admin/certificate-templates/${id}/design`, designData),

  // Add element to template
  addElement: (templateId: string, elementData: any) => api.post(`/api/admin/certificate-templates/${templateId}/elements`, elementData),

  // Update specific element
  updateElement: (templateId: string, elementId: string, updates: any) =>
    api.put(`/api/admin/certificate-templates/${templateId}/elements/${elementId}`, updates),

  // Remove element from template
  removeElement: (templateId: string, elementId: string) =>
    api.delete(`/api/admin/certificate-templates/${templateId}/elements/${elementId}`),

  // ==================== TEMPLATE PREVIEW & VALIDATION ====================

  // Generate preview with sample data
  generatePreview: (id: string, sampleData: any = {}) => api.post(`/api/admin/certificate-templates/${id}/preview`, { sampleData }),

  // Validate template before publishing
  validateTemplate: (id: string) => api.get(`/api/admin/certificate-templates/${id}/validation`),

  // Publish template
  publishTemplate: (id: string) => api.post(`/api/admin/certificate-templates/${id}/publish`),

  // ==================== ISSUED CERTIFICATES ====================

  // Get issued certificates for a template
  getIssuedCertificates: (templateId: string, params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/certificate-templates/${templateId}/issued-certificates${queryString ? `?${queryString}` : ''}`);
  },

  // Get specific issued certificate
  getIssuedCertificate: (certificateId: string) => api.get(`/api/admin/issued-certificates/${certificateId}`),

  // Revoke issued certificate
  revokeCertificate: (certificateId: string, reason: string = '') =>
    api.post(`/api/admin/issued-certificates/${certificateId}/revoke`, { reason }),

  // ==================== STUDENT CERTIFICATE FUNCTIONS ====================

  // Get student's eligible courses
  getEligibleCourses: () => api.get('/api/student-certificates/eligible-courses'),

  // Generate certificate for student
  generateCertificate: (courseId: string, templateId: string) =>
    api.post('/api/student-certificates/generate-certificate', {
      courseId,
      templateId
    }),

  // Get student's certificates
  getStudentCertificates: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/student-certificates${queryString ? `?${queryString}` : ''}`);
  },

  // Get specific student certificate
  getStudentCertificate: (certificateId: string) => api.get(`/api/student-certificates/${certificateId}`),

  // Download certificate
  downloadCertificate: async (certificateId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-certificates/${certificateId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Verify certificate (public endpoint)
  verifyCertificate: (certificateNumber: string) => api.get(`/api/certificates/verify/${certificateNumber}`, { requiresAuth: false }),

  // ==================== PAYMENT & PURCHASE ====================

  // Create payment intent
  createPaymentIntent: (courseId: string) => api.post('/api/student-certificates/create-payment-intent', { courseId }),

  // Confirm payment
  confirmPayment: (paymentIntentId: string) => api.post('/api/student-certificates/confirm-payment', { paymentIntentId }),

  // Request refund
  requestRefund: (certificateId: string, reason: string = '') =>
    api.delete(`/api/student-certificates/${certificateId}`, { 
      body: JSON.stringify({ reason }) 
    }),

  // ==================== BULK OPERATIONS ====================

  // Bulk generate certificates
  bulkGenerateCertificates: (courseId: string, templateId: string) =>
    api.post('/api/admin/certificates/bulk-generate', {
      courseId,
      templateId
    }),

  // ==================== LEGACY COMPATIBILITY ====================
  
  // Legacy endpoints for backward compatibility
  getAdminCertificate: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/admin/certificates${queryString ? `?${queryString}` : ''}`);
  },

  createCertificate: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/certificates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  updateCertificate: async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/certificates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  deleteCertificate: (id: string) =>
    api.delete(`/api/admin/certificates/${id}`),

  toggleStatus: (id: string) =>
    api.post(`/api/admin/certificates/${id}/toggle-status`),
};

export const studentCertificateApi = {
  // Get certificate status (combines eligible courses and purchased certificates)
  getCertificateStatus: () => api.get('/api/student-certificates/eligible-courses'),

  // Create payment intent
  createPaymentIntent: (courseId: string, templateId: string) => api.post('/api/student-certificates/create-payment-intent', { courseId, templateId }),

  // Confirm payment and generate certificate
  confirmPayment: (paymentIntentId: string) => api.post('/api/student-certificates/confirm-payment', { paymentIntentId }),

  // Get student's purchased certificates
  getStudentCertificates: () => api.get('/api/student-certificates'),

  // Download certificate
  downloadCertificate: (certificateId: string) => api.get(`/api/student-certificates/${certificateId}/download`),
};

export const paymentApi = {
  // Create payment intent
  createPaymentIntent: (paymentData: any) =>
    api.post('/api/payments/create-payment-intent', paymentData),

  // Confirm payment
  confirmPayment: (paymentData: any) => api.post('/api/payments/confirm', paymentData),

  // Get payment history
  getPaymentHistory: () => api.get('/api/payments/history'),

  // Request refund
  requestRefund: (paymentId: string, reason?: string) =>
    api.post('/api/payments/refund', { paymentId, reason }),

  // Get payment statistics
  getPaymentStats: () => api.get('/api/payments/stats'),
};

export const categoryApi = {
  // Get all categories
  getCategories: () => api.get('/api/categories', { requiresAuth: false }),
  
  // Create new category
  createCategory: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // your auth token
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      // Then parse as JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
  
  
  // Delete category
  deleteCategory: (id: string) => api.delete(`/api/categories/${id}`),
};

export const specialtyApi = {
  // Get all specialties (with optional category filter)
  getSpecialties: (categoryId?: string) => {
    const url = categoryId ? `/api/specialties?categoryId=${categoryId}` : '/api/specialties';
    return api.get(url, { requiresAuth: false });
  },
  
  // Create new specialty
  createSpecialty: (data: { name: string; categoryId: string }) => api.post('/api/specialties', data),
  
  // Update specialty
  updateSpecialty: (id: string, data: { name: string; categoryId: string }) => api.put(`/api/specialties/${id}`, data),
  
  // Delete specialty
  deleteSpecialty: (id: string) => api.delete(`/api/specialties/${id}`),
};

export const messageApi = {
  // Get all conversations for current user
  getConversations: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/messages/conversations${queryString ? `?${queryString}` : ''}`);
  },

  // Get single conversation details (optional - for better performance)
  getConversation: (conversationId: string) =>api.get(`/api/messages/conversations/${conversationId}`),

  // Get messages in a conversation
  getMessages: (conversationId: string, params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/messages/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ''}`);
  },

  // Send a message in conversation
  sendMessage: (conversationId: string, data: { content: string; attachments?: string[] }) => 
    api.post(`/api/messages/conversations/${conversationId}/messages`, data),

  // Get unread message count
  getUnreadCount: () => 
    api.get('/api/messages/unread-count'),

  // Start new conversation (Admin only)
  startConversation: (data: { recipientId: string; message: string }) =>
    api.post('/api/messages/conversations', data),
}

export const notifyApi = {
  // Get all notifications for current user
  getNotifications: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/notifications${queryString ? `?${queryString}` : ''}`);
  },

  // Get unread notification count
  getUnreadNotificationCount: () => api.get('/api/notifications/unread-count'),

  // Mark notification as read
  markNotificationAsRead: (notificationId: string) => api.patch(`/api/notifications/${notificationId}/read`),

  // Mark all notifications as read
  markAllNotificationsAsRead: () => api.patch('/api/notifications/mark-all-read'),

  // Delete a notification
  deleteNotification: (notificationId: string) =>  api.delete(`/api/notifications/${notificationId}`),

  // Send notification to specific user(s) (Admin only)
  sendNotification: (data: {
    userIds: string[];
    type: string;
    title: string;
    message: string;
    link?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }) => 
    api.post('/api/notifications/send', data),
};

// Add these methods to your api.ts file

export const getInstructorApi = {
  // Get all instructors with filters
  getInstructors: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/detail-instructors${queryString ? `?${queryString}` : ''}`, { requiresAuth: false });
  },

  // Get single instructor
  getInstructorById: (id: string) =>  api.get(`/api/detail-instructors/${id}`, { requiresAuth: false }),
};

export const contactApi = {
  // Submit contact form
  submitContact: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => api.post('/api/contact', data, { requiresAuth: false }),

  // Get all messages (Admin only)

  getMessages: (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return api.get(`/api/contact/messages${queryString ? `?${queryString}` : ''}`, { requiresAuth: false });
  },

  // Update message status (Admin only)
  updateMessageStatus: (id: string, status: string) =>
    api.patch(`/api/contact/messages/${id}/status`, { status }),
};

// Error handler utility
export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};


export const createSampleData = (overrides: any = {}) => ({
  studentName: "John Michael Smith",
  courseTitle: "Advanced Medical Certification Course",
  completionDate: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  certificateNumber: "CERT-2024-ABC123XYZ",
  instructorName: "Dr. Sarah Johnson, MD",
  creditHours: "8.5",
  creditType: "CME",
  accreditationBody: "American Medical Association",
  issueDate: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  ...overrides
});