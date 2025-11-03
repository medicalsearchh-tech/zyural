import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { all_routes } from '../../../router/all_routes'

const Knowledge = () => {
    const route = all_routes
    return (
        <>
            {/* Share your knowledge */}
            <section className="share-knowledge-five">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-12" data-aos="fade-down">
                            <div className="section-five-sub">
                                <div className="header-five-title mb-0">
                                    <h2>Want to share your knowledge? Join us a Mentor</h2>
                                </div>
                                <div className="career-five-content">
                                    <p>
                                        High-definition video is video of higher resolution and quality
                                        than standard-definition.{" "}
                                    </p>
                                </div>
                                <ul className="list-unstyled heading-color mb-4">
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Access Your Class anywhere
                                    </li>
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Flexible Course Plan
                                    </li>
                                    <li className="d-flex mb-3 aos-init aos-animate">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Quality Assurance
                                    </li>
                                    <li className="d-flex mb-3 aos-init aos-animate">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Cost Effectiveness
                                    </li>
                                    <li className="d-flex mb-3 aos-init aos-animate">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        The Most World Class Instructors
                                    </li>
                                </ul>
                                <Link to={route.courseList} className="btn btn-primary">
                                    Start Teaching Today
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12" data-aos="fade-down">
                            <div className="joing-count-five text-center">
                                <div className="joing-count-image">
                                    <ImageWithBasePath src="assets/img/feature/feature-7.png" alt="Img" />
                                    <ImageWithBasePath
                                        src="./assets/img/shapes/dot-2.svg"
                                        alt="img"
                                        className="joing-count-img1"
                                    />
                                    <ImageWithBasePath
                                        src="./assets/img/shapes/half-circle.svg"
                                        alt="img"
                                        className="joing-count-img2"
                                    />
                                </div>
                                <div className="joing-count-five-one course-count">
                                    <h3 className="joing-count-number">
                                        <span className="counterUp"> <CountUp end={55}/> </span>K<span>+</span>
                                    </h3>
                                    <p className="joing-count-text">Courses</p>
                                </div>
                                <div className="joing-count-five-two course-count">
                                    <h3 className="joing-count-number">
                                        <span className="counterUp"><CountUp end={50}/></span>K
                                    </h3>
                                    <p className="joing-count-text">Appreciations</p>
                                </div>
                                <div className="joing-count-five-three course-count">
                                    <h3 className="joing-count-number">
                                        <span className="counterUp"><CountUp end={100}/></span>
                                    </h3>
                                    <p className="joing-count-text">Countries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Share your knowledge */}
        </>

    )
}

export default Knowledge
