import { useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
type PasswordField = "password" | "confirmPassword";
const BecomeInstructor = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
         password: false,
         confirmPassword: false,
       });
     
       const togglePasswordVisibility = (field: PasswordField) => {
         setPasswordVisibility((prevState) => ({
           ...prevState,
           [field]: !prevState[field],
         }));
       };

  return (
    <>
      <Breadcrumb title="Become an Instructor" />

      <>
        {/* share your knowledge */}
        <div className="share-your-knowledge">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 pe-xl-5">
                <div className="share-knowledge-content">
                  <div className="section-header">
                    <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                      Share Knowledge
                    </span>
                    <h2>Share Your Knowledge. Inspire the Future.</h2>
                    <p>
                      Share your knowledge, inspire learners worldwide, and earn
                      while doing what you love. Join a community of experts
                      transforming education through engaging and accessible
                      content.
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="bg-secondary-transparent d-flex justify-content-center align-items-center p-3 rounded-pill">
                                <ImageWithBasePath
                                  src="./assets/img/icons/instructor-icon1.svg"
                                  alt="img"
                                />
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-1">Flexible Work</h6>
                              <p className="text-truncate line-clamb-1">
                                Teach at your own pace.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="bg-secondary-transparent d-flex justify-content-center align-items-center p-3 rounded-pill">
                                <ImageWithBasePath
                                  src="./assets/img/icons/instructor-icon2.svg"
                                  alt="img"
                                />
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-1">Earning Potential</h6>
                              <p className="text-truncate line-clamb-1">
                                Monetize your expertise.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="bg-secondary-transparent d-flex justify-content-center align-items-center p-3 rounded-pill">
                                <ImageWithBasePath
                                  src="./assets/img/icons/instructor-icon3.svg"
                                  alt="img"
                                />
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-1">Impact</h6>
                              <p className="text-truncate line-clamb-1">
                                Reach and educate{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span className="bg-secondary-transparent d-flex justify-content-center align-items-center p-3 rounded-pill">
                                <ImageWithBasePath
                                  src="./assets/img/icons/instructor-icon4.svg"
                                  alt="img"
                                />
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-1">Support</h6>
                              <p className="text-truncate line-clamb-1">
                                Access to dedicated support
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="#"
                    className="btn register-btn-1 d-inline-flex align-items-center"
                  >
                    Register Now <i className="isax isax-arrow-right-3 ms-1" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="share-your-knowledge-img d-none d-lg-flex">
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-4.png"
                    alt="img"
                    className="img-fluid become-instructor-bg-02"
                  />
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-5.png"
                    alt="img"
                    className="img-fluid become-instructor-bg-01"
                  />
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-3.png"
                    alt="img"
                    className="img-fluid become-instructor-bg-03"
                  />
                  <ImageWithBasePath
                    src="assets/img/feature/feature-5.jpg"
                    alt="img"
                    className="img-fluid rounded-4 become-instructor-bg-04"
                  />
                  <ImageWithBasePath
                    src="assets/img/feature/feature-6.jpg"
                    alt="img"
                    className="img-fluid rounded-4 become-instructor-bg-05"
                  />
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-7.svg"
                    alt="img"
                    className="img-fluid become-instructor-bg-06"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* share your knowledge */}
        {/* how it works */}
        <div className="how-it-works-sec bg-light-900">
          <div className="container">
            <div className="section-header">
              <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                Our Workflow
              </span>
              <h2>How It Works</h2>
              <p>Turn Your Expertise into Impact in Just 3 Simple Steps!</p>
            </div>
            <div className="row row-gap-4">
              <div className="col-lg-4">
                <div className="share-knowledge-item-2">
                  <ImageWithBasePath
                    src="./assets/img/icons/how-it-works-1.svg"
                    alt="img"
                  />
                  <h5 className="mt-3 mb-2">Apply &amp; Get Approved</h5>
                  <p className="text-truncate line-clamb-2">
                    Submit your application and get approved to access the
                    platform
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="share-knowledge-item-2">
                  <ImageWithBasePath
                    src="./assets/img/icons/how-it-works-2.svg"
                    alt="img"
                  />
                  <h5 className="mt-3 mb-2">Create &amp; Upload Content</h5>
                  <p className="text-truncate line-clamb-2">
                    Develop and upload your courses, including videos, lessons,
                    quizzes, and assignments.
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="share-knowledge-item-2">
                  <ImageWithBasePath
                    src="./assets/img/icons/how-it-works-3.svg"
                    alt="img"
                  />
                  <h5 className="mt-3 mb-2">Teach &amp; Earn</h5>
                  <p className="text-truncate line-clamb-2">
                    Reach learners worldwide, teach, and start earning while
                    making an impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* how it works */}
        {/* counter */}
        <div className="counter-sec">
          <div className="container">
            <div className="row row-gap-4">
              <div className="col-xl-3 col-md-6">
                <div className="become-instructor-item-3 mb-0">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon1.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content ps-1 pb-2">
                      <h4 className="text-info">
                        <span className="count-digit">
                          <CountUp end={10} />
                        </span>
                        K
                      </h4>
                      <p className="fw-medium text-truncate">Online Courses</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="become-instructor-item-3 mb-0">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon2.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content ps-1 pb-2">
                      <h4 className="text-warning">
                        <span className="count-digit">
                          <CountUp end={200} />
                        </span>
                        +
                      </h4>
                      <p className="fw-medium text-truncate">Expert Tutors</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="become-instructor-item-3 mb-0">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon3.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content ps-1 pb-2">
                      <h4 className="text-skyblue">
                        <span className="count-digit">
                          <CountUp end={6} />
                        </span>
                        K+
                      </h4>
                      <p className="fw-medium text-truncate">
                        Certified Courses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="become-instructor-item-3 mb-0">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon4.svg"
                        alt="img"
                      />
                    </div>
                    <div className="count-content ps-1 pb-2">
                      <h4 className="text-lightgreen">
                        <span className="count-digit">
                          <CountUp end={60} />
                        </span>
                        K+
                      </h4>
                      <p className="fw-medium text-truncate">Online Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* counter */}
        {/* register */}
        <div className="register-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="rounded-4 pe-lg-5">
                  <ImageWithBasePath
                    className="img-fluid rounded-5 d-none d-lg-flex"
                    src="assets/img/feature/feature-4.jpg"
                    alt="img"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="register-section p-4 p-sm-5 p-md-6">
                  <h5 className="mb-2">Register</h5>
                  <p>
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label mb-1">
                            Name<span className="ms-1 text-danger">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label mb-1">
                            Email<span className="ms-1 text-danger">*</span>
                          </label>
                          <input type="email" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label mb-1">
                            Phone Number
                            <span className="ms-1 text-danger">*</span>
                          </label>
                          <input type="tel" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3 position-relative">
                          <label className="form-label mb-1">
                            Password<span className="ms-1 text-danger">*</span>
                          </label>
                          <div className="position-relative">
                          <input
                        type={
                          passwordVisibility.password
                            ? "text"
                            : "password"
                        }
                        className="form-control form-control-lg pass-input"
                         
                      />
                      <span
                        className={`isax toggle-passwords ${passwordVisibility.password
                          ? "isax-eye"
                          : "isax-eye-slash"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility("password")
                        }
                      ></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-4">
                          <label className="form-label mb-1">
                            Confirm Password
                            <span className="ms-1 text-danger">*</span>
                          </label>
                          <div className="position-relative">
                          <input
                        type={
                          passwordVisibility.confirmPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control form-control-lg pass-input"
                        
                      />
                      <span
                        className={`isax toggle-passwords ${passwordVisibility.confirmPassword
                            ? "isax-eye"
                            : "isax-eye-slash"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      ></span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-lg w-100 justify-content-center"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="become-an-instructor rounded-2 bg-primary position-relative mt-5 p-5">
              <ImageWithBasePath
                src="./assets/img/shapes/instructor-bg-1.png"
                alt="img"
                className="instructor-bg-1"
              />
              <ImageWithBasePath
                src="./assets/img/shapes/instructor-bg-2.png"
                alt="img"
                className="instructor-bg-2"
              />
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h3 className="text-white mb-2 mblg-3">
                    Become an Instructor
                  </h3>
                  <p className="text-light">
                    Turn your expertise into impactful courses and inspire
                    learners worldwide. Join our community of instructors and
                    start your journey today!
                  </p>
                </div>
                <div className="col-lg-4 d-flex justify-content-lg-end justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-secondary btn-lg mt-3 mt-lg-0"
                  >
                    Start Teaching Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* register */}
      </>
    </>
  );
};

export default BecomeInstructor;
