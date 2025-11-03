import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Latestblog = () => {

    const latestblogslider = {
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: false,
        speed: 3000,
        arrows: false,
        responsive: [
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 1,
              infinite: true,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      };
      const route = all_routes

    return (
        <>
            {/* Latest Blog */}
            <div className="section latest-blog">
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
                    <div className="section-header text-center aos" data-aos="fade-up">
                        <h2>Latest Blogs</h2>
                        <p className="mb-0">
                            Dont Miss Stay Updated with the Latest Articles and Insights
                        </p>
                    </div>
                    <div className="row row-gap-4 justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="blog-wrap shadow-sm mb-0">
                                <div className="blog-img">
                                    <Link to={route.blogGrid}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/blog/blog-40.jpg"
                                        />
                                    </Link>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-info mb-3">
                                        <Link to="#" className="blog-category">
                                            Marketing
                                        </Link>
                                        <p className="blog-date">
                                            <i className="isax isax-calendar-1" />
                                            May 15, 2020
                                        </p>
                                    </div>
                                    <h5>
                                        <Link to={route.blogGrid}>
                                            How to Find the Perfect Mentor for Your Academic Journey
                                        </Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="blog-wrap shadow-sm mb-0">
                                <div className="blog-img">
                                    <Link to={route.blogGrid}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/blog/blog-41.jpg"
                                        />
                                    </Link>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-info mb-3">
                                        <Link to="#" className="blog-category">
                                            Statistics
                                        </Link>
                                        <p className="blog-date">
                                            <i className="isax isax-calendar-1" />
                                            May 15, 2020
                                        </p>
                                    </div>
                                    <h5>
                                        <Link to={route.blogGrid}>
                                            Unlocking Your Potential in School and Beyond
                                        </Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="blog-wrap shadow-sm mb-0">
                                <div className="blog-img">
                                    <Link to={route.blogGrid}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/blog/blog-42.jpg"
                                        />
                                    </Link>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-info mb-3">
                                        <Link to="#" className="blog-category">
                                            Learning
                                        </Link>
                                        <p className="blog-date">
                                            <i className="isax isax-calendar-1" />
                                            May 15, 2020
                                        </p>
                                    </div>
                                    <h5>
                                        <Link to={route.blogGrid}>
                                            11 Tips to Help You Get New Clients with the design knowledge
                                        </Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="enroll-group aos" data-aos="fade-up">
                        <div className="row row-gap-3 justify-content-center">
                            <div className="col-lg-4 col-md-6">
                                <div className="enroll-course d-flex align-items-center">
                                    <div className="enroll-img">
                                        <ImageWithBasePath
                                            src="assets/img/icons/icon-5.svg"
                                            alt="Img"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="course-count">
                                        <h3>
                                            <span className="counterUp">3,490</span>
                                        </h3>
                                        <p>Students Enrolled</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="enroll-course d-flex align-items-center">
                                    <div className="enroll-img ">
                                        <ImageWithBasePath
                                            src="assets/img/icons/icon-6.svg"
                                            alt="Img"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="course-count">
                                        <h3>
                                            <span className="counterUp">255</span>
                                        </h3>
                                        <p>Total Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="enroll-course d-flex align-items-center">
                                    <div className="enroll-img ">
                                        <ImageWithBasePath
                                            src="assets/img/icons/icon-7.svg"
                                            alt="Img"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="course-count">
                                        <h3>
                                            <span className="counterUp">15</span>
                                        </h3>
                                        <p>Countries</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lab-course">
                        <Slider {...latestblogslider}>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-8.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-9.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-10.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-11.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-12.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-13.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-14.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                            <div>
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-15.svg"
                                    alt="Img"
                                    className="img-fluid"
                                />
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
            {/* /Latest Blog */}
        </>

    )
}

export default Latestblog
