import { useState, useEffect } from 'react';
import ProfileCard from '../common/profileCard';
import AdminSidebar from '../common/adminSidebar';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import Table from "../../../core/common/dataTable/index";
import { adminApi } from '../../../core/utils/api';
import { toast } from "react-toastify";

interface InstructorCourse {
  id: string;
  title: string;
  status: string;
  enrolledStudents: number;
  rating: number;
}

interface Instructor {
  instructorId: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  joinedAt: string;
  lastLogin: string;
  courses: InstructorCourse[];
}

interface InstructorStats {
  totalInstructors: number;
  activeInstructors: number;
  pendingInstructors: number;
  suspendedInstructors: number;
  verifiedInstructors: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalInstructors: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminInstructorsList = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InstructorStats>({
    totalInstructors: 0,
    activeInstructors: 0,
    pendingInstructors: 0,
    suspendedInstructors: 0,
    verifiedInstructors: 0
  });
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalInstructors: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminInstructors({
        page,
        limit,
        search
      });
      
      setInstructors(response.data.instructorListData);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch instructors. Please try again later.');
      console.error('Failed to fetch instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Active' },
      pending: { class: 'bg-warning', text: 'Pending' },
      suspended: { class: 'bg-danger', text: 'Suspended' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="badge bg-info">Verified</span>
    ) : (
      <span className="badge bg-secondary">Unverified</span>
    );
  };

  const getRatingStars = (rating: number) => {
    if (rating === 0) return <span className="text-muted">No ratings</span>;
    
    return (
      <div className="d-flex align-items-center">
        <span className="text-warning me-1">
          <i className="fas fa-star" />
        </span>
        <span className="fw-medium">{rating}</span>
        <span className="text-muted ms-1">({Math.round(rating * 10)} reviews)</span>
      </div>
    );
  };

  const updateInstructorStatus = async (instructorIds: string[], newStatus: string) => {
    try {
      setActionLoading(true);
      
      await adminApi.updateInstructorStatus(instructorIds[0], newStatus);
      
      setShowStatusModal(false);
      setSelectedInstructors([]);
      setSelectedStatus('');
      
      fetchInstructors();
      toast.success('Instructor status updated successfully');
    } catch (error) {
      console.error('Failed to update instructor status:', error);
      toast.error('Failed to update instructor status');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteInstructors = async (instructorIds: string[]) => {
    try {
      setActionLoading(true);
      await adminApi.deleteInstructor(instructorIds);
      
      setShowDeleteModal(false);
      setSelectedInstructors([]);
      
      fetchInstructors();
      toast.success('Instructor(s) deleted successfully');
    } catch (error) {
      console.error('Failed to delete instructors:', error);
      toast.error('Failed to delete instructors');
    } finally {
      setActionLoading(false);
    }
  };

  // Update handleStatusChange:
  const handleStatusChange = (instructorId: string, newStatus: string) => {
    setSelectedInstructors([instructorId]);
    setSelectedStatus(newStatus);
    setShowStatusModal(true);
  };

  // Update handleDeleteInstructor:
  const handleDeleteInstructor = (instructorId: string) => {
    setSelectedInstructors([instructorId]);
    setShowDeleteModal(true);
  };

  // Transform data for the table
  const tableData = instructors.map(instructor => ({
    key: instructor.instructorId,
    InstructorID: instructor.instructorId.substring(0, 8),
    InstructorName: instructor.fullName,
    Email: instructor.email,
    Img: instructor.avatar || 'assets/img/user/user-01.jpg',
    Bio: instructor.bio,
    Status: instructor.status,
    IsVerified: instructor.isVerified,
    JoinedDate: formatDate(instructor.joinedAt),
    LastLogin: formatDate(instructor.lastLogin),
    TotalCourses: instructor.totalCourses,
    TotalStudents: instructor.totalStudents,
    AverageRating: instructor.averageRating,
  }));

  const columns = [
    {
      title: "Instructor ID",
      dataIndex: "InstructorID",
      render: (text: string, record: any) => (
        <Link to={`/admin/instructor-details/${record.key}`} className="text-primary" title={record.key}>
          {text}...
        </Link>
      ),
      sorter: (a: any, b: any) => a.InstructorID.localeCompare(b.InstructorID),
    },
    {
      title: "Instructor Name",
      dataIndex: "InstructorName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={`/admin/instructor-details/${record.key}`}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={record.Img} alt={text} />
          </Link>
          <div>
            <Link to={`/admin/instructor-details/${record.key}`} className="text-decoration-none">
              <p className="fs-14 mb-0 fw-medium">{text}</p>
            </Link>
            <small className="text-muted">{record.Email}</small>
            <div className="mt-1">
              <small className="text-muted">{record.Bio}</small>
            </div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.InstructorName.localeCompare(b.InstructorName),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (status: string, record: any) => (
        <div className="text-center">
          {getStatusBadge(status)}
          <div className="mt-1">
            {getVerificationBadge(record.IsVerified)}
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Joined Date",
      dataIndex: "JoinedDate",
      // FIXED: Remove the render function and use dataIndex directly
      sorter: (a: any, b: any) => new Date(a.JoinedDate).getTime() - new Date(b.JoinedDate).getTime(),
    },
    {
      title: "Courses",
      dataIndex: "TotalCourses",
      render: (courses: number) => (
        <div className="text-center">
          <div className="fw-bold">{courses}</div>
          <small className="text-muted">Total</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.TotalCourses - b.TotalCourses,
    },
    {
      title: "Students",
      dataIndex: "TotalStudents",
      render: (students: number) => (
        <div className="text-center">
          <div className="fw-bold text-success">{students.toLocaleString()}</div>
          <small className="text-muted">Enrolled</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.TotalStudents - b.TotalStudents,
    },
    {
      title: "Rating",
      dataIndex: "AverageRating",
      render: (rating: number) => (
        <div className="text-center">
          {getRatingStars(rating)}
        </div>
      ),
      sorter: (a: any, b: any) => a.AverageRating - b.AverageRating,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <div className="dropdown">
          <button
            className="btn btn-sm btn-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="isax isax-more"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link 
                className="dropdown-item" 
                to={`/admin/instructor-details/${record.key}`}
              >
                <i className="isax isax-eye me-2"></i>View Details
              </Link>
            </li>
            <li>
              <Link 
                className="dropdown-item" 
                to={`/admin/edit-instructor/${record.key}`}
              >
                <i className="isax isax-edit-2 me-2"></i>Edit
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={() => handleStatusChange(record.key, 'active')}
              >
                <i className="isax isax-tick-circle me-2 text-success"></i>Set Active
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={() => handleStatusChange(record.key, 'pending')}
              >
                <i className="isax isax-clock me-2 text-warning"></i>Set Pending
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={() => handleStatusChange(record.key, 'suspended')}
              >
                <i className="isax isax-pause me-2 text-danger"></i>Suspend
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item text-danger" 
                onClick={() => handleDeleteInstructor(record.key)}
              >
                <i className="isax isax-trash me-2"></i>Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <>
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
      <div className="content">
        <div className="container">
          <ProfileCard />
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-2">
              <div className="card bg-primary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.totalInstructors}</h4>
                  <h6 className="fw-medium mb-0 text-white">Total Instructors</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-success">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.activeInstructors}</h4>
                  <h6 className="fw-medium mb-0 text-white">Active</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.pendingInstructors}</h4>
                  <h6 className="fw-medium mb-0 text-white">Pending</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.verifiedInstructors}</h4>
                  <h6 className="fw-medium mb-0 text-white">Verified</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.suspendedInstructors}</h4>
                  <h6 className="fw-medium mb-0 text-white">Suspended</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <AdminSidebar />
            
            <div className="col-lg-9">
              <div className="page-title mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Instructors ({stats.totalInstructors})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.adminInstructorsList} className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  {/* <Link to={all_routes.adminInstructorsGrid}>
                    <i className="isax isax-element-3" />
                  </Link> */}
                </div>
              </div>
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                onSearch={(searchTerm: string) => fetchInstructors(1, 10, searchTerm)}
              />
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Status Change</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowStatusModal(false)}
                disabled={actionLoading}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to change the status to <strong>{selectedStatus}</strong>?
              </p>
              <p className="text-muted small">
                This action will affect the instructor's ability to manage courses and access the platform.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowStatusModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => updateInstructorStatus(selectedInstructors, selectedStatus)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Confirm Deletion</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-danger">
                <i className="isax isax-danger me-2"></i>
                Are you sure you want to delete this instructor?
              </p>
              <p className="text-muted small">
                This action cannot be undone. All instructor data, courses, and related information will be permanently removed.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => deleteInstructors(selectedInstructors)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete Instructor'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminInstructorsList;