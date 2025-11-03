import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../router/all_routes";
import StudentSidebar from "../common/studentSidebar";
import ProfileCard from "../common/profileCard";
import { studentQuizApi } from "../../../core/utils/api";
import { toast } from "react-toastify";
import './result.css';

// Types
interface QuizAttempt {
  id: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string;
  passed: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
}

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  questionId: string;
  questionText: string;
  questionType: string;
  points: number;
  userAnswerId: string | null;
  userAnswerText: string | null;
  correctAnswerId: string;
  correctAnswerText: string;
  isCorrect: boolean;
  pointsEarned: number;
  allAnswers: Answer[];
}

interface QuizResults {
  attempt: QuizAttempt;
  quiz: Quiz;
  questions: Question[];
}

const StudentQuizResults = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const route = all_routes;
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (attemptId) {
      loadQuizResults();
    }
  }, [attemptId]);

  const loadQuizResults = async () => {
    try {
      setLoading(true);
      const response = await studentQuizApi.getResults(attemptId!);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        toast.error('Failed to load quiz results');
      }
    } catch (error: any) {
      console.error('Error loading quiz results:', error);
      toast.error(error.message || 'Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) return 'text-success';
    if (score >= passingScore * 0.8) return 'text-warning';
    return 'text-danger';
  };

  const getAnswerClassName = (answer: Answer, userAnswerId: string | null, correctAnswerId: string) => {
    let className = 'list-group-item border-0 py-2 px-3 mb-1';
    
    if (answer.id === correctAnswerId) {
      className += ' bg-success-subtle text-success border-success';
    } else if (answer.id === userAnswerId && !answer.isCorrect) {
      className += ' bg-danger-subtle text-danger border-danger';
    } else {
      className += ' bg-light';
    }
    
    return className;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Quiz Results" />
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

  if (!results) {
    return (
      <>
        <Breadcrumb title="Quiz Results" />
        <div className="content">
          <div className="container">
            <ProfileCard />
            <div className="row">
              <StudentSidebar />
              <div className="col-lg-9">
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
                  </div>
                  <h5>Results Not Found</h5>
                  <p className="text-muted">The quiz results you're looking for could not be found.</p>
                  <Link to={route.studentQuiz} className="btn btn-primary">
                    Back to My Quizzes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { attempt, quiz, questions } = results;

  return (
    <>
      <Breadcrumb title="Quiz Results" />

      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <StudentSidebar />
            <div className="col-lg-9 quiz-results-page">
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h4 className="mb-1">{quiz.title}</h4>
                  <p className="text-muted mb-0">{quiz.description}</p>
                </div>
                <Link to={route.studentQuiz} className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Quizzes
                </Link>
              </div>

              {/* Results Summary Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      <div className={`display-4 fw-bold ${getScoreColor(attempt.score, quiz.passingScore)}`}>
                        {Math.round(attempt.score)}%
                      </div>
                      <div className={`badge fs-6 px-3 py-2 ${attempt.passed ? 'bg-success' : 'bg-danger'}`}>
                        {attempt.passed ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-6 col-lg-3 mb-3">
                          <div className="text-muted small">Score Required</div>
                          <div className="fw-semibold">{quiz.passingScore}%</div>
                        </div>
                        <div className="col-6 col-lg-3 mb-3">
                          <div className="text-muted small">Correct Answers</div>
                          <div className="fw-semibold">{attempt.correctCount} of {attempt.totalQuestions}</div>
                        </div>
                        <div className="col-6 col-lg-3 mb-3">
                          <div className="text-muted small">Time Taken</div>
                          <div className="fw-semibold">{formatDuration(attempt.startedAt, attempt.completedAt)}</div>
                        </div>
                        <div className="col-6 col-lg-3 mb-3">
                          <div className="text-muted small">Completed On</div>
                          <div className="fw-semibold">{formatDate(attempt.completedAt)}</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small text-muted">Your Performance</span>
                          <span className="small fw-semibold">{Math.round(attempt.score)}%</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${attempt.passed ? 'bg-success' : 'bg-danger'}`}
                            style={{ width: `${Math.min(attempt.score, 100)}%` }}
                          />
                          {/* Passing score marker */}
                          <div 
                            className="position-absolute top-0 bottom-0 bg-warning"
                            style={{ 
                              left: `${quiz.passingScore}%`, 
                              width: '2px',
                              zIndex: 10
                            }}
                          />
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <span className="small text-muted">0%</span>
                          <span 
                            className="small text-warning fw-semibold position-relative"
                            style={{ left: `${quiz.passingScore - 50}%` }}
                          >
                            Pass: {quiz.passingScore}%
                          </span>
                          <span className="small text-muted">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-4">
                <button 
                  className={`btn ${showAnswers ? 'btn-outline-primary' : 'btn-primary'}`}
                  onClick={() => setShowAnswers(!showAnswers)}
                >
                  <i className={`fas ${showAnswers ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
                  {showAnswers ? 'Hide' : 'Review'} Questions & Answers
                </button>
                <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>
                  Print Results
                </button>
              </div>

              {/* Questions Review */}
              {showAnswers && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-question-circle me-2"></i>
                      Question Review
                    </h6>
                  </div>
                  <div className="card-body p-0">
                    {questions.map((question, index) => (
                      <div key={question.questionId} className="border-bottom p-4">
                        <div className="d-flex align-items-start mb-3">
                          <div className={`badge me-3 ${question.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                            {index + 1}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-2">{question.questionText}</h6>
                            <div className="d-flex align-items-center gap-3 mb-3">
                              <span className="badge bg-light text-dark">
                                {question.points} {question.points === 1 ? 'point' : 'points'}
                              </span>
                              <span className={`badge ${question.isCorrect ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                {question.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                              <span className="small text-muted">
                                Earned: {question.pointsEarned} / {question.points} points
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ms-5">
                          <div className="list-group list-group-flush">
                            {question.allAnswers.map((answer) => (
                              <div 
                                key={answer.id}
                                className={getAnswerClassName(answer, question.userAnswerId, question.correctAnswerId)}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="me-2">
                                    {answer.id === question.correctAnswerId && (
                                      <i className="fas fa-check-circle text-success"></i>
                                    )}
                                    {answer.id === question.userAnswerId && !answer.isCorrect && (
                                      <i className="fas fa-times-circle text-danger"></i>
                                    )}
                                    {answer.id !== question.correctAnswerId && answer.id !== question.userAnswerId && (
                                      <i className="far fa-circle text-muted"></i>
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                    {answer.answerText}
                                  </div>
                                  <div className="ms-2">
                                    {answer.id === question.userAnswerId && (
                                      <span className="badge bg-primary">Your Answer</span>
                                    )}
                                    {answer.id === question.correctAnswerId && (
                                      <span className="badge bg-success ms-2">Correct</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {!question.userAnswerId && (
                            <div className="mt-2 p-2 bg-warning-subtle border border-warning rounded">
                              <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                              <span className="text-warning-emphasis">This question was not answered</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div className="text-center mt-4 pt-4 border-top">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Link to={route.studentQuiz} className="btn btn-outline-primary w-100">
                      <i className="fas fa-list me-2"></i>
                      My Quiz History
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link to={route.courseGrid} className="btn btn-outline-secondary w-100">
                      <i className="fas fa-book me-2"></i>
                      Browse Courses
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link to={route.studentDashboard} className="btn btn-primary w-100">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Link>
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

export default StudentQuizResults;