import { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";

const Feature = () => {
  const route = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <>
      {/* Feature Course */}
      <div className="section new-course">
        <div className="home-three-sec-bg">
          <ImageWithBasePath
            src="assets/img/bg/bg-3.png"
            alt="img"
            className="img-fluid sec-bg-01"
          />
          <ImageWithBasePath
            src="assets/img/bg/bg-4.png"
            alt="img"
            className="img-fluid sec-bg-02"
          />
        </div>
        <div className="container">
          <div
            className="d-flex align-items-center justify-content-between flex-wrap gap-3 aos"
            data-aos="fade-up"
          >
            <div className="section-header">
              <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                What’s New
              </span>
              <h2 className="mb-0">Featured Courses</h2>
            </div>
            <div>
              <Link to={route.courseList} className="btn btn-secondary btn-xl">
                View all Categories
              </Link>
            </div>
          </div>
          <div className="course-feature">
            <div className="row">
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-40.jpg"
                      />
                    </Link>
                    <div className="price">
                      <h3>
                        $200 <span>$990.00</span>
                      </h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-21.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>
                              Nicole Brown
                            </Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        key={1}
                        className={`fav-icon ${
                          selectedItems[1] ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick(1)}
                      >
                        <i className="fa-regular fa-heart" />
                      </Link>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        Information About UI/UX Design Degree
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>12+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>9hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.0</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-41.jpg"
                      />
                    </Link>
                    <div className="price">
                      <h3>$156</h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-22.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>Jenis R.</Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        key={2}
                        className={`fav-icon ${
                          selectedItems[2] ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick(2)}
                      >
                        <i className="fa-regular fa-heart" />
                      </Link>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        Wordpress for Beginners - Master Wordpress Quickly
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>11+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>6hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.3</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-42.jpg"
                      />
                    </Link>
                    <div className="price combo">
                      <h3>FREE</h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-25.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>
                              Jesse Stevens
                            </Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        key={3}
                        className={`fav-icon ${
                          selectedItems[3] ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick(3)}
                      >
                        <i className="fa-regular fa-heart" />
                      </Link>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        Sketch from A to Z (2022): Become an app designer
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>16+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>12hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.5</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-43.jpg"
                      />
                    </Link>
                    <div className="price">
                      <h3>$145</h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-24.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>
                              Nicole Brown
                            </Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <div className="course-share d-flex align-items-center justify-content-center">
                        <Link
                          to="#"
                          key={4}
                          className={`fav-icon ${
                            selectedItems[4] ? "selected" : ""
                          }`}
                          onClick={() => handleItemClick(4)}
                        >
                          <i className="fa-regular fa-heart" />
                        </Link>
                      </div>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        Learn Angular Fundamentals From beginning to advance
                        lavel
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>10+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>8hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.2</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-45.jpg"
                      />
                    </Link>
                    <div className="price combo">
                      <h3>Free</h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-23.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>John Smith</Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        key={5}
                        className={`fav-icon ${
                          selectedItems[5] ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick(5)}
                      >
                        <i className="fa-regular fa-heart" />
                      </Link>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        Build Responsive Real World Websites with HTML5 and CSS3
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>13+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>10hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.0</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div
                  className="course-item course-item-three mx-0 flex-fill aos"
                  data-aos="fade-up"
                >
                  <div className="course-img">
                    <Link to={route.courseDetails}>
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/course/course-44.jpg"
                      />
                    </Link>
                    <div className="price combo">
                      <h3>
                        $200 <span>$990.00</span>
                      </h3>
                    </div>
                  </div>
                  <div className="course-content">
                    <div className="course-user">
                      <div className="course-user-img">
                        <Link to={route.instructorProfile}>
                          <ImageWithBasePath
                            src="assets/img/avatar/avatar-26.jpg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="course-name">
                          <h4>
                            <Link to={route.instructorProfile}>
                              Stella Johnson
                            </Link>
                          </h4>
                          <p>Instructor</p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        key={6}
                        className={`fav-icon ${
                          selectedItems[6] ? "selected" : ""
                        }`}
                        onClick={() => handleItemClick(6)}
                      >
                        <i className="fa-regular fa-heart" />
                      </Link>
                    </div>
                    <h3 className="title">
                      <Link to={route.courseDetails}>
                        C# Developers Double Your Coding Speed with Visual
                        Studio
                      </Link>
                    </h3>
                    <div className="course-info d-flex align-items-center">
                      <div className="course-lesson d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-3.svg"
                          alt="Img"
                        />
                        <p>7+ Lesson</p>
                      </div>
                      <div className="course-time d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-4.svg"
                          alt="Img"
                        />
                        <p>7hr 30min</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rating m-0">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">
                          <span>4.6</span> (15)
                        </span>
                      </div>
                      <Link
                        to={route.courseCheckout}
                        className="btn btn-primary btn-xl d-inline-flex align-items-center"
                      >
                        <i className="isax isax-shopping-cart5 me-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Feature Course */}
    </>
  );
};

export default Feature;
