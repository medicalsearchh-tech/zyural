import { useState, useEffect } from 'react';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import InstructorSidebar from '../common/instructorSidebar'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import Table from "../../../core/common/dataTable/index";
import { courseApi } from '../../../core/utils/api';

interface Course {
  id: string;
  title: string;
  progress: number;
  enrolledAt: string;
  certificateIssued: boolean;
}

interface Student {
  studentId: string;
  fullName: string;
  email: string;
  avatar: string;
  enrollDate: string;
  progressPercentage: number;
  courseCount: number;
  certificateCount: number;
  courses: Course[];
}

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  newStudents: number;
  totalCertificatesIssued: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats>({
    totalStudents: 0,
    activeStudents: 0,
    completedStudents: 0,
    newStudents: 0,
    totalCertificatesIssued: 0
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNext: false,
    hasPrev: false
  });

  console.log(pagination);
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await courseApi.getInstructorStudents({
        page,
        limit,
        search
      });
      
      setStudents(response.data.studentListData);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch students:', error);
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

  const getCompletedCoursesCount = (courses: Course[]) => {
    return courses.filter(course => course.progress === 100).length;
  };

  const getCertificateStatusBadge = (certificateCount: number, totalCourses: number) => {
    if (certificateCount === 0) {
      return <span className="badge bg-secondary">No Certificates</span>;
    } else if (certificateCount === totalCourses) {
      return <span className="badge bg-success">All Certified</span>;
    } else {
      return <span className="badge bg-warning">{certificateCount} Certified</span>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  // Transform data for the table
  const tableData = students.map(student => ({
    key: student.studentId,
    StudentID: student.studentId.substring(0, 8), // Show first 8 characters
    StudentName: student.fullName,
    Email: student.email,
    Img: student.avatar || 'assets/img/user/default-avatar.jpg',
    EnrollDate: formatDate(student.enrollDate),
    Progress: student.progressPercentage,
    Courses: student.courseCount,
    CompletedCourses: getCompletedCoursesCount(student.courses),
    CertificateCount: student.certificateCount,
    fullStudentData: student // Keep full data for actions
  }));

  const columns = [
    {
      title: "Student ID",
      dataIndex: "StudentID",
      render: (text: string, record: any) => (
        <Link to="#" className="text-primary" title={record.fullStudentData.studentId}>
          {text}...
        </Link>
      ),
      sorter: (a: any, b: any) => a.StudentID.localeCompare(b.StudentID),
    },
    {
      title: "Student Name",
      dataIndex: "StudentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={record.Img} alt={text} />
          </Link>
          <div>
            <Link to="#" className="text-decoration-none">
              <p className="fs-14 mb-0 fw-medium">{text}</p>
            </Link>
            <small className="text-muted">{record.Email}</small>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.StudentName.localeCompare(b.StudentName),
    },
    {
      title: "Enroll Date",
      dataIndex: "EnrollDate",
      sorter: (a: any, b: any) => new Date(a.fullStudentData.enrollDate).getTime() - new Date(b.fullStudentData.enrollDate).getTime(),
    },
    {
      title: "Progress",
      dataIndex: "Progress",
      render: (progress: number) => (
        <div className="d-flex align-items-center">
          <div
            className="progress progress-xs flex-shrink-0"
            role="progressbar"
            style={{ height: 6, width: 100 }}
          >
            <div
              className={`progress-bar ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ms-2 fs-12 fw-medium">{progress}%</span>
        </div>
      ),
      sorter: (a: any, b: any) => a.Progress - b.Progress,
    },
    {
      title: "Courses",
      dataIndex: "Courses",
      render: (courses: number, ) => (
        <div className="text-center">
          <div className="fw-bold">{courses}</div>
          <small className="text-muted">Enrolled</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.Courses - b.Courses,
    },
    {
      title: "Completed",
      dataIndex: "CompletedCourses",
      render: (completed: number, record: any) => (
        <div className="text-center">
          <div className="fw-bold text-success">{completed}</div>
          <small className="text-muted">of {record.Courses}</small>
        </div>
      ),
      sorter: (a: any, b: any) => a.CompletedCourses - b.CompletedCourses,
    },
    {
      title: "Certificate Status",
      dataIndex: "CertificateCount",
      render: (certificateCount: number, record: any) => (
        <div className="text-center">
          {getCertificateStatusBadge(certificateCount, record.Courses)}
          <div className="mt-1">
            <small className="text-muted">{certificateCount} earned</small>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.CertificateCount - b.CertificateCount,
    },
  ];

  if (loading) {
    return (
      <>
        <Breadcrumb title="Students List" />
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
      <Breadcrumb title="Students List" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-2">
              <div className="card bg-primary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.totalStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Total Students</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-info">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.activeStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Active</h6>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-success">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.completedStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">Completed</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.totalCertificatesIssued}</h4>
                  <h6 className="fw-medium mb-0 text-white">Certificates Issued</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-secondary">
                <div className="card-body text-center">
                  <h4 className="text-white fw-bold">{stats.newStudents}</h4>
                  <h6 className="fw-medium mb-0 text-white">New (30 days)</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <InstructorSidebar />
            
            <div className="col-lg-9">
              <div className="page-title mb-5 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Students ({stats.totalStudents})</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.studentsList} className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  {/* <Link to={all_routes.studentsGrid}>
                    <i className="isax isax-element-3" />
                  </Link> */}
                </div>
              </div>
              
              <Table 
                dataSource={tableData} 
                columns={columns} 
                Search={true}
                onSearch={(searchTerm: string) => fetchStudents(1, 10, searchTerm)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentList;