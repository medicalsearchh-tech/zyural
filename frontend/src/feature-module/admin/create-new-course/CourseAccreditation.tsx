import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';
import { courseApi } from '../../../core/utils/api';
import './license.css';

interface DocumentFile {
  url: string;
  originalName: string;
  publicId: string;
}

interface AccreditationData {
  accreditedCreditType: 'CME' | 'CPD' | '';
  accreditedCreditHours: number;
  accreditationBody: string;
  supportingDocuments: File[];
  existingDocuments: DocumentFile[];
  reviewerNotes: string;
}

interface ReviewerFeedback {
  comments: string;
  status: string;
  requestedChanges: string[];
}

const CourseAccreditation = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;
  const { courseId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [courseStatus, setCourseStatus] = useState<string>('draft');
  const [reviewerFeedback, setReviewerFeedback] = useState<ReviewerFeedback | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState<AccreditationData>({
    accreditedCreditType: '',
    accreditedCreditHours: 0,
    accreditationBody: '',
    supportingDocuments: [],
    existingDocuments: [],
    reviewerNotes: ''
  });

  const loadCourseData = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    try {
      const response = await courseApi.getCourseById(courseId);
      if (response.success) {
        const data = response.data.course;
        const accReq = data.accreditationRequest || {}; 
        
        setFormData({
          accreditedCreditType: data.accreditedCreditType || '',
          accreditedCreditHours: data.accreditedCreditHours || 0,
          accreditationBody: accReq.accreditationBody || '',
          supportingDocuments: [],
          existingDocuments: accReq.supportingDocuments || [],
          reviewerNotes: accReq.reviewerNotes || ''
        });
        
        setCourseStatus(data.status || 'draft');
        setReviewerFeedback(data.reviewFeedback || null);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course data');
    }
  };

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

  const validateForm = (): boolean => {
    if (!formData.accreditedCreditType) {
      toast.error('Proposed credit type is required');
      return false;
    }

    if (!formData.accreditedCreditHours || formData.accreditedCreditHours <= 0) {
      toast.error('Proposed credit hours must be greater than 0');
      return false;
    }

    if (formData.supportingDocuments.length === 0 && formData.existingDocuments.length === 0) {
      toast.error('At least one supporting document is required');
      return false;
    }

    return true;
  };

  const saveDraft = async (): Promise<boolean> => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return false;
    }

    setIsDraftSaving(true);
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('accreditedCreditType', formData.accreditedCreditType);
      formDataToSend.append('accreditedCreditHours', String(formData.accreditedCreditHours));
      formDataToSend.append('accreditationBody', formData.accreditationBody);
      formDataToSend.append('reviewerNotes', formData.reviewerNotes);
      formDataToSend.append('status', 'draft');

      // Add new supporting documents
      formData.supportingDocuments.forEach((file) => {
        formDataToSend.append('supportingDocuments', file);
      });
      
      // Add existing documents as JSON string
      formDataToSend.append('existingDocuments', JSON.stringify(formData.existingDocuments));

      const response = await courseApi.updateAccreditation(courseId, formDataToSend);
      
      if (response.success) {
        toast.success('Draft saved successfully');
        setHasUnsavedChanges(false);
        // Reload to show updated documents
        await loadCourseData();
        return true;
      } else {
        toast.error(response.message || 'Failed to save draft');
        return false;
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return false;
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Save if there are unsaved changes
      if (hasUnsavedChanges || formData.supportingDocuments.length > 0) {
        const saved = await saveDraft();
        if (!saved) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Navigate to next step
      navigate(`/admin/course-pricing/${courseId}`);
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error('Failed to proceed to next step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate(`/admin/course-syllabus/${courseId}`);
  };

  const handleInputChange = (field: keyof AccreditationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a valid document type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, ...validFiles]
      }));
      setHasUnsavedChanges(true);
      toast.info('New files added. Click "Save Draft" to upload them.');
    }
  };

  const removeDocument = async (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const docToRemove = formData.existingDocuments[index];
      
      if (!confirm(`Are you sure you want to delete "${docToRemove.originalName}"? This action cannot be undone.`)) {
        return;
      }

      try {
        setIsDraftSaving(true);
        
        // Create updated list without the removed document
        const updatedExistingDocs = formData.existingDocuments.filter((_, i) => i !== index);
        
        // Send delete request to backend
        const formDataToSend = new FormData();
        formDataToSend.append('accreditedCreditType', formData.accreditedCreditType);
        formDataToSend.append('accreditedCreditHours', String(formData.accreditedCreditHours));
        formDataToSend.append('accreditationBody', formData.accreditationBody);
        formDataToSend.append('reviewerNotes', formData.reviewerNotes);
        formDataToSend.append('status', 'draft');
        formDataToSend.append('existingDocuments', JSON.stringify(updatedExistingDocs));

        const response = await courseApi.updateAccreditation(courseId!, formDataToSend);
        
        if (response.success) {
          // Update local state
          setFormData(prev => ({
            ...prev,
            existingDocuments: updatedExistingDocs
          }));
          toast.success('Document deleted successfully');
        } else {
          toast.error('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
      } finally {
        setIsDraftSaving(false);
      }
    } else {
      // For new documents not yet uploaded, just remove from queue
      setFormData(prev => ({
        ...prev,
        supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
      }));
      toast.success('Document removed from upload queue');
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
      <Breadcrumb title="Course Upload - Accreditation Request" />
      
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {renderStatusBanner()}
              {renderReviewerComments()}
              
              {hasUnsavedChanges && !isReadOnly && (
                <div className="alert alert-warning">
                  <i className="fa-solid fa-exclamation-circle me-2"></i>
                  You have unsaved changes. Click "Save Draft" to save your progress.
                </div>
              )}
              
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
                      <h5>Accreditation Request</h5>
                      <p>Provide data for CME/CPD review and accreditation</p>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Proposed Credit Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={formData.accreditedCreditType}
                            onChange={(e) => handleInputChange('accreditedCreditType', e.target.value)}
                            disabled={isReadOnly}
                            required
                          >
                            <option value="">Select credit type</option>
                            <option value="CME">CME (Continuing Medical Education)</option>
                            <option value="CPD">CPD (Continuing Professional Development)</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Proposed Credit Hours <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter credit hours"
                            value={formData.accreditedCreditHours}
                            onChange={(e) => handleInputChange('accreditedCreditHours', parseFloat(e.target.value) || 0)}
                            disabled={isReadOnly}
                            min="0"
                            step="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Accreditation Body (if already applied)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., ACCME, RCGP, etc."
                            value={formData.accreditationBody}
                            onChange={(e) => handleInputChange('accreditationBody', e.target.value)}
                            disabled={isReadOnly}
                          />
                          <small className="text-muted">Optional - Leave blank if not yet applied</small>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Supporting Documents <span className="text-danger">*</span>
                          </label>
                          <div className="file-upload-area border-dashed border-2 rounded p-4 text-center mb-3">
                            {!isReadOnly ? (
                              <>
                                <i className="fa-solid fa-cloud-upload-alt fs-48 text-muted mb-3"></i>
                                <h6>Upload Supporting Documents</h6>
                                <p className="text-muted">PDF, DOC, DOCX files up to 10MB each</p>
                                <input
                                  type="file"
                                  className="form-control d-block"
                                  multiple
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                />
                              </>
                            ) : (
                              <p className="text-muted">Course is locked for editing</p>
                            )}
                          </div>

                          {/* Display Existing Documents */}
                          {formData.existingDocuments.length > 0 && (
                            <div className="uploaded-files mb-3">
                              <h6>Uploaded Documents:</h6>
                              <div className="list-group">
                                {formData.existingDocuments.map((doc, index) => (
                                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="file-info d-flex align-items-center">
                                      <i className="fa-solid fa-file-pdf text-danger me-2"></i>
                                      <div>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="file-name text-decoration-none">
                                          {doc.originalName}
                                        </a>
                                        <br />
                                        <small className="text-success">
                                          <i className="fa-solid fa-check-circle me-1"></i>
                                          Saved to cloud
                                        </small>
                                      </div>
                                    </div>
                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => removeDocument(index, true)}
                                        title="Remove document"
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Display New Documents */}
                          {formData.supportingDocuments.length > 0 && (
                            <div className="uploaded-files">
                              <h6>New Documents (Not Yet Uploaded):</h6>
                              <div className="list-group">
                                {formData.supportingDocuments.map((file, index) => (
                                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center bg-light">
                                    <div className="file-info d-flex align-items-center">
                                      <i className="fa-solid fa-file text-primary me-2"></i>
                                      <div>
                                        <div className="file-name">{file.name}</div>
                                        <small className="text-warning">
                                          <i className="fa-solid fa-clock me-1"></i>
                                          {(file.size / 1024 / 1024).toFixed(2)} MB - Pending upload
                                        </small>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removeDocument(index, false)}
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="alert alert-info mt-2 mb-0">
                                <i className="fa-solid fa-info-circle me-2"></i>
                                These files will be uploaded when you click "Save Draft" or "Next"
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">Notes to Reviewer</label>
                          <textarea
                            className="form-control"
                            rows={5}
                            placeholder="Provide any additional information or context for the reviewer..."
                            value={formData.reviewerNotes}
                            onChange={(e) => handleInputChange('reviewerNotes', e.target.value)}
                            disabled={isReadOnly}
                          />
                          <small className="text-muted">
                            Optional - Use this space to provide context about your course content, 
                            target audience, or any specific accreditation requirements
                          </small>
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
                            className={`btn main-btn next_btns ${isSubmitting ? 'disabled' : ''}`}
                            onClick={handleNext}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                {hasUnsavedChanges || formData.supportingDocuments.length > 0 ? 'Saving...' : 'Processing...'}
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

export default CourseAccreditation;