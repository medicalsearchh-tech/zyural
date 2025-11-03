import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
// import { all_routes } from '../../../router/all_routes'

const Latestblog = () => {

    // const route = all_routes;

    return (
        <>
            {/* Latest Blog */}
            <section className="latest-blog-three">
                <div className="container">
                    <div
                        className="home-five-head section-header-title pb-0"
                        data-aos="fade-up"
                    >
                        <div className="row align-items-center d-flex justify-content-between row-gap-4">
                            <div className="col-lg-6 col-md-8">
                                <h2>Latest News &amp; Events</h2>
                            </div>
                            <div className="col-lg-6 col-md-4">
                                <div className="see-all text-end">
                                    <Link to={"#"}>
                                        View All
                                        <i className="fas fa-arrow-right ms-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="latest-blog-main">
                        <div className="row">
                            <div className="col-lg-4 d-flex">
                                <div className="event-blog-three blog-three-one flex-fill">
                                    <div className="blog-img-three">
                                        <Link to={"#"}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/blog/blog-34.jpg"
                                            />
                                        </Link>
                                    </div>
                                    <div className="latest-blog-content">
                                        <div className="event-three-title">
                                            <div className="event-span-three d-flex align-items-center">
                                                <span className="span-name-three badge-green">
                                                    Lifestyle
                                                </span>
                                                <div className="blog-student-count">
                                                    <i className="fa-solid fa-calendar" />
                                                    <span>09 Aug 2025</span>
                                                </div>
                                            </div>
                                            <Link to={"#"}>
                                                <h5>Why Learning Management Systems Are Transforming Modern Education</h5>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="blog-user-top">
                                        <Link to="#">
                                            <ImageWithBasePath src="assets/img/user/user-02.jpg" alt="" />
                                            David Benitez
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="event-blog-three blog-three-one">
                                            <div className="blog-img-three">
                                                <Link to={"#"}>
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
                                                        <span className="span-name-three badge-green">
                                                            Productivity
                                                        </span>
                                                        <div className="blog-student-count">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <Link to={"#"}>
                                                        <h5>Boosting Learning Outcomes: The Strategic Impact of LMS Implementation</h5>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-02.jpg" alt="" />
                                                    David Benitez
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="event-blog-three blog-three-one">
                                            <div className="blog-img-three">
                                                <Link to={"#"}>
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
                                                        <span className="span-name-three badge-green">
                                                            Productivity
                                                        </span>
                                                        <div className="blog-student-count">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <Link to={"#"}>
                                                        <h5>Maximizing Educational ROI: Choosing the Right LMS Platform</h5>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-08.jpg" alt="" />
                                                    Maria
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="event-blog-three blog-three-one">
                                            <div className="blog-img-three">
                                                <Link to={"#"}>
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
                                                        <span className="span-name-three badge-green">
                                                            UI /UX
                                                        </span>
                                                        <div className="blog-student-count">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <Link to={"#"}>
                                                        <h5>Designing Exceptional Learning Experiences: UI/UX Principles for Education Platforms</h5>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-07.jpg" alt="" />
                                                    Laura
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="event-blog-three blog-three-one">
                                            <div className="blog-img-three">
                                                <Link to={"#"}>
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
                                                        <span className="span-name-three badge-green">
                                                            Development
                                                        </span>
                                                        <div className="blog-student-count">
                                                            <i className="fa-solid fa-calendar" />
                                                            <span>09 Aug 2025</span>
                                                        </div>
                                                    </div>
                                                    <Link to={"#"}>
                                                        <h5>Building Effective Mentorship Programs in Digital Learning Environments</h5>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="blog-user-top">
                                                <Link to="#">
                                                    <ImageWithBasePath src="assets/img/user/user-05.jpg" alt="" />
                                                    Morgon
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Latest Blog */}
        </>

    )
}

export default Latestblog
