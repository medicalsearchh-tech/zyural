import { useState } from 'react'
import ProfileCard from '../common/profileCard'
import AdminSidebar from '../common/adminSidebar'
import { Link } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import { TimePicker } from 'antd'
import PredefinedDateRanges from '../../../core/common/range-picker/datePicker'
import { all_routes } from '../../router/all_routes'

const AdminEarning = () => {
  const [toursChart] = useState<any>({
    series: [{
			name: "Earnings",
			data: [25, 40, 30, 55, 25, 35, 25,50,20,40,20,50]
		}],
		  chart: {
		  height: 273,
		  type: 'area',
		  zoom: {
			enabled: false
		  }
		},
		colors: ['#FF4667'],
		dataLabels: {
		  enabled: false
		},
		stroke: {
		  curve: 'straight'
		},
		title: {
		  text: '',
		  align: 'left'
		},
		// grid: {
		//   row: {
		//     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
		//     opacity: 0.5
		//   },
		// },
		xaxis: {
		  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		},
		yaxis: {
		  min: 10,
		  max: 60,
		  tickAmount: 5,
			  labels: {
				formatter: (val:any) => {
				  return val / 1 + 'K'
				}
			  }
			},
			legend: {
			  position: 'top',
			  horizontalAlign: 'left'
			}
});
  return (
    <>
      <div className="content">
        <div className="container">
        <ProfileCard/>
          <div className="row">
            <AdminSidebar/>
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Earnings</h5>
              </div>
              <div className="row">
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-success">
                          <i className="isax isax-dollar-circle4" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Revenue</h6>
                          <h5 className="fw-bold text-success mb-1">$8420</h5>
                          <p>Earning this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-secondary">
                          <i className="isax isax-star5" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Courses Ratings</h6>
                          <h5 className="fw-bold text-secondary mb-1">4.8</h5>
                          <p>Rating this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-info">
                          <i className="isax isax-profile-tick5" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Students Enrolled</h6>
                          <h5 className="fw-bold text-info mb-1">12000</h5>
                          <p>New this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                      <h5>Earnings by Year</h5>
                      <div className="icon-form line-height-2 mb-0">
                        <span className="form-icon">
                          <i className="isax isax-calendar-1 fs-16" />
                        </span>
                        
                        <TimePicker className="form-control yearpicker line-height-2"/>
                      </div>
                    </div>
                    <div className="card-body">
                      <div id="earnigs_chart" />
                      <ReactApexChart
                            options={toursChart}
                            series={toursChart.series}
                            type="area"
                            height={290}
                        />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-0">
                <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                  <h5>Earnings</h5>
                  <div className="icon-form line-height-2 mb-0">
                    <span className="form-icon">
                      <i className="isax isax-calendar-1 fs-16" />
                    </span>
                    <PredefinedDateRanges/>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive custom-table">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Course</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="order">
                            <Link to="#">ORD010</Link>
                          </td>
                          <td>28 Jan 2025</td>
                          <td>
                            <Link to={all_routes.courseDetails}>
                              Information about UI/UX Design Degree
                            </Link>
                          </td>
                          <td>$160</td>
                        </tr>
                        <tr>
                          <td className="order">
                            <Link to="#">ORD009</Link>
                          </td>
                          <td>22 Jan 2025</td>
                          <td>
                            <Link to={all_routes.courseDetails}>
                              Wordpress for Beginners - Master Wordpress Quickly
                            </Link>
                          </td>
                          <td>$140</td>
                        </tr>
                        <tr>
                          <td className="order">
                            <Link to="#">ORD008</Link>
                          </td>
                          <td>17 Jan 2025</td>
                          <td>
                            <Link to={all_routes.courseDetails}>
                              Sketch from A to Z (2022): Become an app designer
                            </Link>
                          </td>
                          <td>$200</td>
                        </tr>
                        <tr>
                          <td className="order">
                            <Link to="#">ORD007</Link>
                          </td>
                          <td>08 Jan 2025</td>
                          <td>
                            <Link to={all_routes.courseDetails}>
                              Learn Angular Fundamental From beginning to advance
                            </Link>
                          </td>
                          <td>$170</td>
                        </tr>
                        <tr>
                          <td className="order">
                            <Link to="#">ORD006</Link>
                          </td>
                          <td>03 Jan 2025</td>
                          <td>
                            <Link to={all_routes.courseDetails}>
                              C# Developers Double Your Coding Speed
                            </Link>
                          </td>
                          <td>$120</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminEarning
