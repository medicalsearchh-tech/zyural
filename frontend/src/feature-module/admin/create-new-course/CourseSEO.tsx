import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi } from '../../../core/utils/api';
import './license.css';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  termsAcknowledged: boolean;
}
interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}

const CourseSEO = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [courseStatus, setCourseStatus] = useState<string>('draft');
  const [courseTitle, setCourseTitle] = useState<string>('');

  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);
  const [formData, setFormData] = useState<SEOData>({
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    termsAcknowledged: false
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
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

  const loadCourseData = async () => {

    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    try {
      const response = await courseApi.getCourseById(courseId);
      if (response.success) {
        const data = response.data.course;
        setCourseTitle(data.title || '');
        setFormData({
          metaTitle: data.seoSettings.metaTitle || data.title || '',
          metaDescription: data.seoSettings.metaDescription || '',
          keywords: data.seoSettings.keywords || [],
          termsAcknowledged: data.seoSettings.termsAcknowledged || false
        });
        setCourseStatus(data.status || 'draft');
        setReviewerFeedback(data.reviewFeedback || null);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course data');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.metaTitle.trim()) {
      toast.error('SEO title is required');
      return false;
    }

    if (formData.metaDescription.length > 160) {
      toast.error('Meta description cannot exceed 160 characters');
      return false;
    }

    if (!formData.termsAcknowledged) {
      toast.error('You must acknowledge the terms and conditions');
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
      const response = await courseApi.updateSEO(courseId, {
        ...formData,
        status: 'draft'
      });

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

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await saveDraft();
      navigate(`/admin/course-review/${courseId}`);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error('Failed to proceed to next step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate(`/admin/course-pricing/${courseId}`);
  };

  const handleInputChange = (field: keyof SEOData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !formData.keywords.includes(keyword)) {
      if (formData.keywords.length >= 10) {
        toast.error('Maximum 10 keywords allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const copyFromTitle = () => {
    if (courseTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: courseTitle
      }));
      toast.success('SEO title copied from course title');
    }
  };

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
      <Breadcrumb title="Course Upload - SEO & Compliance" />
      
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {renderStatusBanner()}
              {renderReviewerComments()}
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
                          <p>Accreditation</p>
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
                          <p>Pricing</p>
                        </div>
                      </div>
                    </li>
                    <li className="progress-active">
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
                      <h5>SEO & Compliance</h5>
                      <p>Optimize your course for search engines and ensure compliance</p>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            SEO Title <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter SEO title"
                              value={formData.metaTitle}
                              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                              disabled={isReadOnly}
                              required
                            />
                            {!isReadOnly && courseTitle && (
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={copyFromTitle}
                                title="Copy from course title"
                              >
                                <i className="fa-solid fa-copy"></i>
                              </button>
                            )}
                          </div>
                          <small className="text-muted">
                            This will appear as the page title in search results. 
                            {formData.metaTitle ? ` Current length: ${formData.metaTitle.length} characters` : ''}
                          </small>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">Meta Description</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            maxLength={160}
                            placeholder="Enter a brief description of your course for search engines (max 160 characters)"
                            value={formData.metaDescription}
                            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                            disabled={isReadOnly}
                          />
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">
                              This will appear as the description snippet in search results
                            </small>
                            <small className={`${formData.metaDescription.length > 160 ? 'text-danger' : 'text-muted'}`}>
                              {formData.metaDescription.length}/160 characters
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">Keywords</label>
                          <div className="keywords-input-section">
                            <div className="d-flex gap-2 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter a keyword and press Enter"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyPress={handleKeywordInputKeyPress}
                                disabled={isReadOnly}
                              />
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={addKeyword}
                                  disabled={!keywordInput.trim() || formData.keywords.length >= 10}
                                >
                                  Add
                                </button>
                              )}
                            </div>
                            
                            <div className="keywords-list">
                              {formData.keywords.map((keyword, index) => (
                                <span key={index} className="badge bg-success me-2 mb-2">
                                  {keyword}
                                  {!isReadOnly && (
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-2"
                                      style={{ fontSize: '0.65em' }}
                                      onClick={() => removeKeyword(index)}
                                      aria-label="Remove keyword"
                                    ></button>
                                  )}
                                </span>
                              ))}
                            </div>
                            
                            <small className="text-muted">
                              Add relevant keywords to help users find your course. Maximum 10 keywords allowed.
                              {formData.keywords.length > 0 && ` (${formData.keywords.length}/10 used)`}
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="termsAcknowledged"
                              checked={formData.termsAcknowledged}
                              onChange={(e) => handleInputChange('termsAcknowledged', e.target.checked)}
                              disabled={isReadOnly}
                              required
                            />
                            <label className="form-check-label" htmlFor="termsAcknowledged">
                              <strong className='text-xl text-danger'>Terms Acknowledgement</strong> <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="terms-content mt-2 p-3 border rounded bg-light">
                            <p className="mb-2"><strong>By checking this box, I acknowledge that:</strong></p>
                            <ul className="list-unstyled mb-0">
                              <li className="mb-1">
                                <i className="fa-solid fa-check text-success me-2"></i>
                                I have read and agree to the platform's Terms of Service
                              </li>
                              <li className="mb-1">
                                <i className="fa-solid fa-check text-success me-2"></i>
                                I understand that my course requires review and accreditation approval before publication
                              </li>
                              <li className="mb-1">
                                <i className="fa-solid fa-check text-success me-2"></i>
                                All course content is original or I have proper rights to use the materials
                              </li>
                              <li className="mb-1">
                                <i className="fa-solid fa-check text-success me-2"></i>
                                I will comply with all applicable medical education and professional standards
                              </li>
                              <li className="mb-0">
                                <i className="fa-solid fa-check text-success me-2"></i>
                                I understand the revenue sharing terms as displayed in my admin settings
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="seo-preview-card border rounded p-4 bg-light">
                          <h6 className="mb-3">
                            <i className="fa-solid fa-search me-2"></i>
                            Search Engine Preview
                          </h6>
                          <div className="search-preview">
                            <div className="preview-title text-primary text-decoration-underline">
                              {formData.metaTitle || 'Your Course Title'}
                            </div>
                            <div className="preview-url text-success small">
                              https://zyural.com/courses/{courseId}
                            </div>
                            <div className="preview-description text-muted">
                              {formData.metaDescription || 'Your course description will appear here...'}
                            </div>
                            {formData.keywords.length > 0 && (
                              <div className="preview-keywords mt-2">
                                <small className="text-muted">Keywords: </small>
                                {formData.keywords.slice(0, 5).map((keyword, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1 small">
                                    {keyword}
                                  </span>
                                ))}
                                {formData.keywords.length > 5 && (
                                  <span className="text-muted small">
                                    +{formData.keywords.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isReadOnly && (
                    <div className="add-form-btn widget-next-btn submit-btn d-flex justify-content-between mb-0">
                      <div className="btn-left d-flex gap-2">
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
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handlePrevious}
                        >
                          <i className="fa-solid fa-arrow-left me-1"></i>
                          Previous
                        </button>
                      </div>
                      <div className="btn-right">
                        <button
                          type="button"
                          className={`btn main-btn btn-secondary next_btns ${isSubmitting ? 'disabled' : ''}`}
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
    </>
  );
};

export default CourseSEO;