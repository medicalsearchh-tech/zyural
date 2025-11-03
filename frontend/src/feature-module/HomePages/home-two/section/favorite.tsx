import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { all_routes } from '../../../router/all_routes';

const Favorite = () => {

    const route = all_routes

    const favoriteslider = {
        infinite: true, // loop enabled
        margin: 16,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
        speed: 1000,
        dots: true,
        arrows: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        responsive: [
            {
                breakpoint: 1400,
                settings: { slidesToShow: 6, slidesToScroll: 1 },
            },
            {
                breakpoint: 1200,
                settings: { slidesToShow: 5, slidesToScroll: 1 },
            },
            {
                breakpoint: 992,
                settings: { slidesToShow: 5, slidesToScroll: 1 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3, slidesToScroll: 1 },
            },
            {
                breakpoint: 576,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
                breakpoint: 0,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
        ],
    };

    return (
        <>
            {/* favorite  section */}
            <div className="favorite-course">
                <div className="container">
                    <div className="section-header text-center aos" data-aos="fade-up">
                        <span className="section-badge">Favourite Course</span>
                        <h2>Top Category</h2>
                        <p>
                            The right course, guided by an expert mentor, can provide invaluable
                            insights, practical skills
                        </p>
                    </div>
                    <div className="owl-carousel owl-theme nav-bottom px-1 category-carousel">
                        <Slider {...favoriteslider}>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <span className="categories-img">
                                        <i className="isax isax-archive5 fs-36 text-primary" />
                                    </span>
                                    <h5 className="fw-semi-bold mb-1">
                                        <Link to={route.courseCategory}>Management</Link>
                                    </h5>
                                    <p className="mb-0">156 Courses</p>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <span className="categories-img">
                                        <i className="isax isax-airpod5 fs-36 text-primary" />
                                    </span>
                                    <h5 className="fw-semi-bold mb-1">
                                        <Link to={route.courseCategory} className='text-truncate'>IT &amp; Softwares</Link>
                                    </h5>
                                    <p className="mb-0">214 Courses</p>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <span className="categories-img">
                                        <i className="isax isax-bag-tick-25 fs-36 text-primary" />
                                    </span>
                                    <h5 className="fw-semi-bold mb-1">
                                        <Link to={route.courseCategory}>Marketing</Link>
                                    </h5>
                                    <p className="mb-0">174 Courses</p>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <div className="card-body text-center">
                                        <span className="categories-img">
                                            <i className="isax isax-additem5 fs-36 text-primary" />
                                        </span>
                                        <h5 className="fw-semi-bold mb-1">
                                            <Link to={route.courseCategory}>Productivity</Link>
                                        </h5>
                                        <p className="mb-0">126 Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <div className="card-body text-center">
                                        <span className="categories-img">
                                            <i className="isax isax-dcube5 fs-36 text-primary" />
                                        </span>
                                        <h5 className="fw-semi-bold mb-1">
                                            <Link to={route.courseCategory}>Lifestyles</Link>
                                        </h5>
                                        <p className="mb-0">214 Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <div className="card-body text-center">
                                        <span className="categories-img">
                                            <i className="isax isax-bezier5 fs-36 text-primary" />
                                        </span>
                                        <h5 className="fw-semi-bold mb-1">
                                            <Link to={route.courseCategory}>Design</Link>
                                        </h5>
                                        <p className="mb-0">161 Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="item aos" data-aos="flip-right">
                                <div className="categories-item">
                                    <div className="card-body text-center">
                                        <span className="categories-img">
                                            <i className="isax isax-bag-tick-25 fs-36 text-primary" />
                                        </span>
                                        <h5 className="fw-semi-bold mb-1">
                                            <Link to={route.courseCategory}>Marketing</Link>
                                        </h5>
                                        <p className="mb-0">174 Courses</p>
                                    </div>
                                </div>
                            </div>
                        </Slider>

                    </div>
                </div>
                <ImageWithBasePath src="assets/img/bg/category-bg-1.png" alt="img" className="bg-01" />
            </div>
            {/* /favorite  section */}
        </>

    )
}

export default Favorite
