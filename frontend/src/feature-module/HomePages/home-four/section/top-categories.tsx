import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Topcategories = () => {
    const route = all_routes
    return (
        <>
            {/* Top Categories */}
            <section className="topcategory-sec">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                            Favourite Course
                        </span>
                        <h2>Top Category</h2>
                        <p>
                            Discover our featured courses, specially curated to help you gain
                            in-demand skills
                        </p>
                    </div>
                    <div className="row">
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-1.svg"
                                        alt="Angular Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>Angular Development</Link>
                                </h5>
                                <p>220 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-9.svg"
                                        alt="Python Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>Nodeman Development</Link>
                                </h5>
                                <p>124 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-icon10.svg"
                                        alt="Node Js Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>Node Js Development</Link>
                                </h5>
                                <p>120 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-11.svg"
                                        alt="PHP Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>AWS Development</Link>
                                </h5>
                                <p>285 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-5.svg"
                                        alt="Docker Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>Strapi CMS</Link>
                                </h5>
                                <p>99 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath
                                        src="assets/img/icons/category-6.svg"
                                        alt="Swift Development"
                                    />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>Swift Development</Link>
                                </h5>
                                <p>64 Instructors</p>
                            </div>
                        </div>
                        <div
                            className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                            data-aos="fade-down"
                        >
                            <div className="categories-item categories-item-four flex-fill">
                                <div className="categories-icon">
                                    <ImageWithBasePath src="assets/img/icons/category-7.svg" alt="Photography" />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>VUE JS Development</Link>
                                </h5>
                                <p>32 Instructors</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex">
                            <div
                                className="categories-item categories-item-four flex-fill"
                                data-aos="fade-up"
                            >
                                <div className="categories-icon">
                                    <ImageWithBasePath src="assets/img/icons/category-8.svg" alt="Business" />
                                </div>
                                <h5 className="title">
                                    <Link to={route.courseCategory}>ApostropheCMS</Link>
                                </h5>
                                <p>21 Instructors</p>
                            </div>
                        </div>
                    </div>
                    {/* View all Category */}
                    <div className="more-details text-center" data-aos="fade-down">
                        <Link to={route.courseCategory3} className="btn btn-secondary btn-xl">
                            View all Category
                        </Link>
                    </div>
                    {/* /View all Category */}
                </div>
            </section>
            {/* /Top Categories */}
        </>

    )
}

export default Topcategories
