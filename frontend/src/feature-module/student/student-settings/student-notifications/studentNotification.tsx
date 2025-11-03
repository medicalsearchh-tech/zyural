import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import SettingsLinks from "../settingsLinks/settingsLinks";
import ProfileCard from "../../common/profileCard";
import StudentSidebar from "../../common/studentSidebar";

const StudentNotification = () => {
  return (
    <>
      <Breadcrumb title="Settings" />
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
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <SettingsLinks />
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
                    <h6>Subscriptions</h6>
                    <small>
                      Notify me about activity from profile I’m subscribe to
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
                    <h6>Recommended Courses</h6>
                    <small>Notify me about courses that suits for me</small>
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
                    <h6>Reply to my comments</h6>
                    <small>Notify me about replies for my comments</small>
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
                    <h6>Activity on my comments</h6>
                    <small>Notify me about replies for my comments.</small>
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
                    <h6>Courses Activity</h6>
                    <small>
                      Send me emails about my courses activity and updates I
                      request
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
                    <h6>Promotions &amp; Recommendations</h6>
                    <small>
                      Send me emails about my courses promotions and
                      recommendations
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
                      id={"6"}
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
                      id={"17"}
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
                      id={"8"}
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

export default StudentNotification;
