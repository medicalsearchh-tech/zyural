import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Aboutus = () => {

    const route = all_routes

    const aboutusslider = {
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 1400,
            settings: { slidesToShow: 2, slidesToScroll: 1 },
          },
          {
            breakpoint: 1200,
            settings: { slidesToShow: 2, slidesToScroll: 1 },
          },
          {
            breakpoint: 992,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
          },
          {
            breakpoint: 768,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
          },
          {
            breakpoint: 576,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
          },
          {
            breakpoint: 0,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
          },
        ],
      };

    return (
        <>
            {/* about us */}
            <div className="about-us">
                <div className="container">
                    <div className="about-us-content">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-lg-7 aos" data-aos="fade-up">
                                <div className="about-us-head aos" data-aos="fade-up">
                                    <h2>What People Say About Us ❤️</h2>
                                    <p>
                                        Read what our satisfied clients have to say about their
                                        experiences with our platform.
                                    </p>
                                </div>
                                <Slider {...aboutusslider}
                                    className="owl-carousel owl-theme nav-bottom"
                                >
                                    <div className="item flex-fill">
                                        <div className="review-item">
                                            <div className="rating">
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                            </div>
                                            <h5 className="title">"Transformed My Career"</h5>
                                            <p>
                                                As an employer, the platform exceeded my expectations. We
                                                swiftly found top-tier talent for our company.
                                            </p>
                                            <div className="d-flex align-items-center review-user">
                                                <div className="me-2">
                                                    <Link to={route.studentsDetails}>
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-06.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <h6 className=" fw-medium">
                                                        <Link to={route.studentsDetails}>Brenda Slaton</Link>
                                                    </h6>
                                                    <p className="mb-0">Designer</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item flex-fill">
                                        <div className="review-item">
                                            <div className="rating">
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                            </div>
                                            <h5 className="title">"Enhanced My Study"</h5>
                                            <p>
                                                The LMS made managing my coursework simple and engaging,
                                                with everything I need easily accessible and organized.
                                            </p>
                                            <div className="d-flex align-items-center review-user">
                                                <div className="me-2">
                                                    <Link to={route.studentsDetails}>
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-12.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <h6 className=" fw-medium">
                                                        <Link to={route.studentsDetails}>Adrian Dennis</Link>
                                                    </h6>
                                                    <p className="mb-0">Designer</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item flex-fill">
                                        <div className="review-item">
                                            <div className="rating">
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                                <span>
                                                    <i className="ti ti-star-filled selected" />
                                                </span>
                                            </div>
                                            <h5 className="title">"Transformed My Career"</h5>
                                            <p>
                                                As an employer, the platform exceeded my expectations. We
                                                swiftly found top-tier talent for our company.
                                            </p>
                                            <div className="d-flex align-items-center review-user">
                                                <div className="me-2">
                                                    <Link to={route.studentsDetails}>
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-06.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <h6 className=" fw-medium">
                                                        <Link to={route.studentsDetails}>Brenda Slaton</Link>
                                                    </h6>
                                                    <p className="mb-0">Designer</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                            <div className="col-lg-5">
                                <div className="img-section">
                                    <ImageWithBasePath
                                        src="assets/img/feature/feature-23.jpg"
                                        alt="img"
                                        className="img-fluid about-img aos"
                                        data-aos="zoom-in"
                                    />
                                    <div
                                        className="enrolled-list-cover d-none d-xl-flex aos"
                                        data-aos="fade-down"
                                    >
                                        <div className="enrolled-list">
                                            <div className="avatar-list-stacked">
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-01.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-35.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-09.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-06.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath src="assets/img/user/user-36.jpg" alt="img" />
                                                </span>
                                            </div>
                                            <p className="mb-0 text-light fw-bold text-center">
                                                <span className="text-secondary">200+ </span>Reviews
                                            </p>
                                        </div>
                                    </div>
                                    <ImageWithBasePath
                                        src="assets/img/bg/arrow.png"
                                        alt="img"
                                        className="img-fluid arrow d-none d-xl-flex"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="apply-role-section">
                        <div className="row row-gap-4">
                            <div className="col-md-6">
                                <div className="role-item aos" data-aos="fade-right">
                                    <div className="row">
                                        <div className="col-xl-6">
                                            <h5 className="mb-2">Become an Instructor</h5>
                                            <p className="mb-4">
                                                Top global instructors teach millions of students on
                                                Mentoring.
                                            </p>
                                            <Link
                                                to={route.becomeAnInstructor}
                                                className="btn btn-primary rounded-pill d-inline-flex align-items-center"
                                            >
                                                Apply Now
                                                <i className="isax isax-arrow-right-3 ms-2" />
                                            </Link>
                                        </div>
                                        <div>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor.png"
                                                alt="img"
                                                className="img-fluid role-img d-none d-xl-flex"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="role-item student-bg aos" data-aos="fade-up">
                                    <div className="row">
                                        <div className="col-xl-6">
                                            <h5 className="mb-2">Become a Student</h5>
                                            <p className="mb-4">
                                                Start your educational journey with us and access a wealth
                                                of resources
                                            </p>
                                            <Link
                                                to={route.studentsList}
                                                className="btn btn-secondary rounded-pill d-inline-flex align-items-center"
                                            >
                                                Enroll Now
                                                <i className="isax isax-arrow-right-3 ms-2" />
                                            </Link>
                                        </div>
                                        <div>
                                            <ImageWithBasePath
                                                src="assets/img/students/student.png"
                                                alt="img"
                                                className="img-fluid role-img d-none d-xl-flex"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ImageWithBasePath
                        src="assets/img/bg/about-bg-01.png"
                        alt="img"
                        className="img-fluid about-bg-01 d-none d-xl-flex"
                    />
                    <ImageWithBasePath
                        src="assets/img/bg/about-bg-02.png"
                        alt="img"
                        className="img-fluid about-bg-02 d-none d-xl-flex"
                    />
                </div>
            </div>
            {/* /about us */}
        </>

    )
}

export default Aboutus
