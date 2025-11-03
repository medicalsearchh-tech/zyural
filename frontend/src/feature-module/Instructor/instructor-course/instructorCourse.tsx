import { useState, useEffect } from 'react';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import { courseApi } from '../../../core/utils/api';
import Table from "../../../core/common/dataTable/index";
import { toast } from "react-toastify";

interface Course {
  id: string;
  title: string;
  slug: string;
  heroImageUrl: string;
  totalEnrollments: number;
  averageRating: string;
  status: string;
  pricing: {
    price: number;
    certPrice: number;
    currency: string;
    accessType: string;
    visibility: string;
  };
  stats: {
    totalLessons: number;
    totalDuration: number;
    sectionsCount: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CourseStats {
  active: number;
  approved: number;
  draft: number;
  free: number;
  paid: number;
}

const InstructorCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false
  });
  const [stats, setStats] = useState<CourseStats>({
    active: 0,
    approved: 0,
    draft: 0,
    free: 0,
    paid: 0
  });
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCourses(currentPage, pageSize, searchText, statusFilter);
  }, [currentPage, pageSize, searchText, statusFilter]);

  const fetchCourses = async (page = 1, limit = 10, search = '', status = '') => {
    try {
      setLoading(true);
      const response = await courseApi.getInstructorCourses({
        page,
        limit,
        search,
        status
      });
      
      const coursesData = response.data.courses;
      const paginationData = response.data.pagination;
      
      setCourses(coursesData);
      setPagination(paginationData);
      calculateStats(coursesData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch courses');
      setLoading(false);
    }
  };

  const calculateStats = (coursesData: Course[]) => {
    const newStats = {
      active: 0,
      approved: 0,
      draft: 0,
      free: 0,
      paid: 0
    };

    coursesData.forEach(course => {
      // Status counts - match the spec statuses
      if (course.status === 'published') {
        newStats.active++;
      } else if (course.status === 'approved') {
        newStats.approved++;
      } else if (course.status === 'draft') {
        newStats.draft++;
      }

      // Price counts
      if (course.pricing.price === 0) {
        newStats.free++;
      } else {
        newStats.paid++;
      }
    });

    setStats(newStats);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}hr ${remainingMinutes}min`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-success';
      case 'submitted':
        return 'bg-skyblue';
      case 'changes_requested':
        return 'bg-warning';
      case 'approved':
        return 'bg-info';
      case 'draft':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  // Add these functions after your existing functions
  const handleDeleteCourse = async () => {
    try {
      const response = await courseApi.deleteCourse(courseToDelete);
      
      if (response.success) {
        // Remove the deleted course from the courses array
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseToDelete));
        // Update pagination total count
        setPagination(prev => ({
          ...prev,
          totalCourses: prev.totalCourses - 1
        }));
        toast.success('Course deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setCourseToDelete('');
    }
  };

  const getStatusDisplayText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'draft': 'Draft',
      'submitted': 'Submitted',
      'changes_requested': 'Changes Requested',
      'approved': 'Approved',
      'published': 'Published',
      'archived': 'Archived'
    };
    return statusMap[status] || status;
  };
  // Transform courses data for the table
  const tableData = courses.map(course => ({
    key: course.id,
    CourseName: course.title,
    Img: course.heroImageUrl,
    Enrollement: course.totalEnrollments.toString(),
    Ratings: course.averageRating,
    Status: getStatusDisplayText(course.status),
    course: course // Keep original course data for actions
  }));

  const columns = [
    {
      title: "Course Name",
      dataIndex: "CourseName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={all_routes.instructorCourseDetails.replace(":courseSlug", record.course.slug)}
            className="avatar avatar-lg me-2 flex-shrink-0"
          >
            <img
              className="img-fluid object-fit-cover rounded"
              src={record.Img || "/assets/img/course/default-course.jpg"}
              alt={text}
              style={{ width: '60px', height: '60px' }}
            />
          </Link>
          <div>
            <h6 className="fw-medium mb-2">
              <Link to={all_routes.instructorCourseDetails.replace(":courseSlug", record.course.slug)}>
                {text}
              </Link>
            </h6>
            <div className="d-flex align-items-center">
              <span className="d-inline-flex fs-12 align-items-center me-2 pe-2 border-end">
                <i className="isax isax-video-circle me-1 text-gray-9 fw-bold" />
                {record.course.stats.totalLessons} Lessons
              </span>
              <span className="d-inline-flex fs-12 align-items-center me-2 pe-2 border-end">
                <i className="isax isax-message-question me-1 text-gray-9 fw-bold" />
                {record.course.stats.sectionsCount} Sections
              </span>
              <span className="d-inline-flex fs-12 align-items-center">
                <i className="isax isax-clock me-1 text-gray-9 fw-bold" />
                {record.course.stats.totalDuration ? formatDuration(record.course.stats.totalDuration) : '00:00:00'} Hours
              </span>
            </div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.CourseName.length - b.CourseName.length,
    },
    {
      title: "Enrollment",
      dataIndex: "Enrollement",
      render: (text: string) => (
        <span className="fw-medium">{text}</span>
      ),
      sorter: (a: any, b: any) => parseInt(a.Enrollement) - parseInt(b.Enrollement),
    },
    {
      title: "Ratings",
      dataIndex: "Ratings",
      render: (text: string) => (
        <div className="d-flex align-items-center">
          <i className="fa-solid fa-star fs-12 filled text-warning me-1" />
          <span>{text}</span>
        </div>
      ),
      sorter: (a: any, b: any) => parseFloat(a.Ratings) - parseFloat(b.Ratings),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string, record: any) => (
        <span
          className={`badge badge-sm ${getStatusBadgeClass(record.course.status)} d-inline-flex align-items-center me-1`}>
          <i className="fa-solid fa-circle fs-5 me-1" />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (record: any) => (
        <div className="d-flex align-items-center">
          {/* Edit button - disabled for submitted and approved courses */}
          <Link
            to={record.course.status === 'submitted' || record.course.status === 'approved' || record.course.status === 'published' 
              ? '#' 
              : `/instructor/create-course/${record.course.id}`}
            className={`d-inline-flex fs-14 me-1 action-icon ${
              (record.course.status === 'submitted' || record.course.status === 'approved') 
                ? 'opacity-50' 
                : ''
            }`}
            title={
              record.course.status === 'submitted' 
                ? 'Cannot edit while under review' 
                : record.course.status === 'approved'
                ? 'Cannot edit - awaiting publication'
                : 'Edit Course'
            }
            onClick={(e) => {
              if (record.course.status === 'submitted' || record.course.status === 'approved' || record.course.status === 'published') {
                e.preventDefault();
              }
            }}
          >
            <i className="isax isax-edit-2" />
          </Link>
          
          {/* Under Review indicator */}
          {record.course.status === 'submitted' && (
            <span
              className="d-inline-flex fs-14 me-1 action-icon text-warning"
              title="Under Review"
              style={{ cursor: 'default' }}
            >
              <i className="isax isax-clock" />
            </span>
          )}
          
          {/* Changes Requested indicator */}
          {record.course.status === 'changes_requested' && (
            <Link
              to={`/instructor/create-course/${record.course.id}`}
              className="d-inline-flex fs-14 me-1 action-icon text-danger"
              title="View Feedback & Edit"
            >
              <i className="isax isax-message-notif" />
            </Link>
          )}
          
          {/* Approved - Awaiting Publication */}
          {record.course.status === 'approved' && (
            <span
              className="d-inline-flex fs-14 me-1 action-icon text-info"
              title="Approved - Awaiting Publication"
              style={{ cursor: 'default' }}
            >
              <i className="isax isax-tick-circle" />
            </span>
          )}
          
          {/* Delete button - disabled for submitted, approved, published */}
          <Link
            to="#"
            className={`d-inline-flex fs-14 action-icon ${
              ['submitted', 'approved', 'published'].includes(record.course.status) 
                ? 'opacity-50' 
                : ''
            }`}
            data-bs-toggle={
              ['submitted', 'approved', 'published'].includes(record.course.status) 
                ? '' 
                : 'modal'
            }
            data-bs-target={
              ['submitted', 'approved', 'published'].includes(record.course.status) 
                ? '' 
                : '#delete_modal'
            }
            onClick={(e) => {
              if (['submitted', 'approved', 'published'].includes(record.course.status)) {
                e.preventDefault();
              } else {
                setCourseToDelete(record.course.id);
              }
            }}
            title={
              ['submitted', 'approved', 'published'].includes(record.course.status)
                ? 'Cannot delete this course'
                : 'Delete Course'
            }
          >
            <i className="isax isax-trash" />
          </Link>
        </div>
      ),
    }
  ];

  if (loading) {
    return (
      <>
        <Breadcrumb title='Courses' />
        <div className="content">
          <div className="container">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title='Courses' />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* Sidebar */}
            <InstructorSidebar />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="row">
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-success">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Active Courses</h6>
                      <h4 className="fw-bold text-white">{stats.active}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-secondary">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Pending Courses</h6>
                      <h4 className="fw-bold text-white">{stats.approved}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-info">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Draft Courses</h6>
                      <h4 className="fw-bold text-white">{stats.draft}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-skyblue">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Free Courses</h6>
                      <h4 className="fw-bold text-white">{stats.free}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-purple">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">Paid Courses</h6>
                      <h4 className="fw-bold text-white">{stats.paid}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Courses ({pagination.totalCourses})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to="#" className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to={all_routes.instructorCourseGrid}>
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle text-gray-6 btn rounded border d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {statusFilter || 'All Status'}
                      </Link>
                      <ul className="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('');
                            }}
                          >
                            All Status
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('draft');
                            }}
                          >
                            Draft
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('submitted');
                            }}
                          >
                            Submitted
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('changes_requested');
                            }}
                          >
                            Changes Requested
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('approved');
                            }}
                          >
                            Approved
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusFilter('published');
                            }}
                          >
                            Published
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  {/* Additional filters can be added here */}
                </div>
              </div>
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                pageSize={pageSize}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <>
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Delete Course</h4>
                  <p className="mb-3">Are you sure you want to delete this course?</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                      onClick={() => setCourseToDelete('')}
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-secondary rounded-pill"
                      data-bs-dismiss="modal"
                      onClick={handleDeleteCourse}
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

export default InstructorCourse