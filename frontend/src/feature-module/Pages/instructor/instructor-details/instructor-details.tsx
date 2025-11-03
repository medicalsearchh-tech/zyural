import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { all_routes } from "../../../router/all_routes";
import { getInstructorApi } from "../../../../core/utils/api";
import { toast } from "react-toastify";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImage: string;
  avatar: string;
  expertise: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  courseCount: number;
  totalLessons: number;
  totalDuration: string;
  totalStudents: number;
  phone?: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImageUrl: string;
  level: string;
  pricing: {
    price: number;
    certPrice?: number;
    currency: string;
  };
  averageRating: number;
  totalReviews: number;
  totalEnrollments: number;
  accreditedCreditHours?: number;
  accreditedCreditType?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
    studentCount: number;
  };
}

interface InstructorDetailsData {
  instructor: Instructor;
  courses: Course[];
  stats: {
    courseCount: number;
    totalLessons: number;
    totalDuration: string;
    totalStudents: number;
  };
}

const InstructorDetails = () => {
  const route = all_routes;
  const { id } = useParams<{ id: string }>();
  
  const [instructorData, setInstructorData] = useState<InstructorDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const instructorDetailsSlider = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log('Fetching instructor details for ID:', id);
        
        const response = await getInstructorApi.getInstructorById(id);
        console.log('Instructor details response:', response);

        if (response.success && response.data) {
          setInstructorData(response.data);
        } else {
          toast.error('Failed to load instructor details');
        }
      } catch (error: any) {
        console.error('Error fetching instructor details:', error);
        toast.error('Failed to load instructor details');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorDetails();
  }, [id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // You can add API call here to save favorite status
  };

  // Get profile image URL
  const getProfileImage = (instructor: Instructor) => {
    return instructor.profileImage || instructor.avatar || "assets/img/user/user-61.jpg";
  };

  // Get instructor name
  const getInstructorName = (instructor: Instructor) => {
    return instructor.fullName || `${instructor.firstName} ${instructor.lastName}`;
  };

  // Format price
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Instructor Details" />
        <div className="instructor-detail-content">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading instructor details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!instructorData) {
    return (
      <>
        <Breadcrumb title="Instructor Not Found" />
        <div className="instructor-detail-content">
          <div className="container">
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-user-slash fa-3x text-muted"></i>
              </div>
              <h5>Instructor Not Found</h5>
              <p className="text-muted">The instructor you're looking for doesn't exist.</p>
              <Link to={route.instructorGrid} className="btn btn-primary">
                Browse Instructors
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { instructor, courses, stats } = instructorData;

  return (
    <>
      <Breadcrumb title={`${getInstructorName(instructor)} - Instructor Details`} />
     
      <div className="instructor-detail-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Instructor Header Card */}
              <div className="card bg-light mb-4">
                <div className="card-body instructor-details">
                  <div className="instructor-img">
                    <Link to="#">
                      <ImageWithBasePath
                        src={getProfileImage(instructor)}
                        alt={getInstructorName(instructor)}
                        className="img-fluid"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                    <Link 
                      to="#" 
                      className={`btn heart ${isFavorite ? 'text-danger' : ''}`}
                      onClick={handleFavoriteClick}
                    >
                      <i className={`isax ${isFavorite ? 'isax-heart5 text-danger' : 'isax-heart'}`} />
                    </Link>
                  </div>
                  <div className="flex-fill">
                    <div className="pb-3 border-bottom mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="fw-bold">
                          <Link to="#">{getInstructorName(instructor)}</Link>
                          {instructor.isVerified && (
                            <span className="verify ms-2">
                              <ImageWithBasePath
                                src="assets/img/icons/verify-icon.svg"
                                alt="verified"
                                className="img-fluid"
                                style={{ width: '20px', height: '20px' }}
                              />
                            </span>
                          )}
                        </h6>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <Link to="#" className="fs-14 me-2">
                          {instructor.expertise || 'Instructor'}
                        </Link>
                        <span className="me-2">
                          <i className="fa-solid fa-star text-warning" />
                        </span>
                        <span className="fs-14">
                          {instructor.rating.toFixed(1)} ({instructor.reviewCount} Reviews)
                        </span>
                      </div>
                      <div>
                        <p>
                          {instructor.bio || `${getInstructorName(instructor)} is a professional instructor with ${stats.courseCount} courses and ${stats.totalStudents} students.`}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center counts-details">
                        <span className="d-flex align-items-center me-4">
                          <span className="d-flex align-items-center">
                            <i className="isax isax-book-saved5 fs-16 text-secondary me-2" />
                          </span>
                          {stats.courseCount} Course{stats.courseCount !== 1 ? 's' : ''}
                        </span>
                        <span className="d-flex align-items-center me-4">
                          <span className="d-flex align-items-center">
                            <i className="isax isax-video-play5 fs-16 text-primary me-2" />
                          </span>
                          {stats.totalLessons}+ Lessons
                        </span>
                        <span className="d-flex align-items-center me-4">
                          <span className="d-flex align-items-center">
                            <i className="isax isax-timer-start5 fs-16 text-warning me-2" />
                          </span>
                          {stats.totalDuration}
                        </span>
                        <span className="d-flex align-items-center">
                          <span className="d-flex align-items-center">
                            <i className="isax isax-profile-2user5 fs-16 text-success me-2" />
                          </span>
                          {stats.totalStudents}+ Students
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span>
                          <Link
                            to="#"
                            className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                          >
                            <i className="fa-brands fa-facebook-f" />
                          </Link>
                        </span>
                        <span>
                          <Link
                            to="#"
                            className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                          >
                            <i className="fa-brands fa-instagram" />
                          </Link>
                        </span>
                        <span>
                          <Link
                            to="#"
                            className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                          >
                            <i className="fa-brands fa-x-twitter" />
                          </Link>
                        </span>
                        <span>
                          <Link
                            to="#"
                            className="rounded-circle d-inline-flex align-items-center justify-content-center me-2"
                          >
                            <i className="fa-brands fa-youtube" />
                          </Link>
                        </span>
                        <span>
                          <Link
                            to="#"
                            className="rounded-circle d-inline-flex align-items-center justify-content-center"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">About Me</h5>
                  <p className="mb-3">
                    {instructor.bio || `Welcome to my instructor profile! I'm ${getInstructorName(instructor)}, a dedicated educator with a passion for sharing knowledge and helping students achieve their learning goals. With ${stats.courseCount} courses and ${stats.totalStudents} students, I'm committed to providing high-quality educational content that makes complex topics easy to understand.`}
                  </p>
                  <p className="mb-3">
                    My teaching philosophy centers around practical, hands-on learning experiences that prepare students for real-world challenges. I believe in creating engaging, interactive content that not only teaches theoretical concepts but also provides practical skills that can be immediately applied.
                  </p>
                  <Link to="#" className="read-more-btn">
                    Read More
                  </Link>
                </div>
              </div>

              {/* Courses Section */}
              {courses.length > 0 && (
                <div className="card border-0">
                  <div className="card-body p-0">
                    <h5 className="mb-3">Courses by {getInstructorName(instructor)}</h5>
                    <Slider {...instructorDetailsSlider} className="course-carousal">
                      {courses.map((course) => (
                        <div key={course.id}>
                          <div className="course-item course-item-three mx-2 mb-0">
                            <div className="course-carousal-img position-relative overflow-hidden rounded-3 mb-3">
                              <Link to={`${route.courseDetails.replace(':courseSlug', course.slug)}`}>
                                <ImageWithBasePath
                                  className="img-fluid rounded-3"
                                  src={course.heroImageUrl || "./assets/img/course/course-02.jpg"}
                                  alt={course.title}
                                  style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                />
                              </Link>
                              <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                <Link className="like" to="#">
                                  <i className="isax isax-heart" />
                                </Link>
                              </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm rounded-circle">
                                  <ImageWithBasePath
                                    className="img-fluid rounded-circle object-fit-cover"
                                    src={getProfileImage(instructor)}
                                    alt={getInstructorName(instructor)}
                                    style={{ width: '32px', height: '32px' }}
                                  />
                                </div>
                                <p className="ms-2">
                                  <Link to={`${route.courseDetails.replace(':courseSlug', course.slug)}`}>
                                    {getInstructorName(instructor)}
                                  </Link>
                                </p>
                              </div>
                              {course.category && (
                                <span className="tag-btn">{course.category.name}</span>
                              )}
                            </div>
                            <h5 className="mt-3 mb-2 text-truncate line-clamb-2">
                              <Link to={`${route.courseDetails.replace(':courseSlug', course.slug)}`}>
                                {course.title}
                              </Link>
                            </h5>
                            <div className="d-flex align-items-center">
                              <i className="ti ti-star-filled text-warning" />
                              <p className="ms-2">
                                {course.averageRating?.toFixed(1) || '4.5'} ({course.totalReviews || 0} Reviews)
                              </p>
                            </div>
                            <div className="d-flex justify-content-between mt-3 align-items-center">
                              <h6 className="fs-16 text-secondary">
                                {formatPrice(course.pricing?.price || 0, course.pricing?.currency)}
                              </h6>
                              <Link
                                to={`${route.courseDetails.replace(':courseSlug', course.slug)}`}
                                className="btn view-course-btn"
                              >
                                View Course
                                <i className="fs-8 fas fa-angle-right ms-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Certifications Section */}
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Certifications</h5>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="certificate-img rounded-circle me-2 mb-2">
                      <ImageWithBasePath
                        src="assets/img/certificates/certificate-01.svg"
                        alt="Certification 1"
                        className="img-fluid"
                      />
                    </div>
                    <div className="certificate-img rounded-circle me-2 mb-2">
                      <ImageWithBasePath
                        src="assets/img/certificates/certificate-02.svg"
                        alt="Certification 2"
                        className="img-fluid"
                      />
                    </div>
                    <div className="certificate-img rounded-circle me-2 mb-2">
                      <ImageWithBasePath
                        src="assets/img/certificates/certificate-03.svg"
                        alt="Certification 3"
                        className="img-fluid"
                      />
                    </div>
                    <div className="certificate-img rounded-circle mb-2">
                      <ImageWithBasePath
                        src="assets/img/certificates/certificate-01.svg"
                        alt="Certification 4"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Contact Details</h5>
                  <div className="d-flex align-items-center mb-4">
                    <span className="contact-icon rounded-circle d-flex align-items-center justify-content-center me-3">
                      <i className="fa-regular fa-envelope" />
                    </span>
                    <div>
                      <h6 className="mb-0">Email</h6>
                      <p className="mb-0">{instructor.email}</p>
                    </div>
                  </div>
                  {instructor.phone && (
                    <div className="d-flex align-items-center mb-4">
                      <span className="contact-icon rounded-circle d-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-call" />
                      </span>
                      <div>
                        <h6 className="fs-16 fw-medium text-gray-9 mb-0">
                          Phone
                        </h6>
                        <p className="mb-0">{instructor.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="d-flex align-items-center">
                    <span className="contact-icon rounded-circle d-flex align-items-center justify-content-center me-3">
                      <i className="isax isax-calendar" />
                    </span>
                    <div>
                      <h6 className="fs-16 fw-medium text-gray-9 mb-0">
                        Member Since
                      </h6>
                      <p className="mb-0">
                        {new Date(instructor.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Teaching Stats</h5>
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-fill">
                      <h6 className="mb-1">Total Courses</h6>
                      <p className="mb-0 text-primary fw-bold">{stats.courseCount}</p>
                    </div>
                    <div className="flex-fill">
                      <h6 className="mb-1">Total Students</h6>
                      <p className="mb-0 text-success fw-bold">{stats.totalStudents}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-fill">
                      <h6 className="mb-1">Total Lessons</h6>
                      <p className="mb-0 text-info fw-bold">{stats.totalLessons}</p>
                    </div>
                    <div className="flex-fill">
                      <h6 className="mb-1">Instructor Rating</h6>
                      <p className="mb-0 text-warning fw-bold">{instructor.rating.toFixed(1)}/5.0</p>
                    </div>
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

export default InstructorDetails;