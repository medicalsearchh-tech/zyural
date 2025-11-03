import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';

const Clinet = () => {

    //Client Slider
    const clientslider = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 4,
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
            {/* client */}
            <div className="cliets-section-one">
                <Slider {...clientslider} className="brand-slide">
                    <div>
                        <ImageWithBasePath src="assets/img/client/08.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/09.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/10.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/11.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/12.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/13.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/08.svg" alt="img" />
                    </div>
                    <div>
                        <ImageWithBasePath src="assets/img/client/09.svg" alt="img" />
                    </div>
                </Slider>
            </div>
            {/* /client */}
        </>

    )
}

export default Clinet
