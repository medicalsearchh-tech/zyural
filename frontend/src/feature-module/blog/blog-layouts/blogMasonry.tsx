import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const BlogMasonry = () => {
  return (
    <>
    <Breadcrumb title='Blog Masonry' />
    <div className="content">
  <div className="container">
    <div className="row">
      <div className="col-lg-4">
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
                src="./assets/img/blog/blog-11.jpg"
                alt="img"
              />
            </Link>
          </div>
          <div className="blog-item">
            <span className="badge bg-success mb-2">Guides</span>
            <h5 className="mb-2">
              <Link to={all_routes.blogDetails}>
                Programming Content Guideline For Beginners
              </Link>
            </h5>
            <p className="text-truncate line-clamb-2">
              Kickstart your programming journey with beginner-friendly
              guidelines designed to simplify coding ...
            </p>
            <div className="blog-info">
              <div className="d-flex align-items-center flex-wrap justify-content-between">
                <div className="d-flex align-items-center user-profile">
                  <Link to={all_routes.instructorDetails} className="user-img">
                    <ImageWithBasePath
                      className="rounded-pill w-auto"
                      src="./assets/img/user/user-06.jpg"
                      alt="img"
                    />
                  </Link>
                  <Link to={all_routes.instructorDetails} className="user-name">
                    Lewis Devine
                  </Link>
                </div>
                <ul className="d-flex align-items-center flex-wrap gap-2">
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/calendar.svg"
                      alt="img"
                    />
                    <p>10 Mar 2024</p>
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
                src="./assets/img/blog/blog-26.jpg"
                alt="img"
              />
            </Link>
          </div>
          <div className="blog-item">
            <span className="badge bg-success mb-2">Education</span>
            <h5 className="mb-2">
              <Link to={all_routes.blogDetails}>
                Revolutionize Learning with a Modern LMS
              </Link>
            </h5>
            <p className="text-truncate line-clamb-2">
              An LMS streamlines training and development with centralized
              resources, progress tracking, and flexible..
            </p>
            <div className="blog-info">
              <div className="d-flex align-items-center flex-wrap justify-content-between">
                <div className="d-flex align-items-center user-profile">
                  <Link to={all_routes.instructorDetails} className="user-img">
                    <ImageWithBasePath
                      className="rounded-pill w-auto"
                      src="./assets/img/user/user-08.jpg"
                      alt="img"
                    />
                  </Link>
                  <Link to={all_routes.instructorDetails} className="user-name">
                    Francis Bishop
                  </Link>
                </div>
                <ul className="d-flex align-items-center flex-wrap gap-2">
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/calendar.svg"
                      alt="img"
                    />
                    <p>20 Feb 2024</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-27.jpg"
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
                src="./assets/img/blog/blog-10.jpg"
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
                src="./assets/img/blog/blog-14.jpg"
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
      </div>
      <div className="col-lg-4">
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
                      src="./assets/img/user/user-09.jpg"
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
                src="./assets/img/blog/blog-28.jpg"
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
                src="./assets/img/blog/blog-12.jpg"
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
      </div>
    </div>
    {/* /pagination */}
    <div className="row align-items-center mt-2">
      <div className="col-md-12">
        <ul className="pagination justify-content-center">
          <li className="page-item prev">
            <Link className="page-link" to="#" tabIndex={-1}>
              <i className="fas fa-angle-left" />
            </Link>
          </li>
          <li className="page-item first-page active">
            <Link className="page-link" to="#">
              1
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="#">
              2
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="#">
              3
            </Link>
          </li>
          <li className="page-item next">
            <Link className="page-link" to="#">
              <i className="fas fa-angle-right" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
    {/* /pagination */}
  </div>
</div>

    </>
  )
}

export default BlogMasonry