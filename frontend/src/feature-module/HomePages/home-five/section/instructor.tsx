import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Instructor = () => {


    const route = all_routes;

    return (
        <>
            <section className="home-five-become">
                <div className="container">
                    <div className="row align-items-center row-gap-4">
                        <div className="col-lg-8 col-md-8" data-aos="fade-up">
                            <div className="become-content-three">
                                <h2>Become An Instructor</h2>
                                <p>
                                    Top instructors from around the world teach millions of students on
                                    Zyural.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4" data-aos="fade-up">
                            <div className="text-end">
                                <Link to={route.register} className="btn btn-white">
                                    Join Our Community
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>

    )
}

export default Instructor
