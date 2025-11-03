import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import { all_routes } from '../../../router/all_routes';
import { Link } from 'react-router-dom';

const Testimonials = () => {

    //Testimonial Slider
    const testimonialslider = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: false,
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
            {/* testimonials */}
            <div className="testimonials-section testimonials-sec-one text-center">
                <div className="container">
                    <div className="section-header text-center" data-aos="fade-up">
                        <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                            Featured Instructors
                        </span>
                        <h2>Top Class &amp; Professional Instructors</h2>
                        <p>Words from Those Who’ve Experienced Real Growth</p>
                    </div>
                    <Slider {...testimonialslider} className="testimonials-slider lazy mt-4">
                        <div>
                            <div
                                className="testimonials-item rounded-3 bg-white"
                                data-aos="flip-right"
                            >
                                <div className="position-relative d-inline-flex">
                                    <div className="avatar rounded-circle avatar-xxl border border-white border-3">
                                        <Link to={route.studentsDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid rounded-circle"
                                                src="./assets/img/user/user-41.jpg"
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                    <i className="isax isax-quote-up5 bg-secondary quote rounded-pill fs-16 p-1" />
                                </div>
                                <h6 className="mb-1">
                                    <Link to={route.studentsDetails}>Brenda Slaton</Link>
                                </h6>
                                <p className="designation">Designer</p>
                                <p className="mb-3 text-truncate line-clamb-2">
                                    This mentor helped me understand concepts that I had been
                                    struggling with for weeks.
                                </p>
                                <div>
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                className="testimonials-item rounded-3 bg-white"
                                data-aos="flip-right"
                            >
                                <div className="position-relative d-inline-flex">
                                    <div className="avatar rounded-circle avatar-xxl border border-white border-3">
                                        <Link to={route.studentsDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid rounded-circle"
                                                src="./assets/img/user/user-42.jpg"
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                    <i className="isax isax-quote-up5 bg-secondary quote rounded-pill fs-16 p-1" />
                                </div>
                                <h6 className="mb-1">
                                    <Link to={route.studentsDetails}>Adrian Dennis</Link>
                                </h6>
                                <p className="designation">Developer</p>
                                <p className="mb-3 text-truncate line-clamb-2">
                                    I’ve learned so much from my mentor’s personal experience.
                                </p>
                                <div>
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div
                                className="testimonials-item rounded-3 bg-white"
                                data-aos="flip-right"
                            >
                                <div className="position-relative d-inline-flex">
                                    <div className="avatar rounded-circle avatar-xxl border border-white border-3">
                                        <Link to={route.studentsDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid rounded-circle"
                                                src="./assets/img/user/user-43.jpg"
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                    <i className="isax isax-quote-up5 bg-secondary quote rounded-pill fs-16 p-1" />
                                </div>
                                <h6 className="mb-1">
                                    <Link to={route.studentsDetails}>Adrian Coztanza</Link>
                                </h6>
                                <p className="designation">Architect</p>
                                <p className="mb-3 text-truncate line-clamb-2">
                                    The advice was useful, but I wish my mentor had been more
                                    available for follow-up discussions.
                                </p>
                                <div>
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="testimonials-item rounded-3 bg-white">
                                <div className="position-relative d-inline-flex">
                                    <div className="avatar rounded-circle avatar-xxl border border-white border-3">
                                        <Link to={route.studentsDetails}>
                                            <ImageWithBasePath
                                                className="img-fluid rounded-circle"
                                                src="./assets/img/user/user-43.jpg"
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                    <i className="isax isax-quote-up5 bg-secondary quote rounded-pill fs-16 p-1" />
                                </div>
                                <h6 className="mb-1">
                                    <Link to={route.studentsDetails}>Adrian Coztanza</Link>
                                </h6>
                                <p className="designation">Architect</p>
                                <p className="mb-3 text-truncate line-clamb-2">
                                    The advice was useful, but I wish my mentor had been more
                                    available for follow-up discussions.
                                </p>
                                <div>
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                    <i className="fa-solid fa-star text-warning" />
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
            {/* testimonials */}
        </>

    )
}

export default Testimonials
