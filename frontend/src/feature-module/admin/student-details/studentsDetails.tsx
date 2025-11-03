import ProfileCard from '../common/profileCard'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Slider from 'react-slick'

const StudentsDetails = () => {
    const adminDetailsSlider = {
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
  return (
    <>
    <div className="content instructor-detail-content">
  <div className="container">
    <ProfileCard/>
    <Link to={all_routes.studentsList} className="d-flex align-items-center mb-3">
      <i className="isax isax-arrow-left me-1 fw-bold" />
      Back to List
    </Link>
    <div className="row">
      <div className="col-lg-8">
        <div className="instructor-details-item1 mb-4">
          <div className="instructor-details">
            <div className="instructor-img">
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/students/student-01.jpg"
                  alt="img"
                  className="img-fluid"
                />
              </Link>
            </div>
            <div className="flex-fill">
              <div className="pb-3 border-bottom mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fs-18 fw-bold">
                    <Link to="#">Thompson Hicks</Link>
                  </h6>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <p>Joined on : 24 May 2024</p>
                </div>
                <div>
                  <p>
                    Hello! I'm Thompson Hicks. I'm passionate about developing
                    innovative software solutions, analyzing classic literature.{" "}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-center counts-details mb-0">
                  <div className="d-flex align-items-center me-4">
                    <span className="d-flex align-items-center">
                      <i className="isax isax-book5 text-primary me-1" />
                      10 Courses
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span>
                    <Link
                      to="#"
                      className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                    >
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </span>
                  <span>
                    <Link
                      to="#"
                      className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                    >
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </span>
                  <span>
                    <Link
                      to="#"
                      className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                    >
                      <i className="fa-brands fa-x-twitter" />
                    </Link>
                  </span>
                  <span>
                    <Link
                      to="#"
                      className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
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
        <div className="about-me-card bg-white">
          <div className="about-me-body">
            <h6 className="page-title fs-18 fw-bold">About Me</h6>
            <p className="mb-2">
              Very well thought out and articulate communication. Clear
              milestones, deadlines and fast work. Patience. Infinite patience.
              No shortcuts. Even if the client is being careless. Some quick
              example text to build on the card title and bulk the card's
              content Moltin gives you platform.
            </p>
            <Link
              to="#"
              className="text-secondary text-decoration-underline fs-14"
            >
              Read More
            </Link>
          </div>
        </div>
        <div className="education-card">
          <div className="education-body">
            <h6 className="fs-18 fw-bold page-title">Education</h6>
            <div className="education-flow">
              <div className="ps-4 pb-3 timeline-flow">
                <div>
                  <h6 className="fs-16 mb-1">
                    BCA - Bachelor of Computer Applications
                  </h6>
                  <p>International University - (2004 - 2010)</p>
                </div>
              </div>
              <div className="ps-4 pb-3 timeline-flow">
                <div>
                  <h6 className="fs-16 mb-1">
                    MCA - Master of Computer Application
                  </h6>
                  <p>International University - (2010 - 2012)</p>
                </div>
              </div>
              <div className="ps-4 timeline-flow">
                <div>
                  <h6 className="mb-1">Design Communication Visual</h6>
                  <p>International University - (2012-2015)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="enrolled-courses-card mb-4 mb-lg-0">
          <div className="enrolled-courses-body">
            <div className="page-title">
              <h6 className="mb-0 fs-18 fw-bold">Enrolled Courses</h6>
            </div>
            <Slider {...adminDetailsSlider} className="course-carousal student-details-carousal">
              <div>
                <div className="course-item-two course-item mx-2">
                  <div className="course-img">
                    <Link to={all_routes.courseDetails}>
                      <ImageWithBasePath
                        src="assets/img/course/course-01.jpg"
                        alt="img"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                      <div className="badge text-bg-danger">15% off</div>
                      <Link
                        to="#"
                        className="fav-icon ms-auto"
                      >
                        <i className="isax isax-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="avatar avatar-sm"
                        >
                          <ImageWithBasePath
                            src="assets/img/user/user-29.jpg"
                            alt="img"
                            className="img-fluid avatar avatar-sm rounded-circle"
                          />
                        </Link>
                        <div className="ms-2">
                          <Link
                            to="#"
                            className="link-default fs-14"
                          >
                            Brenda Slaton
                          </Link>
                        </div>
                      </div>
                      <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                        Design
                      </span>
                    </div>
                    <h6 className="title mb-2">
                      <Link to={all_routes.courseDetails}>
                        Information About UI/UX Design Degree
                      </Link>
                    </h6>
                    <p className="d-flex align-items-center mb-3">
                      <i className="fa-solid fa-star text-warning me-2" />
                      4.9 (200 Reviews)
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="text-secondary mb-0">$120</h5>
                      <Link
                        to={all_routes.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="isax isax-arrow-right-3 ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="course-item-two course-item mx-2">
                  <div className="course-img">
                    <Link to={all_routes.courseDetails}>
                      <ImageWithBasePath
                        src="assets/img/course/course-02.jpg"
                        alt="img"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                      <Link
                        to="#"
                        className="fav-icon ms-auto"
                      >
                        <i className="isax isax-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="avatar avatar-sm"
                        >
                          <ImageWithBasePath
                            src="assets/img/user/user-30.jpg"
                            alt="img"
                            className="img-fluid avatar avatar-sm rounded-circle"
                          />
                        </Link>
                        <div className="ms-2">
                          <Link
                            to="#"
                            className="link-default fs-14"
                          >
                            Ana Reyes
                          </Link>
                        </div>
                      </div>
                      <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                        Wordpress
                      </span>
                    </div>
                    <h6 className="title mb-2">
                      <Link to={all_routes.courseDetails}>
                        Wordpress for Beginners - Master Wordpress Quickly
                      </Link>
                    </h6>
                    <p className="d-flex align-items-center mb-3">
                      <i className="fa-solid fa-star text-warning me-2" />
                      4.4 (160 Reviews)
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="text-secondary mb-0">$140</h5>
                      <Link
                        to={all_routes.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="isax isax-arrow-right-3 ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="course-item-two course-item mx-2">
                  <div className="course-img">
                    <Link to={all_routes.courseDetails}>
                      <ImageWithBasePath
                        src="assets/img/course/course-03.jpg"
                        alt="img"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                      <Link
                        to="#"
                        className="fav-icon ms-auto"
                      >
                        <i className="isax isax-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="avatar avatar-sm"
                        >
                          <ImageWithBasePath
                            src="assets/img/user/user-31.jpg"
                            alt="img"
                            className="img-fluid avatar avatar-sm rounded-circle"
                          />
                        </Link>
                        <div className="ms-2">
                          <Link
                            to="#"
                            className="link-default fs-14"
                          >
                            Andrew Pirtle
                          </Link>
                        </div>
                      </div>
                      <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                        Design
                      </span>
                    </div>
                    <h6 className="title mb-2">
                      <Link to={all_routes.courseDetails}>
                        Sketch from A to Z (2024): Become an app designer
                      </Link>
                    </h6>
                    <p className="d-flex align-items-center mb-3">
                      <i className="fa-solid fa-star text-warning me-2" />
                      4.4 (160 Reviews)
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="text-secondary mb-0">$140</h5>
                      <Link
                        to={all_routes.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="isax isax-arrow-right-3 ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="course-item-two course-item mx-2">
                  <div className="course-img">
                    <Link to={all_routes.courseDetails}>
                      <ImageWithBasePath
                        src="assets/img/course/course-04.jpg"
                        alt="img"
                        className="img-fluid"
                      />
                    </Link>
                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                      <Link
                        to="#"
                        className="fav-icon ms-auto"
                      >
                        <i className="isax isax-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="avatar avatar-sm"
                        >
                          <ImageWithBasePath
                            src="assets/img/user/user-32.jpg"
                            alt="img"
                            className="img-fluid avatar avatar-sm rounded-circle"
                          />
                        </Link>
                        <div className="ms-2">
                          <Link
                            to="#"
                            className="link-default fs-14"
                          >
                            Christy Garner
                          </Link>
                        </div>
                      </div>
                      <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                        Programming
                      </span>
                    </div>
                    <h6 className="title mb-2">
                      <Link to={all_routes.courseDetails}>
                        Build Responsive Real World Websites with Crash Course
                      </Link>
                    </h6>
                    <p className="d-flex align-items-center mb-3">
                      <i className="fa-solid fa-star text-warning me-2" />
                      4.2 (220 Reviews)
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="text-secondary mb-0">$200</h5>
                      <Link
                        to={all_routes.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="isax isax-arrow-right-3 ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="certification-card">
          <div className="certification-body">
            <h5 className="mb-3 fw-bold">Certifications</h5>
            <div className="d-flex align-items-center">
              <div className="certificate-img rounded-circle me-2">
                <ImageWithBasePath
                  src="assets/img/certificates/certificate-01.svg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="certificate-img rounded-circle me-2">
                <ImageWithBasePath
                  src="assets/img/certificates/certificate-02.svg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="certificate-img rounded-circle me-2">
                <ImageWithBasePath
                  src="assets/img/certificates/certificate-03.svg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="certificate-img rounded-circle">
                <ImageWithBasePath
                  src="assets/img/certificates/certificate-01.svg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="contact-card border-0 mb-0">
          <div className="contact-details-body">
            <h5 className="mb-3 fw-bold">Contact Details</h5>
            <div className="d-flex align-items-center mb-4">
              <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                <i className="fa-regular fa-envelope" />
              </span>
              <div>
                <h6 className="mb-0">Email</h6>
                <p className="fs-14 mb-0">jennywilson@example.com</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-4">
              <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                <i className="isax isax-location" />
              </span>
              <div>
                <h6 className="mb-0">Address</h6>
                <p className="fs-14 mb-0 text-truncate">
                  877 Ferry Street, Huntsville, Alabama
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                <i className="isax isax-call" />
              </span>
              <div>
                <h6 className="mb-0">Phone</h6>
                <p className="fs-14 mb-0">+1(452) 125-6789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default StudentsDetails