import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';


const Testimonial = () => {


    const testimonialslider = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
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

      const route = all_routes;

    return (
        <>
            {/* Say testimonial Four */}
            <div className="testimonial-four">
                <div className="review">
                    <div className="container">
                        <div className="section-header text-center aos" data-aos="fade-up">
                            <span className="fw-medium text-white fs-18 fw-bold mb-2 d-inline-block">
                                Check out these real reviews
                            </span>
                            <h2 className="text-white mb-0">
                                Users-love-us Don't take it from us.
                            </h2>
                        </div>
                        <Slider {...testimonialslider}
                            className="mentor-testimonial lazy slider aos"
                            data-aos="fade-up"
                            data-sizes="50vw "
                        >
                            <div className="d-flex justify-content-center">
                                <div className="testimonial-all">
                                    <div className="testimonial-quotes">
                                        <ImageWithBasePath src="assets/img/icons/icon-28.png" alt="Img" />
                                    </div>
                                    <div className="testimonial-content text-center align-items-center d-flex">
                                        <div className="testimonial-info ">
                                            <div className="testimonial-icon">
                                                <ImageWithBasePath src="assets/img/icons/icon-29.png" alt="Img" />
                                            </div>
                                            <p>
                                                I really appreciated my mentor’s insight, but sometimes I felt
                                                overwhelmed by the amount of information they provided. It
                                                would have been helpful to focus on one or two areas at a time
                                                rather than trying to cover everything.
                                            </p>
                                            <div className="testimonial-user">
                                                <div className="user-img">
                                                    <Link to={route.instructorProfile}>
                                                        <ImageWithBasePath
                                                            src="assets/img/avatar/avatar-21.jpg"
                                                            alt="Img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <h6>
                                                    <Link to={route.instructorProfile}>Daziy Millar</Link>
                                                </h6>
                                                <span>Founder of Awesomeux Technology</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <div className="testimonial-all">
                                    <div className="testimonial-quotes">
                                        <ImageWithBasePath src="assets/img/icons/icon-28.png" alt="Img" />
                                    </div>
                                    <div className="testimonial-content text-center align-items-center d-flex">
                                        <div className="testimonial-info ">
                                            <div className="testimonial-icon">
                                                <ImageWithBasePath src="assets/img/icons/icon-29.png" alt="Img" />
                                            </div>
                                            <p>
                                                I really appreciated my mentor’s insight, but sometimes I felt
                                                overwhelmed by the amount of information they provided. It
                                                would have been helpful to focus on one or two areas at a time
                                                rather than trying to cover everything.
                                            </p>
                                            <div className="testimonial-user">
                                                <div className="user-img">
                                                    <Link to={route.instructorProfile}>
                                                        <ImageWithBasePath
                                                            src="assets/img/avatar/avatar-23.jpg"
                                                            alt="Img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <h6>
                                                    <Link to={route.instructorProfile}>john smith</Link>
                                                </h6>
                                                <span>Founder of Awesomeux Technology</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <div className="testimonial-all">
                                    <div className="testimonial-quotes">
                                        <ImageWithBasePath src="assets/img/icons/icon-28.png" alt="Img" />
                                    </div>
                                    <div className="testimonial-content text-center align-items-center d-flex">
                                        <div className="testimonial-info ">
                                            <div className="testimonial-icon">
                                                <ImageWithBasePath src="assets/img/icons/icon-29.png" alt="Img" />
                                            </div>
                                            <p>
                                                I really appreciated my mentor’s insight, but sometimes I felt
                                                overwhelmed by the amount of information they provided. It
                                                would have been helpful to focus on one or two areas at a time
                                                rather than trying to cover everything.
                                            </p>
                                            <div className="testimonial-user">
                                                <div className="user-img">
                                                    <Link to={route.instructorProfile}>
                                                        <ImageWithBasePath
                                                            src="assets/img/avatar/avatar-22.jpg"
                                                            alt="Img"
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <h6>
                                                    <Link to={route.instructorProfile}>David Lee</Link>
                                                </h6>
                                                <span>Founder of Awesomeux Technology</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>

            {/* /Say testimonial Four */}
        </>

    )
}

export default Testimonial
