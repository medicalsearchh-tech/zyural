import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const BlogGrid2 = () => {
  return (
    <>
    <Breadcrumb title='Blog 2 Grid'/>

    <div className="content">
  <div className="container">
    <div className="row">
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-1.jpg"
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
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-2.jpg"
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
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-3.jpg"
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
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-4.jpg"
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
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-5.jpg"
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
      <div className="col-lg-6">
        <div className="blog">
          <div className="blog-image">
            <Link to={all_routes.blogDetails}>
              <ImageWithBasePath
                className="img-fluid"
                src="./assets/img/blog/blog-6.jpg"
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

export default BlogGrid2