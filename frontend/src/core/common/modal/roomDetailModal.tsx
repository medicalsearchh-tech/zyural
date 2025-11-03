import Slider from "react-slick";
import ImageWithBasePath from '../imageWithBasePath';
import { Link } from 'react-router-dom';

const RoomDetailModal = () => {
    const CustomNextArrow = ({ onClick }: any) => (
        <div className="owl-nav">
        <button type="button" role="presentation" className="owl-next"  onClick={onClick}>
            <i className="fa-solid fa-chevron-right" />
        </button>
        </div>

      );
      
      const CustomPrevArrow = ({ onClick }: any) => (
        <div className="owl-nav">
        <button type="button" role="presentation" className="owl-prev" onClick={onClick}>
            <i className="fa-solid fa-chevron-left" />
        </button>
        </div>
      );
    const sliderForSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 2000,
        autoplay: false,
        swipe: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    
  return (
    <div className="modal fade" id="room-details">
    <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between">
                <h5>Room Details</h5>
                <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                    <i className="ti ti-x fs-16"></i>
                </Link>
            </div>
            <div className="modal-body pb-2">
                <Slider {...sliderForSettings} className="owl-carousel slicknavfor room-slider nav-center mb-4">
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-01.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-02.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-03.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-04.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-05.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                    <div className="service-img">
                        <ImageWithBasePath src="assets/img/hotels/hotel-large-06.jpg" className="img-fluid" alt="Slider Img" />
                    </div>
                </Slider>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    <div>
                        <h5 className="mb-1">Executive Suite 1Bedroom</h5>
                        <div className="d-flex align-items-center">
                            <span className="badge badge-warning badge-xs text-gray-9 fs-13 fw-medium me-2">4.9</span>
                            <p className="fs-14">(380 Reviews)</p>
                        </div>
                    </div>
                    <h5 className="text-primary">$500 <span className="text-default text-decoration-line-through">$654</span> <span className="fs-14 fw-normal text-default">/ Night</span></h5>
                </div>
                <div className="mb-4">
                    <h6 className="mb-2">Description</h6>
                    <p>Our Deluxe King Room offers a spacious and elegantly designed retreat, ideal for both relaxation and productivity. This room features a plush king-sized bed adorned with premium linens, ensuring a restful night's sleep. A large flat-screen TV, high-speed Wi-Fi, and a well-appointed work desk make it perfect for business or leisure.</p>
                </div>
                <div className="mb-3">
                    <h6 className="mb-2">Services</h6>
                    <div className="row">
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Free Luggage Deposit</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Laundry and Ironing Service</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Dry Cleaning Service</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Daily Housekeeping</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i> Check-In/Check-Out Assistance</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Wake-Up Call Service</p>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <h6 className="mb-2">Accessibility</h6>
                    <div className="row">
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Step-Free or Ramped Access</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Visual Alarms in Hallways</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Automatic Doors</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Wheelchair-Accessible Gym</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Wheelchair-Accessible Business Center</p>
                        </div>
                    </div>
                </div>
                <div className="mb-0">
                    <h6 className="mb-2">Amenities</h6>
                    <div className="row">
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Free Wi-Fi</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Air Conditioning</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Heater</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Safe Deposit Box</p>
                            <p className="mb-2 d-flex align-items-center"><i className="isax isax-tick-circle5 text-success me-2"></i>Iron/Ironing Board</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default RoomDetailModal