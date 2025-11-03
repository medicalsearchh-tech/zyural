// frontend/src/feature-module/learn/components/CourseLearningPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from "../../../feature-module/router/all_routes";
import { courseApi, progressApi, studentQuizApi  } from '../../../core/utils/api';
import CommonDescription from '../../../core/common/commonDescription';
import './index.css';
import VideoModal from '../../HomePages/home-one/section/videoModal';
import ReactPlayer from 'react-player';
import { useUser } from '../../../core/context/UserContext';
import { toast } from "react-toastify";

// API Types
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImageUrl?: string;
  promoVideo?: string;
  learningObjectives?: string[];
  sections: Section[];
  quizzes: Quiz[]; // Quizzes at course level
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
  hasQuiz: boolean; // Indicates if section has a quiz
  isUnlocked?: boolean;
  sectionQuiz?: Quiz; // Quiz for this specific section
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
  type: 'video' | 'pdf' | 'text' | 'link'; // Add this
  textContent?: string; // Add this for text lessons
}

interface Progress {
  id: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  watchTime: number;
  lastPosition: number;
  notes: string | null;
}

interface QuizAnswer {
  id: string;
  text: string;
  Text?: string;
  isCorrect: boolean
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


const LockIcon = ({ className }: { className?: string }) => (
  <svg className={`icon ${className}`} fill="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const CourseLearningPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();

  const { logout, user } = useUser();
  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Quiz states
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showQuestionResult, _setShowQuestionResult] = useState(false);
  const [quizPhase, setQuizPhase] = useState<'lesson' | 'taking' | 'results'>('lesson');
  const [currentSectionQuiz, setCurrentSectionQuiz] = useState<Quiz | null>(null);
  const [_screenLoading, setScreenLoading] = useState(false);

  const [showAnswers, setShowAnswers] = useState(false);
  const [detailedResults, setDetailedResults] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  // Load course + progress
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        

        // fetch course
        const response = await courseApi.getCourseBySlug(courseSlug);
        if (!response.success) throw new Error("Failed to fetch course");
        const courseData = response.data.course as Course;

        // fetch progress
        const progressResponse = await progressApi.getCourseProgress(courseData.id);
        if (!progressResponse.success) throw new Error("Failed to fetch progress");
        
        let progressData = [];
      
        if (progressResponse.data) {
          // The API returns { enrollment: {...}, progress: [...] }
          // We need the progress array
          if (Array.isArray(progressResponse.data.progress)) {
            progressData = progressResponse.data.progress;
          } else if (Array.isArray(progressResponse.data)) {
            // Fallback if data is directly an array
            progressData = progressResponse.data;
          }
        }

        // Fetch quiz attempts for each section
          const sectionsWithQuizStatus = await Promise.all(
            courseData.sections.map(async (section, index) => {
              // CORRECTED: Find quiz by sectionId instead of index or title matching
              const sectionQuiz = courseData.quizzes?.find(quiz => 
                quiz.sectionId === section.id
              );

              let quizStatus = null;
              if (sectionQuiz) {
                try {
                  const quizAttemptsResponse = await studentQuizApi.getQuizAttempts(sectionQuiz.id);
                  if (quizAttemptsResponse.success && quizAttemptsResponse.data) {
                    const attempts: any[] = quizAttemptsResponse.data.attempts || [];
                    const passedAttempt = attempts.find((attempt: any) => attempt.passed);
                    quizStatus = {
                      isCompleted: attempts.length > 0,
                      isPassed: !!passedAttempt,
                      score: passedAttempt?.score || attempts[0]?.score
                    };
                  }
                } catch (error) {
                  console.error(`Error fetching quiz attempts for section ${section.id}:`, error);
                }
              }

              return {
                ...section,
                sectionQuiz: sectionQuiz ? {
                  ...sectionQuiz,
                  ...quizStatus
                } : undefined,
                isUnlocked: await checkSectionUnlockStatus(section, courseData.sections, progressData, index)
              };
            })
          );

        setCourse({
          ...courseData,
          sections: sectionsWithQuizStatus
        });
        setProgress(progressData);

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

   // Check if a section should be unlocked
  const checkSectionUnlockStatus = async (
    section: Section, 
    allSections: Section[], 
    progressData: Progress[], 
    sectionIndex: number
  ): Promise<boolean> => {
    // First section is always unlocked
    if (sectionIndex === 0) return true;
    
    // Find previous section
    const previousSection = allSections[sectionIndex - 1];
    if (!previousSection) return true;

    // Check if ALL lessons in previous section are completed
    const allLessonsCompleted = previousSection.lessons.every(lesson => 
      progressData.some(p => p.lessonId === lesson.id && p.isCompleted)
    );
    
    // CRITICAL: If previous section has a quiz, it MUST be passed
    const previousSectionQuiz = allSections[sectionIndex - 1].sectionQuiz;
    
    if (previousSectionQuiz) {
      try {
        const quizAttemptsResponse = await studentQuizApi.getQuizAttempts(previousSectionQuiz.id);
        if (quizAttemptsResponse.success && quizAttemptsResponse.data) {
          const attempts: any[] = quizAttemptsResponse.data.attempts || [];
          const passedAttempt = attempts.find((attempt: any) => attempt.passed);
          
          // BOTH conditions must be met: all lessons done AND quiz passed
          return allLessonsCompleted && !!passedAttempt;
        }
        // If can't fetch attempts, keep locked
        return false;
      } catch (error) {
        console.error(`Error checking quiz status:`, error, section);
        return false;
      }
    }
    
    // If no quiz in previous section, just check lesson completion
    return allLessonsCompleted;
  };

  const getCurrentSection = () => {
    const currentLesson = getCurrentLesson();
    if (!currentLesson) return null;
    
    return course?.sections.find(section => section.id === currentLesson.sectionId);
  };

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
            isUnlocked: section.isUnlocked || false
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
    if (!Array.isArray(progress)) {
      console.warn("Progress is not an array:", progress);
      return false;
    }
    return progress.some(p => p.lessonId === lessonId && p.isCompleted);
  };

  const isAllQuizzesPassed = (): boolean => {
    if (!course) return false;
    
    return course.sections.every(section => {
      if (section.sectionQuiz) {
        return section.sectionQuiz.isPassed;
      }
      return true; // Sections without quizzes are considered "passed"
    });
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

  // Quiz functions
  const startQuiz = async (quiz: Quiz, sectionId: string) => {
    try {
      const section = course?.sections.find(s => s.id === sectionId);
      if (!section?.isUnlocked) {
        toast.error("This section is locked. Complete the previous section first.");
        return;
      }

      // Check if all lessons in the section are completed
      const sectionProgress = getSectionProgress(sectionId);
      if (sectionProgress.percentage < 100) {
        toast.error(`Please complete all lessons in this section before taking the quiz.`);
        return;
      }
      
      // Check if quiz is already passed
      if (section.sectionQuiz?.isPassed) {
        toast.info("You have already passed this quiz.");
        return;
      }
      
      const response = await studentQuizApi.startQuiz(quiz.id);
      if (response.success && response.data) {
        setQuizSession(response.data);
        setCurrentSectionQuiz(quiz);
        setQuizPhase('taking');
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        // DON'T navigate or reload - just stay on current view
        
        if (response.data.quiz.timeLimit) {
          setTimeRemaining(response.data.quiz.timeLimit * 60);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start quiz');
    }
  };

  const handleAnswerSelect = async (questionId: string, answerId: string) => {
    if (showQuestionResult) return;
    
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    
    if (quizSession) {
      try {
        await studentQuizApi.submitAnswer(quizSession.attemptId, {
          questionId,
          selectedAnswerId: answerId
        });
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  };

  const handleQuizNavigation = async (direction: 'next' | 'prev') => {
    if (!quizSession) return;
    
    if (direction === 'next') {
      const currentQuestion = quizSession.questions[currentQuestionIndex];
      const selectedAnswer = selectedAnswers[currentQuestion.id];
      
      if (selectedAnswer) {
        try {
          await studentQuizApi.submitAnswer(quizSession.attemptId, {
            questionId: currentQuestion.id,
            selectedAnswerId: selectedAnswer
          });
        } catch (error) {
          console.error('Error submitting answer:', error);
        }
        
        // Always move to next question - no result display
        if (currentQuestionIndex < quizSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Last question - finish quiz
          finishQuiz();
        }
      } else {
        toast.error('Please select an answer before continuing.');
      }
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = async () => {
    if (!quizSession) return;
    
    try {
      const response = await studentQuizApi.submitQuiz(quizSession.attemptId);
      if (response.success && response.data) {
        setQuizResult(response.data);
        setQuizPhase('results');
        
        // IMPORTANT: Properly refresh course data
        if (courseSlug && course) {
          const courseResponse = await courseApi.getCourseBySlug(courseSlug);
          if (courseResponse.success) {
            const courseData = courseResponse.data.course as Course;
            const progressResponse = await progressApi.getCourseProgress(courseData.id);
            
            let progressData = [];
            if (progressResponse.success && progressResponse.data) {
              progressData = Array.isArray(progressResponse.data.progress) 
                ? progressResponse.data.progress 
                : (Array.isArray(progressResponse.data) ? progressResponse.data : []);
            }

            // Re-check unlock status for ALL sections with fresh quiz data
            const updatedSections = await Promise.all(
              courseData.sections.map(async (section, index) => {
                // Match quiz by sectionId
                const sectionQuiz = courseData.quizzes?.find(quiz => 
                  quiz.sectionId === section.id
                );
                
                let quizStatus = null;
                if (sectionQuiz) {
                  try {
                    const quizAttemptsResponse = await studentQuizApi.getQuizAttempts(sectionQuiz.id);
                    if (quizAttemptsResponse.success && quizAttemptsResponse.data) {
                      const attempts: any[] = quizAttemptsResponse.data.attempts || [];
                      const passedAttempt = attempts.find((attempt: any) => attempt.passed);
                      quizStatus = {
                        isCompleted: attempts.length > 0,
                        isPassed: !!passedAttempt,
                        score: passedAttempt?.score || attempts[0]?.score
                      };
                    }
                  } catch (error) {
                    console.error(`Error fetching quiz attempts:`, error);
                  }
                }

                return {
                  ...section,
                  sectionQuiz: sectionQuiz ? { ...sectionQuiz, ...quizStatus } : undefined,
                  isUnlocked: await checkSectionUnlockStatus(section, courseData.sections, progressData, index)
                };
              })
            );

            setCourse({
              ...courseData,
              sections: updatedSections
            });
            setProgress(progressData);
            
            // Show appropriate message
            if (response.data.passed) {
              toast.success('Congratulations! You passed the quiz. Next section unlocked!');
            } else {
              toast.error('Quiz failed. Please review the material and try again.');
            }
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit quiz');
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
    // Check if the section is actually unlocked at click time
    const section = course?.sections.find(s => s.id === lesson.sectionId);
    const sectionIndex = course?.sections.findIndex(s => s.id === lesson.sectionId) || 0;
    
    if (sectionIndex > 0) {
      const previousSection = course?.sections[sectionIndex - 1];
      if (previousSection?.sectionQuiz && !previousSection.sectionQuiz.isPassed) {
        toast.error("Complete and pass the previous section's quiz before accessing this section.");
        return;
      }
    }
    
    if (!lesson.isUnlocked || !section?.isUnlocked) {
      toast.error("This lesson is locked. Complete the previous section first.");
      return;
    }
    
    navigate(`/learn/${courseSlug}/${lesson.id}`);
  };

  const markLessonComplete = async (lessonId: string, watchTime?: number, lastPosition?: number) => {
    try {
      // Find the current lesson and its section
      const currentLesson = getAllLessons().find(l => l.id === lessonId);
      if (!currentLesson) {
        throw new Error("Lesson not found");
      }

      const currentSection = course?.sections.find(s => s.id === currentLesson.sectionId);
      if (!currentSection) {
        throw new Error("Section not found");
      }

      // Check if this is the final lesson in the section
      const sortedLessons = [...currentSection.lessons].sort((a, b) => a.sortOrder - b.sortOrder);
      const isFinalLesson = sortedLessons[sortedLessons.length - 1].id === lessonId;

      // Update progress for the current lesson with watch time and last position
      const progressPayload: any = {
        lessonId: lessonId,
        isCompleted: true,
      };

      // Add optional fields if provided
      if (watchTime !== undefined) {
        progressPayload.watchTime = watchTime;
      }
      if (lastPosition !== undefined) {
        progressPayload.lastPosition = lastPosition;
      }

      const response = await progressApi.updateProgress(progressPayload);
      
      if (!response.success) throw new Error("Failed to update progress");
      const updatedProgress = response.data as Progress;

      // Update local progress state
      setProgress(prev => {
        const existing = prev.find(p => p.lessonId === lessonId);
        if (existing) {
          return prev.map(p => (p.lessonId === lessonId ? updatedProgress : p));
        }
        return [...prev, updatedProgress];
      });

      // If this is the final lesson, refresh course data to update unlock status
      if (isFinalLesson && courseSlug) {
        toast.success("Section completed! Updating course progress...");
        
        // Refetch course data to update section unlock status
        const courseResponse = await courseApi.getCourseBySlug(courseSlug);
        if (courseResponse.success) {
          const courseData = courseResponse.data.course as Course;
          const progressResponse = await progressApi.getCourseProgress(courseData.id);
          
          let progressData = [];
          if (progressResponse.success && progressResponse.data) {
            progressData = Array.isArray(progressResponse.data.progress) 
              ? progressResponse.data.progress 
              : (Array.isArray(progressResponse.data) ? progressResponse.data : []);
          }

          // Re-check unlock status for ALL sections
          const updatedSections = await Promise.all(
            courseData.sections.map(async (section, index) => {
              const sectionQuiz = courseData.quizzes?.find(quiz => 
                quiz.sectionId === section.id
              );
              
              let quizStatus = null;
              if (sectionQuiz) {
                try {
                  const quizAttemptsResponse = await studentQuizApi.getQuizAttempts(sectionQuiz.id);
                  if (quizAttemptsResponse.success && quizAttemptsResponse.data) {
                    const attempts: any[] = quizAttemptsResponse.data.attempts || [];
                    const passedAttempt = attempts.find((attempt: any) => attempt.passed);
                    quizStatus = {
                      isCompleted: attempts.length > 0,
                      isPassed: !!passedAttempt,
                      score: passedAttempt?.score || attempts[0]?.score
                    };
                  }
                } catch (error) {
                  console.error(`Error fetching quiz attempts:`, error);
                }
              }

              return {
                ...section,
                sectionQuiz: sectionQuiz ? { ...sectionQuiz, ...quizStatus } : undefined,
                isUnlocked: await checkSectionUnlockStatus(section, courseData.sections, progressData, index)
              };
            })
          );

          setCourse({
            ...courseData,
            sections: updatedSections
          });
          setProgress(progressData);
          
          // Check if section has a quiz that needs to be taken
          if (currentSection.hasQuiz && currentSection.sectionQuiz) {
            toast.info("Section completed! You can now take the section quiz.");
          } else {
            toast.success("Section completed! Next section unlocked.");
          }
        }
      } else {
        toast.success("Lesson marked as complete!");
      }

    } catch (err) {
      console.error("Failed to mark lesson as complete:", err);
      toast.error("Failed to mark lesson as complete. Please try again.");
    }
  };

  // Add quiz timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizPhase === 'taking' && quizSession) {
      timer = setInterval(() => {
        const startTime = new Date(quizSession.startedAt);
        const now = new Date();
        const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
        const remaining = quizSession.quiz.timeLimit - elapsedMinutes;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          finishQuiz();
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizPhase, quizSession]);

  const handleNavigation = async (direction: "previous" | "next") => {
    setScreenLoading(true);
    
    try {
      if (direction === 'next' && !lessonId) {
        const first = getFirstLesson();
        if (first) {
          navigate(`/learn/${courseSlug}/${first.id}`);
        }
        return;
      }

      const navState = getNavigationState();
      const currentSection = getCurrentSection();

      if (direction === "previous" && navState.previousLesson) {
        navigate(`/learn/${courseSlug}/${navState.previousLesson.id}`);
      } else if (direction === "next") {
        if (navState.nextLesson) {
          // Check if moving to next section requires quiz passing
          const nextLessonSection = course?.sections.find(s => 
            s.lessons.some(l => l.id === navState.nextLesson?.id)
          );
          
          if (nextLessonSection && nextLessonSection.id !== currentSection?.id) {
            // Moving to a different section - check if previous section quiz is passed
            if (currentSection?.sectionQuiz && !currentSection.sectionQuiz.isPassed) {
              toast.error("You must pass the section quiz before moving to the next section.");
              setScreenLoading(false);
              return;
            }
          }
          
          if (lessonId) {
            await markLessonComplete(lessonId);
          }
          navigate(`/learn/${courseSlug}/${navState.nextLesson.id}`);
        } else if (!navState.hasNext && currentSection?.hasQuiz && currentSection.sectionQuiz) {
          // Last lesson in section - start section quiz
          if (lessonId) {
            await markLessonComplete(lessonId);
          }
          startQuiz(currentSection.sectionQuiz, currentSection.id);
        } else if (!navState.hasNext && !currentSection?.hasQuiz) {
          // Last lesson in course or section without quiz
          if (lessonId) {
            await markLessonComplete(lessonId);
          }
          
          // Check if this is the final section
          const allSections = course?.sections || [];
          const isLastSection = allSections[allSections.length - 1]?.id === currentSection?.id;
          
          if (isLastSection) {
            toast.success("Course completed! You can now get your certificate.");
            // Navigate to certificate page or show completion modal
          } else {
            toast.success("Section completed! Moving to next section...");
            // Auto-navigate to next section's first lesson if unlocked
            const currentIndex = allSections.findIndex(s => s.id === currentSection?.id);
            const nextSection = allSections[currentIndex + 1];
            
            if (nextSection && nextSection.isUnlocked) {
              const firstLesson = nextSection.lessons.sort((a, b) => a.sortOrder - b.sortOrder)[0];
              if (firstLesson) {
                navigate(`/learn/${courseSlug}/${firstLesson.id}`);
              }
            }
          }
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

  const loadDetailedQuizResults = async (attemptId: string) => {
  try {
    setLoadingResults(true);
    const response = await studentQuizApi.getResults(attemptId);
    
    if (response.success && response.data) {
      setDetailedResults(response.data);
    } else {
      toast.error('Failed to load detailed results');
    }
  } catch (error: any) {
    console.error('Error loading detailed results:', error);
    toast.error(error.message || 'Failed to load detailed results');
  } finally {
    setLoadingResults(false);
  }
};

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
          <ImageWithBasePath
          src="assets/img/error/img-02.svg"
          alt="img"
          className="img-fluid bg-02"
          />
          <ImageWithBasePath
          src="assets/img/error/img-03.svg"
          alt="img"
          className="img-fluid bg-03"
          />
          <ImageWithBasePath
          src="assets/img/error/img-04.svg"
          alt="img"
          className="img-fluid bg-04"
          />
          <ImageWithBasePath
          src="assets/img/error/img-05.svg"
          alt="img"
          className="img-fluid bg-05"
          />
          <ImageWithBasePath
          src="assets/img/error/img-06.svg"
          alt="img"
          className="img-fluid bg-06"
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
          <div className="error-box-img">
          <ImageWithBasePath
            src="assets/img/error/error-01.svg"
            alt="Img"
            className="img-fluid"
          />
          </div>
          <h3 className="h2 mb-3">
          {" "}
          Oh No! Error <span className="text-secondary ms-1">404</span>
          </h3>
          <p className="h4 font-weight-normal">
          Error Loading Course
          </p>
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
            {/* Profile Dropdown */}
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
                                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentCertificates}>
                                    <img
                                      src={'/assets/img/icon/dashboard-cert.svg'}
                                      className="img-fluid me-2 rounded-2"
                                    />
                                    Claim Certificates
                                  </Link>
                                </li>
                                <li>
                                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentDashboard}>
                                    <img
                                      src={'/assets/img/icon/dashboard-dashboard.svg'}
                                      className="img-fluid me-2 rounded-2"
                                    />
                                    Dashboard
                                  </Link>
                                </li>
                                <li>
                                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentQuiz}>
                                    <img
                                      src={'/assets/img/icon/dashboard-quiz.svg'}
                                      className="img-fluid me-2 rounded-2"
                                    />
                                    Quiz Attempts
                                  </Link>
                                </li>
                                <li>
                                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentMessage}>
                                    <img
                                      src={'/assets/img/icon/dashboard-message.svg'}
                                      className="img-fluid me-2 rounded-2"
                                    />
                                    Messages
                                  </Link>
                                </li>
                                <li>
                                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentSettings}>
                                    <img
                                      src={'/assets/img/icon/dashboard-setting.svg'}
                                      className="img-fluid me-2 rounded-2"
                                    />
                                    Settings
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
              {/* Mobile Close Button - Only visible on mobile */}
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
                    const hasCurrentLesson = section.lessons.some(lesson => lesson.id === lessonId);
                    const isExpanded = expandedSections.includes(section.id);
                    const isSectionUnlocked = section.isUnlocked || false;

                    return (
                      <div key={section.id} className={`module-item ${!isSectionUnlocked ? 'locked' : ''}`}>
                        <div className="module-header-container">
                          <div className="module-status-section">
                            {!isSectionUnlocked ? (
                              <LockIcon className="module-status-icon locked" />
                            ) : section.sectionQuiz?.isPassed ? (
                              <CheckCircle className="module-status-icon completed" />
                            ) : (
                              <div className={`module-status-icon ${hasCurrentLesson ? 'current' : 'pending'}`}></div>
                            )}
                          </div>
                          
                          <div className="module-content">
                            <div className="module-number">
                              Section {section.sortOrder}
                              {!isSectionUnlocked && <span className="locked-badge ms-2">🔒 Locked</span>}
                              {section.sectionQuiz?.isPassed && <span className="passed-badge ms-2">✓ Passed</span>}
                            </div>
                            <div className="module-title-container" onClick={() => isSectionUnlocked && toggleSection(section.id)}>
                              <h4 className="module-title">
                                {section.title}
                              </h4>
                              {isSectionUnlocked && (
                                <button className="module-toggle-btn">
                                  {isExpanded ? <ChevronDown /> : <ChevronRight />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && isSectionUnlocked && (
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
                                      handleLessonClick({ ...lesson, sectionId: section.id, isUnlocked: isSectionUnlocked });
                                      // Close mobile menu after selecting lesson
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
                                className={`lesson-item quiz-item ${sectionProgressData.percentage < 100 ? 'disabled' : ''}`}
                                onClick={() => {
                                  if (sectionProgressData.percentage === 100 && section.isUnlocked) {
                                    const sectionIndex = course.sections.findIndex(s => s.id === section.id);
                                    if (sectionIndex > 0) {
                                      const previousSection = course.sections[sectionIndex - 1];
                                      if (previousSection?.sectionQuiz && !previousSection.sectionQuiz.isPassed) {
                                        toast.error("You must pass the previous section's quiz first.");
                                        return;
                                      }
                                    }
                                    startQuiz(section.sectionQuiz!, section.id);
                                    // Close mobile menu after starting quiz
                                    if (window.innerWidth <= 768) {
                                      setMobileMenuOpen(false);
                                    }
                                  } else if (!section.isUnlocked) {
                                    toast.error("Complete the previous section first.");
                                  } else {
                                    toast.error("Complete all lessons in this section to unlock the quiz.");
                                  }
                                }}
                                style={{ 
                                  opacity: (sectionProgressData.percentage === 100 && section.isUnlocked) ? 1 : 0.6,
                                  cursor: (sectionProgressData.percentage === 100 && section.isUnlocked) ? 'pointer' : 'not-allowed'
                                }}
                              >
                                <div className="lesson-status">
                                  <div className="lesson-status-icon quiz">📋</div>
                                  <span className="lesson-title">
                                    Section Quiz: {section.sectionQuiz.title}
                                    {section.sectionQuiz.isPassed && (
                                      <span className="text-success ms-2">✓ Passed ({section.sectionQuiz.score}%)</span>
                                    )}
                                    {section.sectionQuiz.isCompleted && !section.sectionQuiz.isPassed && (
                                      <span className="text-danger ms-2">✗ Failed</span>
                                    )}
                                    {sectionProgressData.percentage < 100 && (
                                      <LockIcon className="ms-2" />
                                    )}
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
                            className= "mb-4"
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

                          <div className="mt-4">
                            
                          </div>
                        </div>
                      </>
                    ) : (
                      currentLessonContent && (
                        <>
                          <div className="content-header">
                            <h1>{currentLessonContent.title}</h1>
                          </div>

                          <div className="content-card">
                            {/* Render based on lesson type */}
                            {currentLessonContent.type === 'video' && (
                              <div className="mb-4">
                                <ReactPlayer
                                  src={currentLessonContent.contentUrl}
                                  controls
                                  width="100%"
                                  height="480px"
                                  onEnded={() => {
                                    // Auto-mark as completed when video ends
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
                                      // Mark as completed when user clicks the link
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

                            {/* Completion status */}
                            <div className="completion-status mb-4">
                              <div className="d-flex align-items-center justify-content-between">
                                <span className="text-muted">
                                  {isLessonCompleted(currentLessonContent.id) ? (
                                    <span className="text-success">
                                      <i className="fa-solid fa-check-circle me-2"></i>
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="text-warning">
                                      <i className="fa-solid fa-clock me-2"></i>
                                      In Progress
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
                    // Quiz taking content
                    <div className="quiz-container">
                      <div className="content-header">
                        <h1>Quiz: {quizSession.quiz.title}</h1>
                      </div>
                      <div className="content-card">
                        {/* Timer and progress */}
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
                        
                        {/* Question */}
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
                          
                          {/* Navigation */}
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
                    // Quiz results - Enhanced display with question review
                    <div className="quiz-results">
                      <div className="content-header">
                        <h1>Quiz Results: {currentSectionQuiz?.title}</h1>
                      </div>
                      
                      {/* Results Summary Card */}
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
                            
                            {/* Progress Bar */}
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
                                {/* Passing score marker */}
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

                        {/* Message based on pass/fail */}
                        <div className={`alert ${quizResult.passed ? 'alert-success' : 'alert-danger'} mb-4`}>
                          <div className="d-flex align-items-center">
                            <i className={`fas ${quizResult.passed ? 'fa-check-circle' : 'fa-times-circle'} fa-2x me-3`}></i>
                            <div>
                              {quizResult.passed ? (
                                <>
                                  <h5 className="alert-heading mb-1">Congratulations! 🎉</h5>
                                  <p className="mb-0">
                                    You have successfully passed this quiz. 
                                    {isAllQuizzesPassed() 
                                      ? ' You can now get your certificate!' 
                                      : ' Continue to the next section.'}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <h5 className="alert-heading mb-1">Quiz Not Passed</h5>
                                  <p className="mb-0">
                                    You scored {Math.round(quizResult.score)}%, but need {quizResult.passingScore}% to pass. 
                                    Review the material and try again.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
                          <button 
                            className={`btn ${showAnswers ? 'btn-outline-primary' : 'btn-primary'}`}
                            onClick={async () => {
                              if (!showAnswers && quizSession && !detailedResults) {
                                // Fetch detailed results when showing for the first time
                                await loadDetailedQuizResults(quizSession.attemptId);
                              }
                              setShowAnswers(!showAnswers);
                            }}
                          >
                            <i className={`fas ${showAnswers ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
                            {showAnswers ? 'Hide' : 'Review'} Questions & Answers
                          </button>

                          <button 
                            className="btn btn-secondary"
                            onClick={() => {
                              setQuizPhase('lesson');
                              // Navigate back to the section's first lesson or current lesson
                              const firstLesson = getFirstLesson();
                              if (firstLesson) {
                                navigate(`/learn/${courseSlug}/${firstLesson.id}`);
                              }
                            }}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Course
                          </button>
                          
                          {!quizResult.passed && currentSectionQuiz && (
                            <button 
                              className="btn btn-warning"
                              onClick={() => {
                                // Reset and restart the quiz
                                setQuizPhase('lesson');
                                setQuizSession(null);
                                setQuizResult(null);
                                setSelectedAnswers({});
                                setCurrentQuestionIndex(0);
                                setShowAnswers(false);
                                setDetailedResults(null);
                                // Then start the quiz again
                                setTimeout(() => {
                                  const section = course?.sections.find(s => 
                                    s.sectionQuiz?.id === currentSectionQuiz.id
                                  );
                                  if (section) {
                                    startQuiz(currentSectionQuiz, section.id);
                                  }
                                }, 100);
                              }}
                            >
                              <i className="fas fa-redo me-2"></i>
                              Retry Quiz
                            </button>
                          )}
                          
                          {quizResult.passed && isAllQuizzesPassed() && (
                            <Link to={all_routes.studentCertificates} className="btn btn-success">
                              <i className="fas fa-certificate me-2"></i>
                              Get Your Certificate
                            </Link>
                          )}
                        </div>
                        
                        {quizResult.passed && !isAllQuizzesPassed() && (
                          <div className="text-center">
                            <div className="alert alert-info">
                              <i className="fas fa-info-circle me-2"></i>
                              Complete all section quizzes to unlock your certificate.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Questions Review Section - Only show when button is clicked */}
                      {showAnswers && (
                        <div className="content-card">
                          {loadingResults ? (
                            <div className="text-center py-5">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading results...</span>
                              </div>
                            </div>
                          ) : detailedResults ? (
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
                          ) : (
                            <div className="text-center py-4 text-muted">
                              Failed to load question details
                            </div>
                          )}
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
                SECTION Progress
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

export default CourseLearningPage;