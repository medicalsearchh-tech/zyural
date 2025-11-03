import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import CustomSelect from '../../../core/common/commonSelect';
import { CourseLevel, Language } from '../../../core/common/selectOption/json/selectOption';
import type { OptionType } from '../../../core/common/commonSelect';
import DefaultEditor from 'react-simple-wysiwyg';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi, categoryApi, specialtyApi } from '../../../core/utils/api';
import { toast } from 'react-toastify';
import './license.css';

interface CourseBasicsData {
  title: string;
  subtitle: string;
  categoryId: string;
  specialtyId: string;
  level: 'beginner' | 'intermediate' | 'advanced' | '';
  language: string;
  duration: number; // in minutes
  learningObjectives: string;
  targetAudience: string[];
  conflictOfInterest: {
    hasConflict: boolean;
    description: string;
  };
  heroImage: File | null;
  heroImagePreview: string;
  promoVideo: string; // URL
}

interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}

const CourseBasics = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});

  const [categories, setCategories] = useState<OptionType[]>([]);
  const [specialties, setSpecialties] = useState<(OptionType & { categoryId?: string })[]>([]);
  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [courseStatus, setCourseStatus] = useState<string>('draft');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState<CourseBasicsData>({
    title: '',
    subtitle: '',
    categoryId: '',
    specialtyId: '',
    level: '',
    language: '',
    duration: 0,
    learningObjectives: '',
    targetAudience: [],
    conflictOfInterest: {
      hasConflict: false,
      description: ''
    },
    heroImage: null,
    heroImagePreview: '',
    promoVideo: ''
  });

  const loadCourseData = async (courseId: string) => {
    try {
      const response = await courseApi.getCourseById(courseId);
      if (response.success) {
        const course = response.data.course;
        setFormData({
          title: course.title || '',
          subtitle: course.subtitle || '',
          categoryId: course.categoryId || '',
          specialtyId: course.specialtyId || '',
          level: course.level || '',
          language: course.language || '',
          duration: course.duration || 0,
          learningObjectives: course.learningObjectives || '',
          targetAudience: course.targetAudience || [],
          conflictOfInterest: course.conflictOfInterest || { hasConflict: false, description: '' },
          heroImage: null,
          heroImagePreview: course.heroImageUrl || '',
          promoVideo: course.promoVideo || ''
        });
        setCourseStatus(course.status || 'draft');
        setReviewerFeedback(course.reviewFeedback || null);
        setHasUnsavedChanges(false); 
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course data');
    }
  };

  // Load existing course data if editing
  useEffect(() => {
    if (courseId && courseId !== 'new') {
      loadCourseData(courseId);
    }
  }, [courseId]);

  // Add this useEffect for fetching categories and specialties
  useEffect(() => {
    const fetchCategoriesAndSpecialties = async () => {
      try {
        setLoadingData(true);
        
        // Fetch categories
        const categoriesResponse = await categoryApi.getCategories();
        if (categoriesResponse.success) {
          const categoryOptions = categoriesResponse.data.categories.map((cat: any) => ({
            value: cat.id,
            label: cat.name
          }));
          setCategories(categoryOptions);
        }

        // Fetch specialties
        const specialtiesResponse = await specialtyApi.getSpecialties();
        if (specialtiesResponse.success) {
          const specialtyOptions = specialtiesResponse.data.specialties.map((spec: any) => ({
            value: spec.id,
            label: spec.name,
            categoryId: spec.categoryId
          }));
          setSpecialties(specialtyOptions);
        }
      } catch (error) {
        console.error('Error fetching categories and specialties:', error);
        toast.error('Failed to load categories and specialties');
      } finally {
        setLoadingData(false);
      }
    };

    fetchCategoriesAndSpecialties();
  }, []);


  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate(route.login);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate(route.login);
    return null;
  }

  const validateForm = (): boolean => {
    const errors: {[key: string]: boolean} = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      errors.title = true;
      setFieldErrors(errors);
      return false;
    } else if (formData.title.length > 120) {
      toast.error('Title cannot exceed 120 characters');
      errors.title = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.duration) {
      toast.error('Course duration is required');
      errors.duration = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.categoryId) {
      toast.error('Course category is required');
      errors.categoryId = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.specialtyId) {
      toast.error('Specialty is required');
      errors.specialtyId = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.language) {
      toast.error('Language is required');
      errors.language = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.learningObjectives.trim()) {
      toast.error('Learning objectives are required');
      errors.learningObjectives = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.heroImage && !formData.heroImagePreview) {
      toast.error('Hero image is required');
      errors.heroImage = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.conflictOfInterest.hasConflict) {
      toast.error('Please acknowledge conflicts of interest');
      errors.hasConflict = true;
      setFieldErrors(errors);
      return false;
    }

    if (!formData.conflictOfInterest.description.trim()) {
      toast.error('Please describe your conflicts of interest');
      errors.conflictOfInterest = true;
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return isValid;
  };

  const saveDraft = async () => {
    if (!validateForm()) return;
    setIsDraftSaving(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('specialtyId', formData.specialtyId);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('duration', formData.duration.toString());
      formDataToSend.append('learningObjectives', formData.learningObjectives);
      formDataToSend.append('targetAudience', JSON.stringify(formData.targetAudience));
      formDataToSend.append('conflictOfInterest', JSON.stringify(formData.conflictOfInterest));
      formDataToSend.append('promoVideo', formData.promoVideo);
      
      // Handle hero image
      if (formData.heroImage) {
        formDataToSend.append('heroImage', formData.heroImage);
      }

      formDataToSend.append('status', 'draft');
      
      let response;
      if (courseId && courseId !== 'new') {
        if (hasUnsavedChanges) {
          response = await courseApi.updateCourseBasics(courseId, formDataToSend);
        }
      } else {
        response = await courseApi.createNewCourse(formDataToSend);
      }

      if (response.success) {
        toast.success('Draft saved successfully');
        
        const newCourseId = response.data.course.id;
      
        // If this was a new course, update the URL without navigation
        if (courseId === 'new') {
          navigate(`/admin/create-course/${newCourseId}`, { replace: true });
        }
        setHasUnsavedChanges(false);
        return newCourseId;
      } else {
        toast.error('Failed to save draft');
        return null;
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return null;
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let savedCourseId = courseId && courseId !== 'new' ? courseId : null;
    
      // Only save if there are unsaved changes or it's a new course
      if (hasUnsavedChanges || savedCourseId == 'new') {
        const newCourseId = await saveDraft();
        
        if (!newCourseId) {
          toast.error('Failed to save course. Please try again.');
          setIsSubmitting(false);
          return;
        }
        
        savedCourseId = newCourseId; // Update with the newly created/saved course ID
      }
      // Use the saved courseId to navigate
      navigate(`/admin/course-syllabus/${savedCourseId}`);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error('Failed to proceed to next step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CourseBasicsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only JPEG, PNG, GIF, or WebP images');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        heroImage: file,
        heroImagePreview: previewUrl
      }));
      setHasUnsavedChanges(true);
      
      // Clear error for hero image
      if (fieldErrors.heroImage) {
        setFieldErrors(prev => ({
          ...prev,
          heroImage: false
        }));
      }
    }
  };

  const addTargetAudience = () => {
    setFormData(prev => ({
      ...prev,
      targetAudience: [...prev.targetAudience, '']
    }));
    setHasUnsavedChanges(true);
  };

  const updateTargetAudience = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.map((item, i) => i === index ? value : item)
    }));
    setHasUnsavedChanges(true);
  };

  const removeTargetAudience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const filteredSpecialties = formData.categoryId 
    ? specialties.filter(specialty => specialty.categoryId === formData.categoryId)
    : specialties;

  // Update the Specialty select to use filtered options and reset when category changes
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value,
      specialtyId: ''
    }));
    setHasUnsavedChanges(true);
    
    // Clear error for category
    if (fieldErrors.categoryId) {
      setFieldErrors(prev => ({
        ...prev,
        categoryId: false
      }));
    }
  };

  const currentLevelOption = CourseLevel.find(option => option.value === formData.level);
  const currentLanguageOption = Language.find(option => option.value === formData.language);

  // Show status banner if course is in review or has feedback
  const renderStatusBanner = () => {
    if (courseStatus === 'submitted') {
      return (
        <div className="alert alert-info">
          <i className="fa-solid fa-clock me-2"></i>
          Your course is under review. Expected turnaround: 5-10 business days. You cannot edit until feedback arrives.
        </div>
      );
    }
    
    if (courseStatus === 'changes_requested' && reviewerFeedback) {
      return (
        <div className="alert alert-warning">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          <strong>Reviewer Feedback:</strong> {reviewerFeedback.comments}
          <div className="mt-2">
            <a href="#reviewer-comments" className="btn btn-sm btn-outline-warning">
              View Detailed Comments
            </a>
          </div>
        </div>
      );
    }

    if (courseStatus === 'approved') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-check-circle me-2"></i>
          Approved - awaiting publication by Admin.
        </div>
      );
    }

    if (courseStatus === 'published') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-globe me-2"></i>
          Live - Enrollments open.
        </div>
      );
    }

    return null;
  };

  const renderReviewerComments = () => {
    if (courseStatus === 'changes_requested' && reviewerFeedback) {
      return (
        <div id="reviewer-comments" className="reviewer-feedback-section mb-4">
          <div className="card border-warning">
            <div className="card-header bg-warning bg-opacity-10">
              <h6 className="mb-0">
                <i className="fa-solid fa-comment-dots me-2"></i>
                Reviewer Comments
              </h6>
            </div>
            <div className="card-body">
              <p><strong>General Comments:</strong></p>
              <p className="mb-3">{reviewerFeedback.comments}</p>
              
              {reviewerFeedback.requestedChanges && reviewerFeedback.requestedChanges.length > 0 && (
                <div>
                  <p><strong>Requested Changes:</strong></p>
                  <ul className="list-unstyled">
                    {reviewerFeedback.requestedChanges.map((change, index) => (
                      <li key={index} className="mb-1">
                        <i className="fa-solid fa-circle-exclamation text-warning me-2"></i>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const isReadOnly = ['submitted', 'approved', 'published'].includes(courseStatus);

  return (
    <>
      <style>{`
        .is-invalid {
          border-color: #dc3545 !important;
        }
        .has-error .ant-select-selector {
          border-color: #dc3545 !important;
        }
        .has-error .form-control {
          border-color: #dc3545 !important;
        }
        .has-error-ground {
          background: #fddee1ff !important;
          border-radius: 5px;
        }
      `}</style>
      <Breadcrumb title="Course Upload - Basic Information" />
      
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {renderStatusBanner()}
              {renderReviewerComments()}
              <div className="add-course-item">
                <div className="wizard">
                  <ul className="form-wizard-steps">
                    <li className="progress-active">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">01</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Basics</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">02</span>
                        </span>
                        <div className="step-section">
                          <p>Syllabus & Content</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">03</span>
                        </span>
                        <div className="step-section">
                          <p>Accreditation</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">04</span>
                        </span>
                        <div className="step-section">
                          <p>Pricing</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">05</span>
                        </span>
                        <div className="step-section">
                          <p>SEO</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">06</span>
                        </span>
                        <div className="step-section">
                          <p>Review & Submit</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="initialization-form-set">
                  <div className="form-inner wizard-form-card">
                    <div className="title">
                      <h5>Basic Information</h5>
                      <p>Capture metadata about the course</p>
                    </div>

                    <div className="row">
                      <div className="col-md-8">
                        <div className="input-block">
                          <label className="form-label">
                            Course Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                            placeholder="Enter course title (max 120 characters)"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            maxLength={120}
                            disabled={isReadOnly}
                            required
                          />
                          <small className="text-muted">{formData.title.length}/120 characters</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">Estimated Duration (minutes) <span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className={`form-control ${fieldErrors.duration ? 'is-invalid' : ''}`}
                            placeholder="0"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                            disabled={isReadOnly}
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">Subtitle (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter course subtitle"
                            value={formData.subtitle}
                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">
                            Course Category <span className="text-danger">*</span>
                          </label>
                          <div className={fieldErrors.categoryId ? 'has-error' : ''}>
                            <CustomSelect
                              options={categories}
                              className={`select d-flex ${fieldErrors.categoryId ? 'is-invalid' : ''}`}
                              placeholder={loadingData ? "Loading categories..." : "Select category"}
                              value={categories.find(cat => cat.value === formData.categoryId)}
                              onChange={(value: OptionType) => handleCategoryChange(String(value.value))}
                              disabled={isReadOnly || loadingData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">
                            Specialty <span className="text-danger">*</span>
                          </label>
                            <div className={fieldErrors.specialtyId ? 'has-error' : ''}>
                              <CustomSelect
                                options={filteredSpecialties}
                                className={`select d-flex ${fieldErrors.specialtyId ? 'is-invalid' : ''}`}
                                placeholder={loadingData ? "Loading specialties..." : "Select specialty"}
                                value={specialties.find(spec => spec.value === formData.specialtyId)}
                                onChange={(value: OptionType) => handleSelectChange('specialtyId', String(value.value))}
                                disabled={!formData.categoryId || isReadOnly || loadingData}
                              />
                            </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">Level</label>
                          <CustomSelect
                            options={CourseLevel}
                            className="select d-flex"
                            placeholder="Select level"
                            value={currentLevelOption}
                            onChange={(value: OptionType) => handleSelectChange('level', String(value.value))}
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Language <span className="text-danger">*</span>
                          </label>
                          <div className={fieldErrors.language ? 'has-error' : ''}>
                            <CustomSelect
                              options={Language}
                              className={`select d-flex ${fieldErrors.language ? 'is-invalid' : ''}`}
                              placeholder="Select language"
                              value={currentLanguageOption}
                              onChange={(value: OptionType) => handleSelectChange('language', String(value.value))}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">Promo Video (Optional)</label>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="Enter video URL"
                            value={formData.promoVideo}
                            onChange={(e) => handleInputChange('promoVideo', e.target.value)}
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Learning Objectives <span className="text-danger">*</span>
                          </label>
                          <div className={`summernote ${fieldErrors.learningObjectives ? 'has-error-ground' : ''}`}>
                            <DefaultEditor
                              value={formData.learningObjectives}
                              onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Hero Image <span className="text-danger">*</span>
                          </label>
                          <div className={`row align-items-center ${fieldErrors.heroImage ? 'has-error' : ''}`}>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className={`form-control ${fieldErrors.heroImage ? 'is-invalid' : ''}`}
                                placeholder={formData.heroImage ? formData.heroImage.name : "No File Selected"}
                                value={formData.heroImage ? formData.heroImage.name : ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-4 d-grid">
                              <label
                                htmlFor="hero-image-upload"
                                className={`file-upload-btn text-center ${isReadOnly ? 'disabled' : ''}`}
                              >
                                Upload File
                              </label>
                              <input
                                type="file"
                                id="hero-image-upload"
                                name="heroImage"
                                accept="image/jpeg, image/png, image/gif, image/webp"
                                onChange={handleFileUpload}
                                disabled={isReadOnly}
                                style={{ display: 'none' }}
                              />
                            </div>
                          </div>
                          {formData.heroImagePreview && (
                            <div className="mt-2">
                              <img
                                src={formData.heroImagePreview}
                                alt="Hero Preview"
                                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                className="img-fluid mb-4"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">Target Audience</label>
                          <div className="bg-light border p-3 rounded">
                            {formData.targetAudience.map((audience, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  placeholder="Enter target audience"
                                  value={audience}
                                  onChange={(e) => updateTargetAudience(index, e.target.value)}
                                  disabled={isReadOnly}
                                />
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeTargetAudience(index)}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                )}
                              </div>
                            ))}
                            {!isReadOnly && (
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={addTargetAudience}
                              >
                                <i className="fa-solid fa-plus me-1"></i>
                                Add Audience
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Disclosure of Conflicts of Interest <span className="text-danger">*</span>
                          </label>
                          <div className="form-check mb-2">
                            <input
                              className={`form-check-input ${fieldErrors.hasConflict ? 'is-invalid' : ''}`}
                              type="checkbox"
                              id="conflictCheckbox"
                              checked={formData.conflictOfInterest.hasConflict}
                              onChange={(e) => handleInputChange('conflictOfInterest', {
                                ...formData.conflictOfInterest,
                                hasConflict: e.target.checked
                              })}
                              disabled={isReadOnly}
                            />
                            <label className="form-check-label" htmlFor="conflictCheckbox">
                              I acknowledge that I have conflicts of interest to disclose
                            </label>
                          </div>
                          <textarea
                            className={`form-control ${fieldErrors.conflictOfInterest ? 'is-invalid' : ''}`}
                            rows={3}
                            placeholder={formData.conflictOfInterest.hasConflict ? 
                              "Please describe your conflicts of interest" : 
                              "Please confirm you have no conflicts of interest"}
                            value={formData.conflictOfInterest.description}
                            onChange={(e) => handleInputChange('conflictOfInterest', {
                              ...formData.conflictOfInterest,
                              description: e.target.value
                            })}
                            disabled={isReadOnly}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {!isReadOnly && (
                      <div className="add-form-btn widget-next-btn submit-btn d-flex justify-content-between mb-0">
                        <div className="btn-left">
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${isDraftSaving ? 'disabled' : ''}`}
                            onClick={saveDraft}
                            disabled={isDraftSaving}
                          >
                            {isDraftSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving Draft...
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-save me-1"></i>
                                Save Draft
                              </>
                            )}
                          </button>
                        </div>
                        <div className="btn-right">
                          <button
                            type="button"
                            className={`btn main-btn next_btns ${isSubmitting ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                Next <i className="isax isax-arrow-right-3 ms-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseBasics;