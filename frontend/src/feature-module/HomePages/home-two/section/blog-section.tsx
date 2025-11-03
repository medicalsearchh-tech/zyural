import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'

const Blogsection = () => {
    const route = all_routes
    return (
        <>
            {/* blog section */}
            <div className="blog-section position-relative">
                <div className="container">
                    <div className="section-header text-center aos" data-aos="fade-up">
                        <span className="section-badge">Blog</span>
                        <h2>Latest Articles &amp; News</h2>
                        <p>
                            Explore curated content to enlighten, entertain and engage global
                            readers.
                        </p>
                    </div>
                    <div className="row row-gap-4 justify-content-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="blog-card aos" data-aos="zoom-in">
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
                                        Learning to code can be overwhelming, but a mentor can make the
                                        journey smoother....
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
                                                <Link to="#" className="fw-medium ms-1">
                                                    Reni Sarow
                                                </Link>
                                            </p>
                                        </div>
                                        <p className="d-flex align-items-center">
                                            <i className="isax isax-calendar-1 text-gray-7" />
                                            09 Aug 2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
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
                                                <Link to="#" className="fw-medium ms-1">
                                                    Chris Daniel
                                                </Link>
                                            </p>
                                        </div>
                                        <p className="d-flex align-items-center">
                                            <i className="isax isax-calendar-1 text-gray-72" />
                                            15 Jul 2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
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
                                                <Link to="#" className="fw-medium ms-1">
                                                    Andrew
                                                </Link>
                                            </p>
                                        </div>
                                        <p className="d-flex align-items-center">
                                            <i className="isax isax-calendar-1 text-gray-7" />
                                            15 Jan 2025
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ImageWithBasePath
                        src="assets/img/bg/feature-bg-02.png"
                        alt="img"
                        className="img-fluid blog-bg-01"
                    />
                </div>
            </div>
            {/* /blog section */}
        </>

    )
}

export default Blogsection
