import { useState, useEffect } from 'react';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { all_routes } from '../../router/all_routes';
import ProfileCard from '../common/profileCard';
import InstructorSidebar from '../common/instructorSidebar';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { courseApi } from '../../../core/utils/api';

interface Course {
  id: string;
  title: string;
  slug: string;
  heroImageUrl: string;
  totalEnrollments: number;
  averageRating: string;
  status: string;
  pricing: {
    price: number;
    certPrice: number;
    currency: string;
    accessType: string;
    visibility: string;
  };
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CourseStats {
  active: number;
  approved: number;
  draft: number;
  inactive: number;
  free: number;
  paid: number;
}

const InstructorCourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false
  });
  const [stats, setStats] = useState<CourseStats>({
    active: 0,
    approved: 0,
    draft: 0,
    inactive: 0,
    free: 0,
    paid: 0
  });
  const [activeTab, setActiveTab] = useState('published');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // Grid typically shows more items per page

  useEffect(() => {
    fetchCourses(currentPage, pageSize, '', activeTab);
  }, [currentPage, pageSize, activeTab]);

  const fetchCourses = async (page = 1, limit = 12, search = '', status = '') => {
    try {
      setLoading(true);
      const response = await courseApi.getInstructorCourses({
        page,
        limit,
        search,
        status: status === 'published' ? '' : status // Empty string for published means all published
      });
      
      const coursesData = response.data.courses;
      const paginationData = response.data.pagination;
      
      setCourses(coursesData);
      setPagination(paginationData);
      calculateStats(coursesData);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData: Course[]) => {
    const newStats = {
      active: 0,
      approved: 0,
      draft: 0,
      inactive: 0,
      free: 0,
      paid: 0
    };

    coursesData.forEach(course => {
      // Status counts
      switch (course.status) {
        case 'published':
          newStats.active++;
          break;
        case 'approved':
          newStats.approved++;
          break;
        case 'draft':
          newStats.draft++;
          break;
        case 'inactive':
          newStats.inactive++;
          break;
      }

      // Price counts (pricing.price is a number)
      if (course.pricing.price === 0) {
        newStats.free++;
      } else {
        newStats.paid++;
      }
    });

    setStats(newStats);
  };

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) {
      return "Free";
    }
    return `$${price.toFixed(2)}`;
  };

  const getPriceClassName = (price: number) => {
    if (price === 0) {
      return "text-success";
    }
    return "";
  };

  const renderCourseCard = (course: Course) => (
    <div key={course.id} className="col-xl-4 col-md-6">
      <div className="course-item course-item-three">
        <div className="position-relative overflow-hidden rounded-3 mb-3 course-image">
          <Link to={all_routes.instructorCourseDetails.replace(":courseSlug", course.slug)}>
            <img
              className="img-fluid rounded-3"
              src={course.heroImageUrl || "/assets/img/course/default-course.jpg"}
              alt={course.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          </Link>
          <span className={`fs-20 price-top d-inline-flex align-items-center ${getPriceClassName(course.pricing.price)}`}>
            {formatPrice(course.pricing.price)}
          </span>
        </div>
        <h6 className="mt-3 mb-3 fs-18 fw-bold text-truncate line-clamp-2">
          <Link to={all_routes.instructorCourseDetails.replace(":courseSlug", course.slug)}>
            {course.title}
          </Link>
        </h6>
        <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
          <span className="d-inline-flex align-items-center text-gray-5">
            <ImageWithBasePath
              src="assets/img/icon/book-3.svg"
              className="me-1"
              alt=""
            />
            {course.stats.totalLessons}+ Lesson
          </span>
          <span className="d-inline-flex align-items-center text-gray-5">
            <ImageWithBasePath
              src="assets/img/icon/timer-start.svg"
              className="me-1"
              alt=""
            />
            {course.stats.totalDuration ? formatDuration(course.stats.totalDuration) : '0h 0min'}
          </span>
        </div>
        <div className="d-flex justify-content-between mt-3 align-items-center">
          <Link
            to="#"
            className="d-inline-flex align-items-center fs-14 text-gray-5"
          >
            <i className="isax isax-trash me-2" />
            Delete
          </Link>
          <Link
            to="#"
            className="d-inline-flex align-items-center fs-14 text-gray-5"
          >
            <i className="isax isax-edit-2 me-2" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );

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
        <Breadcrumb title='Courses' />
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

  return (
    <>
      <Breadcrumb title='Courses'/>
      <div className="content">
        <div className="container">
          <ProfileCard/>
          <div className="row">
            <InstructorSidebar/>
            <div className="col-lg-9">
              {/* Stats Cards */}
              <div className="row">
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-success">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Active Courses</h6>
                      <h4 className="text-white fw-bold">{stats.active}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-secondary">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Pending Courses</h6>
                      <h4 className="text-white fw-bold">{stats.approved}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-info">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Draft Courses</h6>
                      <h4 className="text-white fw-bold">{stats.draft}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-skyblue">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Free Courses</h6>
                      <h4 className="text-white fw-bold">{stats.free}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-purple">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Paid Courses</h6>
                      <h4 className="fw-bold text-white">{stats.paid}</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Courses ({pagination.totalCourses})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.instructorCourse} className="me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to="#" className="active">
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="tab-list course-tab">
                <ul className="nav mb-2" role="tablist">
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      className={activeTab === 'published' ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('published');
                      }}
                    >
                      Published ({stats.active})
                    </Link>
                  </li>
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      className={activeTab === 'approved' ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('approved');
                      }}
                    >
                      Approving ({stats.approved})
                    </Link>
                  </li>
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      className={activeTab === 'draft' ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('draft');
                      }}
                    >
                      Draft ({stats.draft})
                    </Link>
                  </li>
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      className={activeTab === 'inactive' ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('inactive');
                      }}
                    >
                      Inactive ({stats.inactive})
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Course Grid */}
              <div className="tab-content">
                <div className="tab-pane fade active show">
                  {courses.length > 0 ? (
                    <div className="row">
                      {courses.map(renderCourseCard)}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <p className="text-muted">No courses found for this status.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="row align-items-center">
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

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Course</h4>
                <p className="mb-3">Are you sure you want to delete this course?</p>
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-secondary rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorCourseGrid;