import { useState, useEffect } from 'react';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { adminApi } from '../../../core/utils/api';
import { toast } from "react-toastify";

interface Section {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  totalLessons: number;
  totalDuration: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'link' | 'text';
  duration: number;
  sortOrder: number;
  freePreview: boolean;
}

interface SyllabusDocument {
  id: string;
  originalFileName: string;
  fileUrl: string;
  processingStatus: string;
  extractedStructure: any;
}

interface CourseDetails {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  submittedAt: string;
  heroImageUrl: string;
  level: string;
  duration: number;
  totalSections: number;
  totalLessons: number;
  learningObjectives: string;
  targetAudience: string[];
  conflictOfInterest: {
    hasConflict: boolean;
    description: string | null;
  };
  pricing: {
    price: number;
    certPrice: number;
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
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    bio: string;
  };
  category: {
    id: string;
    name: string;
  };
  specialty: {
    id: string;
    name: string;
  };
  sections: Section[];
  syllabusDocuments: SyllabusDocument[];
}

interface CourseReviewModalContentProps {
  courseId: string;
  onReviewSubmit: () => void;
  reviewAction: string;
  reviewComments: string;
  onReviewActionChange: (action: 'approve' | 'reject' | 'request-changes') => void;
  onReviewCommentsChange: (comments: string) => void;
}

const CourseReviewModalContent: React.FC<CourseReviewModalContentProps> = ({
  courseId,
  reviewAction,
  reviewComments,
  onReviewActionChange,
  onReviewCommentsChange
}) => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCourseRequestDetails(courseId);
      
      if (response.success) {
        setCourseDetails(response.data.course);
      } else {
        throw new Error(response.message || 'Failed to fetch course details');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load course details');
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { class: 'bg-warning', text: 'Pending Review' },
      changes_requested: { class: 'bg-info', text: 'Changes Requested' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      draft: { class: 'bg-secondary', text: 'Draft' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      beginner: { class: 'bg-success', text: 'Beginner' },
      intermediate: { class: 'bg-warning', text: 'Intermediate' },
      advanced: { class: 'bg-danger', text: 'Advanced' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || { class: 'bg-secondary', text: level };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getLessonTypeIcon = (type: string) => {
    const icons = {
      video: 'isax isax-play-circle',
      pdf: 'isax isax-document',
      quiz: 'isax isax-message-question',
      link: 'isax isax-link',
      text: 'isax isax-document-text'
    };
    return icons[type as keyof typeof icons] || 'isax isax-document';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading course details...</p>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="text-center py-4">
        <p className="text-danger">Failed to load course details</p>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Left Sidebar - Course Overview */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-body text-center">
            <ImageWithBasePath 
              src={courseDetails.heroImageUrl || 'assets/img/course/course-01.jpg'} 
              alt={courseDetails.title}
              className="rounded mb-3"
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h6>{courseDetails.title}</h6>
            <p className="text-muted small">{courseDetails.subtitle}</p>
            
            <div className="mb-3">
              <strong>Status:</strong><br />
              {getStatusBadge(courseDetails.status)}
            </div>
            
            <div className="mb-3">
              <strong>Instructor:</strong><br />
              {courseDetails.instructor.firstName} {courseDetails.instructor.lastName}<br />
              <small className="text-muted">{courseDetails.instructor.email}</small>
            </div>
            
            <div className="mb-3">
              <strong>Category:</strong><br />
              {courseDetails.category.name} → {courseDetails.specialty?.name || 'N/A'}
            </div>
            
            <div className="mb-3">
              <strong>Level:</strong> {getLevelBadge(courseDetails.level)}
            </div>
            
            <div className="mb-3">
              <strong>Duration:</strong> {formatDuration(courseDetails.duration)}
            </div>
            
            <div className="mb-3">
              <strong>Content:</strong><br />
              {courseDetails.totalSections} sections, {courseDetails.totalLessons} lessons
            </div>

            <div className="mb-3">
              <strong>Price : </strong>
              {courseDetails.pricing.price} {courseDetails.pricing.currency}<br />
              <strong>Certificate : </strong>
              {courseDetails.pricing.certPrice} {courseDetails.pricing.currency}
            </div>
          </div>
        </div>

        {/* Review Action Section */}
        <div className="card mt-3">
          <div className="card-header">
            <h6 className="card-title mb-0">Review Action</h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Action</label>
              <div className="btn-group-vertical w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="reviewAction"
                  id="approve"
                  checked={reviewAction === 'approve'}
                  onChange={() => onReviewActionChange('approve')}
                />
                <label className="btn btn-outline-success text-start" htmlFor="approve">
                  <i className="isax isax-tick-circle me-2"></i> Approve Course
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="reviewAction"
                  id="request-changes"
                  checked={reviewAction === 'request-changes'}
                  onChange={() => onReviewActionChange('request-changes')}
                />
                <label className="btn btn-outline-warning text-start" htmlFor="request-changes">
                  <i className="isax isax-edit me-2"></i> Request Changes
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="reviewAction"
                  id="reject"
                  checked={reviewAction === 'reject'}
                  onChange={() => onReviewActionChange('reject')}
                />
                <label className="btn btn-outline-danger text-start" htmlFor="reject">
                  <i className="isax isax-close-circle me-2"></i> Reject Course
                </label>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-medium">
                {reviewAction === 'approve' ? 'Approval Notes' : 
                 reviewAction === 'request-changes' ? 'Changes Required' : 
                 'Rejection Reason'}
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder={
                  reviewAction === 'approve' ? 'Add any notes about this approval...' :
                  reviewAction === 'request-changes' ? 'List the specific changes required from the instructor...' :
                  'Explain why this course is being rejected...'
                }
                value={reviewComments}
                onChange={(e) => onReviewCommentsChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Course Details */}
      <div className="col-md-8">
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              Syllabus & Content
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing & SEO
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="card-title mb-0">Course Description</h6>
                </div>
                <div className="card-body">
                  <p>{courseDetails.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="card-title mb-0">Learning Objectives</h6>
                </div>
                <div className="card-body">
                  <div dangerouslySetInnerHTML={{ __html: courseDetails.learningObjectives }} />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">Target Audience</h6>
                </div>
                <div className="card-body">
                  {courseDetails.targetAudience && courseDetails.targetAudience.length > 0 ? (
                    <ul>
                      {courseDetails.targetAudience.map((audience, index) => (
                        <li key={index}>{audience}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No target audience specified.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Syllabus & Content Tab */}
          {activeTab === 'syllabus' && (
            <div>
              {/* Syllabus Documents */}
              {courseDetails.syllabusDocuments && courseDetails.syllabusDocuments.length > 0 && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="card-title mb-0">
                      <i className="isax isax-document-text me-2"></i>
                      Uploaded Syllabus Documents
                    </h6>
                  </div>
                  <div className="card-body">
                    {courseDetails.syllabusDocuments.map((doc) => (
                      <div key={doc.id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded-3">
                        <div>
                          <h6 className="mb-1">{doc.originalFileName}</h6>
                          <small className="text-muted">
                            Status: <span className="badge bg-info">{doc.processingStatus}</span>
                          </small>
                        </div>
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="isax isax-eye me-1"></i> View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Sections & Lessons */}
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">Course Structure</h6>
                </div>
                <div className="card-body">
                  {courseDetails.sections && courseDetails.sections.length > 0 ? (
                    <div className="accordion" id="courseSectionsAccordion">
                      {courseDetails.sections.map((section, sectionIndex) => (
                        <div key={section.id} className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#section-${section.id}`}
                            >
                              <div className="d-flex justify-content-between w-100 me-3">
                                <span>
                                  Section {sectionIndex + 1}: {section.title}
                                </span>
                                <span className="text-muted">
                                  {section.lessons.length} lessons • {formatDuration(section.totalDuration)}
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`section-${section.id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#courseSectionsAccordion"
                          >
                            <div className="accordion-body">
                              {section.description && (
                                <p className="text-muted mb-3">{section.description}</p>
                              )}
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="d-flex align-items-center mb-2 p-2 border rounded-3">
                                  <i className={`${getLessonTypeIcon(lesson.type)} me-3 text-primary`}></i>
                                  <div className="flex-grow-1">
                                    <h6 className="mb-0">{lesson.title}</h6>
                                    <small className="text-muted">
                                      {formatDuration(lesson.duration)} • {lesson.type}
                                      {lesson.freePreview && (
                                        <span className="badge bg-success ms-2">Free Preview</span>
                                      )}
                                    </small>
                                  </div>
                                  <small className="text-muted">#{lessonIndex + 1}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No sections added to this course yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & SEO Tab */}
          {activeTab === 'pricing' && (
            <div>
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="card-title mb-0">Pricing Information</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Price:</strong> ${courseDetails.pricing.price} {courseDetails.pricing.currency}
                    </div>
                    <div className="col-md-6">
                      <strong>Certificate Price:</strong> ${courseDetails.pricing.certPrice} {courseDetails.pricing.currency}
                    </div>
                    <div className="col-md-6 mt-2">
                      <strong>Access Type:</strong> {courseDetails.pricing.accessType}
                    </div>
                    <div className="col-md-6 mt-2">
                      <strong>Visibility:</strong> 
                      <span className={`badge ${courseDetails.pricing.visibility === 'public' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                        {courseDetails.pricing.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">SEO Settings</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Meta Title:</strong>
                    <p className="text-muted">{courseDetails.seoSettings.metaTitle || 'Not set'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Meta Description:</strong>
                    <p className="text-muted">{courseDetails.seoSettings.metaDescription || 'Not set'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Keywords:</strong>
                    {courseDetails.seoSettings.keywords && courseDetails.seoSettings.keywords.length > 0 ? (
                      <div>
                        {courseDetails.seoSettings.keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">{keyword}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No keywords set</p>
                    )}
                  </div>
                  <div>
                    <strong>Terms Accepted:</strong>
                    <span className={`badge ${courseDetails.seoSettings.termsAccepted ? 'bg-success' : 'bg-danger'} ms-2`}>
                      {courseDetails.seoSettings.termsAccepted ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModalContent;