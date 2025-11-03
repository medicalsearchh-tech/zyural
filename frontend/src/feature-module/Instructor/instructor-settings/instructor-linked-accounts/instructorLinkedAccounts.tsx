import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../../common/profileCard";
import InstructorSidebar from "../../common/instructorSidebar";
import InstructorSettingsLink from "../settings-link/instructorSettingsLink";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";

const InstructorLinkedAccounts = () => {
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
              <div className="card mb-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex align-items-center border-bottom mb-4 pb-4">
                        <div className="flex-shrink-0 me-3">
                          <ImageWithBasePath src="assets/img/icon/fb-icon.svg" alt="Img" />
                        </div>
                        <div className="d-sm-flex align-items-center justify-content-between w-100">
                          <div className="mb-2 mb-sm-0">
                            <h6 className="mb-1">Facebook</h6>
                            <p className="mb-0">
                              Facebook is a social platform for connecting,
                              sharing, and building communities globally.
                            </p>
                          </div>
                          <Link to="#" className="btn btn-dark flex-shrink-0">
                            Remove
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center border-bottom mb-4 pb-4">
                        <div className="flex-shrink-0 me-3">
                          <ImageWithBasePath
                            src="assets/img/icon/google-icon.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="d-sm-flex align-items-center justify-content-between w-100">
                          <div className="mb-2 mb-sm-0">
                            <h6 className="mb-1">Google</h6>
                            <p className="mb-0">
                              Google is widely used for search, maps, email, and
                              other services.
                            </p>
                          </div>
                          <Link to="#" className="btn btn-light flex-shrink-0">
                            Link Account
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center border-bottom mb-4 pb-4">
                        <div className="flex-shrink-0 me-3">
                          <ImageWithBasePath
                            src="assets/img/icon/github-icon.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="d-sm-flex align-items-center justify-content-between w-100">
                          <div className="mb-2 mb-sm-0">
                            <h6 className="mb-1">Github</h6>
                            <p className="mb-0">
                              GitHub is a version control and collaboration
                              platform for hosting, managing, and sharing code.
                            </p>
                          </div>
                          <Link to="#" className="btn btn-light flex-shrink-0">
                            Link Account
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <ImageWithBasePath
                            src="assets/img/icon/twitter-x-icon.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="d-sm-flex align-items-center justify-content-between w-100">
                          <div className="mb-2 mb-sm-0">
                            <h6 className="mb-1">Twitter</h6>
                            <p className="mb-0">
                              Twitter is a platform for sharing news, updates,
                              and global conversations.
                            </p>
                          </div>
                          <Link to="#" className="btn btn-light flex-shrink-0">
                            Link Account
                          </Link>
                        </div>
                      </div>
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

export default InstructorLinkedAccounts;
