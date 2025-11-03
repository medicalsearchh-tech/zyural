import ProfileCard from "../../common/profileCard";
import AdminSidebar from "../../common/adminSidebar";
import AdminSettingsLink from "../settings-link/adminSettingsLink";

const AdminWithdraw = () => {
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
              <form >
                <div className="withdraw-method">
                  <h5 className="fs-18 mb-3">Select a withdraw method</h5>
                  <ul className="nav nav-pills" id="pills-tab" role="tablist">
                    <li className="nav-item mb-3" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        Bank Transfer <span>Minimum withdraw $50</span>
                      </button>
                    </li>
                    <li className="nav-item mb-3" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                      >
                        Stripe<span>Minimum withdraw $50</span>
                      </button>
                    </li>
                    <li className="nav-item mb-3" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-contact-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-contact"
                        type="button"
                        role="tab"
                        aria-controls="pills-contact"
                        aria-selected="false"
                      >
                        PayPal<span>Minimum withdraw $50</span>
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Account Name
                              <span className="text-danger"> *</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Account Number
                              <span className="text-danger"> *</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Bank Name<span className="text-danger"> *</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              IBAN<span className="text-danger"> *</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              BIC / SWIFT<span className="text-danger"> *</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button className="btn btn-secondary" type="submit">
                            Save Withdrawal Account
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                    >
                      <div className="mb-3">
                        <label className="form-label">
                          Stripe Email Address
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control mb-1"
                          defaultValue="test@example.com"
                        />
                        <span className="fs-14">
                          We will use this email address to send the money to
                          your Stripe account
                        </span>
                      </div>
                      <button className="btn btn-secondary" type="submit">
                        Save Withdrawal Account
                      </button>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-contact"
                      role="tabpanel"
                      aria-labelledby="pills-contact-tab"
                    >
                      <div className="mb-3">
                        <label className="form-label">
                          PayPal Email Address
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control mb-1"
                          defaultValue="test@example.com"
                        />
                        <span className="fs-14">
                          We will use this email address to send the money to
                          your PayPal account
                        </span>
                      </div>
                      <button className="btn btn-secondary" type="submit">
                        Save Withdrawal Account
                      </button>
                    </div>
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

export default AdminWithdraw;
