import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi } from '../../../core/utils/api';
import './license.css';

interface PricingData {
  price: number;
  certPrice: number;
  currency: 'USD' | 'EUR' | 'GBP';
  accessType: 'one-time';
  visibility: 'public' | 'unlisted';
}

interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}


const CoursePricing = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [courseStatus, setCourseStatus] = useState<string>('draft');

  const [formData, setFormData] = useState<PricingData>({
    price: 0,
    certPrice: 0,
    currency: 'USD',
    accessType: 'one-time',
    visibility: 'public'
  });

  const currencies = [
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' }
  ];

  const loadCourseData = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    try {
      const response = await courseApi.getCoursePricing(courseId);
      if (response.success) {
        const data = response.data;
        setFormData({
          price: 0,
          certPrice: data.certPrice || 0,
          currency: data.currency || 'USD',
          accessType: data.accessType || 'one-time',
          visibility: data.visibility || 'public'
        });
        setCourseStatus(data.status || 'draft');
        setReviewerFeedback(data.reviewFeedback || null);
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

  const validateForm = (): boolean => {
    if (!formData.certPrice || formData.certPrice < 0) {
      toast.error('Certificate price must be a positive number');
      return false;
    }

    if (formData.certPrice > 10000) {
      toast.error('Price cannot exceed $10,000');
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
      const response = await courseApi.updatePricing(courseId, formData);

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
      navigate(`/instructor/course-seo/${courseId}`);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error('Failed to proceed to next step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate(`/instructor/course-syllabus/${courseId}`);
  };

  const handleInputChange = (field: keyof PricingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentCurrencySymbol = () => {
    return currencies.find(c => c.value === formData.currency)?.symbol || '$';
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
      <Breadcrumb title="Course Upload - Pricing & Access" />
      
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
                    <li className="progress-active">
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
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">04</span>
                        </span>
                        <div className="step-section">
                          <p>SEO</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profile-step">
                        <span className="dot-active mb-2">
                          <span className="number">05</span>
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
                      <h5>Pricing & Access</h5>
                      <p>Set your certificate price and access settings</p>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Certificate Price <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              {getCurrentCurrencySymbol()}
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0.00"
                              min="0"
                              max="10000"
                              step="0.01"
                              value={formData.certPrice || ''}
                              onChange={(e) => handleInputChange('certPrice', parseFloat(e.target.value) || 0)}
                              disabled={isReadOnly}
                              required
                            />
                          </div>
                          <small className="text-muted">Set a price between $0 and $10,000</small>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">Currency</label>
                          <select
                            className="form-control"
                            value={formData.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            disabled={isReadOnly}
                          >
                            {currencies.map(currency => (
                              <option key={currency.value} value={currency.value}>
                                {currency.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6 d-none">
                        <div className="input-block">
                          <label className="form-label">
                            Access Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            value={formData.accessType}
                            onChange={(e) => handleInputChange('accessType', e.target.value)}
                            disabled={isReadOnly}
                            required
                          >
                            <option value="one-time">One-time Purchase</option>
                          </select>
                          <small className="text-muted">Currently only one-time purchase is supported</small>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">Visibility</label>
                          <select
                            className="form-control"
                            value={formData.visibility}
                            onChange={(e) => handleInputChange('visibility', e.target.value)}
                            disabled={isReadOnly}
                          >
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                          </select>
                          <small className="text-muted">
                            {formData.visibility === 'public' 
                              ? 'Course will be visible in search results and course listings'
                              : 'Course will only be accessible via direct link'
                            }
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="pricing-preview-card border rounded p-4 bg-light">
                          <h6 className="mb-3">
                            <i className="fa-solid fa-eye me-2"></i>
                            Pricing Preview
                          </h6>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="preview-item">
                                <strong>Certificate Price:</strong>
                                <div className="text-primary">
                                  {getCurrentCurrencySymbol()}{formData.certPrice.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="preview-item">
                                <strong>Access Type:</strong>
                                <div className="text-muted">
                                  {formData.accessType === 'one-time' ? 'One-time Purchase' : formData.accessType}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="preview-item">
                                <strong>Visibility:</strong>
                                <div className="text-muted">
                                  <i className={`fa-solid ${formData.visibility === 'public' ? 'fa-globe' : 'fa-lock'} me-1`}></i>
                                  {formData.visibility === 'public' ? 'Public' : 'Unlisted'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="alert alert-info">
                          <i className="fa-solid fa-info-circle me-2"></i>
                          <strong>Note:</strong> Your course cannot be published directly by you. 
                          It will require review and accreditation approval from our admin team before going live.
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

export default CoursePricing;