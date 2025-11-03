import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Knowledge = () => {
    const route = all_routes
    return (
        <>
            {/* Share Knowledge */}
            <div className="section share-knowledge">
                <div className="home-three-sec-bg">
                    <ImageWithBasePath
                        src="assets/img/bg/bg-3.png"
                        alt="img"
                        className="img-fluid sec-bg-01"
                    />
                    <ImageWithBasePath
                        src="assets/img/bg/bg-4.png"
                        alt="img"
                        className="img-fluid sec-bg-02"
                    />
                </div>
                <div className="container">
                    <div className="row align-items-center row-gap-4">
                        <div className="col-md-6">
                            <div className="knowledge-img aos" data-aos="fade-up">
                                <ImageWithBasePath
                                    src="assets/img/feature/feature-17.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center">
                            <div className="join-mentor aos" data-aos="fade-up">
                                <h2>Want to share your knowledge? Join us a Mentor</h2>
                                <p>
                                    High-definition video is video of higher resolution and quality
                                    than standard-definition. While there is no standardized meaning
                                    for high-definition, generally any video.
                                </p>
                                <ul className="list-unstyled mb-4">
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Access Your Class anywhere
                                    </li>
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Flexible Course Plan
                                    </li>
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Quality Assurance
                                    </li>
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        Cost Effectiveness
                                    </li>
                                    <li className="d-flex mb-3">
                                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                                        The Most World Class Instructors
                                    </li>
                                </ul>
                                <div>
                                    <Link
                                        to={route.instructorList}
                                        className="btn btn-secondary btn-xl"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Share Knowledge */}
        </>

    )
}

export default Knowledge
