import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const BlogGrid = () => {
  return (
    <>
    <Breadcrumb title='Blog 1 Grid'/>
    <div className="content">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-16.jpg"
                alt="img"
              />
            </Link>
          </div>
          <div className="blog-item">
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
              <div className="d-flex align-items-center flex-wrap justify-content-between gap-2">
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
                    <p>20 Apr 2024</p>
                  </li>
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/tag.svg"
                      alt="img"
                    />
                    <p>Programming, Web Design</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-9">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-17.jpg"
                alt="img"
              />
            </Link>
          </div>
          <div className="blog-item">
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
              <div className="d-flex align-items-center flex-wrap justify-content-between gap-2">
                <div className="d-flex align-items-center user-profile">
                  <Link to={all_routes.instructorDetails} className="user-img">
                    <ImageWithBasePath
                      className="rounded-pill w-auto"
                      src="./assets/img/user/user-15.jpg"
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
                    <p>08 Apr 2024</p>
                  </li>
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/tag.svg"
                      alt="img"
                    />
                    <p>Programming, Web Design</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-9">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-18.jpg"
                alt="img"
              />
            </Link>
          </div>
          <div className="blog-item">
            <h5 className="mb-2">
              <Link to={all_routes.blogDetails}>
                Revolutionize Learning with a Modern LMS
              </Link>
            </h5>
            <p className="text-truncate line-clamb-2">
              Discover how a Learning Management System (LMS) can transform
              education and corporate training by ...
            </p>
            <div className="blog-info">
              <div className="d-flex align-items-center flex-wrap justify-content-between gap-2">
                <div className="d-flex align-items-center user-profile">
                  <Link to={all_routes.instructorDetails} className="user-img">
                    <ImageWithBasePath
                      className="rounded-pill w-auto"
                      src="./assets/img/user/user-05.jpg"
                      alt="img"
                    />
                  </Link>
                  <Link to={all_routes.instructorDetails} className="user-name">
                    James Barnes
                  </Link>
                </div>
                <ul className="d-flex align-items-center flex-wrap gap-2">
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/calendar.svg"
                      alt="img"
                    />
                    <p>23 Feb 2024</p>
                  </li>
                  <li>
                    <ImageWithBasePath
                      className="me-1"
                      src="./assets/img/icons/tag.svg"
                      alt="img"
                    />
                    <p>Modern Learning, Innovative</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* /pagination */}
    <div className="row align-items-center">
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

export default BlogGrid