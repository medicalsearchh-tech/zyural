import { useState, useEffect } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import PredefinedDateRanges from '../../../core/common/range-picker/datePicker'
import ReactApexChart from "react-apexcharts";
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { instructorApi } from '../../../core/utils/api';
import { toast } from "react-toastify";

interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  submittedCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  totalStudents: number;
  recentEnrollments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  certificateIssued: number;
}

interface RecentCourse {
  id: string;
  title: string;
  slug: string;
  heroImageUrl: string;
  status: string;
  category: string;
  enrollments: number;
  averageRating: number;
  createdAt: string;
}

const InstructorDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    submittedCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    totalStudents: 0,
    recentEnrollments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    completionRate: 0,
    certificateIssued: 0
  });
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const [toursChart, setToursChart] = useState<any>({
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
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'linear',
        shadeIntensity: 0.35,
        gradientToColors: ['#392C7D'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        angle: 90
      }
    },
  });

  useEffect(() => {
    fetchDashboardData();
    fetchEarningsChart();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, coursesResponse] = await Promise.all([
        instructorApi.getDashboardStats(),
        instructorApi.getRecentCourses(5)
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data.stats);
      }

      if (coursesResponse.success) {
        setRecentCourses(coursesResponse.data.courses);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsChart = async (period = 'year') => {
    try {
      setChartLoading(true);
      const response = await instructorApi.getEarningsChart(period);
      
      if (response.success) {
        const chartData = response.data.chartData;
        setToursChart((prev: any) => ({
          ...prev,
          series: chartData.series,
          xaxis: {
            ...prev.xaxis,
            categories: chartData.categories
          }
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch earnings chart:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Draft' },
      submitted: { class: 'bg-warning', text: 'Under Review' },
      published: { class: 'bg-success', text: 'Published' },
      approved: { class: 'bg-info', text: 'Approved' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title='Dashboard' />
        <div className="content">
          <div className="container">
            <ProfileCard/>
            <div className="row">
              <InstructorSidebar/>
              <div className="col-lg-9">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title='Dashboard' />
      <div className="content">
        <div className="container">
          <ProfileCard/>
          <div className="row">
            {/* Sidebar */}
            <InstructorSidebar/>
            {/* /Sidebar */}
            <div className="col-lg-9">
              {/* Stats Cards */}
              <div className="row">
                <div className="col-md-6 col-xl-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-primary-transparent me-2 me-xxl-3 flex-shrink-0">
                          <ImageWithBasePath src="assets/img/icon/graduation.svg" alt="" />
                        </span>
                        <div>
                          <span className="d-block">Total Courses</span>
                          <h4 className="fs-24 mt-1">{stats.totalCourses}</h4>
                          <small className="text-muted">
                            {stats.publishedCourses} published • {stats.draftCourses} draft
                          </small>
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
                          <span className="d-block">Total Enrollments</span>
                          <h4 className="fs-24 mt-1">{stats.totalEnrollments}</h4>
                          <small className="text-muted">
                            {stats.recentEnrollments} new this month
                          </small>
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
                          <span className="d-block">Total Students</span>
                          <h4 className="fs-24 mt-1">{stats.totalStudents}</h4>
                          <small className="text-muted">
                            {stats.completionRate}% completion rate
                          </small>
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
                          <span className="d-block">Course Rating</span>
                          <h4 className="fs-24 mt-1">{stats.averageRating}</h4>
                          <small className="text-muted">
                            {stats.totalReviews} total reviews
                          </small>
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
                          <span className="d-block">Total Revenue</span>
                          <h4 className="fs-24 mt-1">{formatCurrency(stats.totalRevenue)}</h4>
                          <small className="text-muted">
                            {formatCurrency(stats.monthlyRevenue)} this month
                          </small>
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
                          <span className="d-block">Certificates Issued</span>
                          <h4 className="fs-24 mt-1">{stats.certificateIssued}</h4>
                          <small className="text-muted">
                            To completed students
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Chart */}
              <div className="card mt-4">
                <div className="card-body">
                  <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between border-bottom mb-2 pb-3">
                    <h5 className="fw-bold">Earnings by Year</h5>
                    <div className="d-flex gap-2">
                      <div className="input-icon position-relative input-range-picker">
                        <span className="input-icon-addon">
                          <i className="isax isax-calendar" />
                        </span>
                        <PredefinedDateRanges />
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={() => fetchEarningsChart('year')}
                        >
                          Year
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={() => fetchEarningsChart('month')}
                        >
                          Month
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={() => fetchEarningsChart('week')}
                        >
                          Week
                        </button>
                      </div>
                    </div>
                  </div>
                  <div id="earnings_chart">
                    {chartLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading chart...</span>
                        </div>
                      </div>
                    ) : (
                      <ReactApexChart
                        options={toursChart}
                        series={toursChart.series}
                        type="bar"
                        height={290}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Courses */}
              <h5 className="mb-3 fw-bold mt-4">Recently Created Courses</h5>
              <div className="table-responsive custom-table">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Course</th>
                      <th>Enrolled</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.length > 0 ? (
                      recentCourses.map(course => (
                        <tr key={course.id}>
                          <td>
                            <div className="course-title d-flex align-items-center">
                              <Link
                                to={`/instructor/courses/${course.id}`}
                                className="avatar avatar-xl flex-shrink-0 me-2"
                              >
                                <ImageWithBasePath
                                  src={course.heroImageUrl || "assets/img/instructor/instructor-table-01.jpg"}
                                  alt={course.title}
                                />
                              </Link>
                              <div>
                                <p className="fw-medium mb-0">
                                  <Link to={`/instructor/courses/${course.id}`}>
                                    {course.title}
                                  </Link>
                                </p>
                                <small className="text-muted">{course.category}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold">{course.enrollments}</div>
                            <small className="text-muted">students</small>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-star text-warning me-1"></i>
                              <span className="fw-medium">{course.averageRating || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(course.status)}
                          </td>
                          <td>
                            <small className="text-muted">{formatDate(course.createdAt)}</small>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <p className="text-muted mb-0">No courses created yet</p>
                          <Link to={all_routes.instructorCreateNewCourse} className="btn btn-primary btn-sm mt-2">
                            Create Your First Course
                          </Link>
                        </td>
                      </tr>
                    )}
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

export default InstructorDashboard;