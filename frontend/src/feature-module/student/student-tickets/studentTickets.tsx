import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import StudentSidebar from "../common/studentSidebar";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { StudentTicketsData } from "../../../core/common/data/json/studentTicketsData";
import {
  Category,
  Priority,
} from "../../../core/common/selectOption/json/selectOption";
import CustomSelect from "../../../core/common/commonSelect";
import DefaultEditor from "react-simple-wysiwyg";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const StudentTickets = () => {

  const data = StudentTicketsData;
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "TicketID",
      render: (text: string) => (
        <Link
          to="#"
          className="text-primary"
          data-bs-toggle="modal"
          data-bs-target="#ticket_details"
        >
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.TicketID.length - b.TicketID.length,
    },

    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Subject",
      dataIndex: "Subject",
      sorter: (a: any, b: any) => a.Subject.length - b.Subject.length,
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      render: (text: string) => (
        <span
          className={`badge badge-sm ${
            text === "High"
              ? "bg-soft-danger"
              : text === "Low"
              ? "bg-soft-success"
              : "bg-soft-skyblue"
          }  d-inline-flex align-items-center`}
        >
          <i className="fa-solid fa-circle fs-5 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Priority.length - b.Priority.length,
    },
    {
      title: "Category",
      dataIndex: "Category",
      sorter: (a: any, b: any) => a.Category.length - b.Category.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge badge-sm ${
            text === "Opened"
              ? "bg-purple"
              : text === "Inprogress"
              ? "bg-warning"
              : "bg-success"
          }  d-inline-flex align-items-center`}
        >
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
            data-bs-target="#ticket_details"
          >
            <i className="isax isax-eye" />
          </Link>
          <Link
            to="#"
            className="d-inline-flex fs-14 me-1 action-icon"
            data-bs-toggle="modal"
            data-bs-target="#edit_ticket"
          >
            <i className="isax isax-edit-2" />
          </Link>
          <Link
            to="#"
            className="d-inline-flex fs-14 action-icon"
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
          >
            <i className="isax isax-trash" />
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.Action.length - b.Action.length,
    },
  ];

  const [values, setValue] = React.useState();
  function onChange(e: any) {
    setValue(e.target.value);
  }
  return (
    <>
      <Breadcrumb title="Messages" />
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
              <div className="tickets">
                <div className="d-flex align-items-center justify-content-between flex-wrap page-title">
                  <h5>Support Tickets</h5>
                  <Link
                    to="#"
                    className="btn btn-secondary rounded-pill"
                    data-bs-toggle="modal"
                    data-bs-target="#add_ticket"
                  >
                    <i className="isax isax-add-circle me-2 fs-10" />
                    Add Ticket
                  </Link>
                </div>
                <div className="row">
                  <div className="col-md-6 col-xl-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <span className="icon-box bg-primary-transparent me-3 flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/icon/graduation.svg"
                              alt=""
                            />
                          </span>
                          <div>
                            <span className="d-block">Total Tickets</span>
                            <h4 className="fs-24 mt-1">50</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <span className="icon-box bg-secondary-transparent me-3 flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/icon/book.svg"
                              alt=""
                            />
                          </span>
                          <div>
                            <span className="d-block">Opened Tickets</span>
                            <h4 className="fs-24 mt-1">30</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <span className="icon-box bg-success-transparent me-3 flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/icon/bookmark.svg"
                              alt=""
                            />
                          </span>
                          <div>
                            <span className="d-block">Closed Tickets</span>
                            <h4 className="fs-24 mt-1">25</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="mb-3">
                        <div className="dropdown me-3">
                          <Link
                            to="#"
                            className="dropdown-toggle text-gray-6 btn  rounded border d-inline-flex align-items-center"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Category
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Mailing Issues
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Language Issues
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Installation Error
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="dropdown me-3">
                          <Link
                            to="#"
                            className="dropdown-toggle text-gray-6 btn  rounded border d-inline-flex align-items-center"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Priority
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                High
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Low
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Medium
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="dropdown-toggle text-gray-6 btn  rounded border d-inline-flex align-items-center"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Status
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Opened
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Inprogress
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Closed
                              </Link>
                            </li>
                          </ul>
                        </div>
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
                <Table dataSource={data} columns={columns} Search={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Ticket */}
      <div className="modal fade" id="add_ticket">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Add Ticket</h5>
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
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Ticket Title <span className="text-danger"> *</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Category <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        options={Category}
                        className="select d-flex"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Priority <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        options={Priority}
                        className="select d-flex"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <DefaultEditor value={values} onChange={onChange} />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="file-upload drag-file w-100 d-flex align-items-center justify-content-center flex-column">
                        <span className="upload-img mb-2">
                          <i className="isax isax-folder5 fs-24" />
                        </span>
                        <p className="mb-1 text-gray-9 fw-medium">
                          Drag and drop your files
                        </p>
                        <p className="mb-2 fs-12">
                          Accept File Type: doc,docx,jpg,jpeg,png,txt,pdf
                        </p>
                        <input type="file" accept="video/image" />
                        <span className="btn mt-2 btn-secondary rounded-pill">
                          <i className="isax isax-document-upload me-1" />
                          Upload
                        </span>
                      </div>
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Ticket */}
      {/* Edit Ticket */}
      <div className="modal fade" id="edit_ticket">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Edit Ticket</h5>
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
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Ticket Title <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Issue with Course Notification Emails"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Category <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        options={Category}
                        className="select d-flex"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Priority <span className="text-danger"> *</span>
                      </label>
                      <CustomSelect
                        options={Priority}
                        className="select d-flex"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <div className="summernote">
                        <DefaultEditor value={values} onChange={onChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="file-upload drag-file w-100 d-flex align-items-center justify-content-center flex-column">
                        <span className="upload-img mb-2">
                          <i className="isax isax-folder5 fs-24" />
                        </span>
                        <p className="mb-1 text-gray-9 fw-medium">
                          Drag and drop your files
                        </p>
                        <p className="mb-2 fs-12">
                          Accept File Type: doc,docx,jpg,jpeg,png,txt,pdf
                        </p>
                        <input type="file" accept="video/image" />
                        <span className="btn mt-2 btn-secondary rounded-pill">
                          <i className="isax isax-document-upload me-1" />
                          Upload
                        </span>
                      </div>
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
      {/* /Edit Ticket */}
      {/* Ticket Details */}
      <div className="modal fade" id="ticket_details">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="d-inline-flex align-items-center">
                Ticket Details{" "}
                <span className="text-primary fs-14 ms-2">#TIC010</span>
              </h5>
              <div className="d-flex align-items-center justify-content-end">
                <span className="badge badge-sm bg-purple d-inline-flex align-items-center me-2">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Opened
                </span>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-4">
                  <div className="mb-3">
                    <h6 className="mb-1">Category</h6>
                    <p>Mailing Issues</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-3">
                    <h6 className="mb-1">Date</h6>
                    <p>26 Jul 2025</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-3">
                    <h6 className="mb-1">Priority</h6>
                    <span className="badge bg-soft-danger badge-sm d-inline-flex align-items-center">
                      <i className="fa-solid fa-circle fs-5 me-1" />
                      High
                    </span>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="mb-3">
                    <h6 className="mb-1">Subject</h6>
                    <p>Issue with Course Notification Emails</p>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div>
                    <h6 className="mb-1">Description</h6>
                    <p>
                      I am not receiving important emails from the LMS platform,
                      such as course notifications, enrollment confirmations, or
                      assignment updates. Additionally, some students have
                      reported that they are not receiving emails about live
                      classes or announcements. This issue is affecting
                      communication and timely updates for both instructors and
                      students. Please investigate and resolve this issue as
                      soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Ticket Details */}
      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Ticket</h4>
                <p className="mb-3">Are you sure you want to delete ticket?</p>
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
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default StudentTickets;
