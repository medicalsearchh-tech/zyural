import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Trendingcourse = () => {

    const route = all_routes;
    const [selectedItems, setSelectedItems] = useState(Array(12).fill(false));
    const handleItemClick = (index: number) => {
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems];
        updatedSelectedItems[index] = !updatedSelectedItems[index];
        return updatedSelectedItems;
      });
    };
    const trendingslider = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
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

      const trendingslider2 = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
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

    return (
        <>
            {/* Trending Course */}
            <div className="section trend-course">
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
                    <div
                        className="d-flex align-items-center justify-content-between flex-wrap gap-3 aos"
                        data-aos="fade-up"
                    >
                        <div className="section-header">
                            <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                                What’s New
                            </span>
                            <h2 className="mb-0">Trending Courses</h2>
                        </div>
                        <div>
                            <Link to={route.courseList} className="btn btn-secondary btn-xl">
                                View all Courses
                            </Link>
                        </div>
                    </div>
                    <Slider {...trendingslider}>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-40.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $200 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-27.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>John Michael</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(12)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[12] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Learn JavaScript and Express to become a professional
                                                JavaScript
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>13+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>10hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.0</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-41.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $300 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-22.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>John Smith</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(11)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[11] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Responsive Web Design Essentials HTML5 CSS3 and Bootstrap
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>10+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>11hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.2</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-44.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $100 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-23.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>Lavern M.</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(10)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[10] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                The Complete App Design Course - UX, UI and Design Thinking
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>8+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>8hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.3</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box d-flex aos">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-42.jpg"
                                            />
                                        </Link>
                                        <div className="price combo">
                                            <h3>Free</h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-23.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>John Smith</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(9)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[9] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Build Responsive Real World Websites with HTML5 and CSS3
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="rating-img d-flex align-items-center">
                                                <ImageWithBasePath src="assets/img/icons/icon-3.svg" alt="Img" />
                                                <p>13+ Lesson</p>
                                            </div>
                                            <div className="course-view d-flex align-items-center">
                                                <ImageWithBasePath src="assets/img/icons/icon-4.svg" alt="Img" />
                                                <p>10hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.0</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-44.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $300 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-22.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>John Smith</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(8)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[8] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Responsive Web Design Essentials HTML5 CSS3 and Bootstrap
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>10+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>11hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.5</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-45.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $100 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-24.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>Lavern M.</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(7)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[7] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                The Complete App Design Course - UX, UI and Design Thinking
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>8+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>8hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.0</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="course-box trend-box">
                                <div
                                    className="course-item course-item-three mx-0 flex-fill aos"
                                    data-aos="fade-up"
                                >
                                    <div className="course-img">
                                        <Link to={route.courseDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/course/course-44.jpg"
                                            />
                                        </Link>
                                        <div className="price">
                                            <h3>
                                                $200 <span>$99.00</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="course-content">
                                        <div className="course-user">
                                            <div className="course-user-img">
                                                <Link to={route.instructorProfile}>
                                                    <ImageWithBasePath
                                                        src="assets/img/avatar/avatar-21.jpg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                                <div className="course-name">
                                                    <h4>
                                                        <Link to={route.instructorProfile}>John Michael</Link>
                                                    </h4>
                                                    <p>Instructor</p>
                                                </div>
                                            </div>
                                            <div className="course-share d-flex align-items-center justify-content-center">
                                                <Link to="#" onClick={() => handleItemClick(6)}>
                                                    <i className={`fa-regular fa-heart ${selectedItems[6] ? 'color-active' : ''}`}/>
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="title">
                                            <Link to={route.courseDetails}>
                                                Learn JavaScript and Express to become a professional
                                                JavaScript
                                            </Link>
                                        </h3>
                                        <div className="course-info d-flex align-items-center">
                                            <div className="course-lesson d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-3.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>13+ Lesson</p>
                                            </div>
                                            <div className="course-time d-flex align-items-center">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-4.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                                <p>10hr 30min</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="rating m-0">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                                <span className="d-inline-block average-rating">
                                                    <span>4.0</span> (15)
                                                </span>
                                            </div>
                                            <Link
                                                to={route.courseCheckout}
                                                className="btn btn-primary btn-xl d-inline-flex align-items-center"
                                            >
                                                <i className="isax isax-shopping-cart5 me-2" />
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                    {/* Feature Instructors */}
                    <div className="feature-instructors">
                        <div className="section-header text-center aos" data-aos="fade-up">
                            <h2>Featured Instructor</h2>
                            <p className="mb-0">
                                {" "}
                                Our team combines cutting-edge design with robust development
                            </p>
                        </div>
                        <Slider {...trendingslider2} data-aos="fade-up">
                            <div className="instructor-item instructor-item-two">
                                <div className="instructors-img">
                                    <Link to={route.instructorList} tabIndex={0}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/instructor/instructor-09.jpg"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <span className="verify">
                                            <i className="isax isax-verify5" />
                                        </span>
                                        <Link to={route.courseList} className="course-count ms-auto">
                                            20 Courses
                                        </Link>
                                    </div>
                                    <div className="position-absolute end-0 bottom-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link
                                            to="#"
                                            key={1} className={`favourite ${selectedItems[1] ? 'selected' : ''} ms-auto`} onClick={() => handleItemClick(1)}
                                        >
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="instructor-content">
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>David Lee</Link>
                                    </h3>
                                    <span className="designation">Web Developer</span>
                                    <div className="student-count">
                                        <i className="isax isax-profile-2user5 text-secondary me-2" />
                                        <span>50 Students</span>
                                    </div>
                                </div>
                            </div>
                            <div className="instructor-item instructor-item-two">
                                <div className="instructors-img">
                                    <Link to={route.instructorList} tabIndex={0}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/instructor/instructor-10.jpg"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to={route.courseList} className="course-count ms-auto">
                                            15 Courses
                                        </Link>
                                    </div>
                                    <div className="position-absolute end-0 bottom-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to="#" key={2} className={`favourite ${selectedItems[2] ? 'selected' : ''} ms-auto`} onClick={() => handleItemClick(2)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="instructor-content">
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Daziy Millar</Link>
                                    </h3>
                                    <span className="designation">PHP Expert</span>
                                    <div className="student-count">
                                        <i className="isax isax-profile-2user5 text-warning me-2" />
                                        <span>60 Students</span>
                                    </div>
                                </div>
                            </div>
                            <div className="instructor-item instructor-item-two">
                                <div className="instructors-img">
                                    <Link to={route.instructorList} tabIndex={0}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/instructor/instructor-11.jpg"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <span className="verify">
                                            <i className="isax isax-verify5" />
                                        </span>
                                        <Link to={route.courseList} className="course-count ms-auto">
                                            22 Courses
                                        </Link>
                                    </div>
                                    <div className="position-absolute end-0 bottom-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to="#" key={3} className={`favourite ${selectedItems[3] ? 'selected' : ''} ms-auto`} onClick={() => handleItemClick(3)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="instructor-content">
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Patricia Mendoza</Link>
                                    </h3>
                                    <span className="designation">Web Developer</span>
                                    <div className="student-count">
                                        <i className="isax isax-profile-2user5 text-primary me-2" />
                                        <span>40 Students</span>
                                    </div>
                                </div>
                            </div>
                            <div className="instructor-item instructor-item-two">
                                <div className="instructors-img">
                                    <Link to={route.instructorList} tabIndex={0}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/instructor/instructor-12.jpg"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <span className="verify">
                                            <i className="isax isax-verify5" />
                                        </span>
                                        <Link to={route.courseList} className="course-count ms-auto">
                                            20 Courses
                                        </Link>
                                    </div>
                                    <div className="position-absolute end-0 bottom-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to="#" key={4} className={`favourite ${selectedItems[5] ? 'selected' : ''} ms-auto`} onClick={() => handleItemClick(5)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="instructor-content">
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Skyler Whites</Link>
                                    </h3>
                                    <span className="designation">UI Designer</span>
                                    <div className="student-count">
                                        <i className="isax isax-profile-2user5 text-danger me-2" />
                                        <span>50 Students</span>
                                    </div>
                                </div>
                            </div>
                            <div className="instructor-item instructor-item-two">
                                <div className="instructors-img">
                                    <Link to={route.instructorDetails} tabIndex={0}>
                                        <ImageWithBasePath
                                            className="img-fluid"
                                            alt="Img"
                                            src="assets/img/instructor/instructor-10.jpg"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to={route.courseList} className="course-count ms-auto">
                                            15 Courses
                                        </Link>
                                    </div>
                                    <div className="position-absolute end-0 bottom-0 d-flex align-items-start w-100 z-index-2 p-3">
                                        <Link to="#" key={4} className={`favourite ${selectedItems[4] ? 'selected' : ''} ms-auto`} onClick={() => handleItemClick(4)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="instructor-content">
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Patricia Mendoza</Link>
                                    </h3>
                                    <span className="designation">Web Developer</span>
                                    <div className="student-count">
                                        <i className="isax isax-profile-2user5 text-pink me-2" />
                                        <span>50 Students</span>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                    {/* /Feature Instructors */}
                </div>
            </div>
            {/* /Trending Course */}
        </>

    )
}

export default Trendingcourse
