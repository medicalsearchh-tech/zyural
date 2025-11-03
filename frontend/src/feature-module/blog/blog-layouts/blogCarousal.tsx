import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'
import Slider from 'react-slick';

const BlogCarousal = () => {
    const categoriesslider = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
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
    <Breadcrumb title='Blog Carousal'/>

    <div className="content home-3">
  <div className="container">
    <Slider {...categoriesslider} className="lazy">
      <div className="blog">
        <div className="blog-image">
          <Link to={all_routes.blogDetails}>
            <ImageWithBasePath
              className="img-fluid"
              src="./assets/img/blog/blog-7.jpg"
              alt="img"
            />
          </Link>
        </div>
        <div className="blog-item">
          <span className="badge bg-success mb-2">Education</span>
          <h5 className="mb-2">
            <Link to={all_routes.blogDetails}>
              Learn Web App Development from Experts in 2024
            </Link>
          </h5>
          <p className="text-truncate line-clamb-2">
            Master the art of web application development with expert-led
            courses that cover the latest tools, fram...
          </p>
          <div className="blog-info">
            <div className="d-flex align-items-center flex-wrap justify-content-between">
              <div className="d-flex align-items-center user-profile">
                <Link to={all_routes.instructorDetails} className="user-img">
                  <ImageWithBasePath
                    className="rounded-pill w-auto"
                    src="./assets/img/user/user-52.jpg"
                    alt="img"
                  />
                </Link>
                <Link to={all_routes.instructorDetails} className="user-name">
                  John Miller
                </Link>
              </div>
              <ul className="d-flex align-items-center flex-wrap gap-2">
                <li>
                  <ImageWithBasePath
                    className="me-1"
                    src="./assets/img/icons/calendar.svg"
                    alt="img"
                  />
                  <p>23 Apr 2024</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="blog">
        <div className="blog-image">
          <Link to={all_routes.blogDetails}>
            <ImageWithBasePath
              className="img-fluid"
              src="./assets/img/blog/blog-8.jpg"
              alt="img"
            />
          </Link>
        </div>
        <div className="blog-item">
          <span className="badge bg-success mb-2">Guides</span>
          <h5 className="mb-2">
            <Link to={all_routes.blogDetails}>
              Expand Your Career Opportunities With Python
            </Link>
          </h5>
          <p className="text-truncate line-clamb-2">
            Unlock limitless career opportunities by mastering Python, one of
            the most versatile and in-demand ...
          </p>
          <div className="blog-info">
            <div className="d-flex align-items-center flex-wrap justify-content-between">
              <div className="d-flex align-items-center user-profile">
                <Link to={all_routes.instructorDetails} className="user-img">
                  <ImageWithBasePath
                    className="rounded-pill w-auto"
                    src="./assets/img/user/user-01.jpg"
                    alt="img"
                  />
                </Link>
                <Link to={all_routes.instructorDetails} className="user-name">
                  Cedric Glenn
                </Link>
              </div>
              <ul className="d-flex align-items-center flex-wrap gap-2">
                <li>
                  <ImageWithBasePath
                    className="me-1"
                    src="./assets/img/icons/calendar.svg"
                    alt="img"
                  />
                  <p>20 Apr 2024</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="blog">
        <div className="blog-image">
          <Link to={all_routes.blogDetails}>
            <ImageWithBasePath
              className="img-fluid"
              src="./assets/img/blog/blog-9.jpg"
              alt="img"
            />
          </Link>
        </div>
        <div className="blog-item">
          <span className="badge bg-success mb-2">Technical</span>
          <h5 className="mb-2">
            <Link to={all_routes.blogDetails}>
              Learn Mobile Applications Development from Experts
            </Link>
          </h5>
          <p className="text-truncate line-clamb-2">
            Elevate your skills with expert-led training in mobile application
            development! Learn to design, develop ...
          </p>
          <div className="blog-info">
            <div className="d-flex align-items-center flex-wrap justify-content-between">
              <div className="d-flex align-items-center user-profile">
                <Link to={all_routes.instructorDetails} className="user-img">
                  <ImageWithBasePath
                    className="rounded-pill w-auto"
                    src="./assets/img/user/user-02.jpg"
                    alt="img"
                  />
                </Link>
                <Link to={all_routes.instructorDetails} className="user-name">
                  John Reyes
                </Link>
              </div>
              <ul className="d-flex align-items-center flex-wrap gap-2">
                <li>
                  <ImageWithBasePath
                    className="me-1"
                    src="./assets/img/icons/calendar.svg"
                    alt="img"
                  />
                  <p>04 Apr 2024</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="blog">
        <div className="blog-image">
          <Link to={all_routes.blogDetails}>
            <ImageWithBasePath
              className="img-fluid"
              src="./assets/img/blog/blog-10.jpg"
              alt="img"
            />
          </Link>
        </div>
        <div className="blog-item">
          <span className="badge bg-success mb-2">Guides</span>
          <h5 className="mb-2">
            <Link to={all_routes.blogDetails}>
              Complete PHP Programming Career Guideline
            </Link>
          </h5>
          <p className="text-truncate line-clamb-2">
            Master PHP programming with our comprehensive career guideline!
            Learn the fundamentals, explore ...
          </p>
          <div className="blog-info">
            <div className="d-flex align-items-center flex-wrap justify-content-between">
              <div className="d-flex align-items-center user-profile">
                <Link to={all_routes.instructorDetails} className="user-img">
                  <ImageWithBasePath
                    className="rounded-pill w-auto"
                    src="./assets/img/user/user-03.jpg"
                    alt="img"
                  />
                </Link>
                <Link to={all_routes.instructorDetails} className="user-name">
                  Donald Vesely
                </Link>
              </div>
              <ul className="d-flex align-items-center flex-wrap gap-2">
                <li>
                  <ImageWithBasePath
                    className="me-1"
                    src="./assets/img/icons/calendar.svg"
                    alt="img"
                  />
                  <p>24 Mar 2024</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="blog">
        <div className="blog-image">
          <Link to={all_routes.blogDetails}>
            <ImageWithBasePath
              className="img-fluid"
              src="./assets/img/blog/blog-11.jpg"
              alt="img"
            />
          </Link>
        </div>
        <div className="blog-item">
          <span className="badge bg-success mb-2">Education</span>
          <h5 className="mb-2">
            <Link to={all_routes.blogDetails}>
              The Complete JavaScript Course for Beginners
            </Link>
          </h5>
          <p className="text-truncate line-clamb-2">
            Dive into the world of JavaScript with our complete
            beginner-friendly course! Learn essential concepts...
          </p>
          <div className="blog-info">
            <div className="d-flex align-items-center flex-wrap justify-content-between">
              <div className="d-flex align-items-center user-profile">
                <Link to={all_routes.instructorDetails} className="user-img">
                  <ImageWithBasePath
                    className="rounded-pill w-auto"
                    src="./assets/img/user/user-05.jpg"
                    alt="img"
                  />
                </Link>
                <Link to={all_routes.instructorDetails} className="user-name">
                  Richard Garza
                </Link>
              </div>
              <ul className="d-flex align-items-center flex-wrap gap-2">
                <li>
                  <ImageWithBasePath
                    className="me-1"
                    src="./assets/img/icons/calendar.svg"
                    alt="img"
                  />
                  <p>16 Mar 2024</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Slider>
  </div>
</div>

    </>
  )
}

export default BlogCarousal