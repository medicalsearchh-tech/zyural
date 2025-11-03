// frontend/src/feature-module/learn/components/CourseLearningPageDemo.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from "../../../feature-module/router/all_routes";
import { courseApi } from '../../../core/utils/api';
import CommonDescription from '../../../core/common/commonDescription';
import '../../learn/components/index.css';
import VideoModal from '../../HomePages/home-one/section/videoModal';
import ReactPlayer from 'react-player';
import { useUser } from '../../../core/context/UserContext';
import { toast } from "react-toastify";

// API Types (same as main component)
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImageUrl?: string;
  promoVideo?: string;
  learningObjectives?: string[];
  sections: Section[];
  quizzes: Quiz[];
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Section {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: Lesson[];
  hasQuiz: boolean;
  isUnlocked?: boolean;
  sectionQuiz?: Quiz;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  sectionId: string;
  isCompleted?: boolean;
  score?: number;
  isPassed?: boolean;
}

interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

interface Lesson {
  id: string;
  title: string;
  contentUrl: string;
  videoUrl?: string;
  duration?: number;
  sortOrder: number;
  freePreview: boolean;
  attachments?: Attachment[] | string | null;
  type: 'video' | 'pdf' | 'text' | 'link';
  textContent?: string;
}

interface QuizAnswer {
  id: string;
  text: string;
  Text?: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  questionText?: string;
  questionType: 'multiple_choice' | 'true_false';
  points: number;
  answers: QuizAnswer[];
}

interface QuizSession {
  attemptId: string;
  quiz: {
    id: string;
    title: string;
    timeLimit: number;
    totalQuestions: number;
    passingScore: number;
  };
  questions: QuizQuestion[];
  startedAt: string;
}

interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
}

// Simple icon components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={`icon ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={`icon ${className} module-toggle-icon`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={`icon ${className}`} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const CourseLearningPageDemo: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { logout, user } = useUser();

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Demo state (in-memory only, no API calls)
  const [demoProgress, setDemoProgress] = useState<Set<string>>(new Set());
  const [quizPhase, setQuizPhase] = useState<'lesson' | 'taking' | 'results'>('lesson');
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [detailedResults, setDetailedResults] = useState<any>(null);
  const [currentSectionQuiz, setCurrentSectionQuiz] = useState<Quiz | null>(null);
  const [_screenLoading, setScreenLoading] = useState(false);

  // Load course data (REAL DATA from API)
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseSlug) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch REAL course data
        const response = await courseApi.getCourseBySlug(courseSlug);
        if (!response.success) throw new Error("Failed to fetch course");
        const courseData = response.data.course as Course;

        // For demo: Unlock ALL sections
        const sectionsWithQuizStatus = courseData.sections.map((section) => {
          const sectionQuiz = courseData.quizzes?.find(quiz => 
            quiz.sectionId === section.id
          );

          return {
            ...section,
            sectionQuiz: sectionQuiz,
            isUnlocked: true // All unlocked in demo
          };
        });

        setCourse({
          ...courseData,
          sections: sectionsWithQuizStatus
        });

        // Auto-expand section containing current lesson
        if (lessonId && courseData.sections) {
          const currentSection = courseData.sections.find(section =>
            section.lessons.some(lesson => lesson.id === lessonId)
          );
          if (currentSection) {
            setExpandedSections(prev =>
              prev.includes(currentSection.id) ? prev : [...prev, currentSection.id]
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseSlug, lessonId]);

  // Helpers
  const getAllLessons = (): (Lesson & { sectionId: string; isUnlocked: boolean })[] => {
    if (!course) return [];
    return course.sections
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .flatMap(section =>
        section.lessons
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(lesson => ({ 
            ...lesson, 
            sectionId: section.id,
            isUnlocked: true // All unlocked in demo
          }))
      );
  };

  const getCurrentLesson = (): (Lesson & { sectionId: string; isUnlocked: boolean }) | null => {
    const allLessons = getAllLessons();
    return allLessons.find(lesson => lesson.id === lessonId) || null;
  };

  const getCurrentLessonContent = () => {
    const currentLesson = getCurrentLesson();
    if (!currentLesson) return null;

    // For text lessons, use textContent directly
    if (currentLesson.type === 'text' && currentLesson.textContent) {
      return {
        ...currentLesson,
        parsedContent: {
          title: currentLesson.title,
          content: currentLesson.textContent
        }
      };
    }

    // For other types, use the existing logic
    try {
      const contentUrl = JSON.parse(currentLesson.contentUrl);
      return { ...currentLesson, parsedContent: contentUrl };
    } catch {
      return {
        ...currentLesson,
        parsedContent: {
          title: currentLesson.title,
          subtitle: "",
          text: [currentLesson.contentUrl],
          image:
            course?.heroImageUrl ||
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        },
      };
    }
  };

  const getCurrentSection = () => {
    const currentLesson = getCurrentLesson();
    if (!currentLesson) return null;
    
    return course?.sections.find(section => section.id === currentLesson.sectionId);
  };

  const getCurrentSectionProgress = () => {
    const currentLesson = getCurrentLesson();
    if (!currentLesson) return { percentage: 0, current: 0, total: 0, sectionId: null };

    const { percentage, completed, total } = getSectionProgress(currentLesson.sectionId);
    const section = course?.sections.find(s => s.id === currentLesson.sectionId);
    
    return {
      percentage,
      current: completed,
      total,
      sectionId: currentLesson.sectionId,
      sectionTitle: section?.title || ''
    };
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return demoProgress.has(lessonId);
  };

  const getSectionProgress = (sectionId: string) => {
    const section = course?.sections.find(s => s.id === sectionId);
    if (!section) return { percentage: 0, completed: 0, total: 0 };

    const completed = section.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    const total = section.lessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { percentage, completed, total };
  };

  const getNavigationState = () => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);

    return {
      hasPrevious: currentIndex > 0,
      hasNext: currentIndex < allLessons.length - 1,
      currentIndex: currentIndex + 1,
      totalLessons: allLessons.length,
      previousLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    };
  };

  const getFirstLesson = (): (Lesson & { sectionId: string; isUnlocked: boolean }) | null => {
    const allLessons = getAllLessons();
    return allLessons.length > 0 ? allLessons[0] : null;
  };

  // Demo: Mark lesson complete (in-memory only, no API call)
  const markLessonComplete = (lessonId: string) => {
    setDemoProgress(prev => new Set([...prev, lessonId]));
    toast.success("✓ Lesson marked as complete (Demo - not saved)");
  };

  // Demo: Start quiz (mock quiz session, no API call)
  const startQuiz = (quiz: Quiz, sectionId: string) => {
    // Check if all lessons in the section are completed
    const sectionProgress = getSectionProgress(sectionId);
    if (sectionProgress.percentage < 100) {
      toast.error(`Demo: Please complete all lessons in this section before taking the quiz.`);
      return;
    }

    // Create mock quiz session
    const mockQuestions: QuizQuestion[] = Array.from({ length: 5 }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Demo Question ${i + 1}`,
      questionText: `Demo Question ${i + 1} for ${quiz.title}`,
      questionType: 'multiple_choice' as const,
      points: 10,
      answers: [
        { id: `q${i + 1}a1`, text: 'Option A', Text: 'Option A', isCorrect: i === 0 },
        { id: `q${i + 1}a2`, text: 'Option B', Text: 'Option B', isCorrect: i === 1 },
        { id: `q${i + 1}a3`, text: 'Option C', Text: 'Option C', isCorrect: i === 2 },
        { id: `q${i + 1}a4`, text: 'Option D', Text: 'Option D', isCorrect: i === 3 || i === 4 }
      ]
    }));

    const mockSession: QuizSession = {
      attemptId: `demo-attempt-${Date.now()}`,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        totalQuestions: mockQuestions.length,
        passingScore: quiz.passingScore
      },
      questions: mockQuestions,
      startedAt: new Date().toISOString()
    };

    setQuizSession(mockSession);
    setCurrentSectionQuiz(quiz);
    setQuizPhase('taking');
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }

    toast.info("Demo Quiz Started - Your answers won't be saved");
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleQuizNavigation = (direction: 'next' | 'prev') => {
    if (!quizSession) return;
    
    if (direction === 'next') {
      const currentQuestion = quizSession.questions[currentQuestionIndex];
      const selectedAnswer = selectedAnswers[currentQuestion.id];
      
      if (selectedAnswer) {
        if (currentQuestionIndex < quizSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          finishQuiz();
        }
      } else {
        toast.error('Please select an answer before continuing.');
      }
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    if (!quizSession) return;
    
    // Calculate demo result
    let correctCount = 0;
    quizSession.questions.forEach(question => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answers.find(a => a.isCorrect);
      if (selectedAnswerId === correctAnswer?.id) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizSession.questions.length) * 100);
    const result: QuizResult = {
      score,
      correctCount,
      totalQuestions: quizSession.questions.length,
      passed: score >= quizSession.quiz.passingScore,
      passingScore: quizSession.quiz.passingScore
    };

    // Create detailed results for review
    const detailed = {
      questions: quizSession.questions.map(question => {
        const selectedAnswerId = selectedAnswers[question.id];
        const correctAnswer = question.answers.find(a => a.isCorrect);
        const userAnswer = question.answers.find(a => a.id === selectedAnswerId);
        
        return {
          questionId: question.id,
          questionText: question.questionText,
          points: question.points,
          pointsEarned: selectedAnswerId === correctAnswer?.id ? question.points : 0,
          isCorrect: selectedAnswerId === correctAnswer?.id,
          userAnswerId: selectedAnswerId,
          userAnswerText: userAnswer?.text || userAnswer?.Text || 'Not answered',
          correctAnswerId: correctAnswer?.id,
          correctAnswerText: correctAnswer?.text || correctAnswer?.Text,
          allAnswers: question.answers.map(a => ({
            id: a.id,
            answerText: a.text || a.Text,
            isCorrect: a.isCorrect
          }))
        };
      })
    };

    setDetailedResults(detailed);
    setQuizResult(result);
    setQuizPhase('results');
    
    if (result.passed) {
      toast.success(`Demo: Quiz passed with ${score}% (not saved)`);
    } else {
      toast.error(`Demo: Quiz failed with ${score}% (not saved)`);
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  // Events
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleLessonClick = (lesson: Lesson & { sectionId: string; isUnlocked: boolean }) => {
    navigate(`/preview/${courseSlug}/${lesson.id}`);
  };

  const handleNavigation = async (direction: "previous" | "next") => {
    setScreenLoading(true);
    
    try {
      if (direction === 'next' && !lessonId) {
        const first = getFirstLesson();
        if (first) {
          navigate(`/preview/${courseSlug}/${first.id}`);
        }
        return;
      }

      const navState = getNavigationState();
      const currentSection = getCurrentSection();

      if (direction === "previous" && navState.previousLesson) {
        navigate(`/preview/${courseSlug}/${navState.previousLesson.id}`);
      } else if (direction === "next") {
        if (navState.nextLesson) {
          if (lessonId) {
            markLessonComplete(lessonId);
          }
          navigate(`/preview/${courseSlug}/${navState.nextLesson.id}`);
        } else if (!navState.hasNext && currentSection?.hasQuiz && currentSection.sectionQuiz) {
          // Last lesson in section - start section quiz
          if (lessonId) {
            markLessonComplete(lessonId);
          }
          startQuiz(currentSection.sectionQuiz, currentSection.id);
        } else if (!navState.hasNext && !currentSection?.hasQuiz) {
          // Last lesson in course or section without quiz
          if (lessonId) {
            markLessonComplete(lessonId);
          }
          toast.success("Demo: Section completed!");
        }
      }
    } finally {
      setScreenLoading(false);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  const formatTime = (minutes: number): string => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizPhase === 'taking' && quizSession && timeRemaining !== null) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            finishQuiz();
            return 0;
          }
          return prev - (1/60); // Decrease by 1 second (in minutes)
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizPhase, quizSession, timeRemaining]);

  // Loading and error states
  if (loading) {
    return (
      <div className="course-learning-page loading justify-content-center">
        <div className="text-center text-black">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="main-wrapper">
        <div className="error-box">
          <ImageWithBasePath
            src="assets/img/error/img-01.svg"
            alt="img"
            className="img-fluid bg-01"
          />
          <div className="error-logo">
            <Link to={all_routes.homeone}>
              <ImageWithBasePath
                src="assets/img/logo.svg"
                className="img-fluid"
                alt="Logo"
              />
            </Link>
          </div>
          <h3 className="h2 mb-3">Error Loading Course</h3>
          <p className="h4 font-weight-normal">{error}</p>
          <Link to={all_routes.courseList} className="btn back-to-home-btn">
            <i className="isax isax-arrow-left-2 me-1" /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonContent = getCurrentLessonContent();
  const sectionProgress = getCurrentSectionProgress();
  const navState = getNavigationState();
  const showOverview = !lessonId;
  const learnList = (course.learningObjectives && Array.isArray(course.learningObjectives))
    ? course.learningObjectives
    : ((course as any).whatYouwillLearn && Array.isArray((course as any).whatYouwillLearn))
      ? (course as any).whatYouwillLearn
      : [];
  const firstLesson = getFirstLesson();
  const canStart = showOverview && !!firstLesson;

  return (
    <>
    <div className="course-learning-page">
      {/* Demo Banner */}
      <div style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '14px',
        borderBottom: '2px solid #ffc107',
        fontWeight: '600',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <i className="fas fa-info-circle me-2"></i>
        <strong>DEMO MODE:</strong> This is a preview for admins. All sections are unlocked. Progress and quiz results are not saved.
      </div>

      {/* Top Header */}
      <div className="top-header">
        <div className="header-content">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <div className="hamburger-lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </button>
            <Link className="logo-white header-logo" to={all_routes.homeone}>
              <ImageWithBasePath src="assets/img/logo.svg" className="logo" alt="Logo" style={{maxHeight:"65px", minHeight:"65px"}}/>
            </Link>
          </div>
          
          <div className="header-center">
            <div className="course-info">
              <span className="course-badge">📋</span>
              <span className="course-title">{course.title}</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="dropdown profile-dropdown">
              <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
                <div className="avatar">
                  <ImageWithBasePath
                    src={user?.avatar || "assets/img/user/user-02.jpg"}
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </div>
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <div className="profile-header d-flex align-items-center">
                  <div className="avatar">
                    <ImageWithBasePath
                      src={user?.avatar || "assets/img/user/user-02.jpg"}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <div>
                    <h6>{user?.firstName} {user?.lastName}</h6>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <ul className="profile-body">
                  <li>
                    <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminDashboard}>
                      <img
                        src={'/assets/img/icon/dashboard-dashboard.svg'}
                        className="img-fluid me-2 rounded-2"
                      />
                      Dashboard
                    </Link>
                  </li>
                </ul>
                <div className="profile-footer">
                  <Link to={all_routes.homeone} onClick={handleLogout} className="dropdown-item d-inline-flex align-items-center rounded fw-medium">
                    <img
                      src={'/assets/img/icon/dashboard-logout.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="content-container">
          {/* Sidebar */}
          <div className={`learnsidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-toggle">
              <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                {sidebarCollapsed && (
                  <div className="hamburger-lines">
                    <i className="fas fa-arrow-right"></i>
                    <i className="fas fa-bars"></i>
                  </div>
                )}
                {!sidebarCollapsed && (
                  <>
                    <ImageWithBasePath src="assets/img/icon/module-header-icon.svg" />
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginLeft: '12px' }}>
                      Course Modules
                    </span>
                    <div className="menu-icon">
                      <i className="fas fa-bars"></i>
                      <i className="fas fa-arrow-left ms-1"></i>
                    </div>
                  </>
                )}
              </button>
              <button className="sidebar-close-btn" onClick={toggleMobileMenu}>
                <i className="fa-solid fa-times" style={{ fontSize: '20px' }}></i>
              </button>
            </div>

            {!sidebarCollapsed && (
              <div className="modules-list">
                {course.sections
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((section) => {
                    const sectionProgressData = getSectionProgress(section.id);
                    console.log(sectionProgressData);
                    const hasCurrentLesson = section.lessons.some(lesson => lesson.id === lessonId);
                    const isExpanded = expandedSections.includes(section.id);

                    return (
                      <div key={section.id} className="module-item">
                        <div className="module-header-container">
                          <div className="module-status-section">
                            {section.sectionQuiz?.isPassed ? (
                              <CheckCircle className="module-status-icon completed" />
                            ) : (
                              <div className={`module-status-icon ${hasCurrentLesson ? 'current' : 'pending'}`}></div>
                            )}
                          </div>
                          
                          <div className="module-content">
                            <div className="module-number">
                              Section {section.sortOrder}
                            </div>
                            <div className="module-title-container" onClick={() => toggleSection(section.id)}>
                              <h4 className="module-title">
                                {section.title}
                              </h4>
                              <button className="module-toggle-btn">
                                {isExpanded ? <ChevronDown /> : <ChevronRight />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="lessons-list">
                            {section.lessons
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((lesson) => {
                                const isCompleted = isLessonCompleted(lesson.id);
                                const isCurrent = lesson.id === lessonId;

                                return (
                                  <div
                                    key={lesson.id}
                                    className={`lesson-item ${isCurrent ? 'current' : ''}`}
                                    onClick={() => {
                                      handleLessonClick({ ...lesson, sectionId: section.id, isUnlocked: true });
                                      if (window.innerWidth <= 768) {
                                        setMobileMenuOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="lesson-status">
                                      <div className="lesson-status-icon-wrapper">
                                        {isCompleted ? (
                                          <CheckCircle className="lesson-status-icon completed" />
                                        ) : (
                                          <div className={`lesson-status-icon ${isCurrent ? 'current' : 'pending'}`}></div>
                                        )}
                                      </div>
                                      <span className="lesson-title">
                                        {lesson.sortOrder}. {lesson.title}
                                      </span>
                                    </div>
                                    <div className="lesson-meta">
                                      <i className="fa-solid fa-file-alt" style={{ fontSize: '12px', color: '#999', marginRight: '4px' }}></i>
                                      <span className="lesson-duration">
                                        {formatDuration(lesson.duration)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            
                            {section.sectionQuiz && (
                              <div
                                className="lesson-item quiz-item"
                                onClick={() => {
                                  startQuiz(section.sectionQuiz!, section.id);
                                  if (window.innerWidth <= 768) {
                                    setMobileMenuOpen(false);
                                  }
                                }}
                              >
                                <div className="lesson-status">
                                  <div className="lesson-status-icon quiz">📋</div>
                                  <span className="lesson-title">
                                    Section Quiz: {section.sectionQuiz.title}
                                  </span>
                                </div>
                                <div className="lesson-meta">
                                  <i className="fa-solid fa-clock" style={{ fontSize: '12px', color: '#999', marginRight: '4px' }}></i>
                                  <span className="lesson-duration">{section.sectionQuiz.timeLimit} min</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="content-grid">
              <div className="content-main">
                <div className="slide-container" key={lessonId || 'overview'}>
                  { quizPhase === 'lesson' ? (
                    showOverview ? (
                      <>
                        <div className="content-header">
                          <h1>{course.title}</h1>
                        </div>

                        <div className="content-card">
                          <div className="overview-hero">
                            <div className="overview-media">
                              <div className="position-relative">
                                <img
                                  src={course.heroImageUrl || 'https://via.placeholder.com/800x450?text=Course+Thumbnail'}
                                  alt={course.title}
                                  className="sidebar-image"
                                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                                />
                                {course.promoVideo && (
                                  <button
                                    className="play-icon-custom"
                                    onClick={() => setShowPreviewModal(true)}
                                    aria-label="Play preview"
                                  >
                                    <i className="fa-solid fa-play" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <h2 className="content-title mt-3">About this course</h2>
                          <CommonDescription 
                            className="mb-4"
                            description={course.description} 
                          />

                          {learnList.length > 0 && (
                            <div className="mt-4">
                              <h3 className="content-title">What you'll learn</h3>
                              <ul className="custom-list">
                                {learnList.map((item:any, idx:any) => (
                                  <li key={idx} className="list-item">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      currentLessonContent && (
                        <>
                          <div className="content-header">
                            <h1>{currentLessonContent.title}</h1>
                          </div>

                          <div className="content-card">
                            {currentLessonContent.type === 'video' && (
                              <div className="mb-4">
                                <ReactPlayer
                                  src={currentLessonContent.contentUrl}
                                  controls
                                  width="100%"
                                  height="480px"
                                  onEnded={() => {
                                    if (!isLessonCompleted(currentLessonContent.id)) {
                                      markLessonComplete(currentLessonContent.id);
                                    }
                                  }}
                                />
                              </div>
                            )}

                            {currentLessonContent.type === 'pdf' && (
                              <div className="mb-4">
                                <div className="pdf-viewer">
                                  <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(currentLessonContent.contentUrl)}&embedded=true`}
                                    width="100%"
                                    height="600px"
                                    frameBorder="0"
                                    title={`PDF: ${currentLessonContent.title}`}
                                  />
                                  <div className="mt-3">
                                    <a 
                                      href={currentLessonContent.contentUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-primary"
                                    >
                                      <i className="fa-solid fa-download me-2"></i>
                                      Download PDF
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {currentLessonContent.type === 'text' && currentLessonContent.textContent && (
                              <div className="mb-4">
                                <div 
                                  className="text-content"
                                  dangerouslySetInnerHTML={{ __html: currentLessonContent.textContent }}
                                />
                              </div>
                            )}

                            {currentLessonContent.type === 'link' && (
                              <div className="mb-4">
                                <div className="link-content text-center">
                                  <div className="mb-3">
                                    <i className="fa-solid fa-link fa-3x text-primary mb-3"></i>
                                    <h4>External Link</h4>
                                    <p className="text-muted">This lesson contains an external link</p>
                                  </div>
                                  <a 
                                    href={currentLessonContent.contentUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg"
                                    onClick={() => {
                                      if (!isLessonCompleted(currentLessonContent.id)) {
                                        markLessonComplete(currentLessonContent.id);
                                      }
                                    }}
                                  >
                                    <i className="fa-solid fa-external-link-alt me-2"></i>
                                    Visit Link: {currentLessonContent.title}
                                  </a>
                                  <div className="mt-3">
                                    <small className="text-muted">
                                      URL: {currentLessonContent.contentUrl}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="completion-status mb-4">
                              <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted">
                                  {isLessonCompleted(currentLessonContent.id) ? (
                                    <span className="text-success">
                                      <i className="fa-solid fa-check-circle me-2"></i>
                                      Completed (Demo)
                                    </span>
                                  ) : (
                                    <span className="text-warning">
                                      <i className="fa-solid fa-clock me-2"></i>
                                      In Progress (Demo)
                                    </span>
                                  )}
                                </span>
                                {!isLessonCompleted(currentLessonContent.id) && (
                                  <button 
                                    className="btn btn-success btn-sm"
                                    onClick={() => markLessonComplete(currentLessonContent.id)}
                                  >
                                    <i className="fa-solid fa-check me-2"></i>
                                    Mark as Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )
                  ) : quizPhase === 'taking' && quizSession ? (
                    <div className="quiz-container">
                      <div className="content-header">
                        <h1>Quiz: {quizSession.quiz.title}</h1>
                      </div>
                      <div className="content-card">
                        <div className="quiz-header mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Question {currentQuestionIndex + 1} of {quizSession.questions.length}</span>
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
                          <div className="progress">
                            <div className="progress-bar bg-success" style={{ width: `${((currentQuestionIndex + 1) / quizSession.questions.length) * 100}%` }}></div>
                          </div>
                        </div>
                        
                        {quizSession.questions[currentQuestionIndex] && (
                          <div className="question-container">
                            <h4 className="mb-3">{quizSession.questions[currentQuestionIndex].questionText}</h4>
                            
                            {quizSession.questions[currentQuestionIndex].answers.map((answer) => {
                              const isSelected = selectedAnswers[quizSession.questions[currentQuestionIndex].id] === answer.id;
                              
                              return (
                                <div key={answer.id} className="learn-form-check mb-2">
                                  <div className="d-flex align-items-center">
                                    <label className="learn-form-check-label flex-grow-1">
                                      <input
                                        className="learn-form-check-input me-2"
                                        type="radio"
                                        name="quiz-answer"
                                        checked={isSelected}
                                        onChange={() => handleAnswerSelect(quizSession.questions[currentQuestionIndex].id, answer.id)}
                                      />
                                      {answer.text || answer.Text}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="d-flex justify-content-between mt-4">
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => handleQuizNavigation('prev')}
                                disabled={currentQuestionIndex === 0}
                              >
                                Previous
                              </button>
                              <button 
                                className="btn btn-primary"
                                onClick={() => handleQuizNavigation('next')}
                                disabled={!selectedAnswers[quizSession.questions[currentQuestionIndex].id]}
                              >
                                {currentQuestionIndex === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : quizPhase === 'results' && quizResult && quizSession ? (
                    <div className="quiz-results">
                      <div className="content-header">
                        <h1>Quiz Results: {currentSectionQuiz?.title}</h1>
                      </div>
                      
                      <div className="content-card mb-4">
                        <div className="row align-items-center mb-4">
                          <div className="col-md-3 text-center mb-3 mb-md-0">
                            <div className={`display-3 fw-bold ${quizResult.passed ? 'text-success' : 'text-danger'}`}>
                              {Math.round(quizResult.score)}%
                            </div>
                            <div className={`badge fs-15 px-4 py-2 mt-2 ${quizResult.passed ? 'bg-success' : 'bg-danger'}`}>
                              {quizResult.passed ? 'PASSED ✓' : 'FAILED ✗'}
                            </div>
                          </div>
                          
                          <div className="col-md-9">
                            <div className="row">
                              <div className="col-6 col-lg-4 mb-3">
                                <div className="text-muted small">Passing Score Required</div>
                                <div className="fw-semibold fs-15">{quizResult.passingScore}%</div>
                              </div>
                              <div className="col-6 col-lg-4 mb-3">
                                <div className="text-muted small">Correct Answers</div>
                                <div className="fw-semibold fs-15">{quizResult.correctCount} of {quizResult.totalQuestions}</div>
                              </div>
                              <div className="col-6 col-lg-4 mb-3">
                                <div className="text-muted small">Your Score</div>
                                <div className="fw-semibold fs-15">{Math.round(quizResult.score)}%</div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">Performance</span>
                                <span className="small fw-semibold">{Math.round(quizResult.score)}%</span>
                              </div>
                              <div className="progress" style={{ height: '10px', position: 'relative' }}>
                                <div 
                                  className={`progress-bar ${quizResult.passed ? 'bg-success' : 'bg-danger'}`}
                                  style={{ width: `${Math.min(quizResult.score, 100)}%` }}
                                />
                                <div 
                                  className="position-absolute top-0 bottom-0 bg-warning"
                                  style={{ 
                                    left: `${quizResult.passingScore}%`, 
                                    width: '3px',
                                    zIndex: 10,
                                    height: '100%'
                                  }}
                                />
                              </div>
                              <div className="d-flex justify-content-between mt-1">
                                <span className="small text-muted">0%</span>
                                <span className="small text-warning fw-semibold">
                                  Pass: {quizResult.passingScore}%
                                </span>
                                <span className="small text-muted">100%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`alert ${quizResult.passed ? 'alert-success' : 'alert-warning'} mb-4`}>
                          <div className="d-flex align-items-center">
                            <i className={`fas ${quizResult.passed ? 'fa-check-circle' : 'fa-info-circle'} fa-2x me-3`}></i>
                            <div>
                              {quizResult.passed ? (
                                <>
                                  <h5 className="alert-heading mb-1">Demo: Quiz Passed! 🎉</h5>
                                  <p className="mb-0">
                                    You scored {Math.round(quizResult.score)}%. In real mode, this would unlock the next section.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <h5 className="alert-heading mb-1">Demo: Quiz Not Passed</h5>
                                  <p className="mb-0">
                                    You scored {Math.round(quizResult.score)}%, but need {quizResult.passingScore}% to pass. 
                                    In real mode, you would need to retry.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
                          <button 
                            className={`btn ${showAnswers ? 'btn-outline-primary' : 'btn-primary'}`}
                            onClick={() => setShowAnswers(!showAnswers)}
                          >
                            <i className={`fas ${showAnswers ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
                            {showAnswers ? 'Hide' : 'Review'} Questions & Answers
                          </button>

                          <button 
                            className="btn btn-secondary"
                            onClick={() => {
                              setQuizPhase('lesson');
                              const firstLesson = getFirstLesson();
                              if (firstLesson) {
                                navigate(`/preview/${courseSlug}/${firstLesson.id}`);
                              }
                            }}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Course
                          </button>
                          
                          <button 
                            className="btn btn-warning"
                            onClick={() => {
                              setQuizPhase('lesson');
                              setQuizSession(null);
                              setQuizResult(null);
                              setSelectedAnswers({});
                              setCurrentQuestionIndex(0);
                              setShowAnswers(false);
                              setDetailedResults(null);
                              setTimeout(() => {
                                if (currentSectionQuiz) {
                                  const section = course?.sections.find(s => 
                                    s.sectionQuiz?.id === currentSectionQuiz.id
                                  );
                                  if (section) {
                                    startQuiz(currentSectionQuiz, section.id);
                                  }
                                }
                              }, 100);
                            }}
                          >
                            <i className="fas fa-redo me-2"></i>
                            Retry Quiz
                          </button>
                        </div>
                      </div>

                      {showAnswers && detailedResults && (
                        <div className="content-card">
                          <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                              <h6 className="mb-0">
                                <i className="fas fa-question-circle me-2"></i>
                                Question Review
                              </h6>
                            </div>
                            <div className="card-body p-0">
                              {detailedResults.questions.map((question: any, index: number) => (
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
                                      {question.allAnswers.map((answer: any) => {
                                        let answerClass = 'list-group-item border-0 py-2 px-3 mb-1';
                                        
                                        if (answer.id === question.correctAnswerId) {
                                          answerClass += ' bg-success-subtle text-success border-success';
                                        } else if (answer.id === question.userAnswerId && !answer.isCorrect) {
                                          answerClass += ' bg-danger-subtle text-danger border-danger';
                                        } else {
                                          answerClass += ' bg-light';
                                        }
                                        
                                        return (
                                          <div key={answer.id} className={answerClass}>
                                            <div className="d-flex align-items-center">
                                              <div className="me-2">
                                                {answer.id === question.correctAnswerId && (
                                                  <i className="fas fa-check-circle text-success"></i>
                                                )}
                                                {answer.id === question.userAnswerId && answer.id !== question.correctAnswerId && (
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
                                        );
                                      })}
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
                        </div>
                      )}
                    </div>
                  ) : null }
                </div>
              </div>
            </div>
            <div className="nav-buttons">
              <button 
                className="btn btn-primary prev-btn"
                onClick={() => handleNavigation('previous')}
                disabled={!lessonId || !navState.hasPrevious}
              >
                Previous
              </button>
              <button 
                className="btn btn-success next-btn"
                onClick={() => handleNavigation('next')}
                disabled={showOverview && !canStart}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-content">
          <div className="bottom-nav-center">
            <div className="progress-section">
              <span className="progress-text">
                SECTION Progress (Demo)
              </span>
              <span className="progress-percentage">{sectionProgress.percentage}%</span>
              <button 
                className="progress-info-btn" 
                title={`${sectionProgress.current} of ${sectionProgress.total} lessons completed`}
              >
                i
              </button>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${sectionProgress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {course.promoVideo && (
      <VideoModal
        show={showPreviewModal}
        handleClose={() => setShowPreviewModal(false)}
        videoUrl={course.promoVideo}
      />
    )}
    </>
  );
};

export default CourseLearningPageDemo;