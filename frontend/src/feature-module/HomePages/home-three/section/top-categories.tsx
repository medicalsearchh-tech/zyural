import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Topcategories = () => {
    const route = all_routes

    const categoriesslider = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

    return (
        <>
            {/* Top Categories */}
            <div className="section how-it-works">
                <div className="container">
                    <div
                        className="d-flex align-items-center justify-content-between flex-wrap gap-3 aos"
                        data-aos="fade-up"
                    >
                        <div className="section-header">
                            <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                                Favourite Course
                            </span>
                            <h2 className="mb-0">Top Category</h2>
                        </div>
                        <div>
                            <Link to={route.courseCategory2} className="btn btn-secondary btn-xl">
                                View all Categories
                            </Link>
                        </div>
                    </div>
                    <Slider {...categoriesslider}>
                        <div className="categories-item categories-item-two">
                            <span className="categories-icon">
                                <ImageWithBasePath src="assets/img/category/icons/icon-1.svg" alt="Img" />
                            </span>
                            <h5>
                                <Link to={route.courseCategory}>Angular Development</Link>
                            </h5>
                            <p>40 Instructors</p>
                        </div>
                        <div className="categories-item categories-item-two">
                            <span className="categories-icon">
                                <ImageWithBasePath src="assets/img/category/icons/icon-2.svg" alt="Img" />
                            </span>
                            <h5>
                                <Link to={route.courseCategory}>Docker Development</Link>
                            </h5>
                            <p>45 Instructors</p>
                        </div>
                        <div className="categories-item categories-item-two">
                            <span className="categories-icon">
                                <ImageWithBasePath src="assets/img/category/icons/icon-3.svg" alt="Img" />
                            </span>
                            <h5>
                                <Link to={route.courseCategory}>Node JS Frontend</Link>
                            </h5>
                            <p>40 Instructors</p>
                        </div>
                        <div className="categories-item categories-item-two">
                            <span className="categories-icon">
                                <ImageWithBasePath src="assets/img/category/icons/icon-4.svg" alt="Img" />
                            </span>
                            <h5>
                                <Link to={route.courseCategory}>Swift Development</Link>
                            </h5>
                            <p>23 Instructors</p>
                        </div>
                        <div className="categories-item categories-item-two">
                            <span className="categories-icon">
                                <ImageWithBasePath src="assets/img/category/icons/icon-5.png" alt="Img" />
                            </span>
                            <h5>
                                <Link to={route.courseCategory}>React Native</Link>
                            </h5>
                            <p>80 Instructors</p>
                        </div>
                    </Slider>
                </div>
            </div>
            {/* /Top Categories */}
        </>

    )
}

export default Topcategories
