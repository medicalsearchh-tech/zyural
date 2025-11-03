import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { all_routes } from '../../../router/all_routes';

const Topcourses = () => {

    //Top Course SLider
    const topcourseslider = {
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              infinite: true,
              dots: false,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      };

      const route = all_routes
      
    return (
        <>
            {/* top courses */}
            <section className="top-courses-sec">
                <ImageWithBasePath className="top-courses-bg" src="./assets/img/bg/bg-20.png" alt="img" />
                <div className="container">
                    <div className="section-header text-center">
                        <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                            Our Categories
                        </span>
                        <h2>Top Courses &amp; Categories</h2>
                        <p>
                            The right course, guided by an expert mentor, can provide invaluable
                            insights, practical skills
                        </p>
                    </div>
                        <Slider {...topcourseslider} className="top-courses-slider lazy">
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-6.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Frontend Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-7.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Jira Management</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-8.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Figma Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-9.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Framer Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-10.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Vue js Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-11.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Shopify Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-10.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Vue js Developer</Link>
                                </h6>
                            </div>
                        </div>
                        <div>
                            <div className="categories-item categories-item-three mb-0">
                                <ImageWithBasePath
                                    className="mx-auto"
                                    src="assets/img/category/icons/icon-11.svg"
                                    alt="img"
                                />
                                <h6 className="title">
                                    <Link to={route.courseCategory}>Shopify Developer</Link>
                                </h6>
                            </div>
                        </div>
                        </Slider>
              
                    <Link to={route.courseCategory} className="btn btn-primary btn-md">
                        View All Categories
                    </Link>
                </div>
            </section>
            {/* /top courses */}
        </>

    )
}

export default Topcourses
