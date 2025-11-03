import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { all_routes } from '../../../router/all_routes'

const Trendingcourse = () => {

    const trendingslider = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };


      const route = all_routes;

    return (
        <>
            {/* Trending Courses  Three */}
            <section className="home-five-trending">
                <div className="container">
                    <div className="row">
                        <div className="home-five-head section-header-title" data-aos="fade-up">
                            <div className="row align-items-center d-flex justify-content-between row-gap-4">
                                <div className="col-md-6">
                                    <h2>Most Trending Courses</h2>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="see-all text-end">
                                        <Link to={route.courseGrid}>
                                            View All
                                            <i className="fas fa-arrow-right ms-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Slider {...trendingslider} data-aos="fade-up">
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-one">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>SEO, Marketing</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Digital Marketing Strategies for Successfull Business Growth
                                            </Link>
                                        </h3>
                                        <p>
                                            Navigating the Tech World: The Ultimate Guide to Finding an IT
                                            Mentor
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath
                                                src="assets/img/icon/student-icon.svg"
                                                alt="student-icon"
                                            />
                                            <p>400 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>6hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$300</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-two">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>Personalised Learning</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Starting Your Own Business: From Idea to Launch
                                            </Link>
                                        </h3>
                                        <p>
                                            Learn how mentorship can help guide your decision-making
                                            process
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath src="assets/img/icon/student-icon.svg" alt="Img" />
                                            <p>900 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>9hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$800</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-02.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-three">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>Finance</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Financial Literacy: Managing Your Money for Long-Term Growth
                                            </Link>
                                        </h3>
                                        <p>
                                            The tech industry is vast and ever-changing, but a mentor can
                                            help
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath src="assets/img/icon/student-icon.svg" alt="Img" />
                                            <p>400 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>6hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$300</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-03.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-four">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>Business Management</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                The Complete Web Developer PHP framework Course 2.0
                                            </Link>
                                        </h3>
                                        <p>
                                            Scaling a business requires more than just hard work—it
                                            requires
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath src="assets/img/icon/student-icon.svg" alt="Img" />
                                            <p>900 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>4hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$200</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-04.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-one">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>SEO, Marketing</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Digital Marketing Strategies for Successfull Business Growth
                                            </Link>
                                        </h3>
                                        <p>
                                            The tech industry is vast and ever-changing, but a mentor can
                                            help
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath
                                                src="assets/img/icon/student-icon.svg"
                                                alt="student-icon"
                                            />
                                            <p>400 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>6hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$300</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-05.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-two">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>Personalised Learning</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Financial Literacy: Managing Your Money for Long-Term
                                            </Link>
                                        </h3>
                                        <p>
                                            Learn how mentorship can help guide your decision-making
                                            process{" "}
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath src="assets/img/icon/student-icon.svg" alt="Img" />
                                            <p>900 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>9hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$800</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-06.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                            {/* Carousel Item */}
                            <div className="trending-three-item">
                                <div className="trending-content-top trending-bg-three">
                                    <div className="course-title-one">
                                        <Link to={route.courseGrid}>Finance</Link>
                                    </div>
                                    <div className="trending-three-text">
                                        <h3 className="title instructor-text">
                                            <Link to={route.courseGrid}>
                                                Financial Literacy: Managing Your Money for Long-Term
                                            </Link>
                                        </h3>
                                        <p>
                                            The tech industry is vast and ever-changing, but a mentor can
                                            help
                                        </p>
                                    </div>
                                    <div className="trending-counts-info d-flex align-items-center justify-content-between">
                                        <div className="trending-three-counts d-flex align-items-center">
                                            <ImageWithBasePath src="assets/img/icon/student-icon.svg" alt="Img" />
                                            <p>400 Students</p>
                                        </div>
                                        <div className="price-three-time d-inline-flex align-items-center">
                                            <i className="fa-regular fa-clock me-2" />
                                            <span>6hr 30min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-content-footer">
                                    <div className="trending-price-group d-flex align-items-center justify-content-between">
                                        <div className="trending-group-view">
                                            <div className="trending-price-three">
                                                <h3>$300</h3>
                                            </div>
                                        </div>
                                        <div className="trending-footer-img">
                                            <Link to={route.courseGrid}>
                                                <ImageWithBasePath src="assets/img/user/user-07.jpg" alt="img" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Carousel Item */}
                        </Slider>
                    </div>
                    {/* /Favourite Course */}
                </div>
            </section>
            {/* Feature Course */}
        </>

    )
}

export default Trendingcourse
