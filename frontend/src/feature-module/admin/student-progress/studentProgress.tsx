import { useState, useEffect } from 'react';
import ProfileCard from '../common/profileCard'
import AdminSidebar from '../common/adminSidebar'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { adminApi } from '../../../core/utils/api';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  category: string;
  instructorName: string;
  enrolledAt: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  totalTimeSpent: number; // in minutes
  lastAccessedAt: string;
  certificateIssued: boolean;
  quizPerformance?: {
    averageScore: number;
    totalAttempts: number;
    passedQuizzes: number;
    totalQuizzes: number;
  };
}

interface StudentProgress {
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  status: string;
  joinedDate: string;
  lastLogin: string;
  totalEnrolledCourses: number;
  completedCourses: number;
  averageProgress: number;
  totalLearningTime: number; // in minutes
  activeCourses: number;
  certificateCount: number;
  courseProgress: CourseProgress[];
}

interface ProgressStats {
  totalStudents: number;
  activeStudents: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalLearningHours: number;
  certificatesIssued: number;
  progressBreakdown: {
    notStarted: number;
    beginner: number; // 0-25%
    intermediate: number; // 26-50%
    advanced: number; // 51-75%
    completing: number; // 76-99%
    completed: number; // 100%
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const StudentProgress = () => {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    averageCompletionRate: 0,
    totalLearningHours: 0,
    certificatesIssued: 0,
    progressBreakdown: {
      notStarted: 0,
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      completing: 0,
      completed: 0,
    }
  });
  const [_pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const fetchStudentProgress = async (page = 1, limit = 10, search = '', filter = '') => {
    try {
      setLoading(true);
      const response = await adminApi.getStudentProgress({
        page,
        limit,
        search,
        filter
      });
      
      setStudents(response.data.studentProgress);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch student progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-success';
    if (progress >= 76) return 'bg-info';
    if (progress >= 51) return 'bg-primary';
    if (progress >= 26) return 'bg-warning';
    if (progress >= 1) return 'bg-danger';
    return 'bg-secondary';
  };

  const getProgressLevel = (progress: number) => {
    if (progress === 100) return 'Completed';
    if (progress >= 76) return 'Completing';
    if (progress >= 51) return 'Advanced';
    if (progress >= 26) return 'Intermediate';
    if (progress >= 1) return 'Beginner';
    return 'Not Started';
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      suspended: 'bg-danger'
    };
    return <span className={`badge ${statusMap[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const handleViewDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedStudent(null);
  };

  // Transform data for the table
  const tableData = students.map(student => ({
    key: student.studentId,
    StudentID: student.studentId.substring(0, 8),
    StudentName: student.fullName,
    Email: student.email,
    Img: student.avatar || 'assets/img/user/default-avatar.jpg',
    Status: student.status,
    JoinedDate: formatDate(student.joinedDate),
    LastLogin: formatDate(student.lastLogin),
    EnrolledCourses: student.totalEnrolledCourses,
    CompletedCourses: student.completedCourses,
    AverageProgress: student.averageProgress,
    TotalLearningTime: student.totalLearningTime,
    Certificates: student.certificateCount,
    fullStudentData: student
  }));

  const columns = [
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
      render: (status: string) => getStatusBadge(status),
      sorter: (a: any, b: any) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Joined Date",
      dataIndex: "JoinedDate",
      sorter: (a: any, b: any) => new Date(a.fullStudentData.joinedDate).getTime() - new Date(b.fullStudentData.joinedDate).getTime(),
    },
    {
      title: "Last Login",
      dataIndex: "LastLogin",
      sorter: (a: any, b: any) => new Date(a.fullStudentData.lastLogin).getTime() - new Date(b.fullStudentData.lastLogin).getTime(),
    },
    {
      title: "Progress",
      dataIndex: "AverageProgress",
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
      sorter: (a: any, b: any) => a.AverageProgress - b.AverageProgress,
    },
    {
      title: "Courses",
      dataIndex: "EnrolledCourses",
      render: (enrolled: number, record: any) => (
        <div className="text-center">
          <div className="fw-bold">{enrolled}</div>
          <small className="text-muted">
            {record.CompletedCourses} completed
          </small>
        </div>
      ),
      sorter: (a: any, b: any) => a.EnrolledCourses - b.EnrolledCourses,
    },
    {
      title: "Learning Time",
      dataIndex: "TotalLearningTime",
      render: (time: number) => (
        <div className="text-center">
          <div className="fw-bold">{formatTimeSpent(time)}</div>
          <small className="text-muted">Total</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.TotalLearningTime - b.TotalLearningTime,
    },
    {
      title: "Certificates",
      dataIndex: "Certificates",
      render: (certificates: number, _record: any) => (
        <div className="text-center">
          <div className={`fw-bold ${certificates > 0 ? 'text-success' : 'text-muted'}`}>
            {certificates}
          </div>
          <small className="text-muted">Earned</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.Certificates - b.Certificates,
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      render: (_: any, record: any) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleViewDetails(record.fullStudentData)}
        >
          <i className="fa-solid fa-chart-line me-1"></i>
          Details
        </button>
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
                  <h4 className="text-white fw-bold">{stats.totalEnrollments}</h4>
                  <h6 className="fw-medium mb-0 text-white">Enrollments</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.averageCompletionRate}%</h4>
                  <h6 className="fw-medium mb-0 text-white">Avg Completion</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-secondary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{Math.round(stats.totalLearningHours)}</h4>
                  <h6 className="fw-medium mb-0 text-white">Learning Hours</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-danger">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.certificatesIssued}</h4>
                  <h6 className="fw-medium mb-0 text-white">Certificates</h6>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">Progress Distribution</h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-secondary">{stats.progressBreakdown.notStarted}</div>
                        <small className="text-muted">Not Started</small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-danger">{stats.progressBreakdown.beginner}</div>
                        <small className="text-muted">Beginner (0-25%)</small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-warning">{stats.progressBreakdown.intermediate}</div>
                        <small className="text-muted">Intermediate (26-50%)</small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-primary">{stats.progressBreakdown.advanced}</div>
                        <small className="text-muted">Advanced (51-75%)</small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-info">{stats.progressBreakdown.completing}</div>
                        <small className="text-muted">Completing (76-99%)</small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="border rounded p-3">
                        <div className="fw-bold text-success">{stats.progressBreakdown.completed}</div>
                        <small className="text-muted">Completed (100%)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <AdminSidebar />
            
            <div className="col-lg-9">
              <div className="page-title mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Student Progress ({stats.totalStudents})</h5>
                <div className="d-flex align-items-center gap-2">
                  <select 
                    className="form-select form-select-sm" 
                    style={{ width: 'auto' }}
                    onChange={(e) => fetchStudentProgress(1, 10, '', e.target.value)}
                  >
                    <option value="">All Progress</option>
                    <option value="not_started">Not Started</option>
                    <option value="beginner">Beginner (0-25%)</option>
                    <option value="intermediate">Intermediate (26-50%)</option>
                    <option value="advanced">Advanced (51-75%)</option>
                    <option value="completing">Completing (76-99%)</option>
                    <option value="completed">Completed (100%)</option>
                  </select>
                </div>
              </div>
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                onSearch={(searchTerm: string) => fetchStudentProgress(1, 10, searchTerm)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Progress Details - {selectedStudent.fullName}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h4 className="text-primary fw-bold">{selectedStudent.averageProgress}%</h4>
                        <small className="text-muted">Average Progress</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h4 className="text-success fw-bold">{selectedStudent.completedCourses}</h4>
                        <small className="text-muted">Completed Courses</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h4 className="text-info fw-bold">{formatTimeSpent(selectedStudent.totalLearningTime)}</h4>
                        <small className="text-muted">Total Learning Time</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h4 className="text-warning fw-bold">{selectedStudent.certificateCount}</h4>
                        <small className="text-muted">Certificates Earned</small>
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="mb-3">Course Progress Breakdown</h6>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Enrolled</th>
                        <th>Progress</th>
                        <th>Lessons</th>
                        <th>Time Spent</th>
                        <th>Last Activity</th>
                        <th>Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.courseProgress.map((course, index) => (
                        <tr key={index}>
                          <td>
                            <div className="fw-medium">{course.courseTitle}</div>
                            <small className="text-muted">{course.category}</small>
                          </td>
                          <td>{course.instructorName}</td>
                          <td>{formatDate(course.enrolledAt)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="progress progress-xs flex-shrink-0"
                                role="progressbar"
                                style={{ height: 6, width: 80 }}
                              >
                                <div
                                  className={`progress-bar ${getProgressColor(course.progressPercentage)}`}
                                  style={{ width: `${course.progressPercentage}%` }}
                                />
                              </div>
                              <span className="ms-2 fs-12">{course.progressPercentage}%</span>
                            </div>
                            <small className="text-muted">{getProgressLevel(course.progressPercentage)}</small>
                          </td>
                          <td>
                            {course.completedLessons}/{course.totalLessons}
                            <br />
                            <small className="text-muted">completed</small>
                          </td>
                          <td>{formatTimeSpent(course.totalTimeSpent)}</td>
                          <td>{formatDate(course.lastAccessedAt)}</td>
                          <td>
                            {course.certificateIssued ? (
                              <span className="badge bg-success">Issued</span>
                            ) : (
                              <span className="badge bg-secondary">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProgress;