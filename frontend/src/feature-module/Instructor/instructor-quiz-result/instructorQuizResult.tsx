import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import ProfileCard from '../common/profileCard';
import InstructorSidebar from '../common/instructorSidebar';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import Table from "../../../core/common/dataTable/index";
import { quizApi } from '../../../core/utils/api';
import { toast } from 'react-toastify';

// Types
interface QuizAttempt {
  id: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  duration: number; // in minutes
}

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  course: {
    id: string;
    title: string;
  };
}

interface Statistics {
  totalAttempts: number;
  completedAttempts: number;
  passedAttempts: number;
  passRate: number;
  averageScore: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const InstructorQuizResult = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (quizId) {
      loadQuizResults();
    }
  }, [quizId, currentPage, pageSize]);

  const loadQuizResults = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getResults(quizId!, {
        page: currentPage,
        limit: pageSize,
      });
      
      if (response.success && response.data) {
        setQuiz(response.data.quiz);
        setAttempts(response.data.attempts);
        setStatistics(response.data.statistics);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error('Error loading quiz results:', error);
      toast.error(error.message || 'Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination changes from Table component
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAverageTime = () => {
    if (!attempts.length) return '00:00:00';
    
    const totalMinutes = attempts.reduce((sum, attempt) => sum + (attempt.duration || 0), 0);
    const avgMinutes = Math.round(totalMinutes / attempts.length);
    
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };

  // Create pagination object that matches your Table component's expected structure
  const paginationForTable = pagination ? {
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalCourses: pagination.totalItems, // Your Table component expects 'totalCourses'
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev
  } : undefined;
  const columns = [
    {
      title: "Student Name",
      dataIndex: "user",
      render: (user: any, ) => (
        <div className="d-flex align-items-center">
          <Link
            to={`${all_routes.studentsDetails}/${user.id}`}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath 
              src={user.avatar || "assets/img/user/user-placeholder.jpg"} 
              alt={user.name}
            />
          </Link>
          <div>
            <Link to={`${all_routes.studentsDetails}/${user.id}`}>
              <p className="fs-14 mb-0 fw-medium">{user.name}</p>
            </Link>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>
      ),
      sorter: (a: QuizAttempt, b: QuizAttempt) => a.user.name.localeCompare(b.user.name),
    },
    {
      title: "Score",
      dataIndex: "score",
      render: (score: number, record: QuizAttempt) => (
        <div>
          <span className={`fw-semibold ${record.passed ? 'text-success' : 'text-danger'}`}>
            {Math.round(score)}%
          </span>
          <div className="small text-muted">
            {record.correctCount}/{record.totalQuestions} correct
          </div>
        </div>
      ),
      sorter: (a: QuizAttempt, b: QuizAttempt) => a.score - b.score,
    },
    {
      title: "Status",
      dataIndex: "passed",
      render: (passed: boolean, ) => (
        <span className={`badge ${passed ? 'bg-success' : 'bg-danger'}`}>
          {passed ? 'Passed' : 'Failed'}
        </span>
      ),
      sorter: (a: QuizAttempt, b: QuizAttempt) => Number(a.passed) - Number(b.passed),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration: number) => (
        <span className="text-muted">
          {formatDuration(duration)}
        </span>
      ),
      sorter: (a: QuizAttempt, b: QuizAttempt) => (a.duration || 0) - (b.duration || 0),
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      render: (completedAt: string) => (
        <span className="text-muted fs-13">
          {formatDate(completedAt)}
        </span>
      ),
      sorter: (a: QuizAttempt, b: QuizAttempt) => 
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    },
  ];

  if (loading) {
    return (
      <>
        <Breadcrumb title="Quiz Results" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <InstructorSidebar />
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

  if (!quiz) {
    return (
      <>
        <Breadcrumb title="Quiz Results" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <InstructorSidebar />
              <div className="col-lg-9">
                <div className="text-center py-5">
                  <h5>Quiz not found</h5>
                  <p className="text-muted">The quiz you're looking for doesn't exist or you don't have access to it.</p>
                  <Link to={all_routes.instructorQuiz} className="btn btn-primary">
                    Back to Quizzes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Quiz Results" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="page-title mb-0">Quiz Results</h5>
                <Link to={all_routes.instructorQuiz} className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Quizzes
                </Link>
              </div>

              {/* Quiz Info Card */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-sm-flex align-items-center">
                    <div className="quiz-img me-3 mb-2 mb-sm-0">
                      <ImageWithBasePath src="assets/img/students/quiz.jpg" alt="" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-2">
                        <Link to="#">{quiz.title}</Link>
                      </h5>
                      <div className="question-info d-flex align-items-center flex-wrap">
                        <p className="d-flex align-items-center fs-14 me-3 mb-0">
                          <i className="isax isax-book text-primary me-2" />
                          {quiz.course.title}
                        </p>
                        <p className="d-flex align-items-center fs-14 me-3 mb-0">
                          <i className="isax isax-medal-star text-warning me-2" />
                          Passing Score: {quiz.passingScore}%
                        </p>
                        <p className="d-flex align-items-center fs-14 mb-0">
                          <i className="isax isax-profile-2user text-info me-2" />
                          {statistics?.completedAttempts || 0} Students Attempted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card bg-secondary-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">
                            Total Attempts
                          </h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            {statistics?.totalAttempts || 0}
                          </span>
                        </div>
                        <div className="icon-box bg-soft-secondary">
                          <ImageWithBasePath src="assets/img/icon/user-tick.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <div className="card bg-success-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">Pass Rate</h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            {statistics?.passRate || 0}%
                          </span>
                        </div>
                        <div className="icon-box bg-soft-success">
                          <ImageWithBasePath src="assets/img/icon/medal-star.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card bg-info-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">Average Score</h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            {Math.round(statistics?.averageScore || 0)}%
                          </span>
                        </div>
                        <div className="icon-box bg-soft-info">
                          <ImageWithBasePath src="assets/img/icon/document.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card bg-purple-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">Average Time</h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            {formatAverageTime()}
                          </span>
                        </div>
                        <div className="icon-box bg-soft-purple">
                          <ImageWithBasePath src="assets/img/icon/clock.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              {attempts.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <div className="mb-3">
                      <i className="fas fa-clipboard-list fa-3x text-muted"></i>
                    </div>
                    <h6>No Quiz Attempts Yet</h6>
                    <p className="text-muted">No students have completed this quiz yet.</p>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Student Results ({statistics?.completedAttempts || 0} completed attempts)</h6>
                  </div>
                  <div className="card-body p-0">
                    <Table 
                      dataSource={attempts} 
                      columns={columns} 
                      Search={false}
                      pagination={paginationForTable}
                      onPageChange={handlePageChange}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      loading={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InstructorQuizResult