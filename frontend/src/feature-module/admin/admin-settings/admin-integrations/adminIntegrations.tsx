import ProfileCard from "../../common/profileCard";
import AdminSidebar from "../../common/adminSidebar";
import AdminSettingsLink from "../settings-link/adminSettingsLink";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";

const AdminIntegrations = () => {

  return (
    <>
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* Sidebar */}
            <AdminSidebar />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <AdminSettingsLink />
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="d-flex align-items-center justify-content-between border mb-3 p-3 rounded-3">
                      <div className="meet-icon me-3 flex-shrink-0">
                        <ImageWithBasePath
                          src="./assets/img/icons/meet-icon-1.svg"
                          alt="img"
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div>
                          <h6 className="mb-1">Zoom Meeting</h6>
                          <p className="small">
                            A virtual platform for real-time video, audio, and
                            screen-sharing collaboration.
                          </p>
                        </div>
                        <div className="form-check form-switch form-check-md mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkZoom"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Client ID <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Client Secret Key{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <hr className="mb-4 mt-1" />
                    <div className="d-flex align-items-center justify-content-between border mb-3 p-3 rounded-3">
                      <div className="meet-icon me-3 flex-shrink-0">
                        <ImageWithBasePath
                          src="./assets/img/icons/meet-icon-2.svg"
                          alt="img"
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div>
                          <h6 className="mb-1">Google Meet</h6>
                          <p className="small">
                            A video conferencing platform for seamless virtual
                            meetings, collaboration, and screen sharing.
                          </p>
                        </div>
                        <div className="form-check form-switch form-check-md mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkGoogle"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Client ID <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Client Secret Key{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <Link to="#" className="btn btn-secondary">
                      Save Changes
                    </Link>
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

export default AdminIntegrations;
