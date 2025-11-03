import { useState, useEffect } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import StudentSidebar from "../common/studentSidebar";
import ProfileCard from "../common/profileCard";
import { studentQuizApi } from "../../../core/utils/api";
import { toast } from "react-toastify";

// Types
interface QuizAttempt {
  id: string;
  quizTitle: string;
  quizId: string;
  totalQuestions: number;
  score?: number;
  status: 'in_progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  passed?: boolean;
}

const StudentQuiz = () => {
  const route = all_routes;
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Load quiz attempts
  useEffect(() => {
    loadQuizAttempts();
  }, [currentPage]);

  const loadQuizAttempts = async () => {
    try {
      setLoading(true);
      const response = await studentQuizApi.getMyAttempts({
        page: currentPage,
        limit: itemsPerPage
      });

      if (response.success && response.data) {
        setAttempts(response.data.attempts || response.data);
        setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / itemsPerPage));
      }
    } catch (error: any) {
      console.error('Error loading quiz attempts:', error);
      toast.error(error.message || 'Failed to load quiz attempts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (attempt: QuizAttempt) => {
    switch (attempt.status) {
      case 'in_progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      case 'completed':
        return attempt.passed 
          ? <span className="badge bg-success">Passed</span>
          : <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="My Quiz Attempts" />
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

  return (
    <>
      <Breadcrumb title="My Quiz Attempts" />

      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <StudentSidebar />
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>My Quiz Attempts</h5>
              </div>

              {attempts.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="fa fa-quiz-alt fa-3x text-muted"></i>
                  </div>
                  <h6>No Quiz Attempts Yet</h6>
                  <p className="text-muted">You haven't taken any quizzes yet. Start learning and take your first quiz!</p>
                  <Link to={route.courseGrid} className="btn btn-primary">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <>
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="d-flex align-items-center justify-content-between border p-3 mb-3 rounded-2">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <Link 
                            to={attempt.status === 'in_progress' 
                              ? `${route.studentQuizQuestion.replace(':quizId', attempt.quizId)}`
                              : `${route.studentQuizResult.replace(':attemptId', attempt.id.toString())}`
                            }
                          >
                            {attempt.quizTitle}
                          </Link>
                        </h6>
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <p className="fs-14 mb-0">Number of Questions: {attempt.totalQuestions}</p>
                          {attempt.score !== undefined && (
                            <p className="fs-14 mb-0">Score: {Math.round(attempt.score)}%</p>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          {getStatusBadge(attempt)}
                          <small className="text-muted">
                            Started: {formatDate(attempt.startedAt)}
                            {attempt.completedAt && (
                              <> • Completed: {formatDate(attempt.completedAt)}</>
                            )}
                          </small>
                        </div>
                      </div>
                      <div>
                        <Link 
                          to={attempt.status === 'in_progress' 
                            ? `${route.studentQuizQuestion.replace(':quizId', attempt.quizId)}`
                            : `${route.studentQuizResult.replace(':attemptId', attempt.id.toString())}`
                          } 
                          className="arrow-next"
                          title={attempt.status === 'in_progress' ? 'Continue Quiz' : 'View Results'}
                        >
                          <i className="isax isax-arrow-right-1" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="row align-items-center mt-3">
                      <div className="col-md-2">
                        <p className="pagination-text">Page {currentPage} of {totalPages}</p>
                      </div>
                      <div className="col-md-10">
                        <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                          <li className={`page-item prev ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <i className="fas fa-angle-left" />
                            </button>
                          </li>
                          {renderPaginationItems()}
                          <li className={`page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <i className="fas fa-angle-right" />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentQuiz;