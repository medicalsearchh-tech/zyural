// src/pages/student/StudentCertificates.tsx
import { useState, useEffect } from "react";
import ProfileCard from "../common/profileCard";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
import { certificateApi } from "../../../core/utils/api";
import { toast } from "react-toastify";
import CertificatePaymentModal from "./certificatePaymentModal";

// Updated Types to match new backend
interface PurchasedCertificate {
  id: string;
  certificateId: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  issueDate: string;
  certificateUrl: string | null;
  certificateImageUrl: string | null;
  certificatePdfUrl: string | null;
  status: 'pending' | 'issued' | 'revoked';
  isValid: boolean;
  metadata: any;
  template?: {
    id: string;
    name: string;
    backgroundImageUrl: string | null;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
    pricing?: {
      certPrice?: number;
    };
  };
}

// Frontend display type
interface CertificateDisplay {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  instructorName: string;
  certificatePrice: number;
  quizScore: number;
  quizPassed: boolean;
  completedAt: string;
  status: 'quiz_not_passed' | 'no_certificate_available' | 'eligible_for_purchase' | 'purchased';
  action: 'buy_certificate' | 'view_certificate' | null;
  message: string;
  certificate: {
    id: string;
    title: string;
    templateUrl: string | null;
  } | null;
  purchasedCertificate?: PurchasedCertificate;
  templateId?: string;
}

const StudentCertificates = () => {
  const [certificateData, setCertificateData] = useState<CertificateDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<PurchasedCertificate | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
    certificatePrice: number;
    templateId: string;
  }>({
    isOpen: false,
    courseId: '',
    courseTitle: '',
    certificatePrice: 0,
    templateId: ''
  });

  useEffect(() => {
    loadCertificateData();
  }, []);

  const loadCertificateData = async () => {
    try {
      setLoading(true);
      
      // Get eligible courses and purchased certificates
      const [eligibleResponse, purchasedResponse] = await Promise.all([
        certificateApi.getEligibleCourses(),
        certificateApi.getStudentCertificates()
      ]);
      
      if (eligibleResponse.success && purchasedResponse.success) {
        const eligibleCourses: any[] = eligibleResponse.data?.eligibleCourses || [];
        const purchasedCertificates: PurchasedCertificate[] = purchasedResponse.data?.purchasedCertificates || [];

        console.log('Eligible courses:', eligibleCourses);
        console.log('Purchased certificates:', purchasedCertificates);

        // Transform data for frontend display
        const displayData: CertificateDisplay[] = [];

        // Process eligible courses from the API response
        eligibleCourses.forEach((course: any) => {
          // FIX: Check templates array instead of template
          const hasTemplate = course.templates && course.templates.length > 0;
          const purchasedCert = purchasedCertificates.find(pc => pc.courseId === course.courseId);
          
          let status: CertificateDisplay['status'] = 'quiz_not_passed';
          let action: CertificateDisplay['action'] = null;
          let message = '';
          let certificatePrice = course.certificatePrice || 250;

          if (course.quizScore < 70) {
            status = 'quiz_not_passed';
            message = 'Complete the course quiz to unlock certificate';
          } else if (!hasTemplate) {
            status = 'no_certificate_available';
            message = 'Certificate not available for this course';
          } else if (purchasedCert) {
            status = 'purchased';
            action = 'view_certificate';
            message = 'Certificate purchased';
            certificatePrice = purchasedCert.course?.pricing?.certPrice || certificatePrice;
          } else {
            status = 'eligible_for_purchase';
            action = 'buy_certificate';
            certificatePrice = course.certificatePrice || 250;
            message = `Purchase certificate for $${certificatePrice}`;
          }

          // FIX: Get the first template from templates array
          const firstTemplate = hasTemplate ? course.templates[0] : null;

          displayData.push({
            courseId: course.courseId,
            courseTitle: course.courseTitle,
            courseSlug: course.courseSlug,
            instructorName: course.instructorName || 'Course Instructor',
            certificatePrice,
            quizScore: course.quizScore,
            quizPassed: course.quizPassed || course.quizScore >= 70,
            completedAt: course.completedAt,
            status,
            action,
            message,
            certificate: hasTemplate ? {
              id: firstTemplate?.id,
              title: firstTemplate?.name,
              templateUrl: firstTemplate?.backgroundImageUrl
            } : null,
            purchasedCertificate: purchasedCert,
            templateId: firstTemplate?.id // FIX: Use template ID from templates array
          });
        });

        // Add purchased certificates that might not be in eligible courses
        purchasedCertificates.forEach((purchasedCert: PurchasedCertificate) => {
          const exists = displayData.some(item => item.courseId === purchasedCert.courseId);
          if (!exists) {
            displayData.push({
              courseId: purchasedCert.courseId,
              courseTitle: purchasedCert.courseTitle,
              courseSlug: purchasedCert.course?.slug || purchasedCert.courseTitle.toLowerCase().replace(/\s+/g, '-'),
              instructorName: purchasedCert.instructorName,
              certificatePrice: purchasedCert.course?.pricing?.certPrice || 250,
              quizScore: 100, // Assuming they passed if they have certificate
              quizPassed: true,
              completedAt: purchasedCert.completionDate,
              status: 'purchased',
              action: 'view_certificate',
              message: 'Certificate purchased',
              certificate: purchasedCert.template ? {
                id: purchasedCert.template.id,
                title: purchasedCert.template.name,
                templateUrl: purchasedCert.template.backgroundImageUrl
              } : null,
              purchasedCertificate: purchasedCert
            });
          }
        });

        setCertificateData(displayData);
      }
    } catch (error: any) {
      console.error('Error loading certificate data:', error);
      toast.error(error.message || 'Failed to load certificate information');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCertificate = (courseId: string, courseTitle: string, certificatePrice: number, templateId: string) => {
    setPaymentModal({
      isOpen: true,
      courseId,
      courseTitle,
      certificatePrice,
      templateId
    });
  };

  const handlePaymentSuccess = () => {
    loadCertificateData(); // Reload data after successful purchase
    toast.success('Certificate purchased successfully!');
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      courseId: '',
      courseTitle: '',
      certificatePrice: 0,
      templateId: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'purchased':
        return <span className="badge bg-success">Purchased</span>;
      case 'eligible_for_purchase':
        return <span className="badge bg-primary">Available</span>;
      case 'quiz_not_passed':
        return <span className="badge bg-warning">Quiz Required</span>;
      case 'no_certificate_available':
        return <span className="badge bg-secondary">Not Available</span>;
      default:
        return <span className="badge bg-light text-dark">Unknown</span>;
    }
  };

  const handleViewCertificate = (certificate: CertificateDisplay) => {
    if (certificate.purchasedCertificate) {
      setSelectedCertificate(certificate.purchasedCertificate);
      
      // Use setTimeout to ensure the modal is properly initialized
      setTimeout(() => {
        const modalElement = document.getElementById('view_certificate');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      }, 100);
    }
  };

  const handleDownloadCertificate = async (certificate: CertificateDisplay) => {
    if (certificate.purchasedCertificate) {
      try {
        const response = await certificateApi.downloadCertificate(certificate.purchasedCertificate.id);
        if (response.success && response.data?.downloadUrl) {
          // Open the download URL in a new tab
          window.open(response.data.downloadUrl, '_blank');
        } else {
          // Fallback: Use the certificate URL directly
          const downloadUrl = certificate.purchasedCertificate.certificatePdfUrl || 
                            certificate.purchasedCertificate.certificateImageUrl;
          if (downloadUrl) {
            window.open(downloadUrl, '_blank');
          } else {
            toast.error('Certificate download URL not available');
          }
        }
      } catch (error: any) {
        console.error('Download error:', error);
        // Fallback to direct URL
        const downloadUrl = certificate.purchasedCertificate.certificatePdfUrl || 
                          certificate.purchasedCertificate.certificateImageUrl;
        if (downloadUrl) {
          window.open(downloadUrl, '_blank');
        } else {
          toast.error(error.message || 'Failed to download certificate');
        }
      }
    } else {
      toast.info('Certificate is not available for download yet.');
    }
  };

  // Get the actual certificate image URL
  const getCertificateImageUrl = (certificate: PurchasedCertificate | null) => {
    if (!certificate) return null;
    
    // Prefer the actual generated certificate image over template background
    return certificate.certificateImageUrl || 
           certificate.certificatePdfUrl || 
           certificate.template?.backgroundImageUrl;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="My Certificates" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const eligibleCount = certificateData.filter(c => c.status === 'eligible_for_purchase').length;
  const purchasedCount = certificateData.filter(c => c.status === 'purchased').length;

  return (
    <>
      <Breadcrumb title="My Certificates" />

      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <StudentSidebar />
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>My Certificates</h5>
                <div className="d-flex gap-3">
                  <span className="badge bg-primary fs-12">
                    {eligibleCount} Available
                  </span>
                  <span className="badge bg-success fs-12">
                    {purchasedCount} Purchased
                  </span>
                </div>
              </div>

              {certificateData.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="fas fa-certificate fa-3x text-muted"></i>
                  </div>
                  <h6>No Certificates Available</h6>
                  <p className="text-muted">Complete courses and pass quizzes to unlock certificates!</p>
                  <Link to="/student/student-courses" className="btn btn-primary">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="table-responsive custom-table">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Quiz Score</th>
                        <th>Completion Date</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificateData.map((course) => (
                        <tr key={course.courseId}>
                          <td>
                            <div>
                              <Link to="#" className="fw-semibold d-block">
                                {course.courseTitle}
                              </Link>
                              {course.certificate && (
                                <small className="text-muted">{course.certificate.title}</small>
                              )}
                            </div>
                          </td>
                          <td>{course.instructorName}</td>
                          <td>
                            <span className={`fw-semibold ${course.quizPassed ? 'text-success' : 'text-warning'}`}>
                              {course.quizScore}%
                            </span>
                          </td>
                          <td>{formatDate(course.completedAt)}</td>
                          <td>
                            {getStatusBadge(course.status)}
                            <div className="small text-muted mt-1">
                              {course.message}
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">
                              ${course.certificatePrice}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {course.action === 'buy_certificate' && course.templateId && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handlePurchaseCertificate(
                                    course.courseId, 
                                    course.courseTitle, 
                                    course.certificatePrice,
                                    course.templateId!
                                  )}
                                >
                                  <i className="fas fa-shopping-cart me-1" />
                                  Buy Certificate
                                </button>
                              )}
                              
                              {course.action === 'view_certificate' && (
                                <>
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleViewCertificate(course)}
                                  >
                                    <i className="isax isax-eye me-1" />
                                    View
                                  </button>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleDownloadCertificate(course)}
                                  >
                                    <i className="isax isax-import me-1" />
                                    Download
                                  </button>
                                </>
                              )}
                              
                              {course.status === 'quiz_not_passed' && (
                                <Link
                                  to={`/learn/${course.courseSlug}`}
                                  className="btn btn-warning btn-sm"
                                >
                                  <i className="fas fa-play me-1" />
                                  Take Quiz
                                </Link>
                              )}
                              
                              {course.status === 'no_certificate_available' && (
                                <span className="text-muted small">Not Available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <CertificatePaymentModal
        isOpen={paymentModal.isOpen}
        courseId={paymentModal.courseId}
        courseTitle={paymentModal.courseTitle}
        certificatePrice={paymentModal.certificatePrice}
        templateId={paymentModal.templateId}
        onSuccess={handlePaymentSuccess}
        onClose={closePaymentModal}
      />

      {/* View Certificate Modal */}
      <div className="modal fade" id="view_certificate" tabIndex={-1} aria-labelledby="viewCertificateModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewCertificateModalLabel">
                <i className="fas fa-certificate text-success me-2"></i>
                View Certificate
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedCertificate && (
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6>Certificate Details</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="fw-semibold">Certificate Number:</td>
                            <td>{selectedCertificate.certificateNumber}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Student Name:</td>
                            <td>{selectedCertificate.studentName}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Course:</td>
                            <td>{selectedCertificate.courseTitle}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Instructor:</td>
                            <td>{selectedCertificate.instructorName}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Completion Date:</td>
                            <td>{formatDate(selectedCertificate.completionDate)}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Issue Date:</td>
                            <td>{formatDate(selectedCertificate.issueDate)}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Status:</td>
                            <td>
                              <span className={`badge ${
                                selectedCertificate.status === 'issued' ? 'bg-success' : 
                                selectedCertificate.status === 'pending' ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {selectedCertificate.status}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Certificate Preview */}
                  <div className="certificate-preview bg-light p-4 rounded text-center">
                    {getCertificateImageUrl(selectedCertificate) ? (
                      <div>
                        <img 
                          src={getCertificateImageUrl(selectedCertificate)!} 
                          className="img-fluid border rounded shadow-sm" 
                          alt="Certificate"
                          style={{ maxHeight: '500px', maxWidth: '100%' }}
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('d-none');
                          }}
                        />
                        <div className="d-none mt-3">
                          <p className="text-muted">
                            <i className="fas fa-info-circle me-2"></i>
                            Certificate image could not be loaded. Please try downloading the PDF version.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-5">
                        <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Certificate preview not available</p>
                        <small className="text-muted">
                          Your certificate is being generated. Please check back later or contact support.
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-end mt-4">
                {selectedCertificate && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const certDisplay = certificateData.find(c => c.purchasedCertificate?.id === selectedCertificate.id);
                      if (certDisplay) handleDownloadCertificate(certDisplay);
                    }}
                  >
                    <i className="isax isax-import me-2" />
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCertificates;