import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const BlogRightSidebar = () => {
  return (
    <>
    <Breadcrumb title='Blog Right Sidebar'/>
    <div className="content">
  <div className="container">
    <div className="row">
      <div className="col-lg-8">
        <div className="row">
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6">
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
                  Unlock limitless career opportunities by mastering Python, one
                  of the most versatile and in-demand ...
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
          </div>
          <div className="col-md-6">
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
                  Elevate your skills with expert-led training in mobile
                  application development! Learn to design, develop ...
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
          </div>
          <div className="col-md-6">
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
                  Master PHP programming with our comprehensive career
                  guideline! Learn the fundamentals, explore ...
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
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6">
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
          </div>
        </div>
        {/* /pagination */}
        <div className="row align-items-center">
          <div className="col-md-12">
            <ul className="pagination justify-content-center">
              <li className="page-item prev">
                <Link
                  className="page-link"
                  to="#"
                  tabIndex={-1}
                >
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
      {/* Blog Sidebar */}
      <div className="col-lg-4 sidebar-left mt-4 mt-lg-0 theiaStickySidebar">
        {/* Search */}
        <div className="search-widget blog-search blog-widget">
          <div>
            <h5 className="mb-3 fs-18">Search</h5>
            <form className="search-form">
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                />
                <button type="submit" className="search-btn">
                  <i className="isax isax-search-normal-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* /Search */}
        {/* Categories */}
        <div className="blog-widget">
          <h5 className="fs-18 mb-3">Categories</h5>
          <div className="categories-list">
            <h6>
              <Link to="#">
                <i className="isax isax-arrow-right-3 fs-14 text-secondary fw-bold" />{" "}
                Business<span className="float-end">04</span>{" "}
              </Link>
            </h6>
            <h6>
              <Link to="#">
                <i className="isax isax-arrow-right-3 fs-14 text-secondary fw-bold" />{" "}
                Education<span className="float-end">03</span>{" "}
              </Link>
            </h6>
            <h6>
              <Link to="#">
                <i className="isax isax-arrow-right-3 fs-14 text-secondary fw-bold" />{" "}
                Graphics Design<span className="float-end">14</span>{" "}
              </Link>
            </h6>
            <h6>
              <Link to="#">
                <i className="isax isax-arrow-right-3 fs-14 text-secondary fw-bold" />{" "}
                Programming<span className="float-end">12</span>{" "}
              </Link>
            </h6>
            <h6>
              <Link to="#">
                <i className="isax isax-arrow-right-3 fs-14 text-secondary fw-bold" />{" "}
                Web Design<span className="float-end">15</span>
              </Link>
            </h6>
          </div>
        </div>
        {/* /Categories */}
        {/* Latest Posts */}
        <div className="blog-widget">
          <h5 className="fs-18 mb-3">Recent Blogs</h5>
          <ul className="recent-blog-list">
            <li>
              <div className="post-thumb">
                <Link to={all_routes.blogDetails}>
                  <ImageWithBasePath
                    className="img-fluid"
                    src="assets/img/blog/recent-blog-1.jpg"
                    alt="Img"
                  />
                </Link>
              </div>
              <div className="post-info">
                <h6 className="text-truncate line-clamb-2">
                  <Link to={all_routes.blogDetails}>
                    Learn Webs Applications Development from Experts
                  </Link>
                </h6>
                <p className="d-flex align-items-center">
                  <ImageWithBasePath
                    className="img-fluid me-1"
                    src="assets/img/icons/calendar2.svg"
                    alt="Img"
                  />
                  20 Apr 2024
                </p>
              </div>
            </li>
            <li>
              <div className="post-thumb">
                <Link to={all_routes.blogDetails}>
                  <ImageWithBasePath
                    className="img-fluid"
                    src="assets/img/blog/recent-blog-2.jpg"
                    alt="Img"
                  />
                </Link>
              </div>
              <div className="post-info">
                <h6 className="text-truncate line-clamb-2">
                  <Link to={all_routes.blogDetails}>
                    Expand Your Career Opportunities With Python
                  </Link>
                </h6>
                <p className="d-flex align-items-center">
                  <ImageWithBasePath
                    className="img-fluid me-1"
                    src="assets/img/icons/calendar2.svg"
                    alt="Img"
                  />
                  16 Apr 2024
                </p>
              </div>
            </li>
            <li className="mb-0">
              <div className="post-thumb">
                <Link to={all_routes.blogDetails}>
                  <ImageWithBasePath
                    className="img-fluid"
                    src="assets/img/blog/recent-blog-3.jpg"
                    alt="Img"
                  />
                </Link>
              </div>
              <div className="post-info">
                <h6 className="text-truncate line-clamb-2">
                  <Link to={all_routes.blogDetails}>
                    Learn Webs Applications Development from Experts
                  </Link>
                </h6>
                <p className="d-flex align-items-center">
                  <ImageWithBasePath
                    className="img-fluid me-1"
                    src="assets/img/icons/calendar2.svg"
                    alt="Img"
                  />
                  12 Apr 2024
                </p>
              </div>
            </li>
          </ul>
        </div>
        {/* /Latest Posts */}
        {/* Tags */}
        <div className="blog-widget">
          <h5 className="fs-18 mb-3">Latest Tags</h5>
          <div className="card-body">
            <ul className="latest-tags">
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  HTML
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Javascript
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Web Design
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Programming
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Career Growth
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="tag rounded-1 p-2 fs-10 fw-medium d-flex"
                >
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* /Tags */}
      </div>
      {/* /Blog Sidebar */}
    </div>
  </div>
</div>

    </>
  )
}

export default BlogRightSidebar