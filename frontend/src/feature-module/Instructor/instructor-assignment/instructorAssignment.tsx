import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import CustomSelect from '../../../core/common/commonSelect'
import Table from "../../../core/common/dataTable/index";
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { assignmentsData } from '../../../core/common/data/json/assignmentsData'
import { DatePicker } from 'antd';

const InstructorAssignment = () => {
  const data = assignmentsData;
  const getModalContainer = () => {
    const modalElement = document.getElementById('add_assignment');
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
};
  const getModalContainer2 = () => {
    const modalElement = document.getElementById('edit_assignment');
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
};
  const columns = [
  
    {
      title: "Assignment Name",
      dataIndex: "Assignments",
      render: (text: string,record:any) => (
        <div>
          <h6 className="mb-1"><Link to="#" data-bs-toggle="modal" data-bs-target="#view_assignment">{text}</Link></h6>
          <p>{record.AssignmentsNotes}</p>
        </div>
      ),
      sorter: (a: any, b: any) => a.Assignment.length - b.Assignment.length,
    },
    {
      title: "TotalMark",
      dataIndex: "TotalMark",
      sorter: (a: any, b: any) => a.TotalMark.length - b.TotalMark.length,
    },
    {
      title: "TotalSubmit",
      dataIndex: "TotalSubmit",
      sorter: (a: any, b: any) => a.TotalSubmit.length - b.TotalSubmit.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span 
        className={`badge badge-sm ${text === 'Draft'?'bg-skyblue':text === 'Pending'?'bg-info':'bg-success'} d-inline-flex align-items-center me-1`}>
          <i className="fa-solid fa-circle fs-5 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "",
      render: () => (
        <div className="d-flex align-items-center">
          <Link to="#" className="d-inline-flex fs-14 me-1 action-icon"><i className="isax isax-edit-2" data-bs-toggle="modal" data-bs-target="#edit_assignment"></i></Link>
          <Link to="#" className="d-inline-flex fs-14 action-icon" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash"></i></Link>
        </div>
      ),
    },
    
  ]
  const Status = [
    {  label: "Published" ,value: "1"},
    {  label: "Draft" ,value: "2"},
  ];
  const Course = [
    {  label: "Information About UI/UX Design Degree" ,value: "1"},
    {  label: "Wordpress for Beginners - Master Wordpress Quickly" ,value: "2"},
    {  label: "Introduction to Python Programming" ,value: "3"},
  ];

  return (
    <>
    <Breadcrumb title='Assignments'/>
    <div className="content">
  <div className="container">
    <ProfileCard/>
    <div className="row">
      {/* Sidebar */}
      <InstructorSidebar/>
      {/* /Sidebar */}
      <div className="col-lg-9">
        <div className="page-title d-flex align-items-center justify-content-between">
          <h5 className="fw-bold">Assignments</h5>
          <div>
            <Link
              to="#"
              className="btn btn-secondary d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#add_assignment"
            >
              <i className="isax isax-add-circle me-1" />
              Add Assignments
            </Link>
          </div>
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
                      Published
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      Draft
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            
          </div>
        </div>
        <Table dataSource={data} columns={columns} Search={true} />
      </div>
    </div>
  </div>
</div>
<>
<>
  {/* Add Assignment */}
  <div className="modal fade" id="add_assignment">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="fw-bold">Add New Assignments</h5>
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
                    Course <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                      className="select"
                      options={Course}
                      modal={true}
                    />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Assingment Title <span className="text-danger"> *</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Description"
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Instructions <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    defaultValue={"Enter Instructions"}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Last Date <span className="text-danger"> *</span>
                  </label>
                  <div className="input-icon-end position-relative">
                  <DatePicker className="form-control datetimepicker" getPopupContainer={getModalContainer} placeholder="dd/mm/yyyy"/>
                    <span className="input-icon-addon">
                      <i className="isax isax-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Status <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                      className="select"
                      options={Status}
                      modal={true}
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
            <button className="btn btn-secondary rounded-pill" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Assignment */}
  {/* Edit Assignment */}
  <div className="modal fade" id="edit_assignment">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="fw-bold">Edit Assignments</h5>
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
                    Course <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                      className="select"
                      options={Course}
                      defaultValue={Course[1]}
                    />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Assingment Title <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Building Your First Landing Page"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    defaultValue={"Enter Description"}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Instructions <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    defaultValue={"Enter Instructions"}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 mb-md-0">
                  <label className="form-label">
                    Last Date <span className="text-danger"> *</span>
                  </label>
                  <div className="input-icon-end position-relative">
                    <DatePicker className="form-control datetimepicker" getPopupContainer={getModalContainer2} placeholder="dd/mm/yyyy"/>
                    <span className="input-icon-addon">
                      <i className="isax isax-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-0">
                  <label className="form-label">
                    Status <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                      className="select"
                      options={Status}
                      defaultValue={Status[0]}
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
            <button className="btn btn-secondary rounded-pill" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Edit Assignment */}
  {/* Assignment Details */}
  <div className="modal fade" id="view_assignment">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="fw-bold">Assignments Details</h5>
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
          <div className="mb-4">
            <h6 className="mb-1">Course</h6>
            <p>Introduction to Programming - Python &amp; Java</p>
          </div>
          <div className="mb-4">
            <h6 className="mb-1">Title</h6>
            <p>Guest Lecture Announcement</p>
          </div>
          <div className="mb-4">
            <h6 className="mb-1">Description</h6>
            <p>
              I am excited to inform you that we will be having a guest lecture
              from , an expert . This will be an excellent opportunity to gain
              insight into and ask any questions you might have. Please make
              every effort to attend, as participation will count towards.
            </p>
          </div>
          <div className="mb-4">
            <h6 className="mb-1">Instructions</h6>
            <p>
              Explain the specific instructions or requirements for the
              assignment. For example, "The assignment should be 3-5 pages long,
              formatted in APA style. You must use at least 5 peer-reviewed
              articles.
            </p>
          </div>
          <div className="mb-0">
            <h6 className="mb-1">Last Date</h6>
            <p>26 Jul 2025</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Assignment Details */}
</>

  {/* Delete Modal */}
  <div className="modal fade" id="delete_modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body text-center custom-modal-body">
          <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
            <i className="isax isax-trash fs-24 text-danger" />
          </span>
          <div>
            <h4 className="mb-2">Delete Assignments</h4>
            <p className="mb-3">
              Are you sure you want to delete assignments?
            </p>
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

    </>
  )
}

export default InstructorAssignment
