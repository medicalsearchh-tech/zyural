import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Countertrending = () => {

    const route = all_routes

    const countertrendingslider = {
        dots: true,
        infinite: false,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

    return (
        <>
            {/* counter trending section */}
            <section className="counter-trending-cover">
                <div className="container">
                    <div className="counter-section">
                        <div className="section-header text-center aos" data-aos="fade-up">
                            <h2 className="text-white">Acheive you Goals with Zyural</h2>
                            <p className="text-light">
                                96% of eLearning for Business customers see improved results within
                                six months.
                            </p>
                        </div>
                        <div className="row row-gap-4">
                            <div className="col-md-6 col-lg-3 d-flex">
                                <div
                                    className="counter-item text-center flex-fill"
                                    data-aos="fade-up"
                                >
                                    <h2 className="text-white">253,085</h2>
                                    <p className="text-white">Students Enrolled all over World</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex">
                                <div
                                    className="counter-item text-center flex-fill"
                                    data-aos="fade-up"
                                >
                                    <h2 className="text-white">1,205</h2>
                                    <p className="text-white">Total Courses on our Platform</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex">
                                <div
                                    className="counter-item aos text-center flex-fill"
                                    data-aos="fade-up"
                                >
                                    <h2 className="text-white">56</h2>
                                    <p className="text-white">Countries of Students</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 d-flex">
                                <div
                                    className="counter-item no-border aos text-center flex-fill"
                                    data-aos="fade-up"
                                >
                                    <h2 className="text-white">968</h2>
                                    <p className="text-white">Expert Tutors From Various Fields</p>
                                </div>
                            </div>
                        </div>
                        <ImageWithBasePath
                            src="assets/img/bg/count-icon.png"
                            alt="img"
                            className="img-fluid counter-bg-01 d-none d-lg-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-icon-03.svg"
                            alt="img"
                            className="img-fluid counter-bg-02 d-none d-lg-flex"
                        />
                    </div>
                </div>
                <div className="container position-relative">
                    <div className="trending-instruction">
                        <div className="section-header text-center aos" data-aos="fade-up">
                            <span className="section-badge">Trending Instructors</span>
                            <h2>Top Class &amp; Professional Instructors </h2>
                            <p> Empowering Change: Stories from Those Who Took the Leap</p>
                        </div>
                        <Slider {...countertrendingslider} className="owl-carousel instructor-carousel owl-theme nav-bottom">
                            <div className="item aos" data-aos="flip-right">
                                <div className="instructor-item">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" className="favourite ms-auto">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-img">
                                        <Link to={route.instructorDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-05.jpg"
                                                alt="img"
                                            />
                                            <span className="verify">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/verify-icon.svg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <h3 className="title">
                                            <Link to={route.instructorDetails}>Joyce Pence</Link>
                                        </h3>
                                        <span className="designation">Lead Designer</span>
                                        <p className="rating">
                                            <i className="fas fa-star me-1" />
                                            4.8 (157 Reviews)
                                        </p>
                                        <div className="instructor-social">
                                            <Link to="#">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-x-twitter" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-linkedin" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="instructor-item">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" className="favourite ms-auto">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-img">
                                        <Link to={route.instructorDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-06.jpg"
                                                alt="img"
                                            />
                                            <span className="verify">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/verify-icon.svg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <h3 className="title">
                                            <Link to={route.instructorDetails}>Edith Dorsey</Link>
                                        </h3>
                                        <span className="designation">Accountant</span>
                                        <p className="rating">
                                            <i className="fas fa-star me-1" />
                                            4.9 (20 Reviews)
                                        </p>
                                        <div className="instructor-social">
                                            <Link to="#">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-x-twitter" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-linkedin" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="instructor-item">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" className="favourite ms-auto">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-img">
                                        <Link to={route.instructorDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-07.jpg"
                                                alt="img"
                                            />
                                            <span className="verify">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/verify-icon.svg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <h3 className="title">
                                            <Link to={route.instructorDetails}>Ruben Holmesr</Link>
                                        </h3>
                                        <span className="designation">Architect</span>
                                        <p className="rating">
                                            <i className="fas fa-star me-1" />
                                            4.8 (157 Reviews)
                                        </p>
                                        <div className="instructor-social">
                                            <Link to="#">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-x-twitter" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-linkedin" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="instructor-item">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" className="favourite ms-auto">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-img">
                                        <Link to={route.instructorDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-08.jpg"
                                                alt="img"
                                            />
                                            <span className="verify">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/verify-icon.svg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <h3 className="title">
                                            <Link to={route.instructorDetails}>Carol Magner</Link>
                                        </h3>
                                        <span className="designation">Lead Designer</span>
                                        <p className="rating">
                                            <i className="fas fa-star me-1" />
                                            5.0 (218 Reviews)
                                        </p>
                                        <div className="instructor-social">
                                            <Link to="#">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-x-twitter" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-linkedin" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="instructor-item">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" className="favourite ms-auto">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-img">
                                        <Link to={route.instructorDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-06.jpg"
                                                alt="img"
                                            />
                                            <span className="verify">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/verify-icon.svg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <h3 className="title">
                                            <Link to={route.instructorDetails}>Edith Dorsey</Link>
                                        </h3>
                                        <span className="designation">Accountant</span>
                                        <p className="rating">
                                            <i className="fas fa-star me-1" />
                                            4.9 (20 Reviews)
                                        </p>
                                        <div className="instructor-social">
                                            <Link to="#">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-x-twitter" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link to="#">
                                                <i className="fab fa-linkedin" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
                <ImageWithBasePath
                    src="assets/img/bg/instructor-bg-1.png"
                    alt="img"
                    className="instructor-bg"
                />
            </section>
            {/* /counter trending section */}
        </>

    )
}

export default Countertrending
