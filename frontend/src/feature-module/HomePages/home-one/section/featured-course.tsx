import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { all_routes } from '../../../router/all_routes';


const Featuredcourse = () => {

    //Feature Course Slider
    const featurecourseslider = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
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
            {/* featured course */}
            <section className="featured-courses-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                            Featured Courses
                        </span>
                        <h2>What’s New in Zyural</h2>
                        <p>
                            Discover our featured courses, specially curated to help you gain
                            in-demand skills
                        </p>
                    </div>
                    <div className='feature-course-slider-22 top-courses-slider'>
                        <Slider {...featurecourseslider}>
                            
                                <div>
                                    <div className="course-item">
                                        <div className="course-img">
                                            <Link to={route.courseDetails}>
                                                <ImageWithBasePath
                                                    src="assets/img/course/course-36.jpg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                                <span className="price-badge ms-auto">$500</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge badge-md badge-soft-info rounded-pill">
                                                UI/UX
                                            </span>
                                            <Link to="#" className="fav-icon">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                        <div className="pb-3 border-bottom mb-3">
                                            <h5>
                                                <Link to={route.courseDetails}>
                                                    Information About UI/UX Design Degree
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="course-rating">
                                                <span className="course-user">
                                                    <Link to="#">
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-06.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </span>
                                                <Link to="#">Brenda Slaton</Link>
                                            </div>
                                            <div className="d-flex">
                                                <span className="d-flex align-items-center rating">
                                                    <i className="fa-solid fa-star text-warning me-2" />
                                                    5.0
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={route.courseDetails} className="btn buy-course-btn">
                                            Buy Course Now
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="course-item">
                                        <div className="course-img">
                                            <Link to={route.courseDetails}>
                                                <ImageWithBasePath
                                                    src="assets/img/course/course-37.jpg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                                <span className="price-badge ms-auto">$300</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge badge-soft-danger badge-md rounded-pill shadow-none">
                                                Productivity
                                            </span>
                                            <Link to="#" className="fav-icon">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                        <div className="pb-3 border-bottom mb-3">
                                            <h5>
                                                <Link to={route.courseDetails}>
                                                    Learn &amp; Create ReactJS Tech Fundamentals Apps
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="course-rating">
                                                <span className="course-user">
                                                    <Link to="#">
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-07.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </span>
                                                <Link to="#">David Benitez</Link>
                                            </div>
                                            <div className="d-flex">
                                                <span className="d-flex align-items-center rating">
                                                    <i className="fa-solid fa-star text-warning me-2" />
                                                    5.0
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={route.courseDetails} className="btn buy-course-btn">
                                            Buy Course Now
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="course-item">
                                        <div className="course-img">
                                            <Link to={route.courseDetails}>
                                                <ImageWithBasePath
                                                    src="assets/img/course/course-38.jpg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                                <span className="price-badge ms-auto">$350</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge badge-soft-purple badge-md rounded-pill shadow-none">
                                                Management
                                            </span>
                                            <Link to="#" className="fav-icon">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                        <div className="pb-3 border-bottom mb-3">
                                            <h5>
                                                <Link to={route.courseDetails}>
                                                    The Complete Business and Management Course
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="course-rating">
                                                <span className="course-user">
                                                    <Link to="#">
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-08.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </span>
                                                <Link to="#">Calvin Johnsen</Link>
                                            </div>
                                            <div className="d-flex">
                                                <span className="d-flex align-items-center rating">
                                                    <i className="fa-solid fa-star text-warning me-2" />
                                                    5.0
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={route.courseDetails} className="btn buy-course-btn">
                                            Buy Course Now
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="course-item">
                                        <div className="course-img">
                                            <Link to={route.courseDetails}>
                                                <ImageWithBasePath
                                                    src="assets/img/course/course-39.jpg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                                <span className="price-badge ms-auto">$500</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge badge-soft-success badge-md rounded-pill shadow-none">
                                                Art &amp; Media
                                            </span>
                                            <Link to="#" className="fav-icon">
                                                <i className="isax isax-heart5 text-danger" />
                                            </Link>
                                        </div>
                                        <div className="pb-3 border-bottom mb-3">
                                            <h5>
                                                <Link to={route.courseDetails}>
                                                    Build Creative Arts &amp; media Course Completed
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="course-rating">
                                                <span className="course-user">
                                                    <Link to="#">
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-09.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </span>
                                                <Link to="#">David Benitez</Link>
                                            </div>
                                            <div className="d-flex">
                                                <span className="d-flex align-items-center rating">
                                                    <i className="fa-solid fa-star text-warning me-2" />
                                                    5.0
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={route.courseDetails} className="btn buy-course-btn">
                                            Buy Course Now
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="course-item">
                                        <div className="course-img">
                                            <Link to={route.courseDetails2}>
                                                <ImageWithBasePath
                                                    src="assets/img/course/course-37.jpg"
                                                    alt="img"
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                                <span className="price-badge ms-auto">$300</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge badge-soft-danger badge-md rounded-pill shadow-none">
                                                Productivity
                                            </span>
                                            <Link to="#" className="fav-icon">
                                                <i className="isax isax-heart" />
                                            </Link>
                                        </div>
                                        <div className="pb-3 border-bottom mb-3">
                                            <h5>
                                                <Link to={route.courseDetails2}>
                                                    Learn &amp; Create ReactJS Tech Fundamentals Apps
                                                </Link>
                                            </h5>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <div className="course-rating">
                                                <span className="course-user">
                                                    <Link to="#">
                                                        <ImageWithBasePath
                                                            src="assets/img/user/user-07.jpg"
                                                            alt="img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </span>
                                                <Link to="#">David Benitez</Link>
                                            </div>
                                            <div className="d-flex">
                                                <span className="d-flex align-items-center rating">
                                                    <i className="fa-solid fa-star text-warning me-2" />
                                                    5.0
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={route.courseDetails} className="btn buy-course-btn">
                                            Buy Course Now
                                        </Link>
                                    </div>
                                </div>
                        </Slider>


                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <Link to={route.courseList} className="btn btn-primary btn-md">
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>
            {/* /featured course */}
        </>


    )
}

export default Featuredcourse
