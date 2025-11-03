import { useState, useEffect } from 'react';
import ProfileCard from '../common/profileCard'
import AdminSidebar from '../common/adminSidebar'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import Table from "../../../core/common/dataTable/index";
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

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  enrolledStudents: number;
  newStudentsThisMonth: number;
  verifiedStudents: number;
  studentsWithCertificates: number;
  studentsWithoutEnrollments: number;
  activityBreakdown: {
    notEnrolled: number;
    enrolledNotStarted: number;
    active: number;
    completed: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats>({
    totalStudents: 0,
    activeStudents: 0,
    enrolledStudents: 0,
    newStudentsThisMonth: 0,
    verifiedStudents: 0,
    studentsWithCertificates: 0,
    studentsWithoutEnrollments: 0,
    activityBreakdown: {
      notEnrolled: 0,
      enrolledNotStarted: 0,
      active: 0,
      completed: 0,
    }
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminStudents({
        page,
        limit,
        search
      });
      
      setStudents(response.data.studentListData);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not enrolled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getCompletedCoursesCount = (courses: Course[]) => {
    return courses.filter(course => course.progress === 100).length;
  };

  const getCertificateStatusBadge = (certificateCount: number, totalCourses: number) => {
    if (totalCourses === 0) {
      return <span className="badge bg-secondary">Not Enrolled</span>;
    } else if (certificateCount === 0) {
      return <span className="badge bg-secondary">In Progress</span>;
    } else if (certificateCount === totalCourses) {
      return <span className="badge bg-success">All Certified</span>;
    } else {
      return <span className="badge bg-warning">{certificateCount} Certified</span>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'bg-warning',
      active: 'bg-success',
      inactive: 'bg-secondary',
      suspended: 'bg-danger'
    };
    return <span className={`badge ${statusMap[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // Student Management Functions
  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(student => student.studentId));
    } else {
      setSelectedStudents([]);
    }
  };

  const updateStudentStatus = async (studentIds: string[], newStatus: string) => {
    try {
      setActionLoading(true);
      await adminApi.updateStudentStatus({ studentIds, status: newStatus });
      
      // Update local state
      setStudents(prev => prev.map(student => 
        studentIds.includes(student.studentId) 
          ? { ...student, status: newStatus }
          : student
      ));
      
      setShowStatusModal(false);
      setSelectedStudents([]);
      setSelectedStatus('');
      
      // Refresh stats
      fetchStudents(pagination.currentPage);
      
    } catch (error) {
      console.error('Failed to update student status:', error);
      alert('Failed to update student status');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteStudents = async (studentIds: string[]) => {
    try {
      setActionLoading(true);
      await adminApi.deleteStudents(studentIds); 
      
      // Remove from local state
      setStudents(prev => prev.filter(student => 
        !studentIds.includes(student.studentId)
      ));
      
      setShowDeleteModal(false);
      setSelectedStudents([]);
      
      // Refresh stats
      fetchStudents(pagination.currentPage);
      
    } catch (error) {
      console.error('Failed to delete students:', error);
      alert('Failed to delete students');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setSelectedStudents([studentId]);
    setSelectedStatus(newStatus);
    setShowStatusModal(true);
  };

  // Transform data for the table
  const tableData = students.map(student => ({
    key: student.studentId,
    StudentID: student.studentId.substring(0, 8),
    StudentName: student.fullName,
    Email: student.email,
    Img: student.avatar || 'assets/img/user/default-avatar.jpg',
    JoinedDate: formatDate(student.joinedDate),
    Status: student.status,
    Progress: student.progressPercentage,
    Courses: student.courseCount,
    CompletedCourses: getCompletedCoursesCount(student.courses),
    CertificateCount: student.certificateCount,
    IsVerified: student.isVerified,
    fullStudentData: student
  }));

  const columns = [
    {
      title: (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={selectedStudents.length === students.length && students.length > 0}
          />
        </div>
      ),
      dataIndex: "selection",
      render: (_: any, record: any) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={selectedStudents.includes(record.fullStudentData.studentId)}
            onChange={(e) => handleStudentSelection(record.fullStudentData.studentId, e.target.checked)}
          />
        </div>
      ),
      width: 50,
    },
    {
      title: "Student ID",
      dataIndex: "StudentID",
      render: (text: string, record: any) => (
        <Link to="#" className="text-primary" title={record.fullStudentData.studentId}>
          {text}...
        </Link>
      ),
      sorter: (a: any, b: any) => a.StudentID.localeCompare(b.StudentID),
    },
    {
      title: "Student Name",
      dataIndex: "StudentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={record.Img} alt={text} />
          </Link>
          <div>
            <Link to="#" className="text-decoration-none">
              <p className="fs-14 mb-0 fw-medium">{text}</p>
            </Link>
            <small className="text-muted">{record.Email}</small>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.StudentName.localeCompare(b.StudentName),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (status: string, record: any) => (
        <div className="dropdown">
          <button 
            className={`btn btn-sm dropdown-toggle ${getStatusBadge(status).props.className}`}
            type="button"
            data-bs-toggle="dropdown"
          >
            {status}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button 
                className="dropdown-item text-success" 
                onClick={() => handleStatusChange(record.fullStudentData.studentId, 'active')}
              >
                Active
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item text-warning" 
                onClick={() => handleStatusChange(record.fullStudentData.studentId, 'pending')}
              >
                Pending
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item text-secondary" 
                onClick={() => handleStatusChange(record.fullStudentData.studentId, 'inactive')}
              >
                Inactive
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item text-danger" 
                onClick={() => handleStatusChange(record.fullStudentData.studentId, 'suspended')}
              >
                Suspended
              </button>
            </li>
          </ul>
        </div>
      ),
      sorter: (a: any, b: any) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Joined Date",
      dataIndex: "JoinedDate",
      sorter: (a: any, b: any) => new Date(a.fullStudentData.joinedDate).getTime() - new Date(b.fullStudentData.joinedDate).getTime(),
    },
    {
      title: "Progress",
      dataIndex: "Progress",
      render: (progress: number) => (
        <div className="d-flex align-items-center">
          <div
            className="progress progress-xs flex-shrink-0"
            role="progressbar"
            style={{ height: 6, width: 100 }}
          >
            <div
              className={`progress-bar ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ms-2 fs-12 fw-medium">{progress}%</span>
        </div>
      ),
      sorter: (a: any, b: any) => a.Progress - b.Progress,
    },
    {
      title: "Courses",
      dataIndex: "Courses",
      render: (courses: number) => (
        <div className="text-center">
          <div className="fw-bold">{courses}</div>
          <small className="text-muted">Enrolled</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.Courses - b.Courses,
    },
    {
      title: "Completed",
      dataIndex: "CompletedCourses",
      render: (completed: number, record: any) => (
        <div className="text-center">
          <div className="fw-bold text-success">{completed}</div>
          <small className="text-muted">of {record.Courses}</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.CompletedCourses - b.CompletedCourses,
    },
    {
      title: "Certificates",
      dataIndex: "CertificateCount",
      render: (certificateCount: number, record: any) => (
        <div className="text-center">
          {getCertificateStatusBadge(certificateCount, record.Courses)}
          <div className="mt-1">
            <small className="text-muted">{certificateCount} earned</small>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.CertificateCount - b.CertificateCount,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <div className="dropdown">
          <button
            className="btn btn-sm btn-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="isax isax-more"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link 
                className="dropdown-item" 
                to={`/admin/student-detail/${record.fullStudentData.studentId}`}
              >
                <i className="isax isax-eye me-2"></i>View Details
              </Link>
            </li>
            <li>
              <button 
                className="dropdown-item text-danger" 
                onClick={() => deleteStudents([record.fullStudentData.studentId])}
              >
                <i className="isax isax-trash me-2"></i>Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <>
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
      <div className="content">
        <div className="container">
          <ProfileCard />
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-2">
              <div className="card bg-primary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.totalStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Total Students</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-info">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.activeStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Active</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-success">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.enrolledStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Enrolled</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.verifiedStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Verified</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-secondary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.newStudentsThisMonth}</h4>
                  <h6 className="fw-medium mb-0 text-white">New (30 days)</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-danger">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.studentsWithCertificates}</h4>
                  <h6 className="fw-medium mb-0 text-white">Certificates</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <AdminSidebar />
            
            <div className="col-lg-9">
              <div className="page-title mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Students ({stats.totalStudents})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.adminStudentsList} className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to={all_routes.adminStudentsGrid} className="">
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedStudents.length > 0 && (
                <div className="card mb-3">
                  <div className="card-body py-2">
                    <div className="d-flex align-items-center gap-2">
                      <div>
                        <span className="fw-medium">{selectedStudents.length} student(s) selected</span>
                      </div>
                      <div className="d-flex gap-2">
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            disabled={actionLoading}
                          >
                            <i className="isax isax-edit me-1"></i>
                            Change Status
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item text-success" 
                                onClick={() => {
                                  setSelectedStatus('active');
                                  setShowStatusModal(true);
                                }}
                              >
                                Set as Active
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-warning" 
                                onClick={() => {
                                  setSelectedStatus('pending');
                                  setShowStatusModal(true);
                                }}
                              >
                                Set as Pending
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-secondary" 
                                onClick={() => {
                                  setSelectedStatus('inactive');
                                  setShowStatusModal(true);
                                }}
                              >
                                Set as Inactive
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger" 
                                onClick={() => {
                                  setSelectedStatus('suspended');
                                  setShowStatusModal(true);
                                }}
                              >
                                Set as Suspended
                              </button>
                            </li>
                          </ul>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={actionLoading}
                        >
                          <i className="isax isax-trash me-1"></i>
                          Delete Selected
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedStudents([])}
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                onSearch={(searchTerm: string) => fetchStudents(1, 10, searchTerm)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change the status of {selectedStudents.length} student(s) to <strong>{selectedStatus}</strong>?
                </p>
                <p className="text-muted small">
                  This action will affect their ability to access the platform.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowStatusModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => updateStudentStatus(selectedStudents, selectedStatus)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Updating...' : 'Confirm Change'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-danger">
                  <i className="isax isax-danger me-2"></i>
                  Are you sure you want to delete {selectedStudents.length} student(s)?
                </p>
                <p className="text-muted small">
                  This action cannot be undone. All student data, enrollments, and progress will be permanently removed.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => deleteStudents(selectedStudents)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete Students'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;