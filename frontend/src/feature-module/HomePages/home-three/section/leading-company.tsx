import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';

const Leadingcompany = () => {

    const leadingcompanyslider = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2000,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
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
            <div className="section lead-companies">
                <div className="container">
                    <div className="section-header text-center aos" data-aos="fade-up">
                        <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                            Trusted By
                        </span>
                        <h2 className="mb-0">500+ Leading Universities And Companies</h2>
                    </div>
                    <div className="lead-group aos" data-aos="fade-up">
                        <Slider {...leadingcompanyslider}>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/22.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/23.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/24.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/25.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/26.svg"
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="lead-img">
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/client/27.svg"
                                    />
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
            {/* /Leading Companies */}
        </>

    )
}

export default Leadingcompany
