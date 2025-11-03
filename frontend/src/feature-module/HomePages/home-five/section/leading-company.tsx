import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick'

const Leadingcompany = () => {

    //Leading Company Slider
    const leadingslider = {
        infinite: true,
        speed: 2000,
        autoplay: false,
        slidesToShow: 6,
        slidesToScroll: 1,
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
            <section className="lead-companies-three">
                <div className="container">
                    <div className="home-five-head section-header-title aos-init aos-animate">
                        <div className="row align-items-center d-flex justify-content-between">
                            <div className="col-lg-12" data-aos="fade-up">
                                <h2>500+ Leading Universities And Companies</h2>
                            </div>
                        </div>
                    </div>
                    <div className="m-0 p-0 lead-group aos" data-aos="fade-up">
                        <Slider {...leadingslider} className="lead-group-slider owl-carousel owl-theme">
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-33.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-34.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-35.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-36.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-37.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/client-38.svg"
                                    />
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>
            {/* /Leading Companies */}
        </>

    )
}

export default Leadingcompany
