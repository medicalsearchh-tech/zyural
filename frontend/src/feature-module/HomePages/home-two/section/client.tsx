import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';

const Client = () => {

    //Client Slider
    const clientslider = {
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 3000,
        autoplayHoverPause: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1400,
            settings: { slidesToShow: 6, slidesToScroll: 1 },
          },
          {
            breakpoint: 1200,
            settings: { slidesToShow: 6, slidesToScroll: 1 },
          },
          {
            breakpoint: 992,
            settings: { slidesToShow: 4, slidesToScroll: 1 },
          },
          {
            breakpoint: 768,
            settings: { slidesToShow: 4, slidesToScroll: 1 },
          },
          {
            breakpoint: 576,
            settings: { slidesToShow: 3, slidesToScroll: 1 },
          },
          {
            breakpoint: 0,
            settings: { slidesToShow: 2, slidesToScroll: 1 },
          },
        ],
      };

    return (
        <>
            {/* client */}
            <div className="cliets-section">
                <div>
                    <Slider {...clientslider} className="owl-carousel owl-theme brand-carousel">
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/08.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/09.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/10.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/11.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/12.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/13.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/14.svg" alt="img" />
                        </div>
                        <div className="item">
                            <ImageWithBasePath src="assets/img/client/15.svg" alt="img" />
                        </div>
                    </Slider>
                </div>
            </div>
            {/* /client */}
        </>

    )
}

export default Client
