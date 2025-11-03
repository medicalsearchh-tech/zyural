import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'

const CourseCategory = () => {

  const route = all_routes;

  return (
    <>
      <Breadcrumb title='Course Category' />

      <>
        {/* Course */}
        <section className="course-category">
          <div className="container">
            <h2 className="mb-1">Browse By Categories</h2>
            <p>One stop shop for all your needs</p>
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Graphics &amp; Design
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  Programming &amp; Tech
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  Digital Marketing
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-video-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-video"
                  type="button"
                  role="tab"
                  aria-controls="pills-video"
                  aria-selected="false"
                >
                  Video &amp; Animation
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-1.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Logo Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          21
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-2.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brand Style Guides</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-3.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Game Art</Link>
                          </h6>
                        </div>
                        <span className="cat-count fs-14 text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-4.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Business Cards</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          22
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-5.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Illustration</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-6.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Pattern Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-7.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brochure Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          14
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-8.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Flyer Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-9.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Book Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-10.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Social Media Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-11.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Icon Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-12.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Invitation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-13.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Graphics for Streamers</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          06
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-14.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Label Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-15.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>UX Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-16.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Photoshop Editing</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          10
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-17.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Presentation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-18.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Infographic Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
              >
                <div className="row mt-4 mt-md-5">
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-1.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Logo Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          21
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-2.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brand Style Guides</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-3.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Game Art</Link>
                          </h6>
                        </div>
                        <span className="cat-count fs-14 text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-4.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Business Cards</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          22
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-5.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Illustration</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-6.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Pattern Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-7.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brochure Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          14
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-8.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Flyer Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-9.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Book Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-10.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Social Media Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-11.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Icon Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-12.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Invitation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-13.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Graphics for Streamers</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          06
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-14.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Label Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-15.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>UX Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-16.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Photoshop Editing</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          10
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-17.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Presentation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-18.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Infographic Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-contact"
                role="tabpanel"
                aria-labelledby="pills-contact-tab"
              >
                <div className="row mt-4 mt-md-5">
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-1.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Logo Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          21
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-2.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brand Style Guides</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-3.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Game Art</Link>
                          </h6>
                        </div>
                        <span className="cat-count fs-14 text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-4.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Business Cards</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          22
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-5.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Illustration</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-6.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Pattern Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-7.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brochure Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          14
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-8.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Flyer Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-9.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Book Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-10.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Social Media Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-11.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Icon Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-12.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Invitation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-13.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Graphics for Streamers</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          06
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-14.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Label Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-15.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>UX Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-16.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Photoshop Editing</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          10
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-17.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Presentation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-18.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Infographic Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-video"
                role="tabpanel"
                aria-labelledby="pills-video-tab"
              >
                <div className="row mt-4 mt-md-5">
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-1.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Logo Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          21
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-2.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brand Style Guides</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-3.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Game Art</Link>
                          </h6>
                        </div>
                        <span className="cat-count fs-14 text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-4.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Business Cards</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          22
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-5.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Illustration</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-6.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Pattern Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-7.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Brochure Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          14
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-8.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Flyer Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-9.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Book Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-10.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Social Media Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-11.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Icon Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-12.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Invitation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-13.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Graphics for Streamers</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          06
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-14.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Label Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-15.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>UX Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-16.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Photoshop Editing</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          10
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-17.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Presentation Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="course-category-item">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <ImageWithBasePath
                            className="img-fluid category-image"
                            src="./assets/img/category/category-18.jpg"
                            alt="img"
                          />
                          <h6 className="pe-2">
                            <Link to={route.courseDetails}>Infographic Design</Link>
                          </h6>
                        </div>
                        <span className="cat-count text-white fw-medium bg-dark d-inline-flex">
                          15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Course */}
      </>

    </>
  )
}

export default CourseCategory
