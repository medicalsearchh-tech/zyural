import { useState, useEffect } from 'react'
import ProfileCard from '../common/profileCard'
import AdminSidebar from '../common/adminSidebar'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import PredefinedDateRanges from '../../../core/common/range-picker/datePicker'
import ReactApexChart from "react-apexcharts";
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { adminApi } from '../../../core/utils/api';
import { toast } from "react-toastify";

interface DashboardStats {
  statusCounts: {
    draft?: number;
    submitted?: number;
    changes_requested?: number;
    approved?: number;
    rejected?: number;
    published?: number;
    archived?: number;
  };
  submittedThisWeek: number;
  approvedThisMonth: number;
  activeInstructors: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    statusCounts: {},
    submittedThisWeek: 0,
    approvedThisMonth: 0,
    activeInstructors: 0
  });
  const [loading, setLoading] = useState(true);

  const [toursChart] = useState<any>({
    chart: {
      height: 290,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Earnings',
      data: [80, 100, 70, 110, 80, 90, 85, 85, 110, 30, 100, 90]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      labels: {
        style: {
          colors: '#4D4D4D', 
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#4D4D4D', 
          fontSize: '13px',
        }
      }
    },
    grid: {
      borderColor: '#4D4D4D',
      strokeDashArray: 5
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false // Disable data labels
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'linear',
        shadeIntensity: 0.35,
        gradientToColors: ['#392C7D'], // Second gradient color
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        angle: 90 // This sets the gradient direction from top to bottom
      }
    },
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCourseRequestsStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard statistics');
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Draft' },
      submitted: { class: 'bg-warning', text: 'Pending' },
      changes_requested: { class: 'bg-info', text: 'Changes Requested' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      published: { class: 'bg-primary', text: 'Published' },
      archived: { class: 'bg-dark', text: 'Archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <>
    <div className="content">
      <div className="container">
        <ProfileCard/>
        <div className="row">
          {/* Sidebar */}
          <AdminSidebar/>
          {/* /Sidebar */}
          <div className="col-lg-9">
            {/* Course Review Stats Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Course Review Overview</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 border rounded-4">
                          <div className="fs-24 fw-bold text-warning">
                            {loading ? '...' : stats.statusCounts.submitted || 0}
                          </div>
                          <span className="d-block text-muted">Pending Review</span>
                          <small className="text-warning">Awaiting admin approval</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 border rounded-4">
                          <div className="fs-24 fw-bold text-info">
                            {loading ? '...' : stats.statusCounts.changes_requested || 0}
                          </div>
                          <span className="d-block text-muted">Changes Requested</span>
                          <small className="text-info">Needs instructor updates</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 border rounded-4">
                          <div className="fs-24 fw-bold text-success">
                            {loading ? '...' : stats.approvedThisMonth || 0}
                          </div>
                          <span className="d-block text-muted">Approved This Month</span>
                          <small className="text-success">Recently approved courses</small>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 border rounded-4">
                          <div className="fs-24 fw-bold text-primary">
                            {loading ? '...' : stats.activeInstructors || 0}
                          </div>
                          <span className="d-block text-muted">Active Instructors</span>
                          <small className="text-primary">With course submissions</small>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-flex gap-2 flex-wrap">
                        <Link 
                          to={all_routes.adminInstructorRequests}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="isax isax-ticket me-1"></i>
                          Review Course Requests
                        </Link>
                        <Link 
                          to={all_routes.adminInstructorsList}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="isax isax-teacher me-1"></i>
                          Manage Instructors
                        </Link>
                        <Link 
                          to="#"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <i className="isax isax-chart me-1"></i>
                          View Full Reports
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Static Stats Cards */}
            <div className="row">
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-primary-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/graduation.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Enrolled Courses</span>
                        <h4 className="fs-24 mt-1">12</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-secondary-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/book.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Active Courses</span>
                        <h4 className="fs-24 mt-1">08</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-success-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/bookmark.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Completed Courses</span>
                        <h4 className="fs-24 mt-1">06</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-info-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/user-octagon.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Total Students</span>
                        <h4 className="fs-24 mt-1">17</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-blue-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/book-2.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Total Courses</span>
                        <h4 className="fs-24 mt-1">11</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-purple-transparent me-2 me-xxl-3 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/icon/money-add.svg" alt="" />
                      </span>
                      <div>
                        <span className="d-block">Total Earnings</span>
                        <h4 className="fs-24 mt-1">$486</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between border-bottom mb-2 pb-3">
                  <h5 className="fw-bold">Earnings by Year</h5>
                  <div className="input-icon position-relative input-range-picker">
                    <span className="input-icon-addon">
                      <i className="isax isax-calendar" />
                    </span>
                    <PredefinedDateRanges  />
                  </div>
                </div>
                <div id="earnnings_chart" />
              
                <ReactApexChart
                    options={toursChart}
                    series={toursChart.series}
                    type="bar"
                    height={290}
                />
              </div>
            </div>

            {/* Course Status Breakdown */}
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Course Status Breakdown</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <div key={status} className="col-md-4 col-6 mb-3">
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded-3">
                        <span>{getStatusBadge(status)}</span>
                        <strong className="fs-16">{loading ? '...' : count}</strong>
                      </div>
                    </div>
                  ))}
                  {!loading && Object.keys(stats.statusCounts).length === 0 && (
                    <div className="col-12 text-center py-3">
                      <p className="text-muted mb-0">No course data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recently Created Courses (Static) */}
            <h5 className="mb-3 fw-bold mt-4">Recently Created Courses</h5>
            <div className="table-responsive custom-table">
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th>Courses</th>
                    <th>Enrolled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-01.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Complete HTML, CSS and Javascript
                              <br /> Course
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>0</td>
                    <td>Published</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-02.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Complete Course on Fullstack Web
                              <br /> Developer
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>2</td>
                    <td>Published</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-03.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Data Science Fundamentals and
                              <br /> Advanced Bootcampr
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>2</td>
                    <td>Published</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-04.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Master Microservices with Spring Boot
                              <br /> and Spring Cloud
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>1</td>
                    <td>Published</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-05.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Information About UI/UX Design
                              <br /> Degree
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>0</td>
                    <td>Published</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AdminDashboard;