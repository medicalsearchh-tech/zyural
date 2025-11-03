import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "../../../../../node_modules/swiper/swiper.css";
import "../../../../../node_modules/swiper/modules/effect-cards.css";
import { Link } from 'react-router-dom';
import { all_routes } from '../../../router/all_routes'

const Testimonials = () => {
    const route = all_routes;

    return (
        <>
            {/* Testimonial */}
            <section className="testimonial-three">
                <div className="container">
                    <div className="testimonial-pattern">
                        <ImageWithBasePath
                            className="pattern-left img-fluid"
                            alt="Img"
                            src="assets/img/bg/pattern-05.svg"
                        />
                    </div>
                     <div className="testimonial-three-content">
                        <div className="row align-items-center row-gap-4">
                            <div className="col-xl-6 col-lg-12 col-md-12" data-aos="fade-down">
                                <div className="become-content">
                                    <h2 className="aos-init aos-animate">Trusted by Healthcare Professionals</h2>
                                    <h4 className="aos-init aos-animate">
                                        Join thousands of medical professionals advancing their careers with Zyural's accredited CME/CPD courses
                                    </h4>
                                </div>
                                {/* View all Testimonial */}
                                <Link
                                    to={route.register}
                                    className="btn btn-white aos-init aos-animate"
                                    data-aos="fade-up"
                                >
                                    Start Learning Today
                                </Link>
                                {/* View all Testimonial */}
                            </div>
                            <div className="col-xl-6 col-lg-12 col-md-12" data-aos="fade-down">
                                <div className="swiper-testimonial-three">
                                    <Swiper effect="coverflow"
                                        loop={false}
                                        direction='horizontal'
                                        grabCursor={true}
                                        centeredSlides={true}
                                        slidesPerView="auto"
                                        initialSlide={2}
                                        speed={400}
                                        navigation={{
                                            prevEl: ".slide-prev-btn",
                                            nextEl: ".slide-next-btn",
                                        }}
                                        pagination={{ el: ".swiper-pagination", clickable: true }}
                                        coverflowEffect={{
                                            rotate: 0,
                                            stretch: 0,
                                            depth: 100,
                                            modifier: 10,
                                            slideShadows: true,
                                        }}
                                        modules={[EffectCoverflow, Navigation, Pagination]}
                                        className="swiper-wrapper">

                                        <SwiperSlide >
                                            <div className="swiper-slide">
                                                <div className="testimonial-item-five">
                                                    <div className="testimonial-quote">
                                                        <ImageWithBasePath
                                                            className="quote img-fluid"
                                                            alt="Img"
                                                            src="assets/img/bg/quote.svg"
                                                        />
                                                    </div>
                                                    <div className="testimonial-content">
                                                        <p>
                                                            Zyural has transformed how I manage my CME requirements. 
                                                            The ability to learn at my own pace and only pay for certificates 
                                                            I need is brilliant. The courses are high-quality and the credit 
                                                            tracking makes license renewal stress-free.
                                                        </p>
                                                    </div>
                                                    <div className="testimonial-ratings">
                                                        <div className="rating">
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <p className="d-inline-block">
                                                                5.0<span>rating</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="testimonial-users">
                                                        <div className="imgbx">
                                                            <ImageWithBasePath
                                                                className="img-fluid"
                                                                alt="Img"
                                                                src="assets/img/user/user-01.jpg"
                                                            />
                                                        </div>
                                                        <div className="d-block">
                                                            <h6>Dr. Sarah Mitchell</h6>
                                                            <p>Orthopedic Surgeon</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>


                                        <SwiperSlide>
                                            <div className="swiper-slide">
                                                <div className="testimonial-item-five">
                                                    <div className="testimonial-quote">
                                                        <ImageWithBasePath
                                                            className="quote img-fluid"
                                                            alt="Img"
                                                            src="assets/img/bg/quote.svg"
                                                        />
                                                    </div>
                                                    <div className="testimonial-content">
                                                        <p>
                                                            As a busy cardiologist, finding time for continuing education 
                                                            was always challenging. Zyural's platform lets me access 
                                                            expert-led courses whenever I have time. The free learning 
                                                            model is perfect for exploring new specialties.
                                                        </p>
                                                    </div>
                                                    <div className="testimonial-ratings">
                                                        <div className="rating">
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <p className="d-inline-block">
                                                                5.0<span>rating</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="testimonial-users">
                                                        <div className="imgbx">
                                                            <ImageWithBasePath
                                                                className=""
                                                                alt="Img"
                                                                src="assets/img/user/user-02.jpg"
                                                            />
                                                        </div>
                                                        <div className="d-block">
                                                            <h6>Dr. Michael Chen</h6>
                                                            <p>Interventional Cardiologist</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                        <SwiperSlide>
                                            {/* Swiper Slide */}
                                            <div className="swiper-slide">
                                                <div className="testimonial-item-five">
                                                    <div className="testimonial-quote">
                                                        <ImageWithBasePath
                                                            className="quote img-fluid"
                                                            alt="Img"
                                                            src="assets/img/bg/quote.svg"
                                                        />
                                                    </div>
                                                    <div className="testimonial-content">
                                                        <p>
                                                            I've uploaded three courses on Zyural as an instructor. 
                                                            The review process ensures quality, and the revenue sharing 
                                                            on certificates is fair. It's rewarding to share my expertise 
                                                            while helping colleagues earn their required CPD credits.
                                                        </p>
                                                    </div>
                                                    <div className="testimonial-ratings">
                                                        <div className="rating">
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <i className="fas fa-star filled" />
                                                            <p className="d-inline-block">
                                                                5.0<span>rating</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="testimonial-users">
                                                        <div className="imgbx">
                                                            <ImageWithBasePath
                                                                className=""
                                                                alt="Img"
                                                                src="assets/img/user/user-03.jpg"
                                                            />
                                                        </div>
                                                        <div className="d-block">
                                                            <h6>Dr. Amira Hassan</h6>
                                                            <p>Emergency Medicine Specialist</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* /Swiper Slide */}
                                        </SwiperSlide>
                                    </Swiper>
                                    <div className="testimonial-bottom-nav">
                                        <div className="slide-next-btn testimonial-next-pre">
                                            <i className="fas fa-arrow-left" />
                                        </div>
                                        <div className="slide-prev-btn testimonial-next-pre">
                                            <i className="fas fa-arrow-right" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*/Testimonial */}
        </>

    )
}

export default Testimonials
