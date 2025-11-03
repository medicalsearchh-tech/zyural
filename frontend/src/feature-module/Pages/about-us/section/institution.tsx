import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import Slider from "react-slick";

const Institution = () => {
    const institutionslider = {
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1800, // The delay before the next slide
        speed: 3000, // Speed of the sliding animation
        arrows: false,
        responsive: [
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 6,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2
            }
          }
        ]
      };
    
  return (
    <>
      <>
        {/* institutions */}
        <section className="client-section">
          <div className="container">
            <h6 className="fw-medium text-center mb-4">
              Trusted by{" "}
              <span className="text-decoration-underline text-secondary">
                20+
              </span>{" "}
              Institutions Around the World
            </h6>
            <Slider {...institutionslider} className="institutions-slider lazy slider">
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/01.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/02.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/03.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/04.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/05.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/06.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/07.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/02.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/03.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/04.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/05.svg"
                  alt="img"
                />
              </div>
              <div className="institutions-items p-1">
                <ImageWithBasePath
                  className="img-fluid"
                  src="./assets/img/client/06.svg"
                  alt="img"
                />
              </div>
            </Slider>
          </div>
        </section>
        {/* institutions */}
      </>
    </>
  );
};

export default Institution;
