import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import { all_routes } from "../../router/all_routes";
import ProfileCard from "../common/profileCard";

const StudentWishlist = () => {

    const route = all_routes

  return (
    <>
      <Breadcrumb title="Wishlist" />

      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard />
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Wishlist</h5>
                <Link
                  to="#"
                  className="fs-14 text-danger d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_modal"
                >
                  <i className="isax isax-trash me-1" />
                  Remove All
                </Link>
              </div>
              <div className="row">
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-01.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle"
                              src="./assets/img/avatar/avatar1.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            David Benitez
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Design</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Information About UI/UX Design Degree
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star text-warning fs-12" />
                      <p className="fs-14 ms-1">4.9 (200 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$120</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-02.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar2.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>Ana Reyes</Link>
                        </p>
                      </div>
                      <span className="tag-btn">Wordpress</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Wordpress for Beginners - Master Wordpress Quickly
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star text-warning fs-12" />
                      <p className="fs-14 ms-1">4.4 (160 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$140</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-03.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar3.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            Andrew Pirtle
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Design</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Sketch from A to Z (2024): Become an app designer
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.6 (170 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$160</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-04.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar4.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            Christy Garner
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Programming</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Sketch from A to Z (2024): Become an app designer
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.2 (220 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$200</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-05.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar5.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            Justin Gregory
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Programming</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Learn JavaScript and Express to become a Expert
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.4 (180 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$130</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-06.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar6.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            Carolyn Hines
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Programming</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Introduction to Python Programming
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.7 (130 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$150</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-07.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar7.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>
                            Rafael Miller
                          </Link>
                        </p>
                      </div>
                      <span className="tag-btn">Programming</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Build Responsive Websites with HTML5 and CSS3
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.1 (140 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$170</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-08.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar8.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>Nancy Duarte</Link>
                        </p>
                      </div>
                      <span className="tag-btn">Deign</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        Information About Photoshop Design Degree
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.3 (190 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$110</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 d-flex">
                  <div className="course-item course-item-three">
                    <div className="position-relative overflow-hidden rounded-3 mb-3">
                      <Link to={route.courseDetails}>
                        <ImageWithBasePath
                          className="img-fluid rounded-3"
                          src="./assets/img/course/course-09.jpg"
                          alt="img"
                        />
                      </Link>
                      <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                        <Link className="fav-icon like selected" to="#">
                          <i className="isax isax-heart not-filled" />
                          <i className="isax isax-heart5 filled-heart" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm rounded-circle">
                          <Link to={route.instructorDetails}>
                            <ImageWithBasePath
                              className="img-fluid rounded-circle object-fit-cover"
                              src="./assets/img/avatar/avatar9.jpg"
                              alt="im"
                            />
                          </Link>
                        </div>
                        <p className="fs-14 ms-2">
                          <Link to={route.instructorDetails}>James Kagan</Link>
                        </p>
                      </div>
                      <span className="tag-btn">Programming</span>
                    </div>
                    <h6 className="mt-3 mb-2">
                      <Link to={route.courseDetails}>
                        C# Developers Double Your Coding with Visual Studio
                      </Link>
                    </h6>
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-star fs-12 text-warning" />
                      <p className="fs-14 ms-1">4.8 (110 Reviews)</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <h5 className="text-secondary">$180</h5>
                      <Link
                        to={route.courseDetails}
                        className="btn btn-dark btn-sm d-inline-flex align-items-center"
                      >
                        View Course
                        <i className="fs-8 fas fa-angle-right ms-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /pagination */}
              <div className="row align-items-center">
                <div className="col-md-2">
                  <p className="pagination-text">Page 1 of 2</p>
                </div>
                <div className="col-md-10">
                  <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
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
        </div>
      </div>
      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Remove All</h4>
                <p className="mb-3">
                  Are you sure you want to remove all from wishlist?
                </p>
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-secondary rounded-pill"  data-bs-dismiss="modal">
                    Yes, Remove All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default StudentWishlist;
