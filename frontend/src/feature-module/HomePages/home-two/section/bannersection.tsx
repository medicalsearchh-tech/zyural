import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Bannersection = () => {
    return (
        <div>
                {/* Banner section */}
                <div className="banner-section-two">
                    <div className="container position-relative">
                        <ImageWithBasePath
                            src="assets/img/banner/star-01.png"
                            alt="img"
                            className="img-fluid star-01"
                        />
                        <ImageWithBasePath
                            src="assets/img/banner/star-02.png"
                            alt="img"
                            className="img-fluid star-02"
                        />
                        <ImageWithBasePath
                            src="assets/img/banner/star-03.png"
                            alt="img"
                            className="img-fluid star-03"
                        />
                        <ImageWithBasePath
                            src="assets/img/banner/star-04.png"
                            alt="img"
                            className="img-fluid star-04"
                        />
                        <ImageWithBasePath
                            src="assets/img/banner/star-05.png"
                            alt="img"
                            className="img-fluid star-05"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-book.svg"
                            alt="img"
                            className="img-fluid star-06 d-none d-xl-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-icon-03.svg"
                            alt="img"
                            className="img-fluid star-07 d-none d-xl-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-icon-01.svg"
                            alt="img"
                            className="img-fluid star-08 d-none d-xl-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-icon-02.svg"
                            alt="img"
                            className="img-fluid star-09 d-none d-xl-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/icons/banner-icon-04.svg"
                            alt="img"
                            className="img-fluid star-10 d-none d-xl-flex"
                        />
                        <ImageWithBasePath
                            src="assets/img/banner/soft-star.png"
                            alt="img"
                            className="img-fluid star-11 d-none d-xl-flex"
                        />
                        <div className="row align-items-end">
                            <div className="col-lg-6">
                                <div className="d-flex align-items-center position-relative banner-content">
                                    <div className="aos" data-aos="zoom-in">
                                        <div className="banner-info">
                                            <span className="d-inline-flex fw-semibold text-uppercase mb-3">
                                                The Leader in Online Learning
                                            </span>
                                            <h1 className="mb-4">
                                                Engaging &amp; Accessible{" "}
                                                <span className="position-relative banner-title">
                                                    Online{" "}
                                                    <ImageWithBasePath
                                                        src="assets/img/banner/banner-text-bg.png"
                                                        alt="img"
                                                        className="img-fluid position-absolute title-bg"
                                                    />
                                                </span>{" "}
                                                Courses For All
                                            </h1>
                                            <div className="banner-form">
                                                <div className="d-sm-flex align-items-center">
                                                    <div className="dropdown">
                                                        <Link to="#"
                                                            className="btn dropdown-toggle d-flex align-items-center"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="isax isax-book me-2" />
                                                            Category
                                                        </Link>
                                                        <ul className="dropdown-menu p-2">
                                                            <li>
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center p-2"
                                                                    to="#"
                                                                >
                                                                    Design
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center p-2"
                                                                    to="#"
                                                                >
                                                                    Marketing
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center p-2"
                                                                    to="#"
                                                                >
                                                                    Framer Developer
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    className="dropdown-item d-flex align-items-center p-2"
                                                                    to="#"
                                                                >
                                                                    Figma Developer
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <span>
                                                        <input
                                                            type="text"
                                                            placeholder="Search Courses, Instructors"
                                                            className="form-control border-0"
                                                        />
                                                    </span>
                                                </div>
                                                <Link to={all_routes.courseList} className="rounded-pill btn btn-primary btn-xl">
                                                    Search
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="d-sm-flex align-items-center">
                                            {/* Rating star and content */}
                                            <div className="ms-sm-3 mt-2 mt-sm-0">
                                                {/* Star */}
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item me-0">
                                                        <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                        <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                        <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                        <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                        <i className="fas fa-star-half-alt text-warning" />
                                                    </li>
                                                    <li className="list-inline-item heading-color fw-bold me-0">
                                                        4.5 / 5.0
                                                    </li>
                                                </ul>
                                                <small>From 500+ reviews</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="banner-img-section">
                                    <ImageWithBasePath
                                        src="assets/img/banner/banner-bg-01.png"
                                        alt="img"
                                        className="img-fluid banner-bg-01 d-none d-xl-flex aos"
                                        data-aos="fade-up"
                                        data-aos-easing="linear"
                                        data-aos-duration={500}
                                    />
                                    <ImageWithBasePath
                                        src="assets/img/banner/banner-bg-02.png"
                                        alt="img"
                                        className="img-fluid banner-bg-02 d-none d-xl-flex aos"
                                        data-aos="fade-up"
                                        data-aos-easing="linear"
                                        data-aos-duration={600}
                                    />
                                    <ImageWithBasePath
                                        src="assets/img/hero/hero-1.png"
                                        alt="img"
                                        className="img-fluid banner-bg-03 aos"
                                        data-aos="fade-up"
                                        data-aos-easing="linear"
                                        data-aos-duration={900}
                                    />
                                    <div className="enrolled-list-cover aos" data-aos="fade-down">
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
                                                        src="assets/img/user/user-03.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-07.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath
                                                        className="border border-white"
                                                        src="assets/img/user/user-08.jpg"
                                                        alt="img"
                                                    />
                                                </span>
                                                <span className="avatar avatar-rounded">
                                                    <ImageWithBasePath src="assets/img/user/user-06.jpg" alt="img" />
                                                </span>
                                            </div>
                                            <p className="mb-0">
                                                <span className="text-secondary">35K+</span> Students Enrolled
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="course-count d-inline-flex align-items-center aos"
                                        data-aos="fade-down"
                                    >
                                        <span className="counter-icon">
                                            <i className="ti ti-list-details" />
                                        </span>
                                        <div>
                                            <h4 className="text-white">50+</h4>
                                            <p className="text-light mb-0">Courses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Banner section */}
        </div>
    )
}

export default Bannersection
