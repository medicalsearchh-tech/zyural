import ProfileCard from "../common/profileCard";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";

const StudentOrder = () => {

  return (
    <>
      <Breadcrumb title="Order History" />
      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard/>
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Order History</h5>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle btn rounded border d-inline-flex align-items-center"
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
                            Completed
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
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-icon mb-3">
                    <span className="input-icon-addon">
                      <i className="isax isax-search-normal-14" />
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-md"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive custom-table">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
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
                          #ORD010
                        </Link>
                      </td>
                      <td>22 Aug 2025</td>
                      <td>$160</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
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
                          #ORD009
                        </Link>
                      </td>
                      <td>10 Aug 2025</td>
                      <td>$180</td>
                      <td>
                        <span className="badge bg-info d-inline-flex align-items-center me-1">
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
                          #ORD008
                        </Link>
                      </td>
                      <td>26 Jul 2025</td>
                      <td>$200</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
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
                          #ORD007
                        </Link>
                      </td>
                      <td>12 Jul 2025</td>
                      <td>$220</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
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
                          #ORD006
                        </Link>
                      </td>
                      <td>02 Jul 2025</td>
                      <td>$170</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
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
                          #ORD005
                        </Link>
                      </td>
                      <td>25 Jun 2025</td>
                      <td>$150</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
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

      {/* View Invoice */}
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
                      <span className="badge bg-success badge-sm d-inline-flex align-items-center fs-10 fw-normal mb-4">
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
                <div className="table-responsive custom-table rounded-0">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th className="w-50">Description</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Cost</th>
                        <th className="text-end">Discount</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p className="text-gray-9">
                            Information About UI/UX Design Degree
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
                    <h6 className="mb-1 fs-15">Notes</h6>
                    <p>
                      Invoice for course purchase, covering course fee,
                      discounts, and applicable taxes.
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-1 fs-16">Terms and Conditions</h6>
                    <p>
                      Full payment grants non-transferable access to the course,
                      subject to the provider’s refund policy.{" "}
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-end pe-4 mb-2">
                    <ImageWithBasePath
                      src="assets/img/icons/sign.svg"
                      className="img-fluid"
                      alt="sign"
                    />
                  </div>
                  <div className="text-end">
                    <h6 className="fs-15 pe-3 mb-2">Ted M. Davis</h6>
                    <p>Assistant Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /View Invoice */}
    </>
  );
};

export default StudentOrder;
