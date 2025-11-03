import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { all_routes } from '../../../router/all_routes'

const Latestblog = () => {
    const route = all_routes
    return (
        <>
            {/* Latest Blogs */}
            <section className="blogs-section-five bg-white">
                <div className="container">
                    <div
                        className="section-header section-header-six text-center"
                        data-aos="fade-down"
                    >
                        <h2>Latest Blogs</h2>
                        <p>Follow the latest and most useful articles on that student's blog</p>
                    </div>
                    <div className="home-five-blog">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="blog-card">
                                    <div className="blog-img">
                                        <Link to={route.blogDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/blog/blog-22.jpg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                    <div className="blog-content">
                                        <h5>
                                            <Link to={route.blogDetails}>
                                                Mastering Programming with a Technical Mentor
                                            </Link>
                                        </h5>
                                        <p>
                                            Learning to code can be overwhelming, but a mentor can make
                                            the journey smoother....
                                        </p>
                                        <div className="blog-user d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <Link to="#" className="avatar me-2">
                                                    <ImageWithBasePath
                                                        src="assets/img/user/user-42.jpg"
                                                        alt="img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <p className="mb-0 d-flex align-items-center">
                                                    by{" "}
                                                    <Link
                                                        to="#"
                                                        className="link-info text-decoration-underline ms-1"
                                                    >
                                                        Reni Sarow
                                                    </Link>
                                                </p>
                                            </div>
                                            <p className="d-flex align-items-center">
                                                <i className="isax isax-calendar-1 text-gray-7 me-2" />
                                                09 Aug 2025
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="blog-card">
                                    <div className="blog-img">
                                        <Link to={route.blogDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/blog/blog-23.jpg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                    <div className="blog-content">
                                        <h5>
                                            <Link to={route.blogDetails}>
                                                How to Level Up Your Coding Skills with the Help of a Mentor
                                            </Link>
                                        </h5>
                                        <p>
                                            Whether you're a beginner or an advanced coder, this blog will
                                            explore how....
                                        </p>
                                        <div className="blog-user d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <Link to="#" className="avatar me-2">
                                                    <ImageWithBasePath
                                                        src="assets/img/user/user-36.jpg"
                                                        alt="img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <p className="mb-0 d-flex align-items-center">
                                                    by{" "}
                                                    <Link
                                                        to="#"
                                                        className="link-info text-decoration-underline ms-1"
                                                    >
                                                        Chris Daniel
                                                    </Link>
                                                </p>
                                            </div>
                                            <p className="d-flex align-items-center">
                                                <i className="isax isax-calendar-1 text-gray-7 me-2" />
                                                15 Jul 2025
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="blog-card">
                                    <div className="blog-img">
                                        <Link to={route.blogDetails}>
                                            <ImageWithBasePath
                                                src="assets/img/blog/blog-24.jpg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                    <div className="blog-content">
                                        <h5>
                                            <Link to={route.blogDetails}>
                                                Navigating the Tech World: The Ultimate Guide
                                            </Link>
                                        </h5>
                                        <p>
                                            {" "}
                                            The tech industry is vast and ever-changing, but a mentor can
                                            help you stay ahead.....
                                        </p>
                                        <div className="blog-user d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <Link to="#" className="avatar me-2">
                                                    <ImageWithBasePath
                                                        src="assets/img/user/user-53.jpg"
                                                        alt="img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <p className="mb-0 d-flex align-items-center">
                                                    by{" "}
                                                    <Link
                                                        to="#"
                                                        className="link-info text-decoration-underline ms-1"
                                                    >
                                                        Andrew
                                                    </Link>
                                                </p>
                                            </div>
                                            <p className="d-flex align-items-center">
                                                <i className="isax isax-calendar-1 text-gray-7 me-2" />
                                                15 Jan 2025
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <Link to={route.blogGrid2} className="btn btn-xl btn-primary mt-3">
                                See More Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Latest Blogs */}
        </>

    )
}

export default Latestblog
