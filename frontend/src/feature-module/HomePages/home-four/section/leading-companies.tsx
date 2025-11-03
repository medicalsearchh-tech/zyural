import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';

const Leadingcompanies = () => {

    const leadingslider = {
        infinite: true,
        speed: 2000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1170,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 1,
              dots: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              dots: false,
            },
          },
          {
            breakpoint: 0,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: false,
            },
          },
        ],
      };


    return (
        <>
            {/* Leading Companies */}
            <section className="real-reviews-sec">
                <div className="container">
                    <div className="section-header text-center" data-aos="fade-up">
                        <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                            Check out these real reviews
                        </span>
                        <h2>Users love us Don't take it from us</h2>
                        <p>
                            95% of eLearning learners report our hands-on content directly helped
                            their careers.
                        </p>
                    </div>
                    <div className="real-reviews-group">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12" data-aos="fade-up">
                                <div className="reviews-img">
                                    <ImageWithBasePath
                                        src="assets/img/feature/feature-21.jpg"
                                        alt="Img"
                                        className="img-fluid rounded-4"
                                    />
                                    <span className="review-icon">
                                        <ImageWithBasePath src="assets/img/icons/review.svg" alt="img" />
                                    </span>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-md-12" data-aos="fade-up">
                                <div className="owl-carousel real-reviews owl-theme">
                                    <div className="item">
                                        <div className="real-reviews-grid">
                                            <div className="review-content">
                                                <h3>Helps us to improve our productivity</h3>
                                                <p>
                                                    High-definition video is video of higher resolution and
                                                    quality than standard-definition. While there is no
                                                    standardized meaning for high-definition, generally any
                                                    video.High-definition video is video of higher resolution
                                                    and quality than standard-definition. While there is no
                                                    standardized meaning for high-definition, generally any
                                                    video.High-definition video is video of higher resolution
                                                    and quality than standard-definition.
                                                </p>
                                            </div>
                                            <div className="review-top">
                                                <div className="review-info">
                                                    <h5 data-aos="fade-up">William George</h5>
                                                    <h6 data-aos="fade-up">CEO &amp; Chairman</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="real-reviews-grid">
                                            <div className="review-content">
                                                <h3>Helps us to improve our productivity</h3>
                                                <p>
                                                    High-definition video is video of higher resolution and
                                                    quality than standard-definition. While there is no
                                                    standardized meaning for high-definition, generally any
                                                    video.High-definition video is video of higher resolution
                                                    and quality than standard-definition. While there is no
                                                    standardized meaning for high-definition, generally any
                                                    video.
                                                </p>
                                            </div>
                                            <div className="review-top">
                                                <div className="review-info">
                                                    <h5 data-aos="fade-up">Julian Adrose</h5>
                                                    <h6 data-aos="fade-up">Manager</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="owl-nav slide-nav-8 nav-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="client-two-carousel">
                        <Slider {...leadingslider} className="lead-group-slider owl-carousel owl-theme">
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/16.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/17.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/18.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/19.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/20.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="img"
                                        src="assets/img/client/21.svg"
                                    />
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
                <ImageWithBasePath src="assets/img/bg/bg-9.png" alt="img" className="review-bg" />
            </section>
            {/* /Leading Companies */}
        </>

    )
}

export default Leadingcompanies
