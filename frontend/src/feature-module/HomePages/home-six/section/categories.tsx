import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import Slider from 'react-slick';
import { all_routes } from '../../../router/all_routes';

const Categories = () => {

    const categoriesslider = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
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

      const route = all_routes;
    return (
        <>
            {/* Course Categories Five */}
            <section className="course-section-five">
                <div className="container">
                    <div className="header-five-title text-center" data-aos="fade-down">
                        <h2>Course Categories</h2>
                        <p>
                            Explore our top categories to find the perfect courses for your
                            learning journey
                        </p>
                    </div>
                    <Slider {...categoriesslider}>
                        {/* Carousel Item */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-01.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>Angular</Link>
                            </h3>
                            <p>50 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                        {/* Carousel Item  */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-02.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>React JS</Link>
                            </h3>
                            <p>50 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                        {/* Carousel Item  */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-03.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>Node JS</Link>
                            </h3>
                            <p>30 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                        {/* Carousel Item  */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-04.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>Docker</Link>
                            </h3>
                            <p>60 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                        {/* Carousel Item */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-01.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>Angular</Link>
                            </h3>
                            <p>40 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                        {/* Carousel Item  */}
                        <div
                            className="categories-item categories-item-six"
                            data-aos="fade-down"
                        >
                            <div className="categories-icon">
                                <div className="icon-bg">
                                    <Link to={route.courseCategory}>
                                        <ImageWithBasePath src="assets/img/icon/framework-02.svg" alt="Img" />
                                    </Link>
                                </div>
                            </div>
                            <h3 className="title">
                                <Link to={route.courseCategory}>React JS</Link>
                            </h3>
                            <p>50 Instructors</p>
                            <Link to={route.courseCategory} className="view-icon">
                                <i className="fas fa-chevron-right" />
                            </Link>
                        </div>
                        {/* /Carousel Item  */}
                    </Slider>
                </div>
            </section>
            {/* /Course Categories Five*/}
        </>

    )
}

export default Categories
