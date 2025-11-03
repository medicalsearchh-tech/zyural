import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link, useNavigate } from 'react-router-dom'
import VideoModal from '../../HomePages/home-one/section/videoModal'
import { all_routes } from '../../router/all_routes'
import  CommonDescription  from '../../../core/common/commonDescription';
import { courseApi } from '../../../core/utils/api'// Adjust path as needed
import { toast } from "react-toastify";

interface Course {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  heroImageUrl: string
  promoVideo?: string
  pricing: {
    price: number
    certPrice: number
    currency: string
    accessType: string
    visibility: string
  }
  level: string
  language: string
  duration: number
  learningObjectives: string
  targetAudience: string[]
  conflictOfInterest: {
    hasConflict: boolean
    description: string
  }
  status: string
  totalEnrollments: number
  averageRating?: number | null
  totalReviews: number
  totalLessons: number
  totalSections: number
  instructor: {
    id: string
    firstName: string
    lastName: string
    avatar: string
    bio: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  specialty?: {
    id: string
    name: string
    slug: string
  }
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
  }
  sections: Array<{
    id: string
    title: string
    description?: string | null
    sortOrder: number
    totalLessons: number
    totalDuration: number
    hasQuiz: boolean
    lessons?: Array<{
      id: string
      title: string
      contentUrl: string
      duration: number
      freePreview: boolean
      sortOrder: number
    }>
  }>
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    user: {
      firstName: string
      lastName: string
      avatar: string | null
    }
    createdAt: string
  }>
  isEnrolled: boolean
  accreditedCreditType: string
  accreditedCreditHours: string
}

const InstructorCourseDetails = () => {
  const navigate = useNavigate();
  const { courseSlug } = useParams();
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)

  const route = all_routes

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseSlug) {
          toast.error('Course slug not found')
          return
        }
        
        const response = await courseApi.getInstructorCourseBySlug(courseSlug)
        if (response.success) {
          setCourse(response.data.course)
        } else {
          toast.error('Course not found')
        }
      } catch (err) {
        toast.error('Failed to load course')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseSlug])

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handlePreview = async () => {
    if (!course) return
    
    setEnrollmentLoading(true)
    try {
       navigate(`/preview/${course.slug}`);

    } catch (error) {

      console.error('Enrollment error:', error)
    } finally {
      setEnrollmentLoading(false)
    }
  }

  // Helper functions
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  const formatPrice = (pricing: { price: number; currency: string }) => {
    const symbol = pricing.currency === 'USD' ? '$' : pricing.currency === 'EUR' ? '€' : '£'
    return pricing.price === 0 ? 'FREE' : `${symbol}${pricing.price.toFixed(2)}`
  }

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating)
    const fullStars = Math.floor(ratingNum)
    const hasHalfStar = ratingNum % 1 !== 0
    const emptyStars = 5 - Math.ceil(ratingNum)

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fa-solid fa-star text-warning me-1" />
        ))}
        {hasHalfStar && <i className="fa-solid fa-star-half text-warning me-1" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="fa-solid fa-star text-gray-1 me-1" />
        ))}
      </>
    )
  }

  if (loading) {
    return (
    <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
      <div className="text-center text-white">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      </div>
    </div>
    );
  }

  if (!course) {
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
          <Link to={route.homeone}>
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
          This page you requested counld not found. May the force be with
          you!
          </p>
          <Link to={route.homeone} className="btn back-to-home-btn">
          <i className="isax isax-arrow-left-2 me-1" /> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb title='Course Detail' />

      <section className="course-details-two">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-body d-lg-flex align-items-center">
                  <div className="position-relative">
                    <Link
                      to="#"
                      id="openVideoBtn"
                      onClick={handleOpenModal}
                    >
                      <img
                        className="img-fluid rounded-2"
                        src={course.heroImageUrl}
                        alt={course.title}
                        style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                      />
                      <div className="play-icon">
                        <i className="ti ti-player-play-filled fs-28" />
                      </div>
                    </Link>
                  </div>
                  <div id="videoModal">
                    <div className="modal-content1">
                      <span className="close-btn" id="closeModal">×</span>
                      <VideoModal 
                        show={showModal} 
                        handleClose={handleCloseModal} 
                        videoUrl={course.promoVideo ?? ''} 
                      />
                    </div>
                  </div>
                  <div className="w-100 ps-lg-4">
                    <h3 className="mb-2">{course.title}</h3>
                    <p className="fs-14 mb-3">{course.subtitle || course.learningObjectives.substring(0, 150)}</p>
                    <div className="d-flex align-items-center gap-2 gap-sm-3 gap-xl-4 flex-wrap my-3 my-sm-0">
                      <p className="fw-medium d-flex align-items-center mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/book.svg"
                          alt="img"
                        />
                        {course.totalLessons}+ Lessons
                      </p>
                      <p className="fw-medium d-flex align-items-center mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/timer-start.svg"
                          alt="img"
                        />
                        {formatDuration(course.stats.totalDuration)}
                      </p>
                      <p className="fw-medium d-flex align-items-center mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/people.svg"
                          alt="img"
                        />
                        {course.totalEnrollments} students enrolled
                      </p>
                      <span className="badge badge-sm rounded-pill bg-warning fs-12">
                        {course.category.name}
                      </span>
                    </div>
                    <div className="d-sm-flex align-items-center justify-content-sm-between mt-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg">
                          <img
                            className="rounded-circle"
                            src={course.instructor.avatar}
                            alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="ms-2">
                          <h5 className="fs-18 fw-semibold">
                            <Link to={route.instructorDetails}>
                              {course.instructor.firstName} {course.instructor.lastName}
                            </Link>
                          </h5>
                          <p className="fs-14">Instructor</p>
                        </div>
                      </div>
                      <div className="d-flex mt-sm-0 mt-2 align-items-center">
                        {renderStars(course.averageRating?.toString() || '0')}
                        <p className="fs-14">
                          <span className="text-gray-9">{course.averageRating?.toString() || '0'}</span> ({course.totalReviews})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-8">
              <div>
                <img
                  src={course.heroImageUrl}
                  alt={course.title}
                  className="img-fluid mb-4"
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
              </div>
              <div className="course-page-content pt-0">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="mb-3">Overview</h5>
                    <h6 className="mb-2">Course Description</h6>
                    <CommonDescription 
                      className= "mb-4"
                      description={course.learningObjectives} 
                    />
                    <h6 className="mb-2">Target Audience</h6>
                    <ul className="custom-list mb-3">
                      {course.targetAudience.map((item, index) => (
                        <li key={index} className="list-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between flex-wrap">
                      <h5 className="subs-title mb-2 mb-sm-3">Course Content</h5>
                      <h6 className="fs-16 fw-medium text-gray-7 mb-3">
                        {course.totalLessons} Lessons <span className="text-secondary">{formatDuration(course.stats.totalDuration)}</span>
                      </h6>
                    </div>
                    <div className="accordion accordion-customicon1 accordions-items-seperate p-0" id="accordioncustomicon1Example">
                      {course.sections.map((section, sectionIndex) => (
                        <div key={section.id} className="accordion-item" data-aos="fade-up">
                          <h2 className="accordion-header" id={`heading-${section.id}`}>
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${section.id}`}
                              aria-expanded="false"
                              aria-controls={`collapse-${section.id}`}
                            >
                              {section.title}
                              <i className="fa-solid fa-chevron-down" />
                            </button>
                          </h2>
                          <div
                            id={`collapse-${section.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${section.id}`}
                            data-bs-parent="#accordioncustomicon1Example"
                          >
                            <div className="accordion-body p-0">
                              <ul>
                                {section.lessons?.map((lesson, lessonIndex) => (
                                  <li key={lesson.id} className="p-4 px-3 d-flex justify-content-between">
                                    <p className="mb-0">
                                      <ImageWithBasePath
                                        className="me-2"
                                        src="./assets/img/icons/play.svg"
                                        alt="img"
                                      />
                                      Lecture {sectionIndex + 1}.{lessonIndex + 1} {lesson.title}
                                    </p>
                                    <div className="d-flex gap-xl-5 gap-3">
                                      {lesson.freePreview && (
                                        <Link to="#" className="preview-link">
                                          Preview
                                        </Link>
                                      )}
                                      <p className="mb-0">{formatDuration(lesson.duration)}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="subs-title mb-4">About the instructor</h5>
                    <div className="d-flex align-items-center justify-content-between mt-4 gap-2 flex-wrap">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg">
                          <img
                            className="rounded-circle"
                            src={course.instructor.avatar}
                            alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="ms-2">
                          <Link to={route.instructorDetails} className="name-link">
                            {course.instructor.firstName} {course.instructor.lastName}
                          </Link>
                          <p className="mb-0 fs-14">Instructor</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {renderStars(course.averageRating?.toString() || '0')}
                        <p className="mb-0 fs-14">{course.averageRating?.toString() || '0'}</p>
                      </div>
                    </div>
                    <div className="course-info align-items-center d-flex gap-2 gap-xl-3 mt-3 mb-3 flex-wrap">
                      <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/play2.svg"
                          alt="img"
                        />
                        1 Course
                      </p>
                      <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/book2.svg"
                          alt="img"
                        />
                        {course.totalLessons}+ Lessons
                      </p>
                      <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/timer-start2.svg"
                          alt="img"
                        />
                        {formatDuration(course.stats.totalDuration)}
                      </p>
                      <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                        <ImageWithBasePath
                          className="me-2"
                          src="./assets/img/icons/people.svg"
                          alt="img"
                        />
                        {course.totalEnrollments} students enrolled
                      </p>
                    </div>
                    <p>{course.instructor.bio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="course-sidebar-sec mt-0">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className={`fs-30 ${course.pricing.price === 0 ? 'text-success' : 'text-primary'}`}>
                        Free
                      </h2>
                      {course.pricing.certPrice > 0 && (
                        <p className="fs-14 mb-0">
                          Certificate: {formatPrice(course.pricing.certPrice ? { price: course.pricing.certPrice, currency: course.pricing.currency } : { price: 0, currency: course.pricing.currency })}
                        </p>
                      )}
                    </div>
                    <div className="d-flex justify-content-between gap-3 wishlist-btns">
                      <Link className="btn d-flex btn-wish" to="#">
                        <i className="isax isax-heart me-1 fs-18" />
                        Add to Wishlist
                      </Link>
                      <Link className="btn d-flex btn-wish" to="#">
                        <i className="ti ti-share me-1 fs-18" />
                        Share
                      </Link>
                    </div>
                    {course.isEnrolled ? (
                      <Link
                        to={route.courseLearningPage.replace(":courseSlug/:lessonId", course.slug)}
                        className="btn btn-primary w-100 mt-3 btn-enroll"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={handlePreview}
                        disabled={enrollmentLoading}
                        className="btn btn-primary w-100 mt-3 btn-enroll"
                      >
                        {enrollmentLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enrolling...
                          </>
                        ) : (
                          'Try Demo'
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="subs-title mb-4">Includes</h5>
                    <p className="mb-3">
                      <ImageWithBasePath
                        className="me-2"
                        src="./assets/img/icons/play.svg"
                        alt="img"
                      />
                      {formatDuration(course.duration)} on-demand video
                    </p>
                    <p className="mb-3">
                      <ImageWithBasePath
                        className="me-2"
                        src="./assets/img/icons/import.svg"
                        alt="img"
                      />
                      {course.totalLessons} lessons
                    </p>
                    <p className="mb-3">
                      <ImageWithBasePath
                        className="me-2"
                        src="./assets/img/icons/key.svg"
                        alt="img"
                      />
                      Full lifetime access
                    </p>
                    <p className="mb-3">
                      <ImageWithBasePath
                        className="me-2"
                        src="./assets/img/icons/monitor-mobbile.svg"
                        alt="img"
                      />
                      Access on mobile and TV
                    </p>
                    <p className="mb-3">
                      <ImageWithBasePath
                        className="me-2"
                        src="./assets/img/icons/cloud-lightning.svg"
                        alt="img"
                      />
                      Assignments
                    </p>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body cou-features">
                    <h5 className="subs-title">Course Features</h5>
                    <ul>
                      <li>
                        <p className="mb-0">
                          <ImageWithBasePath
                            className="me-2"
                            src="./assets/img/icons/people2.svg"
                            alt="img"
                          />
                          Enrolled: {course.totalEnrollments} students
                        </p>
                      </li>
                      <li>
                        <p className="mb-0">
                          <ImageWithBasePath
                            className="me-2"
                            src="./assets/img/icons/timer-start3.svg"
                            alt="img"
                          />
                          Duration: {formatDuration(course.stats.totalDuration)}
                        </p>
                      </li>
                      <li>
                        <p className="mb-0">
                          <ImageWithBasePath
                            className="me-2"
                            src="./assets/img/icons/note.svg"
                            alt="img"
                          />
                          Sections: {course.totalSections}
                        </p>
                      </li>
                      <li>
                        <p className="mb-0">
                          <ImageWithBasePath
                            className="me-2"
                            src="./assets/img/icons/play3.svg"
                            alt="img"
                          />
                          Video: {formatDuration(course.duration)}
                        </p>
                      </li>
                      <li>
                        <p className="mb-0">
                          <ImageWithBasePath
                            className="me-2"
                            src="./assets/img/icons/chart.svg"
                            alt="img"
                          />
                          Level: {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default InstructorCourseDetails