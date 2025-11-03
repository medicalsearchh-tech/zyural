import { useState, useEffect } from 'react';
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import ProfileCard from '../common/profileCard'
import AdminSidebar from '../common/adminSidebar'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import { adminApi } from '../../../core/utils/api';

interface Course {
  id: string;
  title: string;
  progress: number;
  enrolledAt: string;
  certificateIssued: boolean;
}

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  status: string;
  isVerified: boolean;
  isActive: boolean;
  joinedDate: string;
  lastLogin: string;
  lastActivity: string;
  enrollDate: string | null;
  progressPercentage: number;
  courseCount: number;
  certificateCount: number;
  activityStatus: string;
  courses: Course[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const StudentGrid = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents(1);
  }, []);

  const fetchStudents = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminStudents({
        page,
        limit: 9,
        search
      });
      
      setStudents(response.data.studentListData);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchStudents(1, term);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchStudents(page, searchTerm);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not joined';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'bg-warning',
      active: 'bg-success',
      inactive: 'bg-secondary',
      suspended: 'bg-danger'
    };
    return statusMap[status] || 'bg-secondary';
  };

  // Generate pagination array
  const getPaginationArray = () => {
    const arr = [];
    const maxVisible = 5;
    const start = Math.max(1, pagination.currentPage - 2);
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (start > 1) arr.push('...');
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    if (end < pagination.totalPages) arr.push('...');

    return arr;
  };

  if (loading) {
    return (
      <div className="content">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* Sidebar */}
            <AdminSidebar />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Students ({pagination.totalStudents})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.adminStudentsList} className="me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to={all_routes.adminStudentsGrid} className="active">
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-md-4">
                  <div className="input-icon mb-3">
                    <span className="input-icon-addon">
                      <i className="isax isax-search-normal-14" />
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-md"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {students.length > 0 ? (
                <div className="row">
                  {students.map((student) => (
                    <div className="col-xl-4 col-md-6" key={student.studentId}>
                      <div className="card">
                        <div className="card-body">
                          <div className="mb-3">
                            <Link to={all_routes.studentsDetails}>
                              <ImageWithBasePath
                                src={student.avatar || 'assets/img/students/student-default.jpg'}
                                className="rounded-3 w-100"
                                alt={student.fullName}
                                style={{ height: '200px', objectFit: 'cover' }}
                              />
                            </Link>
                          </div>
                          <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                            <div>
                              <h5 className="mb-2 fw-bold">
                                <Link to={all_routes.studentsDetails} className="text-decoration-none">
                                  {student.fullName}
                                </Link>
                              </h5>
                              <small className="text-muted d-block mb-2">{student.email}</small>
                              <span className={`badge ${getStatusBadgeColor(student.status)}`}>
                                {student.status}
                              </span>
                            </div>
                            <Link
                              to="#"
                              className="avatar avatar-md avatar-rounded border"
                              title="Message"
                            >
                              <i className="isax isax-messages text-gray-9 fs-14" />
                            </Link>
                          </div>
                          <div className="d-flex align-items-center justify-content-between fs-14 mb-2">
                            <span className="d-inline-flex align-items-center">
                              <i className="isax isax-calendar-add5 text-primary me-1" />
                              {formatDate(student.joinedDate)}
                            </span>
                            <span className="d-inline-flex align-items-center">
                              <i className="isax isax-teacher5 text-secondary me-1" />
                              {student.courseCount} Courses
                            </span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between fs-14">
                            <span className="d-inline-flex align-items-center">
                              <i className="isax isax-award text-info me-1" />
                              {student.certificateCount} Certificates
                            </span>
                            <span className="d-inline-flex align-items-center">
                              <i className="isax isax-activity text-warning me-1" />
                              {student.progressPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info text-center">
                  <p className="mb-0">No students found</p>
                </div>
              )}

              {/* Pagination */}
              <div className="row align-items-center mt-4">
                <div className="col-md-2">
                  <p className="pagination-text">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                </div>
                <div className="col-md-10">
                  <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                    <li className={`page-item prev ${!pagination.hasPrev ? 'disabled' : ''}`}>
                      <Link
                        className="page-link"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasPrev) handlePageChange(pagination.currentPage - 1);
                        }}
                        tabIndex={!pagination.hasPrev ? -1 : 0}
                      >
                        <i className="fas fa-angle-left" />
                      </Link>
                    </li>

                    {getPaginationArray().map((page, index) => (
                      <li
                        key={index}
                        className={`page-item ${page === '...' ? 'disabled' : ''} ${
                          page === pagination.currentPage ? 'active' : ''
                        }`}
                      >
                        {page === '...' ? (
                          <span className="page-link">...</span>
                        ) : (
                          <Link
                            className="page-link"
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page as number);
                            }}
                          >
                            {page}
                          </Link>
                        )}
                      </li>
                    ))}

                    <li className={`page-item next ${!pagination.hasNext ? 'disabled' : ''}`}>
                      <Link
                        className="page-link"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasNext) handlePageChange(pagination.currentPage + 1);
                        }}
                        tabIndex={!pagination.hasNext ? -1 : 0}
                      >
                        <i className="fas fa-angle-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* /Pagination */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentGrid