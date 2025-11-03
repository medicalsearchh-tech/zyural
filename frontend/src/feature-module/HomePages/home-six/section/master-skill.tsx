import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Masterskill = () => {
    const route = all_routes;
    return (
        <>
            {/* Master the skills Five */}
            <section className="master-section-five">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-12" data-aos="fade-down">
                            <div className="section-five-sub">
                                <div className="header-five-title mb-4">
                                    <h2>Master the skills to drive your career</h2>
                                </div>
                                <div className="career-five-content">
                                    <p data-aos="fade-down">
                                        Get certified, master modern tech skills, and level up your
                                        career — whether you’re starting out or a seasoned pro. 95% of
                                        eLearning learners report our hands-on earning learners report
                                        our hands-on{" "}
                                    </p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Link to={route.courseList} className="btn btn-primary me-2">
                                        Join Course
                                    </Link>
                                    <Link to={route.courseList} className="btn btn-secondary">
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="row align-items-center">
                                <div className="col-lg-6 col-sm-6" data-aos="fade-down">
                                    <div className="skill-five-item">
                                        <div className="skill-five-icon bg-success">
                                            <ImageWithBasePath
                                                src="assets/img/icon/skill-01.svg"
                                                alt="Stay motivated"
                                            />
                                        </div>
                                        <div className="skill-five-content">
                                            <h3>Stay motivated with engaging instructors</h3>
                                            <p>
                                                eLearning learners report our hands-on content directly
                                                helped their careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6" data-aos="fade-down">
                                    <div className="skill-five-item">
                                        <div className="skill-five-icon bg-skyblue">
                                            <ImageWithBasePath
                                                src="assets/img/icon/skill-02.svg"
                                                alt="Stay motivated"
                                            />
                                        </div>
                                        <div className="skill-five-content">
                                            <h3>Keep up with in the latest in cloud</h3>
                                            <p>
                                                eLearning learners report our hands-on content directly
                                                helped their careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6" data-aos="fade-down">
                                    <div className="skill-five-item">
                                        <div className="skill-five-icon bg-danger">
                                            <ImageWithBasePath
                                                src="assets/img/icon/skill-03.svg"
                                                alt="Stay motivated"
                                            />
                                        </div>
                                        <div className="skill-five-content">
                                            <h3>Get certified with 100+ certification courses</h3>
                                            <p>
                                                eLearning learners report our hands-on content directly
                                                helped their careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6" data-aos="fade-down">
                                    <div className="skill-five-item">
                                        <div className="skill-five-icon bg-info">
                                            <ImageWithBasePath
                                                src="assets/img/icon/skill-04.svg"
                                                alt="Stay motivated"
                                            />
                                        </div>
                                        <div className="skill-five-content">
                                            <h3>Build skills your way, from labs to courses</h3>
                                            <p>
                                                eLearning learners report our hands-on content directly
                                                helped their careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Master the skills Five */}
        </>

    )
}

export default Masterskill
