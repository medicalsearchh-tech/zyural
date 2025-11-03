import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ProfileCard from "../../common/profileCard";
import StudentSidebar from "../../common/studentSidebar";
import SettingsLinks from "../settingsLinks/settingsLinks";
import SettingsModal from "../settingsModal/settingsModal";

const StudentBillingAddress = () => {
  return (
    <>
      <Breadcrumb title="Settings" />
      <div className="content">
        <div className="container">
          {/* Profile */}
          <ProfileCard />
          {/* /Profile */}
          <div className="row">
            {/* Sidebar */}
            <StudentSidebar />
            {/* Sidebar */}
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <SettingsLinks />
              <div className="card mb-0">
                <div className="card-body">
                  <form>
                    <div className="d-sm-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                      <div className="d-flex align-items-center mb-2 mb-sm-0">
                        <div>
                          <h6 className="mb-1">
                            Home{" "}
                            <span className="badge bg-soft-success ms-1 fs-12 fw-normal">
                              Default
                            </span>
                          </h6>
                          <p>16 Lake Floyd Circle, Newark, DE 19714</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="btn btn-light btn-sm border me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_billing"
                        >
                          <i className="isax isax-edit-2 me-2" />
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-secondary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="isax isax-trash me-1" />
                          Delete
                        </Link>
                      </div>
                    </div>
                    <div className="d-sm-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                      <div className="d-flex align-items-center mb-2 mb-sm-0">
                        <div>
                          <h6 className="mb-1">Work</h6>
                          <p>33 Hart Country Lane, West Point, GA 31833</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="btn btn-light btn-sm border me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_billing"
                        >
                          <i className="isax isax-edit-2 me-2" />
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-secondary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="isax isax-trash me-1" />
                          Delete
                        </Link>
                      </div>
                    </div>
                  </form>
                  <div className="mt-4">
                    <Link
                      to="#"
                      className="btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_billing"
                    >
                      Add New Address
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SettingsModal />
    </>
  );
};

export default StudentBillingAddress;
