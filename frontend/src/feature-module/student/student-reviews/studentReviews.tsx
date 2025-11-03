import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import { all_routes } from "../../router/all_routes";
import ProfileCard from "../common/profileCard";

const StudentReviews = () => {

    const route = all_routes;

  return (
    <>
      <Breadcrumb title="Reviews" />

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
                <h5>Reviews</h5>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">6 months ago</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    This is the second Photoshop course I have completed with
                    Nancy Duarte. Worth every penny and recommend it highly. To
                    get the most out of this course, its best to to take the
                    Beginner to Advanced course first. The sound and video
                    quality is of a good standard. Thank you Nancy Duarte.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Edit
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Delete
                    </Link>
                  </div>
                </div>
                <div className="bg-light border p-3 rounded-2">
                  <h6 className="mb-1">Reply</h6>
                  <p className="fs-14">
                    As a learner who has navigated through various online
                    platforms, the sophistication and user-centric design of
                    this website set a new
                  </p>
                </div>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 months ago</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    I've been using this LMS for several months for my online
                    courses, and it's been a game-changer. The interface is
                    incredibly user-friendly, making it easy for both
                    instructors and students to navigate through the courses.
                    The variety of tools available for creating interactive and
                    engaging content has significantly enhanced the learning
                    experience.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Edit
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 months ago</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    Any time I've had a question or encountered a minor issue,
                    the customer support team has been quick to respond and
                    incredibly helpful. Moreover, the reliability of this LMS
                    has impressed me—downtime is nearly non-existent, ensuring
                    that students have access to their courses 24/7.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Edit
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 months ago</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    From the onset, my experience with this LMS Website has been
                    nothing short of extraordinary. As a learner who has
                    navigated through various online platforms, the
                    sophistication and user-centric design of this website set a
                    new benchmark for what digital education should look like.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Edit
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
              {/* /pagination */}
              <div className="row align-items-center mt-3">
                <div className="col-md-2">
                  <p className="pagination-text">Page 1 of 2</p>
                </div>
                <div className="col-md-10">
                  <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
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
          </div>
        </div>
      </div>

      {/* Edit Review */}
      <div className="modal fade" id="edit_review">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit Review</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="mb-3">
                <label className="form-label fs-14">
                  Your Rating <span className="text-danger">*</span>
                </label>
                <div className="selection-wrap">
                  <div className="d-inline-block">
                    <div className="rating-selction">
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={5}
                        id="rating5"
                        defaultChecked
                      />
                      <label htmlFor="rating5">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={4}
                        id="rating4"
                        defaultChecked
                      />
                      <label htmlFor="rating4">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={3}
                        id="rating3"
                        defaultChecked
                      />
                      <label htmlFor="rating3">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={2}
                        id="rating2"
                      />
                      <label htmlFor="rating2">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={1}
                        id="rating1"
                      />
                      <label htmlFor="rating1">
                        <i className="fa-solid fa-star" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fs-14">
                  Write Your Review <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control lh-base"
                  rows={3}
                  defaultValue={
                    "This is the second Photoshop course I have completed with Nancy Duarte. Worth every penny and recommend it highly. To get the most out of this course, its best to to take the Beginner to Advanced course first. The sound and video quality is of a good standard. Thank you Nancy Duarte."
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to="#"
                className="btn btn-md bg-gray-100 rounded-pill me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </Link>
              <button
                type="button"
                className="btn btn-md btn-secondary rounded-pill"
                 data-bs-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Review */}
      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Review</h4>
                <p className="mb-3">Are you sure you want to delete review?</p>
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

export default StudentReviews;
