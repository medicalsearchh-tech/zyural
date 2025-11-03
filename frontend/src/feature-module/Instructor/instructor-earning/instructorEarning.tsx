import { useState, useEffect } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { Link } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import { TimePicker } from 'antd'
import PredefinedDateRanges from '../../../core/common/range-picker/datePicker'
import { instructorApi } from '../../../core/utils/api'
import { toast } from "react-toastify"

interface EarningsStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalGrossRevenue: number;
  monthlyGrossRevenue: number;
  averageRating: number;
  totalStudents: number;
  recentEnrollments: number;
  revenueShare: {
    instructorRate: number;
    platformRate: number;
    instructorShare: number;
    platformShare: number;
  };
}

interface EarningsTransaction {
  id: string;
  paymentId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  studentName: string;
  studentEmail: string;
  grossAmount: number;
  instructorShare: number;
  platformShare: number;
  createdAt: string;
  paymentMethod: string;
  status: string;
  type: 'certificate' | 'course_purchase';
  revenueShare: {
    instructorRate: number;
    platformRate: number;
  };
}

// interface EarningsChartData {
//   categories: string[];
//   series: {
//     name: string;
//     data: number[];
//   }[];
// }

const InstructorEarning = () => {
  const [stats, setStats] = useState<EarningsStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalGrossRevenue: 0,
    monthlyGrossRevenue: 0,
    averageRating: 0,
    totalStudents: 0,
    recentEnrollments: 0,
    revenueShare: {
      instructorRate: 40,
      platformRate: 60,
      instructorShare: 0,
      platformShare: 0
    }
  });
  
  const [transactions, setTransactions] = useState<EarningsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [_transactionsSummary, setTransactionsSummary] = useState<any>(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [earningsChart, setEarningsChart] = useState<any>({
    series: [{
      name: "Your Earnings (40%)",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: (val: any) => {
          return `$${val}`
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    }
  });

  useEffect(() => {
    fetchEarningsData();
    fetchEarningsChart();
    fetchTransactions();
    fetchTransactionsSummary();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await instructorApi.getDashboardStats();
      
      if (response.success) {
        setStats(response.data.stats);
      } else {
        throw new Error(response.message || 'Failed to load earnings data');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load earnings statistics');
      console.error('Failed to fetch earnings data:', error);
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
        setEarningsChart((prev:any) => ({
          ...prev,
          series: chartData.series,
          xaxis: {
            ...prev.xaxis,
            categories: chartData.categories
          },
          yaxis: {
            ...prev.yaxis,
            max: Math.max(...chartData.series[0].data) * 1.2 || 1000
          }
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch earnings chart:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchTransactions = async (page = 1, startDate?: string, endDate?: string) => {
    try {
      setTransactionsLoading(true);
      const response = await instructorApi.getEarningsTransactions({
        page,
        limit: 10,
        startDate,
        endDate
      });
      
      if (response.success) {
        setTransactions(response.data.transactions);
        // You can also use response.data.totals for summary display
        // and response.data.pagination for pagination controls
      } else {
        throw new Error(response.message || 'Failed to load transactions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load earnings transactions');
      console.error('Failed to fetch transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchTransactionsSummary = async () => {
    try {
      const response = await instructorApi.getTransactionsSummary();
      
      if (response.success) {
        setTransactionsSummary(response.data.summary);
      }
    } catch (error: any) {
      console.error('Failed to fetch transactions summary:', error);
    }
  };

  const renderTransactionsTable = () => {
    if (transactionsLoading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading transactions...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="table-responsive custom-table">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Course</th>
              <th>Student</th>
              <th>Gross Amount</th>
              <th>Your Share (40%)</th>
              <th>Platform Share (60%)</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="order">
                    <Link to="#">{transaction.id}</Link>
                  </td>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>
                    <Link to={`/course-details/${transaction.courseSlug}`}>
                      {transaction.courseTitle}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{transaction.studentName}</div>
                      <small className="text-muted">{transaction.studentEmail}</small>
                    </div>
                  </td>
                  <td className="fw-bold">
                    {formatCurrency(transaction.grossAmount)}
                  </td>
                  <td className={`fw-bold ${getRevenueShareColor('instructor')}`}>
                    {formatCurrency(transaction.instructorShare)}
                  </td>
                  <td className={`fw-bold ${getRevenueShareColor('platform')}`}>
                    {formatCurrency(transaction.platformShare)}
                  </td>
                  <td>
                    <span className={`badge ${
                      transaction.type === 'certificate' ? 'bg-success' : 'bg-primary'
                    }`}>
                      {transaction.type === 'certificate' ? 'Certificate' : 'Course Purchase'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <p className="text-muted mb-0">No transactions found</p>
                  <small>Transactions will appear here when students purchase certificates</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
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

  const getRevenueShareColor = (type: 'instructor' | 'platform') => {
    return type === 'instructor' ? 'text-success' : 'text-secondary';
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title='Earnings'/>
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
      <Breadcrumb title='Earnings'/>
      <div className="content">
        <div className="container">
          <ProfileCard/>
          <div className="row">
            <InstructorSidebar/>
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Earnings Overview</h5>
                <div className="text-muted">
                  Revenue Share: <strong>{stats.revenueShare.instructorRate}% Instructor</strong> • {stats.revenueShare.platformRate}% Platform
                </div>
              </div>
              
              <div className="row">
                {/* Revenue Card */}
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-success">
                          <i className="isax isax-dollar-circle4" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Your Revenue (40%)</h6>
                          <h5 className="fw-bold text-success mb-1">
                            {formatCurrency(stats.monthlyRevenue)}
                          </h5>
                          <p>Earning this month</p>
                          <small className="text-muted">
                            Total: {formatCurrency(stats.totalRevenue)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gross Revenue Card */}
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-primary">
                          <i className="isax isax-chart-square" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Gross Revenue</h6>
                          <h5 className="fw-bold text-primary mb-1">
                            {formatCurrency(stats.monthlyGrossRevenue)}
                          </h5>
                          <p>Before revenue split</p>
                          <small className="text-muted">
                            Total: {formatCurrency(stats.totalGrossRevenue)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Card */}
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="earnings-icon bg-info">
                          <i className="isax isax-profile-tick5" />
                        </span>
                        <div className="ms-3">
                          <h6 className="mb-1">Students Enrolled</h6>
                          <h5 className="fw-bold text-info mb-1">
                            {stats.recentEnrollments}
                          </h5>
                          <p>New this month</p>
                          <small className="text-muted">
                            Total: {stats.totalStudents} students
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings Chart */}
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                      <h5>Earnings by Year</h5>
                      <div className="d-flex gap-2">
                        <div className="icon-form line-height-2 mb-0">
                          <span className="form-icon">
                            <i className="isax isax-calendar-1 fs-16" />
                          </span>
                          <TimePicker className="form-control yearpicker line-height-2"/>
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
                    <div className="card-body">
                      <div id="earnings_chart">
                        {chartLoading ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading chart...</span>
                            </div>
                          </div>
                        ) : (
                          <ReactApexChart
                            options={earningsChart}
                            series={earningsChart.series}
                            type="area"
                            height={290}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="card mb-0">
                <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                  <h5>Recent Earnings</h5>
                  <div className="icon-form line-height-2 mb-0">
                    <span className="form-icon">
                      <i className="isax isax-calendar-1 fs-16" />
                    </span>
                    <PredefinedDateRanges/>
                  </div>
                </div>
                <div className="card-body">
                  {renderTransactionsTable()}

                  {/* Revenue Summary */}
                  <div className="row mt-4 pt-3 border-top">
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="text-success fw-bold">
                          {formatCurrency(stats.revenueShare.instructorShare)}
                        </h4>
                        <p className="text-muted mb-0">Your Total Earnings (40%)</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="text-primary fw-bold">
                          {formatCurrency(stats.totalGrossRevenue)}
                        </h4>
                        <p className="text-muted mb-0">Total Gross Revenue</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="text-secondary fw-bold">
                          {formatCurrency(stats.revenueShare.platformShare)}
                        </h4>
                        <p className="text-muted mb-0">Platform Share (60%)</p>
                      </div>
                    </div>
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

export default InstructorEarning