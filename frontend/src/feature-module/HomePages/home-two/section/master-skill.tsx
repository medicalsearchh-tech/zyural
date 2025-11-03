import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Masterskill = () => {
    const route = all_routes
    return (
        <>
            {/* master skill */}
            <div className="skill-section">
                <div className="container">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6 col-xl-7">
                            <div className="skill-image">
                                <div className="row position-relative">
                                    <ImageWithBasePath
                                        src="assets/img/bg/book-bg.png"
                                        alt="img"
                                        className="img-fluid img-04 d-none d-xl-flex"
                                    />
                                    <ImageWithBasePath
                                        src="assets/img/icons/icon-31.png"
                                        alt="img"
                                        className="img-fluid img-05 d-none d-xl-flex"
                                    />
                                    <div className="col-md-6 d-flex">
                                        <div className="flex-fill">
                                            <ImageWithBasePath
                                                src="assets/img/feature/feature-26.jpg"
                                                alt="img"
                                                className="img-fluid flex-fill img-01 aos"
                                                data-aos="fade-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <ImageWithBasePath
                                                src="assets/img/feature/feature-27.jpg"
                                                alt="img"
                                                className="img-fluid img-02 aos"
                                                data-aos="fade-down"
                                            />
                                        </div>
                                        <div>
                                            <ImageWithBasePath
                                                src="assets/img/feature/feature-28.jpg"
                                                alt="img"
                                                className="img-fluid img-03 aos"
                                                data-aos="fade-up"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-5 aos" data-aos="fade-up">
                            <div className="skill-content">
                                <h2>Master the Skills To Drive Your Career</h2>
                                <p>
                                    Get certified, master modern tech skills, and level up your career
                                    whether you’re starting out or a seasoned pro. 95% of eLearning
                                    learners report our hands-on content directly helped their
                                    careers.
                                </p>
                                <div className="skill-list mb-4">
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Access Your Class anywhere
                                    </p>
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Flexible Course Plan
                                    </p>
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Quality Assurance
                                    </p>
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Cost-Effectiveness
                                    </p>
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        The Most World Class Instructors
                                    </p>
                                    <p className="d-flex align-items-center">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Quality Assurance
                                    </p>
                                </div>
                                <Link
                                    to={route.courseList}
                                    className="btn btn-dark btn-xl rounded-pill d-inline-flex align-items-center"
                                >
                                    Get Started
                                    <i className="isax isax-arrow-right-3 ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /master skill */}
        </>

    )
}

export default Masterskill
