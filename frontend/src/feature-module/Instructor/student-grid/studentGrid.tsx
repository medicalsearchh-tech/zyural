import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'

const StudentGrid = () => {
  return (
    <>
    <Breadcrumb title='Students Grid'/>
    <div className="content">
  <div className="container">
    <ProfileCard/>
    <div className="row">
      {/* Sidebar */}
      <InstructorSidebar/>
      {/* /Sidebar */}
      <div className="col-lg-9">
        <div className="page-title d-flex align-items-center justify-content-between">
          <h5 className="fw-bold">Students</h5>
          <div className="d-flex align-items-center list-icons">
            <Link to={all_routes.studentsList} className="me-2">
              <i className="isax isax-task" />
            </Link>
            <Link to={all_routes.studentsGrid} className="active">
              <i className="isax isax-element-3" />
            </Link>
          </div>
        </div>
        <div className="row justify-content-end">
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
        <div className="row">
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-01.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Ronald Richard</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Newyork
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    22 Aug 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    10 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-02.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Mona Nancy</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Los Angels
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    15 Jul 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    08 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-03.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Patrick Alleman</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Alabama
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    18 Jun 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    12 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-04.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Olive Paxson</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Brisbane
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    03 May 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    07 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-05.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Chris Thomas</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Newyork
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    14 Apr 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    04 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <Link to={all_routes.studentsDetails}>
                    <ImageWithBasePath
                      src="assets/img/students/student-06.jpg"
                      className="rounded-3"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
                  <div>
                    <h5 className="mb-2 fw-bold">
                      <Link to={all_routes.studentsDetails}>Joyce Perron</Link>
                    </h5>
                    <span className="text-info d-inline-flex align-items-center">
                      <i className="isax isax-location me-1" />
                      <Link
                        to="#"
                        className="text-info text-decoration-underline stu-loc"
                      >
                        Ontoro
                      </Link>
                    </span>
                  </div>
                  <Link
                    to="#"
                    className="avatar avatar-md avatar-rounded border"
                  >
                    <i className="isax isax-messages text-gray-9 fs-14" />
                  </Link>
                </div>
                <div className="d-flex align-items-center justify-content-between fs-14">
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-calendar-add5 text-primary me-1" />
                    17 Mar 2025
                  </span>
                  <span className="d-inline-flex align-items-center">
                    <i className="isax isax-teacher5 text-secondary me-1" />
                    06 Courses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /pagination */}
        <div className="row align-items-center">
          <div className="col-md-2">
            <p className="pagination-text">Page 1 of 2</p>
          </div>
          <div className="col-md-10">
            <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
              <li className="page-item prev">
                <Link
                  className="page-link"
                  to="#"
                  tabIndex={-1}
                >
                  <i className="fas fa-angle-left" />
                </Link>
              </li>
              <li className="page-item first-page active">
                <Link className="page-link" to="#">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  2
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  3
                </Link>
              </li>
              <li className="page-item next">
                <Link className="page-link" to="#">
                  <i className="fas fa-angle-right" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* /pagination */}
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default StudentGrid
