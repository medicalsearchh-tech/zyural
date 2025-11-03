import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Latestblog = () => {
    const route = all_routes;
    return (
        <>
            {/* Latest Blog */}
            <section className="latest-blog-three latest-blog-five">
                <div className="container">
                    <div className="section-header text-center" data-aos="fade-up">
                        <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                            Articles &amp; Updates
                        </span>
                        <h2>Our&nbsp;Recent Blog &amp; Articles</h2>
                        <p>
                            Explore curated content to enlighten, entertain and engage global
                            readers.
                        </p>
                    </div>
                    <div className="latest-blog-main">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="event-blog-three blog-three-one" data-aos="fade-up">
                                    <div className="blog-img-three">
                                        <Link to={route.blogGrid}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/blog/blog-35.jpg"
                                            />
                                        </Link>
                                    </div>
                                    <div className="latest-blog-content">
                                        <div className="event-three-title">
                                            <div className="event-span-three d-flex align-items-center">
                                                <span className="category">Lifestyle</span>
                                                <div className="blog-date">
                                                    <i className="fa-solid fa-calendar" />
                                                    <span>09 Aug 2025</span>
                                                </div>
                                            </div>
                                            <Link to={route.blogGrid}>
                                                <h5>Why an LMS is Essential for Modern Education</h5>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="blog-user-top">
                                        <Link to="#">
                                            <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="" />
                                            David Benitez
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div
                                            className="event-blog-three blog-three-one"
                                            data-aos="fade-up"
                                        >
                                            <div className="blog-img-three">
                                                <Link to={route.blogDetails}>
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        alt="Img"
                                                        src="assets/img/blog/blog-36.jpg"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="latest-blog-content">
                                                <div className="event-three-title">
                                                    <div className="event-span-three d-flex align-items-center">
                                                        <span className="category">Productivity</span>
                                                        <div className="blog-date">
                                                            <i className="fa-solid fa-calendar" />{" "}
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <h5>
                                                        <Link to={route.blogGrid}>
                                                            The Impact of LMS on Academic Journey Education
                                                        </Link>
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="" />
                                                    David Benitez
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className="event-blog-three blog-three-one"
                                            data-aos="fade-up"
                                        >
                                            <div className="blog-img-three">
                                                <Link to={route.blogGrid}>
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        alt="Img"
                                                        src="assets/img/blog/blog-38.jpg"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="latest-blog-content">
                                                <div className="event-three-title">
                                                    <div className="event-span-three d-flex align-items-center">
                                                        <span className="category">Productivity</span>
                                                        <div className="blog-date">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <h5>
                                                        <Link to={route.blogGrid}>
                                                            Maximizing Academic Success with the Right LMS
                                                        </Link>
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="" />
                                                    David Benitez
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className="event-blog-three blog-three-one"
                                            data-aos="fade-up"
                                        >
                                            <div className="blog-img-three">
                                                <Link to={route.blogGrid}>
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        alt="Img"
                                                        src="assets/img/blog/blog-37.jpg"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="latest-blog-content">
                                                <div className="event-three-title">
                                                    <div className="event-span-three d-flex align-items-center">
                                                        <span className="category">UI /UX</span>
                                                        <div className="blog-date">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <h5>
                                                        <Link to={route.blogGrid}>
                                                            Promoting Health &amp; Well being in Schools
                                                        </Link>
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="" />
                                                    David Benitez
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className="event-blog-three blog-three-one"
                                            data-aos="fade-up"
                                        >
                                            <div className="blog-img-three">
                                                <Link to={route.blogGrid}>
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        alt="Img"
                                                        src="assets/img/blog/blog-39.jpg"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="latest-blog-content">
                                                <div className="event-three-title">
                                                    <div className="event-span-three d-flex align-items-center">
                                                        <span className="category">Development</span>
                                                        <div className="blog-date">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <h5>
                                                        <Link to={route.blogGrid}>
                                                            How to Build and Run a Pilot Mentoring Program
                                                        </Link>
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="" />
                                                    David Benitez
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Link
                            className="btn btn-view-all"
                            data-aos="fade-up"
                            to={route.blogGrid}
                        >
                            View All Articles
                        </Link>
                    </div>
                </div>
            </section>
            {/* /Latest Blog */}
        </>

    )
}

export default Latestblog
