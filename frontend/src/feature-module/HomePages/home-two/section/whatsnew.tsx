import { useState } from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { all_routes } from '../../../router/all_routes';

const Whatsnew = () => {

    const route = all_routes;
    const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
    const handleItemClick = (index: number) => {
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems];
        updatedSelectedItems[index] = !updatedSelectedItems[index];
        return updatedSelectedItems;
      });
    };
    const whatsnewslider = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
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
    
    return (
        <>
            {/* whats new */}
            <div className="feature-section position-relative">
                <div className="container">
                    <ImageWithBasePath
                        src="assets/img/bg/feature-bg-01.png"
                        alt="img"
                        className="bg-star-01 img-fluid"
                    />
                    <ImageWithBasePath
                        src="assets/img/bg/feature-bg-02.png"
                        alt="img"
                        className="bg-star-02 img-fluid"
                    />
                    <div className="section-header text-center aos" data-aos="fade-up">
                        <span className="section-badge">What’s New</span>
                        <h2>Featured Courses</h2>
                        <p>
                            Discover our featured courses, specially curated to help you gain
                            in-demand skills
                        </p>
                    </div>
                    <Slider {...whatsnewslider}>
                        <div className="item">
                            <div className="course-item-two course-item">
                                <div className="course-img">
                                    <Link to={route.courseDetails}>
                                        <ImageWithBasePath
                                            src="assets/img/course/course-22.jpg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" key={1} className={`fav-icon ${selectedItems[1] ? 'selected' : ''}`} onClick={() => handleItemClick(1)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                        <Link to="#" className="brand-icon ms-auto">
                                            <ImageWithBasePath
                                                src="assets/img/icons/course-01.svg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <Link
                                                to={route.instructorDetails}
                                                className="avatar avatar-sm"
                                            >
                                                <ImageWithBasePath
                                                    src="assets/img/user/user-29.jpg"
                                                    alt="img"
                                                    className="img-fluid avatar avatar-sm rounded-circle"
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <Link
                                                    to={route.instructorDetails}
                                                    className="link-default fs-14"
                                                >
                                                    Brenda Slaton
                                                </Link>
                                            </div>
                                        </div>
                                        <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                            Design
                                        </span>
                                    </div>
                                    <h6 className="title mb-2">
                                        <Link to={route.courseDetails}>
                                            Information About UI/UX Design Degree Course
                                        </Link>
                                    </h6>
                                    <p className="d-flex align-items-center mb-3">
                                        <i className="ti ti-star-filled text-warning me-2" />
                                        4.9 (200 Reviews)
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="text-secondary fs-16 fw-semi-bold mb-0">$120</h6>
                                        <Link
                                            to={route.courseCart}
                                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                        >
                                            Add to Cart
                                            <i className="isax isax-arrow-right-3 ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="course-item-two course-item">
                                <div className="course-img">
                                    <Link to={route.courseDetails}>
                                        <ImageWithBasePath
                                            src="assets/img/course/course-23.jpg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" key={2} className={`fav-icon ${selectedItems[2] ? 'selected' : ''}`} onClick={() => handleItemClick(2)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                        <Link to="#" className="brand-icon ms-auto">
                                            <ImageWithBasePath
                                                src="assets/img/icons/course-01.svg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <Link
                                                to={route.instructorDetails}
                                                className="avatar avatar-sm"
                                            >
                                                <ImageWithBasePath
                                                    src="assets/img/user/user-50.jpg"
                                                    alt="img"
                                                    className="img-fluid avatar avatar-sm rounded-circle"
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <Link
                                                    to={route.instructorDetails}
                                                    className="link-default fs-14"
                                                >
                                                    David Benitz
                                                </Link>
                                            </div>
                                        </div>
                                        <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                            Productivity
                                        </span>
                                    </div>
                                    <h6 className="title mb-2">
                                        <Link to={route.courseDetails}>
                                            The Complete Business and Management Course
                                        </Link>
                                    </h6>
                                    <p className="d-flex align-items-center mb-3">
                                        <i className="ti ti-star-filled text-warning me-2" />
                                        5.0 (210 Reviews)
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="text-secondary fs-16 fw-semi-bold mb-0">$168</h6>
                                        <Link
                                            to={route.courseCart}
                                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                        >
                                            Add to Cart
                                            <i className="isax isax-arrow-right-3 ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="course-item-two course-item">
                                <div className="course-img">
                                    <Link to={route.courseDetails}>
                                        <ImageWithBasePath
                                            src="assets/img/course/course-24.jpg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" key={3} className={`fav-icon ${selectedItems[3] ? 'selected' : ''}`} onClick={() => handleItemClick(3)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                        <Link to="#" className="brand-icon ms-auto">
                                            <ImageWithBasePath
                                                src="assets/img/featured-courses/react.svg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <Link
                                                to={route.instructorDetails}
                                                className="avatar avatar-sm"
                                            >
                                                <ImageWithBasePath
                                                    src="assets/img/user/user-23.jpg"
                                                    alt="img"
                                                    className="img-fluid avatar avatar-sm rounded-circle"
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <Link
                                                    to={route.instructorDetails}
                                                    className="link-default fs-14"
                                                >
                                                    Calvin Johnsen
                                                </Link>
                                            </div>
                                        </div>
                                        <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                            Development
                                        </span>
                                    </div>
                                    <h6 className="title mb-2">
                                        <Link to={route.courseDetails}>
                                            Learn &amp; Create ReactJS Tech Fundamentals Apps
                                        </Link>
                                    </h6>
                                    <p className="d-flex align-items-center mb-3">
                                        <i className="ti ti-star-filled text-warning me-2" />
                                        5.0 (154 Reviews)
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="text-secondary fs-16 fw-semi-bold mb-0">$147</h6>
                                        <Link
                                            to={route.courseCart}
                                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                        >
                                            Add to Cart
                                            <i className="isax isax-arrow-right-3 ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="course-item-two course-item">
                                <div className="course-img">
                                    <Link to={route.courseDetails}>
                                        <ImageWithBasePath
                                            src="assets/img/course/course-25.jpg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" key={4} className={`fav-icon ${selectedItems[4] ? 'selected' : ''}`} onClick={() => handleItemClick(4)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                        <Link to="#" className="brand-icon ms-auto">
                                            <ImageWithBasePath
                                                src="assets/img/featured-courses/Clip-path-group.svg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <Link
                                                to={route.instructorDetails}
                                                className="avatar avatar-sm"
                                            >
                                                <ImageWithBasePath
                                                    src="assets/img/user/user-20.jpg"
                                                    alt="img"
                                                    className="img-fluid avatar avatar-sm rounded-circle"
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <Link
                                                    to={route.instructorDetails}
                                                    className="link-default fs-14"
                                                >
                                                    Edith Dorsey
                                                </Link>
                                            </div>
                                        </div>
                                        <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                            Lifestyles
                                        </span>
                                    </div>
                                    <h6 className="title mb-2">
                                        <Link to={route.courseDetails}>
                                            Build Creative Arts &amp; media Course Completed
                                        </Link>
                                    </h6>
                                    <p className="d-flex align-items-center mb-3">
                                        <i className="ti ti-star-filled text-warning me-2" />
                                        4.9 (178 Reviews)
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="text-secondary fs-16 fw-semi-bold mb-0">$190</h6>
                                        <Link
                                            to={route.courseCart}
                                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                        >
                                            Add to Cart
                                            <i className="isax isax-arrow-right-3 ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="course-item-two course-item">
                                <div className="course-img">
                                    <Link to={route.courseDetails}>
                                        <ImageWithBasePath
                                            src="assets/img/course/course-22.jpg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </Link>
                                    <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                        <Link to="#" key={5} className={`fav-icon ${selectedItems[5] ? 'selected' : ''}`} onClick={() => handleItemClick(5)}>
                                            <i className="isax isax-heart" />
                                        </Link>
                                        <Link to="#" className="brand-icon ms-auto">
                                            <ImageWithBasePath
                                                src="assets/img/icons/course-01.svg"
                                                alt="img"
                                                className="img-fluid"
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="course-content">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <Link
                                                to={route.instructorDetails}
                                                className="avatar avatar-sm"
                                            >
                                                <ImageWithBasePath
                                                    src="assets/img/user/user-50.jpg"
                                                    alt="img"
                                                    className="img-fluid avatar avatar-sm rounded-circle"
                                                />
                                            </Link>
                                            <div className="ms-2">
                                                <Link
                                                    to={route.instructorDetails}
                                                    className="link-default fs-14"
                                                >
                                                    David Benitz
                                                </Link>
                                            </div>
                                        </div>
                                        <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                            Productivity
                                        </span>
                                    </div>
                                    <h6 className="title mb-2">
                                        <Link to={route.courseDetails}>
                                            The Complete Business and Management Course
                                        </Link>
                                    </h6>
                                    <p className="d-flex align-items-center mb-3">
                                        <i className="ti ti-star-filled text-warning me-2" />
                                        5.0 (210 Reviews)
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="text-secondary fs-16 fw-semi-bold mb-0">$168</h6>
                                        <Link
                                            to={route.courseCart}
                                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                        >
                                            Add to Cart
                                            <i className="isax isax-arrow-right-3 ms-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
            {/* /whats new */}
        </>

    )
}

export default Whatsnew
