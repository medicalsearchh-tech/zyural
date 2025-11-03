import { useState, useEffect } from 'react';
import ProfileCard from '../common/profileCard';
import AdminSidebar from '../common/adminSidebar';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CourseReviewModalContent from './courseReviewModalContent';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import Table from "../../../core/common/dataTable/index";
import { adminApi } from '../../../core/utils/api';
import { toast } from "react-toastify";

interface Instructor {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
}

interface Category {
  name: string;
}

interface Specialty {
  name: string;
}

interface CourseRequest {
  id: string;
  title: string;
  subtitle: string;
  status: 'submitted' | 'changes_requested' | 'approved' | 'rejected';
  submittedAt: string;
  heroImageUrl: string;
  instructor: Instructor;
  category: Category;
  specialty: Specialty;
  level: string;
  duration: number;
  totalSections: number;
  totalLessons: number;
}

interface CourseRequestsStats {
  pending: number;
  changesRequested: number;
  approvedThisWeek: number;
  totalProcessed: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminInstructorRequests = () => {
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CourseRequestsStats>({
    pending: 0,
    changesRequested: 0,
    approvedThisWeek: 0,
    totalProcessed: 0
  });
  const [, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false
  });

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request-changes'>('approve');
  const [reviewComments, setReviewComments] = useState('');

  useEffect(() => {
    fetchCourseRequests();
  }, []);

  const fetchCourseRequests = async (page = 1, limit = 10, search = '', status = 'all') => {
    try {
      setLoading(true);
      const response = await adminApi.getCourseRequests({
        page,
        limit,
        search,
        status
      });
      
      if (response.success) {
        setCourseRequests(response.data.courses || []);
        setStats(response.data.stats || {
          pending: 0,
          changesRequested: 0,
          approvedThisWeek: 0,
          totalProcessed: 0
        });
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCourses: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch course requests');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch course requests. Please try again later.');
      console.error('Failed to fetch course requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { class: 'bg-warning', text: 'Pending Review', icon: '⏳' },
      changes_requested: { class: 'bg-info', text: 'Changes Requested', icon: '📝' },
      approved: { class: 'bg-success', text: 'Approved', icon: '✅' },
      rejected: { class: 'bg-danger', text: 'Rejected', icon: '❌' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status, icon: '' };
    return (
      <span className={`badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      beginner: { class: 'bg-success', text: 'Beginner' },
      intermediate: { class: 'bg-warning', text: 'Intermediate' },
      advanced: { class: 'bg-danger', text: 'Advanced' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || { class: 'bg-secondary', text: level };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Modal handlers
  const handleReviewCourse = (course: CourseRequest) => {
    setSelectedCourse(course);
    setReviewAction('approve');
    setReviewComments('');
    setShowReviewModal(true);
  };

  const handleQuickApprove = async (courseId: string) => {
    try {
      await adminApi.reviewCourseRequest(courseId, {
        action: 'approve',
        comments: 'Course approved via quick action'
      });
      toast.success('Course approved successfully');
      fetchCourseRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve course');
    }
  };

  const handleQuickReject = async (courseId: string) => {
    try {
      await adminApi.reviewCourseRequest(courseId, {
        action: 'reject',
        comments: 'Course rejected via quick action'
      });
      toast.success('Course rejected');
      fetchCourseRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject course');
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedCourse) return;

    try {
      await adminApi.reviewCourseRequest(selectedCourse.id, {
        action: reviewAction,
        comments: reviewComments
      });
      
      toast.success(`Course ${reviewAction === 'approve' ? 'approved' : reviewAction === 'reject' ? 'rejected' : 'sent for changes'} successfully`);
      setShowReviewModal(false);
      setSelectedCourse(null);
      fetchCourseRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedCourse(null);
    setReviewComments('');
  };

  // Transform data for the table
  const tableData = courseRequests.map(course => ({
    key: course.id,
    CourseID: course.id.substring(0, 8),
    CourseTitle: course.title,
    Subtitle: course.subtitle,
    HeroImage: course.heroImageUrl || 'assets/img/course/course-01.jpg',
    InstructorName: course.instructor.fullName,
    InstructorEmail: course.instructor.email,
    InstructorAvatar: course.instructor.avatar,
    Category: course.category.name,
    Specialty: course.specialty?.name || 'N/A',
    Level: course.level,
    Duration: course.duration,
    TotalSections: course.totalSections,
    TotalLessons: course.totalLessons,
    SubmittedDate: formatDate(course.submittedAt),
    Status: course.status,
    fullCourseData: course
  }));

  const columns = [
    {
      title: "Course Info",
      dataIndex: "CourseTitle",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-md avatar-rounded flex-shrink-0 me-2">
            <ImageWithBasePath src={record.HeroImage} alt={text} />
          </div>
          <div>
            <p className="fs-14 mb-0 fw-medium">
                <Link
                    to="#" 
                    onClick={() => handleReviewCourse(record.fullCourseData)}
                >
                    {text}
                </Link>
            </p>
            <small className="text-muted">{record.Subtitle}</small>
            <div className="mt-1">
              <small className="text-muted">
                <strong>Instructor:</strong> {record.InstructorName}
              </small>
            </div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.CourseTitle.localeCompare(b.CourseTitle),
    },
    {
      title: "Category",
      dataIndex: "Category",
      render: (category: string, record: any) => (
        <div>
          <div className="fw-medium">{category}</div>
          <small className="text-muted">{record.Specialty}</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.Category.localeCompare(b.Category),
    },
    {
      title: "Level & Duration",
      dataIndex: "Level",
      render: (level: string, record: any) => (
        <div>
          <div className="mb-1">{getLevelBadge(level)}</div>
          <small className="text-muted">{record.Duration} mins</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.Duration - b.Duration,
    },
    {
      title: "Content",
      dataIndex: "TotalSections",
      render: (sections: number, record: any) => (
        <div className="text-center">
          <div className="fw-bold">{sections}</div>
          <small className="text-muted">Sections</small>
          <div className="fw-bold mt-1">{record.TotalLessons}</div>
          <small className="text-muted">Lessons</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.TotalSections - b.TotalSections,
    },
    {
      title: "Submitted",
      dataIndex: "SubmittedDate",
      sorter: (a: any, b: any) => new Date(a.fullCourseData.submittedAt).getTime() - new Date(b.fullCourseData.submittedAt).getTime(),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (status: string) => (
        <div className="text-center">
          {getStatusBadge(status)}
        </div>
      ),
      sorter: (a: any, b: any) => a.Status.localeCompare(b.Status),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: string, record: any) => {
        void text;
        const isPending = record.Status === 'submitted';
        const isChangesRequested = record.Status === 'changes_requested';
        
        return (
          <div className="d-flex align-items-center">
            <button
              onClick={() => handleReviewCourse(record.fullCourseData)}
              className="btn btn-icon btn-sm btn-light me-1"
              title="Review Course"
            >
              <i className="isax isax-eye" />
            </button>
            
            {isPending && (
              <>
                <button
                  onClick={() => handleQuickApprove(record.key)}
                  className="btn btn-icon btn-sm btn-success me-1"
                  title="Quick Approve"
                >
                  <i className="isax isax-tick-circle" />
                </button>
                <button
                  onClick={() => handleQuickReject(record.key)}
                  className="btn btn-icon btn-sm btn-danger"
                  title="Quick Reject"
                >
                  <i className="isax isax-close-circle" />
                </button>
              </>
            )}
            
            {isChangesRequested && (
              <button
                onClick={() => handleQuickApprove(record.key)}
                className="btn btn-icon btn-sm btn-success"
                title="Approve Changes"
              >
                <i className="isax isax-tick-circle" />
              </button>
            )}
          </div>
        );
      },
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
            <div className="col-md-3">
              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.pending}</h4>
                  <h6 className="fw-medium mb-0 text-white">Pending Review</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.changesRequested}</h4>
                  <h6 className="fw-medium mb-0 text-white">Changes Requested</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.approvedThisWeek}</h4>
                  <h6 className="fw-medium mb-0 text-white">Approved This Week</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.totalProcessed}</h4>
                  <h6 className="fw-medium mb-0 text-white">Total Processed</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <AdminSidebar />
            
            <div className="col-lg-9">
              <div className="page-title mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Course Requests ({stats.pending + stats.changesRequested} pending)</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.adminInstructorRequests} className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                </div>
              </div>
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                onSearch={(searchTerm: string) => fetchCourseRequests(1, 10, searchTerm)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Course Modal */}
      {showReviewModal && selectedCourse && (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
          <div className="modal-content">
              <div className="modal-header">
              <h5 className="modal-title">Review Course: {selectedCourse.title}</h5>
              <button type="button" className="btn-close" onClick={closeReviewModal}></button>
              </div>
              <div className="modal-body">
              <CourseReviewModalContent 
                  courseId={selectedCourse.id}
                  onReviewSubmit={handleSubmitReview}
                  reviewAction={reviewAction}
                  reviewComments={reviewComments}
                  onReviewActionChange={setReviewAction}
                  onReviewCommentsChange={setReviewComments}
              />
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeReviewModal}>
                  Cancel
              </button>
              <button 
                  type="button" 
                  className={`btn ${
                  reviewAction === 'approve' ? 'btn-success' :
                  reviewAction === 'request-changes' ? 'btn-warning' : 'btn-danger'
                  }`}
                  onClick={handleSubmitReview}
                  disabled={!reviewComments.trim() && reviewAction !== 'approve'}
              >
                  {reviewAction === 'approve' ? 'Approve Course' :
                  reviewAction === 'request-changes' ? 'Request Changes' : 'Reject Course'}
              </button>
              </div>
          </div>
          </div>
      </div>
      )}
    </>
  );
};

export default AdminInstructorRequests;