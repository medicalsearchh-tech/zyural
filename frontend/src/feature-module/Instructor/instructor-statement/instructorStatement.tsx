import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import InstructorSidebar from "../common/instructorSidebar";
import ProfileCard from "../common/profileCard";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { StatementData } from "../../../core/common/data/json/statementData";

const InstructorStatement = () => {

  const data = StatementData;
  const columns = [
    {
      title: "OrderID",
      dataIndex: "OrderID",
      render: (text: string) => (
        <Link to="#" data-bs-toggle="modal" data-bs-target="#view_invoice">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.OrderID.length - b.OrderID.length,
    },
    {
      title: "Course",
      dataIndex: "Course",
      sorter: (a: any, b: any) => a.Course.length - b.Course.length,
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
        <span className={`badge badge-sm ${text === 'Completed' ? 'bg-success' : text === 'Pending' ? 'bg-info' : ''}  d-inline-flex align-items-center`}>
          <i className="fa-solid fa-circle fs-5 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "",
      dataIndex: "Action",
      render: () => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="d-inline-flex fs-14 me-1 action-icon"
            data-bs-toggle="modal"
            data-bs-target="#view_invoice"
          >
            <i className="isax isax-eye" />
          </Link>
          <Link to="#" className="d-inline-flex fs-14 action-icon">
            <i className="isax isax-import" />
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.Action.length - b.Action.length,
    },
  ];
  return (
    <>
      <Breadcrumb title="Statements" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="statements">
                <h5 className="page-title">Statements</h5>
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
                    <h6 className="mb-1 fs-16">Notes</h6>
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
                    <h6 className="fs-16 pe-3 mb-2">Ted M. Davis</h6>
                    <p>Assistant Manager</p>
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

export default InstructorStatement;
