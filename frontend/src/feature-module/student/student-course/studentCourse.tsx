import { useState, useEffect } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
import { all_routes } from "../../router/all_routes";
import ProfileCard from "../common/profileCard";
import { courseApi } from "../../../core/utils/api";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  heroImageUrl: string;
  pricing: {
    price: number
    certPrice: number
    currency: string
    accessType: string
    visibility: string
  }
  rating: string;
  accreditedCreditHours: number;
  accreditedCreditType: 'CME' | 'CPD' | null;
  reviewCount: number;
  instructor: Instructor;
  category: Category;
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
  };
}

interface Enrollment {
  enrollmentId: string;
  enrolledAt: string;
  completedAt: string | null;
  progressPercentage: number;
  lastAccessedAt: string;
  certificateIssued: boolean;
  certificateUrl: string | null;
  course: Course;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface EnrollmentStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  certificatesEarned: number;
}

const StudentCourse = () => {
  const route = all_routes;
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false
  });
  const [stats, setStats] = useState<EnrollmentStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    certificatesEarned: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [_selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchEnrolledCourses(currentPage, pageSize, '', activeTab);
  }, [currentPage, pageSize, activeTab]);

  const fetchEnrolledCourses = async (page = 1, limit = 12, search = '', status = '') => {
    try {
      setLoading(true);
      const statusParam = status === 'all' ? '' : status;
      const response = await courseApi.getEnrolledCourses({
        page,
        limit,
        search,
        status: statusParam
      });
      
      const enrollmentsData = response.data.enrollments;
      const paginationData = response.data.pagination;
      const statsData = response.data.stats;
      
      setEnrollments(enrollmentsData);
      setPagination(paginationData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = (enrollmentId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [enrollmentId]: !prev[enrollmentId]
    }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      if (price === 0) return "Free";
      return `$${price.toFixed(2)}`;
    }
    if (price === "0.00" || price === "0") {
      return "Free";
    }
    return `$${price}`;
  };

  const getProgressBadge = (progressPercentage: number) => {
    if (progressPercentage === 0) {
      return <span className="badge bg-secondary">Not Started</span>;
    } else if (progressPercentage === 100) {
      return <span className="badge bg-success">Completed</span>;
    } else {
      return <span className="badge bg-primary">{progressPercentage.toFixed(0)}% Progress</span>;
    }
  };

  const getButtonText = (progressPercentage: number) => {
    if (progressPercentage === 0) {
      return "Start Course";
    } else if (progressPercentage === 100) {
      return "Review Course";
    } else {
      return "Continue Learning";
    }
  };

  const filterEnrollmentsByTab = (enrollments: Enrollment[]) => {
    switch (activeTab) {
      case 'in-progress':
        return enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100);
      case 'completed':
        return enrollments.filter(e => e.progressPercentage === 100);
      default:
        return enrollments;
    }
  };

  const renderCourseCard = (enrollment: Enrollment) => {
    const course = enrollment.course;
    
    return (
      <div key={enrollment.enrollmentId} className="col-xl-4 col-md-6">
        <div className="course-item-two course-item mx-0">
          <div className="course-img">
            <Link to={route.courseDetails.replace(":courseSlug", course.slug)}>
              <ImageWithBasePath
                src={course.heroImageUrl || "assets/img/course/default-course.jpg"}
                alt={course.title}
                className="img-fluid"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </Link>
            <div 
              className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3" 
              onClick={() => handleItemClick(enrollment.enrollmentId)}
            >
              <div className="badge text-bg-primary me-2">Free</div>
              {formatPrice(course.pricing.price) !== "Free" && (
                <div className="badge text-bg-primary me-2">{formatPrice(course.pricing.price)}</div>
              )}
              {getProgressBadge(enrollment.progressPercentage)}
             
            </div>
            <div className="position-absolute start-0 bottom-0 d-flex justify-content-end w-100 z-index-2">
              {/* Accreditation Badge */}
              {course.accreditedCreditType && (
                <div 
                  className="ms-2" 
                  style={{ width: '60px', height: '60px' }}
                  title={`${course.accreditedCreditType} Accredited - ${course.accreditedCreditHours}h`}
                >
                  <img
                    src={
                      course.accreditedCreditType === 'CME'
                        ? '/assets/img/icon/CME.svg'
                        : '/assets/img/icon/CPD.svg'
                    }
                    alt={`${course.accreditedCreditType} Accredited`}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="course-content">
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <Link
                  to={route.instructorDetails}
                  className="avatar avatar-sm"
                >
                  <ImageWithBasePath
                    src={course.instructor.avatar || "assets/img/user/default-avatar.jpg"}
                    alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                    className="img-fluid avatar avatar-sm rounded-circle"
                  />
                </Link>
                <div className="ms-2">
                  <Link
                    to={route.instructorDetails}
                    className="link-default fs-14"
                  >
                    {course.instructor.firstName} {course.instructor.lastName}
                  </Link>
                </div>
              </div>
              <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                {course.category.name}
              </span>
            </div>
            <h6 className="title mb-2">
              <Link to={route.courseDetails.replace(":courseSlug", course.slug)}>
                {course.title}
              </Link>
            </h6>
            {/* Accreditation Info Badge */}
              {course.accreditedCreditType && (
                <div className="mb-2">
                  <span className="badge bg-success-transparent text-success d-inline-flex align-items-center">
                    <i className="isax isax-verify me-1" style={{ fontSize: '14px' }}></i>
                    {course.accreditedCreditType} • {course.accreditedCreditHours}h Credits
                  </span>
                </div>
              )}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="d-flex align-items-center mb-0">
                <i className="fa-solid fa-star text-warning me-2" />
                {course.rating} ({course.reviewCount} Reviews)
              </p>
              {enrollment.certificateIssued && (
                <span className="badge bg-warning">
                  <i className="fa-solid fa-certificate me-1" />
                  Certified
                </span>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="d-inline-flex align-items-center text-gray-5">
                <i className="fa-solid fa-book me-1" />
                {course.stats.totalLessons} Lessons
              </span>
              <span className="d-inline-flex align-items-center text-gray-5">
                <i className="fa-solid fa-clock me-1" />
                {course.stats.totalDuration ? formatDuration(course.stats.totalDuration) : '0h 0min'}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <small className="text-muted">
                  Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </small>
                {enrollment.lastAccessedAt && (
                  <small className="text-muted">
                    Last accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                  </small>
                )}
              </div>
              <Link
                to={`/learn/${course.slug}`}
                className="btn btn-dark btn-sm d-inline-flex align-items-center"
              >
                {getButtonText(enrollment.progressPercentage)}
                <i className="isax isax-arrow-right-3 ms-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <Link 
            className="page-link" 
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Enrolled Courses" />
        <div className="content">
          <div className="container">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayedEnrollments = filterEnrollmentsByTab(enrollments);

  return (
    <>
      <Breadcrumb title="Enrolled Courses" />

      <div className="content">
        <div className="container">
          <ProfileCard/>
          
          <div className="row">
            <StudentSidebar />
            
            <div className="col-lg-9">
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary">
                    <div className="card-body text-center">
                      <h4 className="text-white fw-bold">{stats.total}</h4>
                      <h6 className="fw-medium mb-0 text-white">Total Enrolled</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info">
                    <div className="card-body text-center">
                      <h4 className="text-white fw-bold">{stats.inProgress}</h4>
                      <h6 className="fw-medium mb-0 text-white">In Progress</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success">
                    <div className="card-body text-center">
                      <h4 className="text-white fw-bold">{stats.completed}</h4>
                      <h6 className="fw-medium mb-0 text-white">Completed</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning">
                    <div className="card-body text-center">
                      <h4 className="text-white fw-bold">{stats.certificatesEarned}</h4>
                      <h6 className="fw-medium mb-0 text-white">Certificates</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="page-title d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <h5>Enrolled Courses ({pagination.totalCourses})</h5>
                <div className="tab-list">
                  <ul className="nav mb-0 gap-2" role="tablist">
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange('all');
                        }}
                      >
                        All ({stats.total})
                      </Link>
                    </li>
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        className={activeTab === 'in-progress' ? 'active' : ''}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange('in-progress');
                        }}
                      >
                        In Progress ({stats.inProgress})
                      </Link>
                    </li>
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        className={activeTab === 'completed' ? 'active' : ''}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange('completed');
                        }}
                      >
                        Completed ({stats.completed})
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="tab-content">
                <div className="tab-pane fade active show">
                  {displayedEnrollments.length > 0 ? (
                    <div className="row">
                      {displayedEnrollments.map(renderCourseCard)}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <p className="text-muted">No enrolled courses found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="row align-items-center mt-4">
                  <div className="col-md-2">
                    <p className="pagination-text">
                      Page {currentPage} of {pagination.totalPages}
                    </p>
                  </div>
                  <div className="col-md-10">
                    <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                      <li className={`page-item prev ${!pagination.hasPrev ? 'disabled' : ''}`}>
                        <Link
                          className="page-link"
                          to="#"
                          tabIndex={-1}
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasPrev) handlePageChange(currentPage - 1);
                          }}
                        >
                          <i className="fas fa-angle-left" />
                        </Link>
                      </li>
                      {renderPagination()}
                      <li className={`page-item next ${!pagination.hasNext ? 'disabled' : ''}`}>
                        <Link 
                          className="page-link" 
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasNext) handlePageChange(currentPage + 1);
                          }}
                        >
                          <i className="fas fa-angle-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourse;