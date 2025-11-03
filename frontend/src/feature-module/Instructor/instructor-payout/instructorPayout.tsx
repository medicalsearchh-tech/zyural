import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import InstructorSidebar from "../common/instructorSidebar";
import ProfileCard from "../common/profileCard";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { PayoutData } from "../../../core/common/data/json/payoutData";

const InstructorPayout = () => {


  const data = PayoutData;
  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      render: (text: string) => (
        <Link to="#" className="text-primary">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.ID.length - b.ID.length,
    },
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: (a: any, b: any) => a.Amount.length - b.Amount.length,
    },
    {
      title: "Payment Method",
      dataIndex: "PaymentMethod",
      sorter: (a: any, b: any) =>
        a.PaymentMethod.length - b.PaymentMethod.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-sm ${
            text === "Paid"
              ? "bg-success"
              : text === "Pending"
              ? "bg-info"
              : "bg-danger"
          } bg-success d-inline-flex align-items-center`}
        >
          <i className="fa-solid fa-circle fs-5 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
  ];

  return (
    <>
      <Breadcrumb title="Payouts" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="payouts">
                <div className="alert alert-warning alert-dismissible d-flex fade show mb-4">
                  <i className="isax isax-information4 flex-shrink-0 me-2" />
                  Your selected payout method was confirmed on Next Payout on 15
                  Jan, 2025 for "payout@example.com"
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  >
                    <i className="isax isax-close-circle5" />
                  </button>
                </div>
                <div className="row mb-4">
                  <div className="col-xl-5">
                    <div className="earning-this-month border">
                      <ImageWithBasePath
                        src="./assets/img/shapes/withdraw-bg1.svg"
                        className="earning-bg1"
                        alt="img"
                      />
                      <ImageWithBasePath
                        src="./assets/img/shapes/withdraw-bg2.svg"
                        className="earning-bg2"
                        alt="img"
                      />
                      <div className="flex-shrink-0 earn-img">
                        <ImageWithBasePath
                          className="img-fluid"
                          src="./assets/img/icons/icon-2.svg"
                          alt="img"
                        />
                      </div>
                      <div className="ps-3">
                        <h6 className="mb-2">Earning this month</h6>
                        <h5>$8,420</h5>
                        <p>Update your payout in settings</p>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#withdraw-req"
                      >
                        Withdraw
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <h6 className="mb-3">Select Payment Gateway for Payout</h6>
                    <div className="payment-method">
                      <div className="row g-3">
                        <div className="col-lg-6">
                          <div>
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio1"
                              defaultChecked
                            />
                            <label
                              className="btn bg-white btn-check-label w-100 d-flex justify-content-between align-items-center"
                              htmlFor="btnradio1"
                            >
                              <span className="d-flex align-items-center">
                                <span className="check-outer me-2">
                                  <i />
                                </span>
                                <ImageWithBasePath
                                  src="assets/img/icons/paypal.svg"
                                  alt="img"
                                />
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div>
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio2"            
                            />
                            <label
                              className="btn btn-check-label bg-white w-100 d-flex justify-content-between align-items-center"
                              htmlFor="btnradio2"
                            >
                              <span className="d-flex align-items-center fs-16 fw-medium">
                                <span className="check-outer me-2">
                                  <i />
                                </span>
                                Bank Transfer
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 className="page-title">Payouts</h5>
                <div className="table-top">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div className="mb-3">
                          <div className="dropdown me-3">
                            <Link
                              to="#"
                              className="dropdown-toggle btn d-inline-flex align-items-center"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Payment Method
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Paypal
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Bank Transfer
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Stripe
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="dropdown me-3">
                            <Link
                              to="#"
                              className="dropdown-toggle btn d-inline-flex align-items-center"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Status
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Paid
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Pending
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                >
                                  Cancel
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                    </div>
                  </div>
                </div>
                <Table dataSource={data} columns={columns} Search={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="withdraw-req">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Withdrawal Request</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form>
              <div className="modal-body pb-0">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <p className="mb-2">Withdrawal Balance</p>
                        <h6 className="fs-16">$5340</h6>
                      </div>
                      <div className="col-6">
                        <p className="mb-2">Selected</p>
                        <h6 className="fs-16">PayPal</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Amount<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="$ "
                  />
                  <p className="form-info">
                    <i className="isax isax-info-circle" />
                    Minimum withdraw amount is $50
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn bg-gray-100 rounded-pill me-2"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
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
    </>
  );
};

export default InstructorPayout;
