import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import SettingsLinks from "../settingsLinks/settingsLinks";
import ProfileCard from "../../common/profileCard";
import StudentSidebar from "../../common/studentSidebar";

const StudentSocialProfile = () => {

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
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Twitter</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.twitter.com/"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Facebook</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.facebook.com/"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Instagram</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.instagram.com/"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">LinkedIn</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.linkedin.com/"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">YouTube</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.youtube.com/"
                          />
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
        </div>
      </div>
    </>
  );
};

export default StudentSocialProfile;
