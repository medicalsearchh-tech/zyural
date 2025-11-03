import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Feature = () => {

   const route = all_routes;

    return (
        <>
            {/* Feature Course */}
            <section className="featured-courses-sec">
                <div className="patter-bg">
                    <ImageWithBasePath className="patter-one" src="assets/img/bg/bg-13.png" alt="Img" />
                </div>
                <div className="container">
                    <div className="section-header text-center">
                        <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                            What’s New
                        </span>
                        <h2>Featured Courses</h2>
                        <p>
                            Get certified, master modern tech skills, and level up your career
                        </p>
                    </div>
                    <div className="featured-courses-two">
                        <div className="row">
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-10.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                PHP
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">203 reviews</span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                The Complete Web Developer PHP framework Course 2.0
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    Emily Williams
                                                </Link>
                                            </p>
                                            <p className="course-level">Expert</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                6hr 30min
                                            </p>
                                            <h5 className="price">
                                                $400 <span>$99.00</span>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-11.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                Self Improvements
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">5.0 (22 Reviews)</span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Building Your Personal Brand: Tips for Career Success
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    Brook Salaine
                                                </Link>
                                            </p>
                                            <p className="course-level text-warning">Intermediate</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                1hr 20min
                                            </p>
                                            <h5 className="price">$125</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-12.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                Finance
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">4.0 (15 Reviwes) </span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Strength Training 101: Building a Solid Foundation
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    Mark Richardson
                                                </Link>
                                            </p>
                                            <p className="course-level text-purple">Basic</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                2hr 30min
                                            </p>
                                            <h5 className="price">$3560</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-13.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                SEO
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">203 reviews</span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Digital Marketing Strategies for Business Growth
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    Laura Bennett
                                                </Link>
                                            </p>
                                            <p className="course-level text-purple">Basic</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                6hr 30min
                                            </p>
                                            <h5 className="price">
                                                $350 <span>$699.00</span>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-14.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                Development
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">5.0 (05 Reviews)</span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Web Development for Beginners: HTML, CSS, and JavaScript
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    David Morgan
                                                </Link>
                                            </p>
                                            <p className="course-level">Expert</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                1hr 15min
                                            </p>
                                            <h5 className="price">$150</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                            {/* Featured Courses */}
                            <div
                                className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex"
                                data-aos="fade-down"
                            >
                                <div className="course-item course-item-four mx-0">
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-15.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <Link to="#" className="course-name">
                                                PHP
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="rating">
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <span className="ms-2">203 reviews</span>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Photography Basics: Understanding Composition and Lighting
                                            </Link>
                                        </h3>
                                        <div className="user-info">
                                            <p className="user-name">
                                                <Link to={route.instructorDetails} className="link-info">
                                                    Maria Lopez
                                                </Link>
                                            </p>
                                            <p className="course-level text-pink">Advanced</p>
                                        </div>
                                        <div className="course-info">
                                            <p className="course-time">
                                                <i className="fa-regular fa-clock me-2" />
                                                2hr 40min
                                            </p>
                                            <h5 className="price">$250</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Featured Courses */}
                        </div>
                    </div>
                    {/* View all  Courses */}
                    <div className="col-lg-12" data-aos="fade-up">
                        <div className="more-details text-center">
                            <Link to={route.courseList} className="btn btn-secondary btn-xl">
                                View all Courses{" "}
                            </Link>
                        </div>
                    </div>
                    {/* /View all  Courses */}
                </div>
            </section>
            {/* /Feature Course */}
        </>

    )
}

export default Feature
