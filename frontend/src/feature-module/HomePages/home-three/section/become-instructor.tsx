import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Becomeinstructor = () => {
    const route = all_routes
    return (
        <>
            {/* Become An Instructor */}
            <div className="section become-instructors aos" data-aos="fade-up">
                <ImageWithBasePath
                    src="assets/img/bg/bg-5.png"
                    alt=""
                    className="img-fluid become-instructors-bg1"
                />
                <ImageWithBasePath
                    src="assets/img/bg/bg-6.png"
                    alt=""
                    className="img-fluid become-instructors-bg2"
                />
                <div className="container">
                    <div className="row row-gap-3">
                        <div className="col-md-6 d-flex">
                            <div className="student-mentor d-flex flex-fill">
                                <div className="row align-items-center">
                                    <div className="col-lg-7 col-md-12">
                                        <div className="top-instructors">
                                            <h4>Become An Instructor</h4>
                                            <p>
                                                Top instructors from around the world teach millions of
                                                students on Mentoring.
                                            </p>
                                            <Link
                                                to={route.becomeAnInstructor}
                                                className="btn btn-secondary btn-xl"
                                            >
                                                Register as Instructor
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md-12">
                                        <div className="mentor-img">
                                            <ImageWithBasePath
                                                className="img-fluid d-none d-lg-flex"
                                                alt="Img"
                                                src="assets/img/feature/feature-15.svg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex">
                            <div className="student-mentor bg-dark d-flex flex-fill">
                                <div className="row align-items-center">
                                    <div className="col-lg-7 col-md-12">
                                        <div className="top-instructors">
                                            <h4>Transform Access To Education</h4>
                                            <p>
                                                Create an account to receive our newsletter course
                                                promotions.
                                            </p>
                                            <Link
                                                to={route.becomeAnInstructor}
                                                className="btn btn-secondary btn-xl"
                                            >
                                                Register as Instructor
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md-12">
                                        <div className="mentor-img d-none d-lg-flex">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/feature/feature-14.svg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Become An Instructor */}
        </>

    )
}

export default Becomeinstructor
