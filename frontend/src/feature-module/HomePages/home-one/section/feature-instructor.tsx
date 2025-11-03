import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Featureinstructor = () => {

    const route = all_routes

    //Feature Instuctor SLider
    const featurinstructorslider = {
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows:false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: false,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

    return (
        <>
            {/* featured instructor */}
            <div className="featured-instructor-sec">
                <div className="container">
                    <div className="section-header text-center" data-aos="fade-up">
                        <span className="fw-medium text-light text-decoration-underline mb-2 d-inline-block">
                            Featured Instructors
                        </span>
                        <h2 className="text-white">
                            Top Class &amp; Professional Instructors{" "}
                        </h2>
                        <p className="text-light">
                            Empowering Change: Stories from Those Who Took the Leap
                        </p>
                    </div>
                    <Slider {...featurinstructorslider} className="featured-instructor-slider lazy">
                        <div
                            className="instructor-item instructor-item-three mb-0"
                            data-aos="flip-left"
                        >
                            <div className="instructors-img ">
                                <Link to={route.instructorList} tabIndex={0}>
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/instructor/instructor-09.jpg"
                                    />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                    <span className="verify">
                                        <ImageWithBasePath
                                            src="assets/img/icons/verify-icon.svg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <Link to="#" className="favourite ms-auto">
                                        <i className="isax isax-heart" />
                                    </Link>
                                </div>
                            </div>
                            <div className="instructor-content">
                                <div>
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Joyce Pence</Link>
                                    </h3>
                                    <span className="designation">Lead Designer</span>
                                </div>
                                <p className="rating">
                                    <i className="fas fa-star me-1" />
                                    4.8
                                </p>
                            </div>
                        </div>
                        <div
                            className="instructor-item instructor-item-three mb-0"
                            data-aos="flip-left"
                        >
                            <div className="instructors-img">
                                <Link to={route.instructorList} tabIndex={0}>
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/instructor/instructor-10.jpg"
                                    />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                    <span className="verify">
                                        <ImageWithBasePath
                                            src="assets/img/icons/verify-icon.svg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <Link to="#" className="favourite ms-auto">
                                        <i className="isax isax-heart" />
                                    </Link>
                                </div>
                            </div>
                            <div className="instructor-content">
                                <div>
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Edith Dorsey</Link>
                                    </h3>
                                    <span className="designation">Accountant</span>
                                </div>
                                <p className="rating">
                                    <i className="fas fa-star me-1" />
                                    5.0
                                </p>
                            </div>
                        </div>
                        <div
                            className="instructor-item instructor-item-three mb-0"
                            data-aos="flip-left"
                        >
                            <div className="instructors-img ">
                                <Link to={route.instructorList} tabIndex={0}>
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/instructor/instructor-11.jpg"
                                    />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                    <span className="verify">
                                        <ImageWithBasePath
                                            src="assets/img/icons/verify-icon.svg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <Link to="#" className="favourite ms-auto">
                                        <i className="isax isax-heart" />
                                    </Link>
                                </div>
                            </div>
                            <div className="instructor-content">
                                <div>
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Ruben Holmes</Link>
                                    </h3>
                                    <span className="designation">Architect</span>
                                </div>
                                <p className="rating">
                                    <i className="fas fa-star me-1" />
                                    4.8
                                </p>
                            </div>
                        </div>
                        <div
                            className="instructor-item instructor-item-three mb-0"
                            data-aos="flip-left"
                        >
                            <div className="instructors-img">
                                <Link to={route.instructorList} tabIndex={0}>
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/instructor/instructor-12.jpg"
                                    />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                    <span className="verify">
                                        <ImageWithBasePath
                                            src="assets/img/icons/verify-icon.svg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <Link to="#" className="favourite ms-auto">
                                        <i className="isax isax-heart" />
                                    </Link>
                                </div>
                            </div>
                            <div className="instructor-content">
                                <div>
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Carol Magner</Link>
                                    </h3>
                                    <span className="designation">Lead Designer</span>
                                </div>
                                <p className="rating">
                                    <i className="fas fa-star me-1" />
                                    4.5
                                </p>
                            </div>
                        </div>
                        <div
                            className="instructor-item instructor-item-three mb-0"
                            data-aos="flip-left"
                        >
                            <div className="instructors-img">
                                <Link to={route.instructorList} tabIndex={0}>
                                    <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Img"
                                        src="assets/img/instructor/instructor-10.jpg"
                                    />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                    <span className="verify">
                                        <ImageWithBasePath
                                            src="assets/img/icons/verify-icon.svg"
                                            alt="img"
                                            className="img-fluid"
                                        />
                                    </span>
                                    <Link to="#" className="favourite ms-auto">
                                        <i className="isax isax-heart" />
                                    </Link>
                                </div>
                            </div>
                            <div className="instructor-content">
                                <div>
                                    <h3 className="title">
                                        <Link to={route.instructorDetails}>Edith Dorsey</Link>
                                    </h3>
                                    <span className="designation">Accountant</span>
                                </div>
                                <p className="rating">
                                    <i className="fas fa-star me-1" />
                                    5.0
                                </p>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
            {/* featured instructor */}
        </>

    )
}

export default Featureinstructor
