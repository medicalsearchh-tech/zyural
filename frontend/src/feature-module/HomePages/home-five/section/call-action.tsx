import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Callaction = () => {


    const route = all_routes;

    return (
        <>
            {/* Call to Action */}
            <section className="home-five-transform">
                <div className="container" data-aos="fade-up">
                    <div className="row align-items-center row-gap-4">
                        <div className="col-lg-9 col-md-8 col-sm-12">
                            <div className="cta-content">
                                <h2>Transform Access To Education</h2>
                                <p>
                                    Create an account to receive our newsletter, course
                                    recommendations and promotions.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12">
                            <div className="transform-button-three">
                                <Link to={route.courseGrid} className="btn btn-secondary">
                                    View all Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Call to Action */}
        </>

    )
}

export default Callaction
