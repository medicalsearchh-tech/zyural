import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CircleProgress from "../../Instructor/instructor-dashboard/circleProgress";
import { studentQuizApi } from "../../../core/utils/api";
import { toast } from "react-toastify";

// Types
interface Answer {
  id: string;
  Text: string;
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  points: number;
  answers: Answer[];
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
}

interface QuizSession {
  attemptId: string;
  quiz: QuizData;
  questions: Question[];
  startedAt: string;
}

interface QuizResult {
  attemptId: string;
  score: number;
  totalPointsEarned: number;
  totalPossiblePoints: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  completedAt: string;
}

const StudentQuizQuestion = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const route = all_routes;

  // States
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizPhase, setQuizPhase] = useState<'loading' | 'taking' | 'completed' | 'results'>('loading');

  // Timer effect
  useEffect(() => {
    if (!quizSession || !quizSession.quiz.timeLimit || quizPhase !== 'taking') return;

    const timer = setInterval(() => {
      const startTime = new Date(quizSession.startedAt);
      const now = new Date();
      const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
      const remaining = quizSession.quiz.timeLimit - elapsedMinutes;

      if (remaining <= 0) {
        setTimeRemaining(0);
        handleAutoSubmit();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSession, quizPhase]);

  // Start quiz
  const startQuiz = async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await studentQuizApi.continueQuiz(quizId);
      
      if (response.success && response.data) {
        setQuizSession(response.data);
        setQuizPhase('taking');
        
        if (response.data.quiz.timeLimit) {
          setTimeRemaining(response.data.quiz.timeLimit);
        }
      }
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      toast.error(error.message || 'Failed to start quiz');
      navigate(route.studentDashboard);
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for current question
  const submitAnswer = async (questionId: string, answerId: string) => {
    if (!quizSession) return;

    try {
      await studentQuizApi.submitAnswer(quizSession.attemptId, {
        questionId,
        selectedAnswerId: answerId
      });
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to save answer');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));

    // Auto-submit the answer
    submitAnswer(questionId, answerId);
  };

  // Navigate to next question
  const handleNext = () => {
    if (!quizSession) return;

    if (currentQuestionIndex < quizSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question, show finish button
      handleFinishQuiz();
    }
  };

  // Navigate to previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Finish quiz
  const handleFinishQuiz = async () => {
    if (!quizSession) return;

    try {
      setSubmitting(true);
      const response = await studentQuizApi.submitQuiz(quizSession.attemptId);
      
      if (response.success && response.data) {
        setQuizResult(response.data);
        setQuizPhase('results');
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-submit when time runs out
  const handleAutoSubmit = async () => {
    toast.warning('Time up! Quiz will be submitted automatically.');
    await handleFinishQuiz();
  };

  // Format time display
  const formatTime = (minutes: number) => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (!quizSession) return 0;
    return ((currentQuestionIndex + 1) / quizSession.questions.length) * 100;
  };

  // Initialize quiz on component mount
  useEffect(() => {
    if (quizId) {
      startQuiz();
    }
  }, [quizId]);

  // Loading state
  if (loading || quizPhase === 'loading') {
    return (
      <div className="content">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz not loaded
  if (!quizSession && quizPhase === 'taking') {
    return (
      <div className="content">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            Failed to load quiz. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizSession?.questions[currentQuestionIndex];

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              
              {/* Quiz Taking Phase */}
              {quizPhase === 'taking' && quizSession && currentQuestion && (
                <fieldset className="d-block">
                  <div className="page-title d-flex align-items-center justify-content-between">
                    <h5>Taking Quiz</h5>
                  </div>
                  <div className="quiz-attempt-card border-0">
                    <div className="quiz-attempt-body p-0">
                      <div className="border p-3 mb-3 rounded-2">
                        {/* Quiz Header */}
                        <div className="bg-light border p-3 mb-3 rounded-2 flex-wrap">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="mb-2 mb-md-0">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-lg me-3 flex-shrink-0">
                                    <ImageWithBasePath
                                      className="img-fluid rounded-3"
                                      src="assets/img/students/quiz.jpg"
                                      alt=""
                                    />
                                  </div>
                                  <h5 className="fs-18">
                                    {quizSession.quiz.title}
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="text-md-end">
                                {quizSession.quiz.timeLimit && timeRemaining !== null && (
                                  <p className="d-inline-flex align-items-center mb-0">
                                    <i className="isax isax-clock me-1" />
                                    {formatTime(timeRemaining)}
                                    <span className="text-dark ms-1">
                                      / {formatTime(quizSession.quiz.timeLimit)}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fw-semibold text-gray-9">
                              Quiz Progress
                            </span>
                            <span>
                              Question {currentQuestionIndex + 1} of {quizSession.questions.length}
                            </span>
                          </div>
                          <div className="progress progress-xs flex-grow-1 mb-1">
                            <div
                              className="progress-bar bg-success rounded"
                              role="progressbar"
                              style={{ width: `${getProgress()}%` }}
                              aria-valuenow={getProgress()}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>

                        {/* Question */}
                        <div className="mb-0">
                          <h6 className="mb-3">{currentQuestion.questionText}</h6>
                          {currentQuestion.answers.map((answer,) => (
                            <div key={answer.id} className="form-check mb-2">
                              <label
                                className="form-check-label"
                                htmlFor={`answer-${answer.id}`}
                              >
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question-${currentQuestion.id}`}
                                  id={`answer-${answer.id}`}
                                  value={answer.id}
                                  checked={selectedAnswers[currentQuestion.id] === answer.id}
                                  onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                />
                                {answer.Text}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="d-flex align-items-center justify-content-between">
                        {currentQuestionIndex > 0 && (
                          <button
                            type="button"
                            className="btn bg-gray-100 d-inline-flex rounded-pill align-items-center prev_btn me-1"
                            onClick={handlePrev}
                          >
                            <i className="isax isax-arrow-left-2 me-1 fs-10" />
                            Back
                          </button>
                        )}
                        
                        <div className="ms-auto">
                          {currentQuestionIndex < quizSession.questions.length - 1 ? (
                            <button
                              type="button"
                              className="btn btn-secondary rounded-pill next_btn"
                              onClick={handleNext}
                              disabled={!selectedAnswers[currentQuestion.id]}
                            >
                              Next
                              <i className="isax isax-arrow-right-3 ms-1 fs-10" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-secondary rounded-pill next_btn"
                              onClick={handleFinishQuiz}
                              disabled={submitting || !selectedAnswers[currentQuestion.id]}
                            >
                              {submitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Submitting...
                                </>
                              ) : (
                                'Finish Quiz'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              )}

              {/* Results Phase */}
              {quizPhase === 'results' && quizResult && (
                <fieldset className="d-block">
                  <div className="page-title d-flex align-items-center justify-content-between">
                    <h5>Quiz Results</h5>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="quiz-circle-progress m-0 mb-3">
                        <CircleProgress value={Math.round(quizResult.score)} />
                        <p className="text-center fs-14">Pass Score: {quizResult.passingScore}%</p>
                      </div>
                      <div className="text-center mb-3">
                        <h6 className="mb-1">
                          {quizResult.passed 
                            ? "Congratulations! You Passed" 
                            : "Sorry, You Didn't Pass This Time"
                          }
                        </h6>
                        <p className="fs-14">
                          {quizResult.passed 
                            ? "You've successfully passed the quiz. Keep up the great work!"
                            : "Don't worry, learn from this attempt and come back stronger next time!"
                          }
                        </p>
                        
                        {/* Score Details */}
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <div className="text-center p-2 bg-light rounded">
                              <h6 className="mb-1">{Math.round(quizResult.score)}%</h6>
                              <small className="text-muted">Your Score</small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="text-center p-2 bg-light rounded">
                              <h6 className="mb-1">
                                {quizResult.correctCount}/{quizResult.totalQuestions}
                              </h6>
                              <small className="text-muted">Correct Answers</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to={route.studentDashboard}
                          className="btn btn-secondary rounded-pill me-2"
                        >
                          <i className="isax isax-arrow-left-2 me-1 fs-10" />
                          Back to Dashboard
                        </Link>
                        <button
                          className="btn btn-outline-secondary rounded-pill"
                          onClick={() => {
                            // View detailed results
                            navigate(`${route.studentQuizResult.replace(':attemptId', quizResult.attemptId.toString())}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </fieldset>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentQuizQuestion;