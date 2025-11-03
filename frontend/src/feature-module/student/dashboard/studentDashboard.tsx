import { useState, useEffect } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import StudentSidebar from '../common/studentSidebar'
import CircleProgress from '../../Instructor/instructor-dashboard/circleProgress'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'
import { studentDashboardApi, studentCertificateApi} from '../../../core/utils/api'

// Types
interface DashboardStats {
  enrolledCourses: number
  activeCourses: number
  completedCourses: number
  totalLearningHours: number
  weeklyLearningHours: number
  dailyLearningHours: number
  certificatesEarned: number
  learningStats: {
    totalWatchTimeSeconds: number
    weeklyWatchTimeSeconds: number
    dailyWatchTimeSeconds: number
  }
}

interface Course {
  id: string
  title: string
  subtitle: string
  slug: string
  instructorName: string
  instructorAvatar: string
  thumbnail: string
  category: string
  rating: number
  reviewCount: number
  accreditedCreditHours?: number
  accreditedCreditType?: string
  price: number
  progress: number
  enrolledAt: string
  status: 'active' | 'completed' | 'enrolled'
  lastAccessedAt?: string
  totalLessons?: number
  completedLessons?: number
}

interface QuizProgress {
  id: string
  title: string
  correctAnswers: number
  totalQuestions: number
  score: number
  completedAt: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  courseTitle: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  createdAt: string
}

interface ActiveQuiz {
  id: string
  title: string
  answered: number
  totalQuestions: number
  timeRemaining: number
}

interface Certificate {
  id: string
  certificateNumber: string
  courseTitle: string
  issueDate: string
  certificateUrl: string
  isValid: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  type: 'course_completion' | 'learning_hours' | 'quiz_master' | 'consistent_learner'
}

const StudentDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'enrolled' | 'active' | 'completed'>('all')
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [allCourses, activeFilter])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all dashboard data in parallel with proper error handling
      const [
        statsResponse, 
        coursesResponse, 
        quizzesResponse, 
        invoicesResponse, 
        activeQuizResponse
      ] = await Promise.all([
        studentDashboardApi.getDashboardStats().catch(() => ({ data: null })),
        studentDashboardApi.getRecentCourses().catch(() => ({ data: { courses: [] } })),
        studentDashboardApi.getQuizProgress().catch(() => ({ data: [] })),
        studentDashboardApi.getRecentInvoices().catch(() => ({ data: [] })),
        studentDashboardApi.getActiveQuiz().catch(() => ({ data: null }))
      ])

      setStats(statsResponse?.data || null)
      setAllCourses(coursesResponse?.data || [])
      setQuizProgress(quizzesResponse?.data || [])
      setInvoices(invoicesResponse?.data || [])
      setActiveQuiz(activeQuizResponse?.data || null)

      // Fetch certificates separately with better error handling
      try {
        const certificatesResponse = await studentDashboardApi.getCertificates()
        
        // Handle different possible response structures
        let certificatesData = []
        if (certificatesResponse.data) {
          if (Array.isArray(certificatesResponse.data)) {
            certificatesData = certificatesResponse.data
          } else if (certificatesResponse.data.certificates) {
            certificatesData = certificatesResponse.data.certificates
          } else if (certificatesResponse.data.data && Array.isArray(certificatesResponse.data.data)) {
            certificatesData = certificatesResponse.data.data
          } else if (Array.isArray(certificatesResponse.data.data?.certificates)) {
            certificatesData = certificatesResponse.data.data.certificates
          }
        }
        
        setCertificates(Array.isArray(certificatesData) ? certificatesData : [])
      } catch (certError) {
        console.error('Error fetching certificates:', certError)
        setCertificates([])
      }

      // Find current course (most recently accessed active course)
      const courses = coursesResponse?.data?.courses || []
      const activeCourses = courses.filter((course: Course) => 
        course.status === 'active' && course.progress > 0 && course.progress < 100
      )
      
      if (activeCourses.length > 0) {
        const mostRecent = activeCourses.sort((a: Course, b: Course) => 
          new Date(b.lastAccessedAt || b.enrolledAt).getTime() - new Date(a.lastAccessedAt || a.enrolledAt).getTime()
        )[0]
        setCurrentCourse(mostRecent)
      }

      generateAchievements(statsResponse?.data, courses)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAchievements = (statsData: DashboardStats | null, _courses: Course[]) => {
    const userAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first course',
        icon: '🎯',
        earned: (statsData?.completedCourses || 0) > 0,
        type: 'course_completion'
      },
      {
        id: '2',
        title: 'Dedicated Learner',
        description: 'Spend 10+ hours learning',
        icon: '⏱️',
        earned: (statsData?.totalLearningHours || 0) >= 10,
        type: 'learning_hours'
      },
      {
        id: '3',
        title: 'Quiz Master',
        description: 'Score 90%+ on any quiz',
        icon: '🏆',
        earned: quizProgress.some(quiz => quiz.score >= 90),
        type: 'quiz_master'
      },
      {
        id: '4',
        title: 'Course Collector',
        description: 'Enroll in 5+ courses',
        icon: '📚',
        earned: (statsData?.enrolledCourses || 0) >= 5,
        type: 'course_completion'
      },
      {
        id: '5',
        title: 'Certificate Collector',
        description: 'Earn 3+ certificates',
        icon: '📜',
        earned: certificates.length >= 3,
        type: 'course_completion'
      }
    ]
    setAchievements(userAchievements)
  }

  const filterCourses = () => {
    let filtered = allCourses
    
    switch (activeFilter) {
      case 'enrolled':
        filtered = allCourses
        break
      case 'active':
        filtered = allCourses.filter(course => 
          course.status === 'active' && course.progress > 0 && course.progress < 100
        )
        break
      case 'completed':
        filtered = allCourses.filter(course => course.status === 'completed' || course.progress === 100)
        break
      default:
        filtered = allCourses
    }
    
    setFilteredCourses(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // const getProgressColor = (progress: number) => {
  //   if (progress >= 80) return 'success'
  //   if (progress >= 50) return 'warning'
  //   return 'primary'
  // }

  const getLearningIntensity = (hours: number) => {
    if (hours >= 10) return { level: 'High', color: 'success', icon: '🔥' }
    if (hours >= 5) return { level: 'Medium', color: 'warning', icon: '⚡' }
    return { level: 'Low', color: 'info', icon: '🌱' }
  }

  const handleCertificateDownload = (certificate: Certificate) => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank')
    } else {
      // Fallback: try to download via API
      studentCertificateApi.downloadCertificate(certificate.id)
        .then(response => {
          // Handle file download
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `certificate-${certificate.certificateNumber}.pdf`)
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
        .catch(error => {
          console.error('Error downloading certificate:', error)
          alert('Unable to download certificate at this time.')
        })
    }
  }

  if (loading) {
    return (
      <div className="content">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5">Loading your learning dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const learningIntensity = getLearningIntensity(stats?.weeklyLearningHours || 0)
  const earnedAchievements = achievements.filter(ach => ach.earned)
  const earnedCertificates = certificates.filter(cert => cert.isValid)

  return (
    <>
      <Breadcrumb title='Dashboard'/>
      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard/>
          {/* profile box */}
          
          <div className="row">
            {/* sidebar */}
            <StudentSidebar/>
            {/* sidebar */}
            
            <div className="col-lg-9">
              {/* Welcome Card with Learning Stats */}
              <div className="card bg-gradient-primary text-white mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4 className="mb-2">Welcome back! 👋</h4>
                      <p className="mb-3 text-white">
                        Continue your learning journey. You've spent <strong>{stats?.totalLearningHours || 0} hours</strong> learning so far!
                      </p>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-play-circle me-2"></i>
                          <span>Today: {stats?.dailyLearningHours || 0}h</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-calendar-week me-2"></i>
                          <span>This Week: {stats?.weeklyLearningHours || 0}h</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{learningIntensity.icon}</span>
                          <span>Intensity: {learningIntensity.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center text-md-end">
                      <div className="learning-stats-circle">
                        <div className="position-relative d-inline-block">
                          <CircleProgress value={Math.min((stats?.weeklyLearningHours || 0) * 10, 100)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Course Progress */}
              {currentCourse && (
                <div className="card border-warning mb-4">
                  <div className="card-header bg-warning bg-opacity-10 border-warning">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-warning">
                        <i className="fas fa-play-circle me-2"></i>
                        Currently Learning
                      </h5>
                      <span className="badge bg-warning">{Math.round(currentCourse.progress)}% Complete</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="mb-2">{currentCourse.title}</h6>
                        <p className="text-muted mb-3">{currentCourse.subtitle}</p>
                        <div className="progress mb-2" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            style={{ width: `${currentCourse.progress}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between text-sm text-muted">
                          <span>{currentCourse.completedLessons || 0}/{currentCourse.totalLessons || 0} lessons completed</span>
                          <span>{Math.round(currentCourse.progress)}%</span>
                        </div>
                      </div>
                      <div className="col-md-4 text-end">
                        <Link
                          to={`/learn/${currentCourse.slug}`}
                          className="btn btn-warning btn-lg px-4"
                        >
                          <i className="fas fa-play me-2"></i>
                          Continue Course
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Quiz Card */}
              {activeQuiz && (
                <div className="card bg-light quiz-ans-card border-warning mb-4">
                  <ImageWithBasePath
                    src="./assets/img/shapes/withdraw-bg1.svg"
                    className="quiz-ans-bg1"
                    alt="img"
                  />
                  <ImageWithBasePath
                    src="./assets/img/shapes/withdraw-bg2.svg"
                    className="quiz-ans-bg2"
                    alt="img"
                  />
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <div>
                          <h6 className="mb-1 text-warning">
                            <i className="fas fa-clock me-2"></i>
                            Active Quiz: {activeQuiz.title}
                          </h6>
                          <p className="mb-1">Answered: {activeQuiz.answered}/{activeQuiz.totalQuestions}</p>
                          {activeQuiz.timeRemaining > 0 && (
                            <p className="text-muted small mb-0">
                              <i className="fas fa-hourglass-half me-1"></i>
                              Time remaining: {Math.floor(activeQuiz.timeRemaining / 60)}:
                              {(activeQuiz.timeRemaining % 60).toString().padStart(2, '0')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-end">
                          <Link
                            to={`${all_routes.studentQuizQuestion.replace(':quizId',activeQuiz.id)}`}
                            className="btn btn-warning rounded-pill px-4"
                          >
                            <i className="fas fa-play me-2"></i>
                            Continue Quiz
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards with Clickable Filters */}
              <div className="row mb-4">
                <div className="col-md-6 col-xl-3">
                  <div 
                    className={`card stat-card border-primary cursor-pointer ${activeFilter === 'enrolled' ? 'active-filter' : ''}`}
                    onClick={() => setActiveFilter('enrolled')}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-primary-transparent me-3 flex-shrink-0">
                          <ImageWithBasePath src="assets/img/icon/graduation.svg" alt="" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="d-block text-muted">Enrolled Courses</span>
                          <h3 className="mt-1 mb-0 text-primary">{stats?.enrolledCourses || 0}</h3>
                          <small className="text-muted">Click to view all</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div 
                    className={`card stat-card border-warning cursor-pointer ${activeFilter === 'active' ? 'active-filter' : ''}`}
                    onClick={() => setActiveFilter('active')}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-warning-transparent me-3 flex-shrink-0">
                          <ImageWithBasePath src="assets/img/icon/book.svg" alt="" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="d-block text-muted">Active Courses</span>
                          <h3 className="mt-1 mb-0 text-warning">{stats?.activeCourses || 0}</h3>
                          <small className="text-muted">In progress</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div 
                    className={`card stat-card border-success cursor-pointer ${activeFilter === 'completed' ? 'active-filter' : ''}`}
                    onClick={() => setActiveFilter('completed')}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-success-transparent me-3 flex-shrink-0">
                          <ImageWithBasePath src="assets/img/icon/bookmark.svg" alt="" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="d-block text-muted">Completed</span>
                          <h3 className="mt-1 mb-0 text-success">{stats?.completedCourses || 0}</h3>
                          <small className="text-muted">Courses finished</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card stat-card border-info">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-info-transparent me-3 flex-shrink-0">
                          <ImageWithBasePath src="assets/img/icon/clock.svg" alt="" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="d-block text-muted">Learning Hours</span>
                          <h3 className="mt-1 mb-0 text-info">{stats?.totalLearningHours || 0}h</h3>
                          <small className="text-muted">
                            {stats?.dailyLearningHours || 0}h today
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Section with Filter Tabs */}
              <div className="card mb-4">
                <div className="card-header bg-transparent border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fs-18">
                      <i className="fas fa-rocket me-2 text-primary"></i>
                      My Courses
                      <span className="badge bg-primary ms-2">{filteredCourses.length}</span>
                    </h5>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveFilter('all')}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={`btn ${activeFilter === 'active' ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setActiveFilter('active')}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        className={`btn ${activeFilter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setActiveFilter('completed')}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                      <h5>No courses found</h5>
                      <p className="text-muted mb-4">
                        {activeFilter === 'active' 
                          ? "You don't have any active courses. Start learning!" 
                          : activeFilter === 'completed'
                          ? "You haven't completed any courses yet."
                          : "You haven't enrolled in any courses yet."
                        }
                      </p>
                      <Link to={all_routes.courseGrid} className="btn btn-primary">
                        Browse Courses
                      </Link>
                    </div>
                  ) : (
                    <div className="row">
                      {filteredCourses.map((course) => (
                        <div key={course.id} className="col-xl-4 col-md-6 mb-4">
                          <div className="course-item-two course-item mx-0">
                            <div className="course-img">
                              <Link to={`${all_routes.courseDetails.replace(":courseSlug", course.slug)}`}>
                                <ImageWithBasePath
                                  src={course.thumbnail || "assets/img/course/course-01.jpg"}
                                  alt="img"
                                  className="img-fluid"
                                />
                              </Link>
                              <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                <div className="badge text-bg-danger">New</div>
                                
                              </div>
                              <div className="position-absolute start-0 bottom-0 d-flex justify-content-end w-100 z-index-2">
                                {/* Accreditation Badge */}
                                {course.accreditedCreditType && (
                                  <div 
                                    className="ms-2" 
                                    style={{ width: '60px', height: '60px' }}
                                    title={`${course.accreditedCreditType} Accredited - ${course.accreditedCreditHours}h`}
                                  >
                                    <img
                                      src={
                                        course.accreditedCreditType === 'CME'
                                          ? '/assets/img/icon/CME.svg'
                                          : '/assets/img/icon/CPD.svg'
                                      }
                                      alt={`${course.accreditedCreditType} Accredited`}
                                      className="img-fluid"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="course-content">
                              <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                  <Link
                                    to={`${all_routes.instructorDetails}/${course.instructorName}`}
                                    className="avatar avatar-sm"
                                  >
                                    <ImageWithBasePath
                                      src={course.instructorAvatar || "assets/img/user/user-29.jpg"}
                                      alt="img"
                                      className="img-fluid avatar avatar-sm rounded-circle"
                                    />
                                  </Link>
                                  <div className="ms-2">
                                    <Link
                                      to={`${all_routes.instructorDetails}/${course.instructorName}`}
                                      className="link-default fs-14"
                                    >
                                      {course.instructorName}
                                    </Link>
                                  </div>
                                </div>
                                <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                  {course.category}
                                </span>
                              </div>
                              <h6 className="title mb-2">
                                <Link to={`${all_routes.courseDetails.replace(":courseSlug", course.slug)}`}>
                                  {course.title}
                                </Link>
                              </h6>
                              {/* Accreditation Info Badge */}
                              {course.accreditedCreditType && (
                                <div className="mb-2">
                                  <span className="badge bg-success-transparent text-success d-inline-flex align-items-center">
                                    <i className="isax isax-verify me-1" style={{ fontSize: '14px' }}></i>
                                    {course.accreditedCreditType} • {course.accreditedCreditHours}h Credits
                                  </span>
                                </div>
                              )}
                              <p className="d-flex align-items-center mb-3">
                                <i className="fa-solid fa-star text-warning me-2" />
                                {course.rating} ({course.reviewCount} Reviews)
                              </p>
                              <div className="d-flex align-items-center justify-content-between">
                                <h5 className="text-secondary mb-0">
                                  {course.price > 0 ? formatCurrency(course.price) : 'Free'}
                                </h5>
                                <Link
                                  to={`/learn/${course.slug}`}
                                  className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                >
                                  {course.progress > 0 ? 'Continue' : 'Start'}
                                  <i className="isax isax-arrow-right-3 ms-1" />
                                </Link>
                              </div>
                              {course.progress > 0 && (
                                <div className="progress mt-2" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements and Certificates Section */}
              <div className="row">
                {/* Achievements */}
                <div className="col-lg-6">
                  <div className="card mb-4">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h5 className="mb-0 fs-18">
                        <i className="fas fa-trophy me-2 text-warning"></i>
                        Achievements
                        <span className="badge bg-warning ms-2">{earnedAchievements.length}/{achievements.length}</span>
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {achievements.map((achievement) => (
                          <div key={achievement.id} className="col-6 mb-3">
                            <div className={`achievement-item text-center p-3 rounded ${achievement.earned ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                              <div className="achievement-icon mb-2" style={{ fontSize: '2rem' }}>
                                {achievement.icon}
                              </div>
                              <h6 className={`mb-1 ${achievement.earned ? 'text-success' : 'text-muted'}`}>
                                {achievement.title}
                              </h6>
                              <p className="small text-muted mb-0">{achievement.description}</p>
                              {achievement.earned && (
                                <div className="mt-2">
                                  <i className="fas fa-check-circle text-success"></i>
                                  <small className="text-success ms-1">Earned</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="col-lg-6">
                  <div className="card mb-4">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h5 className="mb-0 fs-18">
                        <i className="fas fa-certificate me-2 text-success"></i>
                        Certificates
                        <span className="badge bg-success ms-2">{earnedCertificates.length}</span>
                      </h5>
                    </div>
                    <div className="card-body">
                      {earnedCertificates.length === 0 ? (
                        <div className="text-center py-4">
                          <i className="fas fa-certificate fs-1 text-muted mb-3"></i>
                          <p className="text-muted">No certificates earned yet</p>
                          <small className="text-muted">Complete courses to earn certificates</small>
                        </div>
                      ) : (
                        <div className="certificates-list">
                          {earnedCertificates.map((certificate) => (
                            <div key={certificate.id} className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 last-border-0">
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">{certificate.courseTitle}</h6>
                                <div className="d-flex align-items-center flex-wrap">
                                  <span className="badge badge-sm bg-light border d-inline-flex me-2">
                                    #{certificate.certificateNumber}
                                  </span>
                                  <small className="text-muted">
                                    Issued: {formatDate(certificate.issueDate)}
                                  </small>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <button
                                  onClick={() => handleCertificateDownload(certificate)}
                                  className="btn btn-outline-success btn-sm"
                                >
                                  <i className="fas fa-download me-1"></i>
                                  Download
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Invoices and Quiz Performance */}
              <div className="row">
                <div className="col-xl-6">
                  <div className="card mb-4">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h5 className="mb-0 fs-18">
                        <i className="fas fa-receipt me-2 text-success"></i>
                        Recent Invoices
                      </h5>
                    </div>
                    <div className="card-body">
                      {invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 last-border-0">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{invoice.courseTitle}</h6>
                            <div className="d-flex align-items-center flex-wrap">
                              <span className="badge badge-sm bg-light border d-inline-flex me-2">
                                #{invoice.invoiceNumber}
                              </span>
                              <small className="text-muted">
                                {formatCurrency(invoice.amount)} • {formatDate(invoice.createdAt)}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className={`badge fw-normal d-inline-flex align-items-center me-2 ${
                              invoice.status === 'paid' ? 'bg-success' : 
                              invoice.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              <i className="fa-solid fa-circle fs-5 me-1" />
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="col-xl-6">
                  <div className="card mb-4">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h5 className="mb-0 fs-18">
                        <i className="fas fa-chart-line me-2 text-info"></i>
                        Quiz Performance
                      </h5>
                    </div>
                    <div className="card-body">
                      {quizProgress.slice(0, 3).map((quiz) => (
                        <div key={quiz.id} className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 last-border-0">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{quiz.title}</h6>
                            <div className="d-flex align-items-center">
                              <small className="text-muted mb-0">
                                Score: {quiz.correctAnswers}/{quiz.totalQuestions} ({Math.round(quiz.score)}%)
                              </small>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <CircleProgress 
                              value={Math.round(quiz.score)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .active-filter {
          border-width: 2px !important;
          background-color: rgba(var(--bs-primary-rgb), 0.05);
        }
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .last-border-0:last-child {
          border-bottom: none !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .course-card {
          transition: all 0.3s ease;
        }
        .course-card:hover {
          transform: translateY(-3px);
        }
        .achievement-item {
          transition: all 0.3s ease;
        }
        .achievement-item:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  )
}

export default StudentDashboard