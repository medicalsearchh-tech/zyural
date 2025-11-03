import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import InstructorSettingsLink from "../settings-link/instructorSettingsLink";
import ProfileCard from "../../common/profileCard";
import InstructorSidebar from "../../common/instructorSidebar";

const InstructorSocialprofileSettings = () => {
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
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Twitter</label>
                      <div className="position-relative input-icon-start">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.twitter.com/"
                        />
                        <span className="social-icon">
                          <i className="fa-brands fa-x-twitter fs-14" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Facebook</label>
                      <div className="position-relative input-icon-start">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.facebook.com/"
                        />
                        <span className="social-icon">
                          <i className="fa-brands fa-square-facebook fs-14" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Instagram</label>
                      <div className="position-relative input-icon-start">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.instagram.com/"
                        />
                        <span className="social-icon">
                          <i className="fa-brands fa-instagram fs-14" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">LinkedIn</label>
                      <div className="position-relative input-icon-start">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.linkedin.com/"
                        />
                        <span className="social-icon">
                          <i className="fa-brands fa-linkedin-in fs-14" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">YouTube</label>
                      <div className="position-relative input-icon-start">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.youtube.com/"
                        />
                        <span className="social-icon">
                          <i className="fa-brands fa-youtube fs-14" />
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="btn btn-secondary" type="submit">
                        Save Social Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorSocialprofileSettings;
