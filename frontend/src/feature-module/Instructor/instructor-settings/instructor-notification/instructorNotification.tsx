import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../../common/profileCard";
import InstructorSidebar from "../../common/instructorSidebar";
import InstructorSettingsLink from "../settings-link/instructorSettingsLink";

const InstructorNotification = () => {

  return (
    <>
      <Breadcrumb title="Settings" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* Sidebar */}
            <InstructorSidebar />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <InstructorSettingsLink />
              <form>
                {/* Title */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                  <h5 className="fs-18 mb-0">General Notifications</h5>
                  <button className="btn btn-sm btn-dark" type="button">
                    Toggle all
                  </button>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Student Questions</h6>
                    <small>
                      Notify me when a student asks a question in the Q&amp;A
                      section
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkPrivacy1"
                      defaultChecked
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Feedback Received</h6>
                    <small>Notify me when receive feedback from students</small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"7"}
                      defaultChecked
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Quiz/Exam Results Submission</h6>
                    <small>
                      Notify me when quiz or exam results are submitted
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"4"}
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Forum Activity</h6>
                    <small>
                      Notify me about new posts or replies in course discussion
                      forums.
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"5"}
                    />
                  </div>
                </div>
              </form>
              <div className="text-center my-5" />
              <form>
                {/* Title */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                  <h5 className="fs-18 mb-0">Email Notifications</h5>
                  <button className="btn btn-sm btn-dark" type="button">
                    Toggle all
                  </button>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Course Enrolment</h6>
                    <small>
                      Send me emails when a new student enrolls the course
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkPrivacy6"
                      defaultChecked
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Assignment Submission</h6>
                    <small>
                      Send me email whenever an assignment is submitted by a
                      student
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkPrivacy7"
                      defaultChecked
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Course Comments</h6>
                    <small>
                      Get notified about comments on your posts and replies to
                      your comments.
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"8"}
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>Course Reminders</h6>
                    <small>
                      Receive booking assistance reminders to stay updated on
                      your scheduled sessions.
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"9"}
                    />
                  </div>
                </div>
                {/* Item */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Content */}
                  <div>
                    <h6>System Updates</h6>
                    <small>
                      Send me emails about updates to the LMS platform{" "}
                    </small>
                  </div>
                  {/* Switch */}
                  <div className="form-check form-switch form-check-md mb-0 ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={"17"}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorNotification;
