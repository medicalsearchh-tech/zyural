import ProfileCard from "../../common/profileCard";
import AdminSidebar from "../../common/adminSidebar";
import AdminSettingsLink from "../settings-link/adminSettingsLink";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import CustomSelect from "../../../../core/common/commonSelect";
import {
  Payment_Method,
} from "../../../../core/common/selectOption/json/selectOption";
import { DatePicker } from "antd";

const AdminPlanSettings = () => {
  const getModalContainer = () => {
    const modalElement = document.getElementById("add_assignment");
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  };
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
              <div className="row">
                <div className="col-xl-5">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                        <h5 className="fs-18">Active Plan</h5>
                        <Link to="#" className="btn download-btn fs-12">
                          Download PDF
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-3 py-4">
                        <div>
                          <h6 className="mb-1">Standard Plan</h6>
                          <span className="fs-14">
                            Valid till:&nbsp;May 2025 - Jun 2025
                          </span>
                        </div>
                        <h4>$199</h4>
                      </div>
                      <div className="justify-content-end d-flex row-gap-2 flex-wrap">
                        <button
                          className="btn bg-gray-100 rounded-pill me-1 fs-12"
                          type="button"
                        >
                          Cancel Subscription
                        </button>
                        <button
                          className="btn btn-secondary rounded-pill fs-12"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                          type="submit"
                        >
                          Update Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-7">
                  <div className="card saved-card-items p-0 mb-3">
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center border-bottom mb-3 pb-3">
                        <h5 className="fs-18">Saved Cards</h5>
                        <Link
                          to="#"
                          className="btn btn-secondary fs-12"
                          data-bs-toggle="modal"
                          data-bs-target="#add_new_card"
                        >
                          <i className="isax isax-add-circle me-1" />
                          Add New Card
                        </Link>
                      </div>
                      <div className="row row-gap-3">
                        <div className="col-sm-6 px-2">
                          <div className="border rounded p-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="border p-2 rounded flex-shrink-0 me-2">
                                <ImageWithBasePath
                                  src="./assets/img/icons/visa-logo.svg"
                                  alt="img"
                                />
                              </div>
                              <div>
                                <h6>Credit Card</h6>
                                <small>Visa •••• 1568</small>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <Link to="#" className="btn btn-secondary fs-12">
                                Default
                              </Link>
                              <div className="d-flex gap-2">
                                <Link
                                  to="#"
                                  className="fs-14 text-gray-5 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_card"
                                >
                                  <i className="isax isax-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  className="fs-14 text-gray-5 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="isax isax-trash" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 px-2">
                          <div className="border rounded p-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="border p-2 rounded flex-shrink-0 me-2">
                                <ImageWithBasePath
                                  src="./assets/img/icons/Mastercard.svg"
                                  alt="img"
                                />
                              </div>
                              <div>
                                <h6>Debit Card</h6>
                                <small>•••• 1279</small>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-4">
                              <Link
                                to="#"
                                className="fs-14 text-secondary text-decoration-underline fw-normal"
                              >
                                Set as Default
                              </Link>
                              <div className="d-flex gap-2">
                                <Link
                                  to="#"
                                  className="fs-14 text-gray-5 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_card"
                                >
                                  <i className="isax isax-edit" />
                                </Link>
                                <Link
                                  to="#"
                                  className="fs-14 text-gray-5 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="isax isax-trash" />
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
              <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between p-3">
                <h5 className="fs-18">Transaction History</h5>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle text-gray-6 btn rounded border d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Status
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
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
                        Cancelled
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-responsive custom-table">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Plan Name</th>
                      <th>Payment Method</th>
                      <th>Subscribed On</th>
                      <th>Last Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV1245
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Standard Plan
                        </Link>
                      </td>
                      <td>Credit Card</td>
                      <td>11 May 2025</td>
                      <td>14 Jun 2025</td>
                      <td>$199</td>
                      <td>
                        <span className="badge badge-sm fs-10 bg-success rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Paid
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV3215
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Basic Plan
                        </Link>
                      </td>
                      <td>Debit Card</td>
                      <td>12 Apr 2025</td>
                      <td>14 May 2025</td>
                      <td>$99</td>
                      <td>
                        <span className="badge badge-sm bg-skyblue rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Pending
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV4581
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Premium Plan
                        </Link>
                      </td>
                      <td>Paypal</td>
                      <td>14 Mar 2025</td>
                      <td>14 Apr 2025</td>
                      <td>$299</td>
                      <td>
                        <span className="badge badge-sm fs-10 bg-success rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Paid
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV6545
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Basic Plan
                        </Link>
                      </td>
                      <td>Debit Card</td>
                      <td>13 Feb 2025</td>
                      <td>13 Mar 2025</td>
                      <td>$99</td>
                      <td>
                        <span className="badge badge-sm fs-10 bg-danger rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Cancelled
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV6546
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Basic Plan
                        </Link>
                      </td>
                      <td>Debit Card</td>
                      <td>12 Feb 2025</td>
                      <td>12 Mar 2025</td>
                      <td>$99</td>
                      <td>
                        <span className="badge badge-sm fs-10 bg-danger rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Cancelled
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #INV5769
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="fw-medium"
                          data-bs-toggle="modal"
                          data-bs-target="#pricing-plan"
                        >
                          Standard Plan
                        </Link>
                      </td>
                      <td>Stripe</td>
                      <td>05 Jan 2025</td>
                      <td>05 Feb 2025</td>
                      <td>$199</td>
                      <td>
                        <span className="badge badge-sm fs-10 bg-success rounded-pill d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Paid
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* pricing plan */}
        <div className="modal fade pricing-modal" id="pricing-plan">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="fw-bold">Pricing Plan</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <div className="modal-body">
                <div className="enable-item mb-3 d-flex align-items-center justify-content-center text-gray-9">
                  <label className="mb-0 me-2 fs-14">Monthly</label>
                  <div className="form-check form-switch check-on m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                    />
                  </div>
                  <label className="mb-0 ms-2 fs-14">Annualy</label>
                </div>
                <div className="row row-gap-4">
                  <div className="col-xl-4 col-lg-6 d-flex">
                    <div className="pricing-item flex-fill">
                      <h5 className="mb-2">Basic</h5>
                      <h1 className="mb-2 text-primary">
                        <sup className="me-1">$</sup>99
                      </h1>
                      <h6 className="fw-normal">
                        Ideal for individuals or small teams starting with
                        online education.
                      </h6>
                      <div className="border-top pt-3 mt-3">
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          10 active courses
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Basic course creation tools
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Student progress tracking
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />1 GB
                          storage
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Email notifications
                        </p>
                        <p className="d-flex align-items-center mb-0">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Community support
                        </p>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-secondary w-100 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#pricing-plan-two"
                      >
                        Choose Plan
                        <i className="isax isax-arrow-right-3 fs-10 ms-1" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 d-flex">
                    <div className="pricing-item flex-fill">
                      <h5 className="mb-2">Standard</h5>
                      <h1 className="mb-2 text-primary">
                        <sup className="me-1">$</sup>199
                      </h1>
                      <h6 className="fw-normal">
                        Ideal for growing institutions that need advanced tools
                        and greater flexibility.
                      </h6>
                      <div className="border-top pt-3 mt-3">
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Access to 20 courses
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Custom course certificates
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Basic analytics
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          10 GB storage
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Course scheduling
                        </p>
                        <p className="d-flex align-items-center mb-0">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Priority email and chat support
                        </p>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-secondary w-100 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#pricing-plan-two"
                      >
                        Choose Plan
                        <i className="isax isax-arrow-right-3 fs-10 ms-1" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 d-flex">
                    <div className="pricing-item flex-fill">
                      <h5 className="mb-2">Premium</h5>
                      <h1 className="mb-2 text-primary">
                        <sup className="me-1">$</sup>299
                      </h1>
                      <h6 className="fw-normal">
                        Designed for large-scale learning with robust features
                        and custom branding.
                      </h6>
                      <div className="border-top pt-3 mt-3">
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Unlimited courses
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Advanced course creation tools
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Detailed student analytics
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          100 GB storage
                        </p>
                        <p className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Integration with third-party tools
                        </p>
                        <p className="d-flex align-items-center mb-0">
                          <i className="fa-solid fa-circle fs-5 me-2" />
                          Completion certificates
                        </p>
                      </div>
                      <Link
                        to="#"
                        className="btn btn-secondary w-100 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#pricing-plan-two"
                      >
                        Choose Plan
                        <i className="isax isax-arrow-right-3 fs-10 ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* pricing plan */}

        <div className="modal fade" id="view_invoice">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Invoice</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <div className="modal-body">
                <div className="border-bottom mb-3">
                  <div className="row justify-content-between align-items-center flex-wrap row-gap-4">
                    <div className="col-md-6">
                      <div className="mb-2 invoice-logo-white">
                        <ImageWithBasePath
                          src="assets/img/logo.svg"
                          className="img-fluid"
                          alt="logo"
                        />
                      </div>
                      <p className="mb-2">
                        3099 Kennedy Court Framingham, MA 01702
                      </p>
                    </div>
                    <div className="col-md-6">
                      <div className=" text-end mb-3">
                        <h6 className="text-default mb-1 text-secondary fs-16">
                          #OI0010
                        </h6>
                        <p className="mb-1">
                          Created Date :{" "}
                          <span className="text-gray-9">Aug 25, 2025</span>{" "}
                        </p>
                        <p>
                          Due Date :{" "}
                          <span className="text-gray-9">Aug 30, 2025</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-bottom mb-3">
                  <div className="row g-4">
                    <div className="col-lg-5">
                      <span className="mb-3 d-flex">From</span>
                      <div>
                        <h6 className="mb-2 fs-16">Thomas Lawler</h6>
                        <p className="fs-14 mb-1">
                          2077 Chicago Avenue Orosi, CA 93647
                        </p>
                        <p className="fs-14 mb-1">
                          Email :thomaslawler@example.com
                        </p>
                        <p className="fs-14">Phone : +1 987 654 3210</p>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <span className="mb-3 d-flex">To</span>
                      <div>
                        <h6 className="mb-2">Ronald Richard</h6>
                        <p className="fs-14 mb-1">
                          3103 Trainer Avenue Peoria, IL 61602
                        </p>
                        <p className="fs-14 mb-1">
                          Email : <Link to="#">adre3@example.com</Link>
                        </p>
                        <p className="fs-14">
                          Phone : <Link to="#">+1 987 471 6589</Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="mb-3 text-end">
                        <span className="mb-1 d-block">Payment Status</span>
                        <span className="badge bg-success badge-md d-inline-flex align-items-center fs-10 fw-normal mb-4">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
                        </span>
                        <div>
                          <ImageWithBasePath
                            src="assets/img/icon/qr.svg"
                            className="img-fluid"
                            alt="QR"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="table-responsive">
                    <table className="table invoice-table">
                      <thead className="thead-light">
                        <tr>
                          <th className="w-50 bg-light-400">Description</th>
                          <th className="text-center bg-light-400">Qty</th>
                          <th className="text-end bg-light-400">Cost</th>
                          <th className="text-end bg-light-400">Discount</th>
                          <th className="text-end bg-light-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <p className="text-gray-9 fw-semibold">
                              Basic Plan
                            </p>
                          </td>
                          <td className="text-gray text-center">1</td>
                          <td className="text-gray text-end">$120</td>
                          <td className="text-gray text-end">$0</td>
                          <td className="text-gray text-end">$120</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="border-bottom mb-3 pb-3">
                  <div className="row">
                    <div className="col-md-6" />
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center border-bottom my-2 pb-2 pe-3">
                        <p className="text-gray mb-0">Sub Total</p>
                        <p className="text-gray-9 fw-medium">$120</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-bottom my-2 pb-2 pe-3">
                        <p className="mb-0">Discount (0%)</p>
                        <p className="text-gray-9 fs-14 fw-medium">$0</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3 pe-3">
                        <p className="mb-0">VAT (5%)</p>
                        <p className="text-gray-9 fs-14 fw-medium mb-2">$0</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2 pe-3">
                        <h6 className="fs-16">Total Amount</h6>
                        <h6 className="fs-16">$120</h6>
                      </div>
                      <p>Amount in Words : Dollar One Hundred Twenty</p>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center gy-3">
                  <div className="col-lg-9">
                    <div className="mb-3">
                      <h6 className="mb-1 fs-16">Notes</h6>
                      <p>Invoice for course purchase, covering course fee.</p>
                    </div>
                    <div>
                      <h6 className="mb-1 fs-16">Terms and Conditions</h6>
                      <p>
                        Full payment grants non-transferable access to the
                        course.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-end pe-4 mb-2">
                      <ImageWithBasePath
                        src="assets/img/sign.svg"
                        className="img-fluid"
                        alt="sign"
                      />
                    </div>
                    <div className="text-end">
                      <h6 className="fs-16 pe-3 mb-2">Ted M. Davis</h6>
                      <p>Assistant Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /View Invoice */}
        {/* add new card */}
        <div className="modal fade" id="add_new_card">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add New Card</h5>
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
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Method<span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={Payment_Method}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Card Number<span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 add-card-date">
                        <label className="form-label">
                          Expiration Date<span className="text-danger"> *</span>
                        </label>
                        <div className="input-icon position-relative calender-input">
                          <span className="input-icon-addon">
                            <i className="isax isax-calendar z-1" />
                          </span>
                          <DatePicker
                            className="form-control datetimepicker"
                            getPopupContainer={getModalContainer}
                            placeholder="dd/mm/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          CVV<span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Name on Card<span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
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
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* add new card */}
        {/* edit card */}
        <div className="modal fade" id="edit_card">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Card</h5>
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
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Method<span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={Payment_Method}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Card Number<span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="9834 7923 4098 1568"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3 add-card-date">
                        <label className="form-label">
                          Expiration Date<span className="text-danger"> *</span>
                        </label>
                        <div className="input-icon position-relative calender-input">
                          <span className="input-icon-addon">
                            <i className="isax isax-calendar" />
                          </span>
                          <DatePicker
                            className="form-control datetimepicker"
                            getPopupContainer={getModalContainer}
                            placeholder="dd/mm/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          CVV<span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={725}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Name on Card<span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Eugene Andre"
                        />
                      </div>
                    </div>
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* edit card */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Delete Card</h4>
                  <p className="mb-3">Are you sure you want to delete card?</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-secondary rounded-pill"
                      data-bs-dismiss="modal"
                    >
                      Yes, Remove All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </>
  );
};

export default AdminPlanSettings;
