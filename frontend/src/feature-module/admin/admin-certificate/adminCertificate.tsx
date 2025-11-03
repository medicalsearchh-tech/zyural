import { useState, useEffect } from 'react';
import ProfileCard from '../common/profileCard';
import AdminSidebar from '../common/adminSidebar';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { adminApi, certificateApi } from '../../../core/utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ---------------- Updated Types ----------------
interface Course {
  value: string;
  label: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  backgroundImageUrl: string | null;
  previewImageUrl: string | null;
  courseId: string | null;
  course?: {
    id: string;
    title: string;
    instructor?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  designConfig: {
    canvas: {
      width: number;
      height: number;
      backgroundColor: string;
      backgroundImage: string | null;
    };
    elements: CertificateElement[];
  };
  dynamicFields: {
    studentName: { enabled: boolean; required: boolean; label: string };
    courseTitle: { enabled: boolean; required: boolean; label: string };
    completionDate: { enabled: boolean; required: boolean; label: string };
    certificateNumber: { enabled: boolean; required: boolean; label: string };
    instructorName: { enabled: boolean; required: boolean; label: string };
    creditHours: { enabled: boolean; required: boolean; label: string };
    creditType: { enabled: boolean; required: boolean; label: string };
    accreditationBody: { enabled: boolean; required: boolean; label: string };
    customFields: any[];
  };
  status: 'draft' | 'active' | 'archived';
  isGlobal: boolean;
  createdBy: string;
  issuedCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CertificateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'dynamic-field';
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    textBaseline?: 'top' | 'middle' | 'bottom';
    maxWidth?: number;
    lineHeight?: number;
    opacity?: number;
    rotation?: number;
  };
  content?: string;
  fieldType?: 'studentName' | 'courseTitle' | 'completionDate' | 'certificateNumber' | 
               'instructorName' | 'creditHours' | 'creditType' | 'accreditationBody' | 'issueDate';
  zIndex?: number;
}

interface CertificateStats {
  totalCertificates: number;
  activeCertificates: number;
  draftCertificates: number;
  archivedCertificates: number;
  certificatesWithIssued: number;
  certificatesWithoutIssued: number;
}

// ---------------- Component ----------------
const AdminCertificate = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    totalCertificates: 0,
    activeCertificates: 0,
    draftCertificates: 0,
    archivedCertificates: 0,
    certificatesWithIssued: 0,
    certificatesWithoutIssued: 0
  });
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Default template designs for quick start
  const defaultTemplates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean modern design with professional layout',
      preview: './assets/img/certificates/modern-template.jpg',
      designConfig: {
        canvas: { width: 1200, height: 850, backgroundColor: '#FFFFFF' },
        elements: [
          {
            id: 'title',
            type: 'text',
            position: { x: 50, y: 20 },
            style: { fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
            content: 'Certificate of Completion'
          },
          {
            id: 'student-name',
            type: 'dynamic-field',
            position: { x: 50, y: 40 },
            style: { fontFamily: 'Roboto', fontSize: 36, fontWeight: 'normal', color: '#333333', textAlign: 'center' },
            fieldType: 'studentName'
          }
        ]
      }
    },
    {
      id: 'classic',
      name: 'Classic Gold',
      description: 'Traditional design with elegant gold accents',
      preview: './assets/img/certificates/classic-template.jpg',
      designConfig: {
        canvas: { width: 1200, height: 850, backgroundColor: '#fef9e7' },
        elements: [
          {
            id: 'title',
            type: 'text',
            position: { x: 50, y: 25 },
            style: { fontFamily: 'Times New Roman', fontSize: 42, fontWeight: 'bold', color: '#8b6914', textAlign: 'center' },
            content: 'Certificate of Achievement'
          }
        ]
      }
    },
    {
      id: 'academic',
      name: 'Academic Formal',
      description: 'Formal academic style certificate',
      preview: './assets/img/certificates/academic-template.jpg',
      designConfig: {
        canvas: { width: 1200, height: 850, backgroundColor: '#ffffff' },
        elements: [
          {
            id: 'title',
            type: 'text',
            position: { x: 50, y: 22 },
            style: { fontFamily: 'Georgia', fontSize: 38, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
            content: 'Certificate of Excellence'
          }
        ]
      }
    }
  ];

  useEffect(() => {
    fetchCourses();
    fetchTemplates();
  }, [activeTab, pagination.currentPage, searchTerm]);

  const fetchCourses = async () => {
    try {
      const response = await adminApi.getAdminCourses({ limit: 100 });
      if (response.success && response.data) {
        const courseOptions = response.data.courses.map((course: any) => ({
          value: course.id,
          label: course.title
        }));
        setCourses(courseOptions);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchTemplates = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: any = { 
        page, 
        limit: pagination.itemsPerPage
      };
      
      if (searchTerm) params.search = searchTerm;
      if (activeTab === 'active') params.status = 'active';
      if (activeTab === 'draft') params.status = 'draft';
      if (activeTab === 'archived') params.status = 'archived';

      const response = await certificateApi.getTemplates(params);
      if (response.success && response.data) {
        setTemplates(response.data.templates || []);
        setStats(response.data.stats || stats);
        setPagination(response.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load certificate templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    // Show modal - you'll need to implement the modal show logic
    const modal = new (window as any).bootstrap.Modal(document.getElementById('view_template_modal'));
    modal.show();
  };

  const handleCreateFromTemplate = (template: any) => {
    // Create template from the selected default template
    const createTemplate = async () => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', `${template.name} - Copy`);
        formData.append('description', template.description);
        formData.append('isGlobal', 'false');
        formData.append('designConfig', JSON.stringify(template.designConfig));

        const response = await certificateApi.createTemplate(formData);
        if (response.success) {
          toast.success('Template created successfully!');
          fetchTemplates(pagination.currentPage);
          // Navigate to builder
          if (response.data?.template) {
            navigate(`/admin/certificate-builder/${response.data.template.id}`);
          }
        }
      } catch (error: any) {
        console.error('Error creating template:', error);
        toast.error(error.message || 'Failed to create template');
      } finally {
        setIsLoading(false);
      }
    };

    createTemplate();
  };

  const handleToggleStatus = async (templateId: string, newStatus: 'active' | 'draft' | 'archived') => {
    try {
      const response = await certificateApi.updateTemplateJson(templateId, { status: newStatus });
      if (response.success) {
        toast.success(`Template ${newStatus === 'active' ? 'published' : newStatus} successfully`);
        fetchTemplates(pagination.currentPage);
      }
    } catch (error: any) {
      console.error('Error updating template status:', error);
      toast.error(error.message || 'Failed to update template status');
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      const response = await certificateApi.deleteTemplate(templateId);
      if (response.success) {
        toast.success('Template deleted successfully');
        fetchTemplates(pagination.currentPage);
        setDeleteModalId('');
        
        // Close modal
        const modal = document.getElementById('delete_modal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }
      }
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', label: 'Active' },
      draft: { class: 'bg-warning', label: 'Draft' },
      archived: { class: 'bg-secondary', label: 'Archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const handleOpenBuilder = (templateId?: string) => {
    if (templateId) {
      navigate(`/admin/certificate-builder/${templateId}`);
    } else {
      navigate('/admin/certificate-builder');
    }
  };

  return (
    <>
      <div className="content">
        <div className="container">
          <ProfileCard/>
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-primary bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-award5 fs-24 text-primary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{stats.totalCertificates}</h4>
                      <p className="text-muted mb-0">Total Templates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-success bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-tick-circle5 fs-24 text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{stats.activeCertificates}</h4>
                      <p className="text-muted mb-0">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-warning bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-edit5 fs-24 text-warning"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{stats.draftCertificates}</h4>
                      <p className="text-muted mb-0">Draft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-info bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-profile-2user5 fs-24 text-info"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{stats.certificatesWithIssued}</h4>
                      <p className="text-muted mb-0">Issued</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-secondary bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-archive5 fs-24 text-secondary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{stats.archivedCertificates}</h4>
                      <p className="text-muted mb-0">Archived</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div className="card stats-card bg-purple bg-opacity-10 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="isax isax-book5 fs-24 text-purple"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-0 fw-bold">{courses.length}</h4>
                      <p className="text-muted mb-0">Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <AdminSidebar/>
            <div className="col-lg-9">
              <div className="certificate">
                {/* Header with Search and Actions */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h5 className="mb-0 fw-bold">Certificate Templates</h5>
                        <p className="text-muted mb-0">Design and manage certificate templates</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="search-group position-relative">
                          <i className="isax isax-search-normal-1 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                          <input
                            type="text"
                            className="form-control ps-5"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ minWidth: '300px' }}
                          />
                        </div>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={() => handleOpenBuilder()}
                            disabled={isLoading}
                          >
                            <i className="isax isax-add-circle me-2" />
                            New Template
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={isLoading}
                          >
                            <span className="visually-hidden">Toggle Dropdown</span>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => handleOpenBuilder()}
                              >
                                <i className="isax isax-add-circle me-2" />
                                Blank Template
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            {defaultTemplates.map(template => (
                              <li key={template.id}>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleCreateFromTemplate(template)}
                                  disabled={isLoading}
                                >
                                  <i className="isax isax-copy me-2" />
                                  {template.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-3">
                    <ul className="nav nav-pills nav-pills-bg-soft">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                          onClick={() => setActiveTab('all')}
                        >
                          All Templates
                          <span className="badge bg-primary ms-2">{stats.totalCertificates}</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                          onClick={() => setActiveTab('active')}
                        >
                          Active
                          <span className="badge bg-success ms-2">{stats.activeCertificates}</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'draft' ? 'active' : ''}`}
                          onClick={() => setActiveTab('draft')}
                        >
                          Draft
                          <span className="badge bg-warning ms-2">{stats.draftCertificates}</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'archived' ? 'active' : ''}`}
                          onClick={() => setActiveTab('archived')}
                        >
                          Archived
                          <span className="badge bg-secondary ms-2">{stats.archivedCertificates}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading templates...</p>
                  </div>
                )}

                {/* Templates Grid */}
                {!isLoading && (
                  <div className="row">
                    {templates.length === 0 ? (
                      <div className="col-12">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center py-5">
                            <div className="mb-3">
                              <i className="isax isax-document-text fa-4x text-muted opacity-50"></i>
                            </div>
                            <h5 className="fw-bold text-muted">No Templates Found</h5>
                            <p className="text-muted mb-4">
                              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first certificate template'}
                            </p>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleOpenBuilder()}
                            >
                              <i className="isax isax-add-circle me-2" />
                              Create Template
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      templates.map((template) => (
                        <div key={template.id} className="col-xl-4 col-lg-6 col-md-6">
                          <div className="card template-card border-0 shadow-sm h-100">
                            <div className="card-body p-0">
                              {/* Template Preview */}
                              <div className="template-preview position-relative">
                                <div
                                  className="d-block cursor-pointer"
                                  onClick={() => handleView(template)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <ImageWithBasePath
                                    className="img-fluid w-100 rounded-top"
                                    src={template.previewImageUrl || template.backgroundImageUrl || "./assets/img/certificates/default-template.jpg"}
                                    alt={template.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="position-absolute top-0 end-0 m-3">
                                  {getStatusBadge(template.status)}
                                </div>
                                {template.isGlobal && (
                                  <div className="position-absolute top-0 start-0 m-3">
                                    <span className="badge bg-info">Global</span>
                                  </div>
                                )}
                              </div>

                              {/* Template Details */}
                              <div className="p-3">
                                <h6 className="mb-1 fw-bold text-truncate">{template.name}</h6>
                                <p className="text-muted small mb-2 text-truncate">{template.description}</p>
                                
                                {template.course && (
                                  <p className="text-muted small mb-2">
                                    <i className="isax isax-book5 me-1"></i>
                                    {template.course.title}
                                  </p>
                                )}
                                
                                <div className="d-flex align-items-center justify-content-between text-muted small">
                                  <span>
                                    <i className="isax isax-calendar-1 me-1"></i>
                                    {formatDate(template.updatedAt)}
                                  </span>
                                  {template.issuedCount !== undefined && (
                                    <span>
                                      <i className="isax isax-profile-2user5 me-1"></i>
                                      {template.issuedCount} issued
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="card-footer bg-transparent border-top-0 pt-0">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleOpenBuilder(template.id)}
                                      title="Edit in Builder"
                                      disabled={isLoading}
                                    >
                                      <i className="isax isax-edit-2" />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleView(template)}
                                      title="Preview"
                                      disabled={isLoading}
                                    >
                                      <i className="isax isax-eye" />
                                    </button>
                                    {template.status === 'draft' && (
                                      <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => handleToggleStatus(template.id, 'active')}
                                        title="Publish"
                                        disabled={isLoading}
                                      >
                                        <i className="isax isax-tick-circle" />
                                      </button>
                                    )}
                                    {template.status === 'active' && (
                                      <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleToggleStatus(template.id, 'draft')}
                                        title="Unpublish"
                                        disabled={isLoading}
                                      >
                                        <i className="isax isax-pause-circle" />
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setDeleteModalId(template.id)}
                                    title="Delete"
                                    disabled={isLoading}
                                  >
                                    <i className="isax isax-trash" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Pagination */}
                {!isLoading && pagination.totalPages > 1 && (
                  <div className="card border-0 shadow-sm mt-4">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <p className="text-muted mb-0">
                            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                            {pagination.totalItems} templates
                          </p>
                        </div>
                        <div className="col-md-6">
                          <nav aria-label="Template pagination">
                            <ul className="pagination justify-content-center justify-content-md-end mb-0">
                              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => fetchTemplates(pagination.currentPage - 1)}
                                  disabled={pagination.currentPage === 1 || isLoading}
                                >
                                  <i className="fas fa-chevron-left" />
                                </button>
                              </li>
                              
                              {(() => {
                                const pages = [];
                                const startPage = Math.max(1, pagination.currentPage - 2);
                                const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);
                                
                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(
                                    <li key={i} className={`page-item ${i === pagination.currentPage ? 'active' : ''}`}>
                                      <button 
                                        className="page-link" 
                                        onClick={() => fetchTemplates(i)}
                                        disabled={isLoading}
                                      >
                                        {i}
                                      </button>
                                    </li>
                                  );
                                }
                                return pages;
                              })()}
                              
                              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => fetchTemplates(pagination.currentPage + 1)}
                                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                                >
                                  <i className="fas fa-chevron-right" />
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Template Modal */}
      <div className="modal fade" id="view_template_modal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Template Preview - {selectedTemplate?.name}</h5>
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
              {selectedTemplate && (
                <>
                  <div className="text-center mb-4">
                    <ImageWithBasePath
                      src={selectedTemplate.previewImageUrl || selectedTemplate.backgroundImageUrl || "assets/img/icon/certificate.svg"}
                      className="img-fluid border rounded"
                      alt={selectedTemplate.name}
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Template Details</h6>
                      <p><strong>Name:</strong> {selectedTemplate.name}</p>
                      <p><strong>Description:</strong> {selectedTemplate.description}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedTemplate.status)}</p>
                      {selectedTemplate.course && (
                        <p><strong>Course:</strong> {selectedTemplate.course.title}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6>Dynamic Fields</h6>
                      <div className="small">
                        {Object.entries(selectedTemplate.dynamicFields).map(([key, field]: [string, any]) => (
                          field.enabled && (
                            <div key={key} className="d-flex align-items-center mb-1">
                              <i className="isax isax-tick-circle text-success me-2"></i>
                              <span>{field.label}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="text-end mt-4">
                {selectedTemplate && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const modal = document.getElementById('view_template_modal');
                      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
                      bootstrapModal?.hide();
                      handleOpenBuilder(selectedTemplate.id);
                    }}
                  >
                    <i className="isax isax-edit-2 me-2" />
                    Edit in Builder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-gray-100 rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Delete Template</h4>
                <p className="mb-3">Are you sure you want to delete this template? This action cannot be undone.</p>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                    onClick={() => setDeleteModalId('')}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-pill"
                    onClick={() => handleDelete(deleteModalId)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .template-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .template-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .stats-card {
          transition: transform 0.2s ease-in-out;
        }
        .stats-card:hover {
          transform: translateY(-2px);
        }
        .nav-pills-bg-soft .nav-link {
          border-radius: 8px;
          margin-right: 8px;
          padding: 8px 16px;
          color: #6c757d;
          font-weight: 500;
        }
        .nav-pills-bg-soft .nav-link.active {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .bg-purple {
          background-color: #6f42c1 !important;
        }
        .text-purple {
          color: #6f42c1 !important;
        }
      `}</style>
    </>
  );
};

export default AdminCertificate;