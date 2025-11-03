import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import Table from "../../../core/common/dataTable/index";
import { StudentRefferalData } from "../../../core/common/data/json/studentRefferalData";
import ProfileCard from "../common/profileCard";

const StudentRefferal = () => {
  const route = all_routes;

  const data = StudentRefferalData;
  const columns = [
    {
      title: "Refferd ID",
      dataIndex: "Referred_ID",
      render: (text: string) => (
        <Link to="#" className="text-primary">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.Referred_ID.length - b.Referred_ID.length,
    },

    {
      title: "Referrals",
      dataIndex: "Referrals",
      render: (text: string, rendor: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={route.instructorDetails}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={`assets/img/user/${rendor.image}`} alt="" />
          </Link>
          <Link to={route.instructorDetails}>
            <p className="fs-14">{text}</p>
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.Referrals.length - b.Referrals.length,
    },
    {
      title: "URL",
      dataIndex: "URL",
      sorter: (a: any, b: any) => a.URL.length - b.URL.length,
    },
    {
      title: "",
      dataIndex: "FIELD4",
      render: () => (
        <Link to="#" className="action-icon">
          <i className="isax isax-document-copy4" />
        </Link>
      ),
      sorter: (a: any, b: any) => a.FIELD4.length - b.FIELD4.length,
    },
    {
      title: "Visits",
      dataIndex: "Visits",
      sorter: (a: any, b: any) => a.Visits.length - b.Visits.length,
    },
    {
      title: "Total Earned",
      dataIndex: "Total_Earned",
      sorter: (a: any, b: any) => a.Total_Earned.length - b.Total_Earned.length,
    },
  ];

  return (
    <>
      <Breadcrumb title="Referrals" />

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
                <h5>Referrals</h5>
              </div>
              <div className="row">
                <div className="col-xl-4 col-md-6">
                  <div className="student-info bg-skyblue-transparent referral-card border-0">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-skyblue me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/dollar-circle.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">
                          Net Earnings
                        </h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-skyblue">
                          $12,000
                        </span>
                        <p className="fs-13">Earning this month</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="student-info border-0 bg-secondary-transparent referral-card">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-secondary me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/wallet.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">Balance</h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-secondary">
                          $15,000
                        </span>
                        <p className="fs-13">In the Wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="student-info border-0 bg-info-transparent referral-card">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-info me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/wallet.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">
                          No of Referrals
                        </h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-info">
                          10
                        </span>
                        <p className="fs-13">In this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h5 className="mb-3 fs-18">Your Referral Link</h5>
                      <p className="mb-2">
                        You can earn easily money by copy and share
                      </p>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="https://zyural.com/refer/?refid=345re667877k9"
                        />
                      </div>
                      <Link to="#" className="btn btn-secondary rounded-pill">
                        Copy link
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h5 className="mb-3 fs-18">Withdraw Money</h5>
                      <ul className="mb-4">
                        <li className="mb-2">
                          Withdraw securely to your bank account.
                        </li>
                        <li>Commision is $25 per transaction under $10,000</li>
                      </ul>
                      <Link
                        to="#"
                        className="btn btn-secondary rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#withdraw_request"
                      >
                        Withdraw Money
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Table dataSource={data} columns={columns} Search={true} />
            </div>
          </div>
        </div>
      </div>
      <>
        {/* View Invoice */}
        <div className="modal fade" id="withdraw_request">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Withdrawal Request</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="card withdraw-item">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-6">
                          <div>
                            <p className="mb-1">Withdrawal Balance</p>
                            <h6>$15000</h6>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div>
                            <p className="mb-1">Selected </p>
                            <h6>PayPal</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Amount <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="$"
                    />
                    <p className="d-flex align-items-center pt-1">
                      <i className="isax isax-info-circle me-1" />
                      Minimum withdraw amount is $50
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-secondary rounded-pill"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /View Invoice */}
      </>
    </>
  );
};

export default StudentRefferal;
