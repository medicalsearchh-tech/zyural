import React from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import CustomSelect from '../../../../core/common/commonSelect'
import { BannerSelect } from '../../../../core/common/selectOption/json/selectOption'
import { Link, useNavigate } from 'react-router-dom'
import Slider from 'react-slick'
import { all_routes } from '../../../router/all_routes'

const Banner = () => {
    const route = all_routes
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        const Path = route.courseList; 
        navigate(Path);
      };
    const bannerslider = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            {/* Home Banner */}
            <section className="home-slide-five">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-5 col-lg-6 col-12">
                            <div className="home-slide-five-face" data-aos="fade-down">
                                {/* Banner Text */}
                                <div className="home-slide-five-text">
                                    <span className="text-warning d-inline-flex fw-semibold text-uppercase mb-3">
                                        The Leader in Online Learning
                                    </span>
                                    <h1 className="text-white mb-4">
                                        Engaging &amp; Accessible Online Courses For All
                                    </h1>
                                    <p className="text-white fs-lg text-center text-md-start pb-2 pb-md-3 mb-4">
                                        Trusted by over 15K Users worldwide since 2022
                                    </p>
                                </div>
                                {/* /Banner Text */}
                                {/* banner Seach Category */}
                                <div className="banner-content-five">
                                    <form onSubmit={handleSubmit} className="form">
                                        <div className="form-inner-five">
                                            <div className="input-group">
                                                {/* Slect Category */}
                                                <span className="drop-detail-five">
                                                    <CustomSelect
                                                        options={BannerSelect}
                                                        className="select d-flex"
                                                        placeholder="Select"
                                                        defaultValue={BannerSelect[1]}
                                                    />
                                                </span>
                                                {/* Slect Category */}
                                                {/* Search */}
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Search for Courses, Instructors"
                                                />
                                                {/* Search */}
                                                {/* Submit Button */}
                                                <button className="btn btn-primary sub-btn" type="submit">
                                                    <span>
                                                        <i className="fa-solid fa-magnifying-glass" />
                                                    </span>
                                                </button>
                                                {/* Submit Button */}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                {/* /banner Seach Category */}
                                {/* Review and Experience */}
                                <div className="review-five-group">
                                    <div className="review-user-five  d-flex align-items-center">
                                        <ul className="review-users-list">
                                            <li>
                                                <Link
                                                    to="#"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title=""
                                                    data-bs-original-title="leader 1"
                                                >
                                                    <ImageWithBasePath src="assets/img/user/user-01.jpg" alt="img" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="#"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title=""
                                                    data-bs-original-title="leader 2"
                                                >
                                                    <ImageWithBasePath src="assets/img/user/user-02.jpg" alt="img" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="#"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title=""
                                                    data-bs-original-title="leader 3"
                                                >
                                                    <ImageWithBasePath src="assets/img/user/user-03.jpg" alt="img" />
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="review-rating-five">
                                            <div className="rating-star">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <p>4.9 / 200 Review</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Review and Experience */}
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-6 col-12">
                            <div className="banner-six-img">
                                <div className="row">
                                    <div className="col-lg-6 align-self-end">
                                        <div className="ban-img-1" data-aos="fade-up">
                                            <ImageWithBasePath src="./assets/img/hero/hero-7.png" alt="img" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="ban-img-2" data-aos="fade-down">
                                            <ImageWithBasePath
                                                className="ban-shape2"
                                                data-aos="fade-down"
                                                data-aos-delay={250}
                                                src="./assets/img/shapes/dot-group.png"
                                                alt="img"
                                            />
                                            <ImageWithBasePath
                                                className="ban-shape3"
                                                data-aos="fade-down"
                                                data-aos-delay={300}
                                                src="./assets/img/banner/ban-shape-2.svg"
                                                alt="img"
                                            />
                                            <ImageWithBasePath
                                                className="ban-shape4"
                                                data-aos="fade-down"
                                                data-aos-delay={350}
                                                src="./assets/img/banner/ban-shape-3.svg"
                                                alt="img"
                                            />
                                            <ImageWithBasePath src="./assets/img/hero/hero-8.png" alt="img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="vector-shapes-five d-none d-lg-flex">
                        <ImageWithBasePath src="assets/img/bg/banner-vector.svg" alt="Img" />
                    </div>
                </div>
            </section>
            {/* /Home Banner */}
            {/* Leading Companies */}
            <section className="leading-section-five">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-4 col-md-6" data-aos="fade-down">
                            <div className="leading-five-content course-count">
                                <h3 className="mb-2">
                                    Trusted By <span className="counterUp">500</span>+
                                </h3>
                                <p>Leading Universities And Companies</p>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-6" data-aos="fade-down">
                            <div className="lead-group-five">
                                <Slider {...bannerslider} className="leading-slider-five">
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-28.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-29.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-30.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-31.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-32.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-30.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="lead-img">
                                            <ImageWithBasePath
                                                className="img-fluid"
                                                alt="Img"
                                                src="assets/img/client/client-31.svg"
                                            />
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Leading Companies */}
        </>

    )
}

export default Banner
