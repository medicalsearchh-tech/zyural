import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';

const Testimonials = () => {

    const testimonialslider = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        speed: 3000,
        arrows: false,
      };

    return (
        <>
            {/* Testimonials */}
            <section className="testimonial-section-five">
                <ImageWithBasePath
                    src="./assets/img/shapes/quote.png"
                    className="d-none d-lg-flex testimonials-quote"
                    alt="Img"
                />
                <div className="container">
                    <div className="header-five-title text-center" data-aos="fade-down">
                        <h2 className="text-light">Testimonials</h2>
                        <p className="text-white">
                            We are a very happy because we have a happy customer{" "}
                        </p>
                    </div>
                    <div className="testimonial-slider-five">
                        <Slider {...testimonialslider}>
                            <div className="testimonial-carousel">
                                <div className="testimonial-item-six">
                                    <div className="testimonial-content-five">
                                        <div className="testimonial-text">
                                            <h5 className="mb-3">
                                                Exactly what I was looking for. You will not regret it. It
                                                really saves me time and effort. Skill is what our business
                                                lacked."
                                            </h5>
                                            <p className="mb-3">
                                                Thank you very much for your help. This is exactly what I
                                                was looking for. You will not regret it. It really saves me
                                                time and effort. Skill is what our business lacked. Thank
                                                you very much for your help. This is exactly what I was
                                                look.
                                            </p>
                                        </div>
                                        <div className="testimonial-users-group d-flex align-items-center justify-content-between">
                                            <div className="testimonial-users">
                                                <h5 className="mb-1">Hawkins</h5>
                                                <p>UI-UX Designer</p>
                                            </div>
                                            <div className="testimonial-ratings-five d-inline-flex align-items-center">
                                                <div className="rating">
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="testimonial-image">
                                        <ImageWithBasePath
                                            src="assets/img/testimonial/testimonials-1.png"
                                            alt="Img"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-carousel">
                                <div className="testimonial-item-six">
                                    <div className="testimonial-content-five">
                                        <div className="testimonial-text">
                                            <p className="mb-3">
                                                "Thank you very much for your help. This is exactly what I
                                                was looking for. You will not regret it. It really saves me
                                                time and effort. Skill is what our business lacked. Thank
                                                you very much for your help. This is exactly what I was
                                                looking for. You will not regret it. It really saves me time
                                                and effort. Skill is what our business lacked."
                                            </p>
                                        </div>
                                        <div className="testimonial-users-group d-flex align-items-center justify-content-between">
                                            <div className="testimonial-users">
                                                <h5 className="mb-1">Nikolas Brooten</h5>
                                                <p>Sales Manager</p>
                                            </div>
                                            <div className="testimonial-ratings-five d-inline-flex align-items-center">
                                                <div className="rating">
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="testimonial-image">
                                        <ImageWithBasePath
                                            src="assets/img/testimonial/testimonial-02.png"
                                            alt="Img"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-carousel">
                                <div className="testimonial-item-six">
                                    <div className="testimonial-content-five">
                                        <div className="testimonial-text">
                                            <p className="mb-3">
                                                "Thank you very much for your help. This is exactly what I
                                                was looking for. You will not regret it. It really saves me
                                                time and effort. Skill is what our business lacked. Thank
                                                you very much for your help. This is exactly what I was
                                                looking for. You will not regret it. It really saves me time
                                                and effort. Skill is what our business lacked."
                                            </p>
                                        </div>
                                        <div className="testimonial-users-group d-flex align-items-center justify-content-between">
                                            <div className="testimonial-users">
                                                <h5 className="mb-1">Nikolas Brooten</h5>
                                                <p>Sales Manager</p>
                                            </div>
                                            <div className="testimonial-ratings-five d-inline-flex align-items-center">
                                                <div className="rating">
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                    <i className="fas fa-star filled" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="testimonial-image">
                                        <ImageWithBasePath
                                            src="assets/img/testimonial/testimonial-03.png"
                                            alt="Img"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>
            {/* /Testimonials */}
        </>

    )
}

export default Testimonials
