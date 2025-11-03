import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Featureinstructors = () => {
    const route = all_routes;
    return (
        <>
            {/* Feature Instructors */}
            <div className="feature-instructors-sec">
                <div className="container">
                    <div className="section-header text-center" data-aos="fade-up">
                        <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                            New Courses
                        </span>
                        <h2>Featured Instructor</h2>
                        <p>
                            95% of eLearning learners report our hands-on content directly helped
                            their careers.
                        </p>
                    </div>
                    {/* Featured Instructor */}
                    <div className="featured-instructor-two">
                        <div className="row">
                            <div
                                className="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                                data-aos="fade-up"
                            >
                                <div className="instructor-item instructor-item-four">
                                    <div className="instructors-img ">
                                        <Link to={route.instructorList} tabIndex={0}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/instructor/instructor-01.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <div className="featured-img">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/category-1.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <Link to="#" className="favourite ms-auto">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="instructor-content">
                                        <h5 className="title">
                                            <Link to={route.instructorDetails}>Julian Adrose</Link>
                                        </h5>
                                        <span className="designation">Angular Expert</span>
                                        <div className="student-count">
                                            <i className="fa-solid fa-user-group me-2" />
                                            <span>50 Students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                                data-aos="fade-up"
                            >
                                <div className="instructor-item instructor-item-four">
                                    <div className="instructors-img ">
                                        <Link to={route.instructorList} tabIndex={0}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/instructor/instructor-02.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <div className="featured-img">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/category-2.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <Link to="#" className="favourite ms-auto">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="instructor-content">
                                        <h5 className="title">
                                            <Link to={route.instructorDetails}>Gallegos</Link>
                                        </h5>
                                        <span className="designation">Angular Expert</span>
                                        <div className="student-count">
                                            <i className="fa-solid fa-user-group me-2" />
                                            <span>70 Students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                                data-aos="fade-up"
                            >
                                <div className="instructor-item instructor-item-four">
                                    <div className="instructors-img ">
                                        <Link to={route.instructorList} tabIndex={0}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/instructor/instructor-03.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <div className="featured-img">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/category-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <Link to="#" className="favourite ms-auto">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="instructor-content">
                                        <h5 className="title">
                                            <Link to={route.instructorDetails}>Kristi</Link>
                                        </h5>
                                        <span className="designation">Node Js</span>
                                        <div className="student-count">
                                            <i className="fa-solid fa-user-group me-2" />
                                            <span>60 Students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xl-3 col-lg-6 col-md-6 col-sm-12"
                                data-aos="fade-up"
                            >
                                <div className="instructor-item instructor-item-four">
                                    <div className="instructors-img ">
                                        <Link to={route.instructorList} tabIndex={0}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/instructor/instructor-04.jpg"
                                            />
                                        </Link>
                                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <div className="featured-img">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/category-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <Link to="#" className="favourite ms-auto">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="instructor-content">
                                        <h5 className="title">
                                            <Link to={route.instructorDetails}>Pinero</Link>
                                        </h5>
                                        <span className="designation">Python</span>
                                        <div className="student-count">
                                            <i className="fa-solid fa-user-group me-2" />
                                            <span>40 Students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Featured Instructor */}
                    {/* View all Category */}
                    <div className="col-lg-12">
                        <div className="more-details text-center" data-aos="fade-up">
                            <Link to={route.instructorList} className="btn btn-secondary btn-xl">
                                View all Instructors
                            </Link>
                        </div>
                    </div>
                    {/* /View all Category */}
                </div>
            </div>
            {/* /Feature Instructors */}
        </>

    )
}

export default Featureinstructors
