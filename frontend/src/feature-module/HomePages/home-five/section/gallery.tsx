import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Gallery = () => {

    const route =all_routes;

    return (
        <section className="gallery-three">
            <ImageWithBasePath
                className="gallery-bg d-none d-lg-flex"
                src="assets/img/shapes/shape-11.svg"
                alt="img"
            />
            <div className="container">
                <div className="home-five-head section-header-title" data-aos="fade-up">
                    <div className="row align-items-center d-flex justify-content-between row-gap-4">
                        <div className="col-lg-6 col-sm-12">
                            <h2>Courses Taught by Real Instructor</h2>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="see-all text-end">
                                <Link to={route.instructorList}>
                                    View all
                                    <i className="fas fa-arrow-right ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="courses-gallery-three">
                    <div className="row">
                        {/* Col */}
                        <div className="col-lg-5 col-md-5">
                            <div className="row">
                                <div className="col-lg-7 col-md-7 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-13.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>David</Link>
                                                    </h6>
                                                    <p>Angular Js</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-14.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Maria</Link>
                                                    </h6>
                                                    <p>Node Js</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-15.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Richardson</Link>
                                                    </h6>
                                                    <p>React Js</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-7 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-16.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Patricia</Link>
                                                    </h6>
                                                    <p>Vue Js</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Col */}
                        {/* Col */}
                        <div className="col-lg-3 col-md-3 d-flex">
                            <div className="instructor-item instructor-item-five">
                                <div className="instructors-img">
                                    <ImageWithBasePath src="assets/img/gallery/gallery-5.jpg" alt="Instructor" />
                                </div>
                                <div className="instructor-overlay">
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to="#" className="favourite">
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                    <div className="instructor-content">
                                        <div>
                                            <h6>
                                                <Link to={route.instructorGrid}>Hendriques</Link>
                                            </h6>
                                            <p>Python Developer</p>
                                        </div>
                                        <div>
                                            <Link to={route.instructorGrid} className="view-link">
                                                <i className="fas fa-arrow-right" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Col */}
                        {/* Col */}
                        <div className="col-lg-4 col-md-4 d-flex">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-17.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Laura</Link>
                                                    </h6>
                                                    <p>UI/UX Designer</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-18.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Morgon</Link>
                                                    </h6>
                                                    <p>Node Js</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex">
                                    <div className="instructor-item instructor-item-five">
                                        <div className="instructors-img">
                                            <ImageWithBasePath
                                                src="assets/img/instructor/instructor-19.jpg"
                                                alt="Instructor"
                                            />
                                        </div>
                                        <div className="instructor-overlay">
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                                <Link to="#" className="favourite">
                                                    <i className="isax isax-heart" />
                                                </Link>
                                            </div>
                                            <div className="instructor-content">
                                                <div>
                                                    <h6>
                                                        <Link to={route.instructorGrid}>Brook</Link>
                                                    </h6>
                                                    <p>PHP Developer</p>
                                                </div>
                                                <div>
                                                    <Link to={route.instructorGrid} className="view-link">
                                                        <i className="fas fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Col */}
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Gallery
