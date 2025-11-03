import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi } from '../../../core/utils/api';
import './license.css';

interface CourseData {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  instructorId: string;
  categoryId: string;
  specialtyId?: string;
  level: string;
  language: string;
  duration: number;
  learningObjectives: string;
  targetAudience: string[];
  conflictOfInterest: {
    hasConflict: boolean;
    description: string;
  };
  heroImageUrl: string;
  heroImagePublicId: string;
  promoVideo?: string;
  status: string;
  submittedAt?: string | null;
  reviewFeedback?: string | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
  accreditationRequest: {
    creditType: string;
    creditHours: number;
    accreditationBody?: string;
    reviewerNotes?: string;
    supportingDocuments: Array<{
      url: string;
      publicId: string;
      originalName: string;
    }>;
    submittedAt: string;
  };
  accreditationStatus?: string | null;
  accreditedCreditHours: string;
  accreditedCreditType: string;
  pricing: {
    price: number;
    currency: string;
    accessType: string;
    visibility: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    termsAccepted: boolean;
  };
  totalEnrollments: number;
  totalRevenue: string;
  averageRating?: number | null;
  totalReviews: number;
  totalLessons: number;
  totalSections: number;
  isFeatured: boolean;
  featuredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  specialty?: {
    id: string;
    name: string;
    slug: string;
  };
  sections: Array<{
    id: string;
    title: string;
    description?: string | null;
    sortOrder: number;
    courseId: string;
    isPublished: boolean;
    totalLessons: number;
    totalDuration: number;
    hasQuiz: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  reviewerComments?: string;
}

interface ChecklistItem {
  step: string;
  completed: boolean;
  required: boolean;
}
interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}

const CourseReviewSubmit = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { step: 'Basics', completed: false, required: true },
    { step: 'Syllabus & Content', completed: false, required: true },
    { step: 'Pricing', completed: false, required: true },
    { step: 'SEO & Compliance', completed: false, required: true }
  ]);

   const loadCourseData = async () => {

    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    try {
      const response = await courseApi.getCourseById(courseId);
      if (response.success) {
        const data = response.data.course;
        setCourseData(data);
        setReviewerFeedback(data.reviewFeedback || null);
        
        // Update checklist based on course data
        setChecklist([
          { 
            step: 'Basics', 
            completed: !!(data.title && data.categoryId && data.learningObjectives && data.heroImageUrl),
            required: true 
          },
          { 
            step: 'Syllabus & Content', 
            completed: !!(data.sections && data.sections.length > 0 || data.syllabusDocuments && data.syllabusDocuments.length > 0),
            required: true 
          },
          { 
            step: 'Pricing', 
            // FIX: Check pricing object correctly
            completed: !!(data.pricing && data.pricing.price !== undefined && data.pricing.currency && data.pricing.accessType),
            required: true 
          },
          { 
            step: 'SEO & Compliance', 
            // FIX: termsAccepted not termsAcknowledged
            completed: !!(data.seoSettings && data.seoSettings.metaTitle && data.seoSettings.termsAccepted),
            required: true 
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course data');
    }
  };

  useEffect(() => {
    if (user && user.role !== 'instructor') {
      navigate(route.login);
    } else if (courseId) {
      loadCourseData();
    }
  }, [user, navigate, courseId]);

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

  const validateSubmission = (): boolean => {
    const requiredSteps = checklist.filter(item => item.required);
    const incompleteSteps = requiredSteps.filter(item => !item.completed);
    
    if (incompleteSteps.length > 0) {
      toast.error(`Please complete the following steps: ${incompleteSteps.map(s => s.step).join(', ')}`);
      return false;
    }

    // FIX: Check correct property
    if (!courseData?.seoSettings?.termsAccepted) {
      toast.error('You must acknowledge the terms and conditions before submitting');
      return false;
    }

    return true;
  };

  const saveDraft = async () => {

    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    setIsDraftSaving(true);
    try {
      const response = await courseApi.updateCourseStatus(courseId, 'draft');
      if (response.success) {
        toast.success('Draft saved successfully');
      } else {
        toast.error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const submitForReview = async () => {

    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    if (!validateSubmission()) return;

    setIsSubmitting(true);
    try {
      const response = await courseApi.submitForReview(courseId);
      if (response.success) {
        toast.success('Course submitted for review successfully!');
        setCourseData(prev => prev ? {...prev, status: 'submitted'} : null);
        setTimeout(() => {
          navigate(route.instructorCourse);
        }, 2000);
      } else {
        toast.error('Failed to submit course for review');
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      toast.error('Failed to submit course for review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resubmitForReview = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    if (!validateSubmission()) return;

    setIsSubmitting(true);
    try {
      const response = await courseApi.resubmitForReview(courseId);
      if (response.success) {
        toast.success('Course resubmitted for review successfully!');
        setCourseData(prev => prev ? {...prev, status: 'submitted'} : null);
        setTimeout(() => {
          navigate(route.instructorCourse);
        }, 2000);
      } else {
        toast.error('Failed to resubmit course for review');
      }
    } catch (error) {
      console.error('Error resubmitting course:', error);
      toast.error('Failed to resubmit course for review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToDraft = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }
    try {
      const response = await courseApi.updateCourseStatus(courseId, 'draft');
      if (response.success) {
        setCourseData(prev => prev ? {...prev, status: 'draft'} : null);
        toast.success('Course status changed to draft');
      }
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to change course status');
    }
  };

  const handlePrevious = () => {
    navigate(`/instructor/course-seo/${courseId}`);
  };

  const renderStatusBanner = () => {
    if (!courseData) return null;

    if (courseData.status === 'submitted') {
      return (
        <div className="alert alert-info">
          <i className="fa-solid fa-clock me-2"></i>
          Your course is under review. Expected turnaround: 5-10 business days. You cannot edit until feedback arrives.
        </div>
      );
    }
    
    if (courseData.status === 'changes_requested' && reviewerFeedback) {
      return (
        <div className="alert alert-warning">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          <strong>Reviewer Feedback:</strong> {reviewerFeedback.comments}
          <div className="mt-2">
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

    if (courseData.status === 'approved') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-check-circle me-2"></i>
          Approved - awaiting publication by Admin.
        </div>
      );
    }

    if (courseData.status === 'published') {
      return (
        <div className="alert alert-success">
          <i className="fa-solid fa-globe me-2"></i>
          Live - Enrollments open.
        </div>
      );
    }

    return null;
  };

  const renderCoursePreview = () => {
    if (!courseData) return null;

    return (
      <div className="course-preview-card border rounded p-4 bg-white">
        <div className="row">
          <div className="col-md-4">
            {/* FIX: Use heroImageUrl not heroImage */}
            {courseData.heroImageUrl && (
              <img 
                src={courseData.heroImageUrl} 
                alt={courseData.title}
                className="img-fluid rounded"
                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="col-md-8">
            <h4 className="mb-2">{courseData.title}</h4>
            {courseData.subtitle && (
              <p className="text-muted mb-2">{courseData.subtitle}</p>
            )}
            <div className="course-meta mb-3">
              {/* FIX: Access category and specialty names correctly */}
              <span className="badge bg-primary me-2">{courseData.category?.name}</span>
              <span className="badge bg-secondary me-2">{courseData.specialty?.name}</span>
              <span className="badge bg-info me-2">{courseData.level}</span>
            </div>
            <div className="row mb-3">
              <div className="col-sm-6">
                <small className="text-muted">Duration:</small>
                {/* FIX: Duration might be 0, show appropriate message */}
                <div>{courseData.duration || courseData.duration || 'Not set'}</div>
              </div>
              <div className="col-sm-6">
                <small className="text-muted">Language:</small>
                <div>{courseData.language}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <small className="text-muted">Price:</small>
                <div className="text-success">
                  {/* FIX: Access pricing correctly */}
                  {courseData.pricing?.currency === 'USD' ? '$' : courseData.pricing?.currency === 'EUR' ? '€' : '£'}
                  {(typeof courseData.pricing?.price === 'number'
                    ? courseData.pricing.price
                    : parseFloat(courseData.pricing?.price || '0')
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FIX: Use learningObjectives not objectives */}
        {courseData.learningObjectives && (
          <div className="mt-3">
            <h6>Learning Objectives:</h6>
            <div dangerouslySetInnerHTML={{ __html: courseData.learningObjectives }} />
          </div>
        )}
        
        {courseData.sections && courseData.sections.length > 0 && (
          <div className="mt-3">
            <h6>Course Content:</h6>
            <div className="text-muted">
              {courseData.sections.length} sections with{' '}
              {/* FIX: Use totalLessons from section object */}
              {courseData.sections.reduce((total, section) => total + (section.totalLessons || 0), 0)} lectures
            </div>
          </div>
        )}
      </div>
    );
  };

  const isReadOnly = ['submitted', 'approved', 'published'].includes(courseData?.status || '');
  const canSubmit = checklist.every(item => !item.required || item.completed) && courseData?.seoSettings?.termsAccepted;
  const isChangesRequested = courseData?.status === 'changes_requested';

  return (
    <>
      <Breadcrumb title="Course Upload - Review & Submit" />
      
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {renderStatusBanner()}
              
              <div className="add-course-item">
                <div className="wizard">
                  <ul className="form-wizard-steps">
                    <li className="progress-activated">
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
                    <li className="progress-activated">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">02</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Syllabus & Content</p>
                        </div>
                      </div>
                    </li>
                    <li className="progress-activated">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">03</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>Pricing</p>
                        </div>
                      </div>
                    </li>
                    <li className="progress-activated">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">04</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
                        </span>
                        <div className="step-section">
                          <p>SEO</p>
                        </div>
                      </div>
                    </li>
                    <li className="progress-active">
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">05</span>
                          <span className="tickmark">
                            <i className="fa-solid fa-check" />
                          </span>
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
                      <h5>Review & Submit</h5>
                      <p>Review your course details and submit for accreditation approval</p>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="checklist-card border rounded p-4 mb-4">
                          <h6 className="mb-3">
                            <i className="fa-solid fa-list-check me-2"></i>
                            Completion Checklist
                          </h6>
                          {checklist.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                              <i className={`fa-solid ${item.completed ? 'fa-check-circle text-success' : 'fa-circle text-muted'} me-2`}></i>
                              <span className={item.completed ? 'text-success' : 'text-muted'}>
                                {item.step}
                                {item.required && <span className="text-danger ms-1">*</span>}
                              </span>
                            </div>
                          ))}
                          <hr className="my-3" />
                          <div className="completion-status">
                            <strong>
                              Status: {canSubmit ? (
                                <span className="text-success">Ready to Submit</span>
                              ) : (
                                <span className="text-warning">Incomplete</span>
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="submission-info-card border rounded p-4 mb-4 bg-light">
                          <h6 className="mb-3">
                            <i className="fa-solid fa-info-circle me-2"></i>
                            Submission Process
                          </h6>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="fa-solid fa-arrow-right text-primary me-2"></i>
                              Course will be submitted for review
                            </li>
                            <li className="mb-2">
                              <i className="fa-solid fa-clock text-primary me-2"></i>
                              Expected review time: 5-10 business days
                            </li>
                            <li className="mb-2">
                              <i className="fa-solid fa-lock text-primary me-2"></i>
                              Course will be locked during review
                            </li>
                            <li className="mb-2">
                              <i className="fa-solid fa-bell text-primary me-2"></i>
                              You'll be notified of the review outcome
                            </li>
                            <li className="mb-0">
                              <i className="fa-solid fa-globe text-primary me-2"></i>
                              Published after admin approval
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="preview-section mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>
                              <i className="fa-solid fa-eye me-2"></i>
                              Course Preview
                            </h6>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              {showPreview ? 'Hide' : 'Show'} Preview
                            </button>
                          </div>
                          
                          {showPreview && renderCoursePreview()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="sticky-footer">
                    <div className="row">
                      <div className="col-sm-4">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handlePrevious}
                          disabled={isSubmitting || isDraftSaving}
                        >
                          <i className="fa-solid fa-arrow-left me-2"></i>
                          Previous
                        </button>
                      </div>
                      <div className="col-sm-8 text-end">
                        {courseData?.status === 'draft' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline-secondary me-2"
                              onClick={saveDraft}
                              disabled={isSubmitting || isDraftSaving}
                            >
                              {isDraftSaving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-save me-2"></i>
                                  Save Draft
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={submitForReview}
                              disabled={!canSubmit || isSubmitting || isDraftSaving}
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-paper-plane me-2"></i>
                                  Submit for Review
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {isChangesRequested && (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline-secondary me-2"
                              onClick={backToDraft}
                              disabled={isSubmitting}
                            >
                              <i className="fa-solid fa-edit me-2"></i>
                              Back to Draft
                            </button>
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={resubmitForReview}
                              disabled={!canSubmit || isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Resubmitting...
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-redo me-2"></i>
                                  Resubmit for Review
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseReviewSubmit;