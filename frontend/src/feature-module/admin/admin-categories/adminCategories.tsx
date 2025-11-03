import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import AdminSidebar from '../common/adminSidebar';
import ProfileCard from '../common/profileCard';
import Table from "../../../core/common/dataTable/index";
import { categoryApi } from '../../../core/utils/api';

interface Category {
  id: string;
  name: string;
  icon?: string;  
  imageUrl?: string;  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ 
    name: '',
    iconFile: null as File | null, 
    iconPreview: '' as string 
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/admin/specialties?category=${category.id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        iconFile: file,
        iconPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      // Create FormData object
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      
      // Add icon file if selected
      if (formData.iconFile) {
        submitData.append('icon', formData.iconFile);
      }

      let response;
      
      if (editingCategory) {
        response = await categoryApi.updateCategory(editingCategory.id, submitData);
      } else {
        response = await categoryApi.createCategory(submitData);
      }

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        setFormData({ name: '', iconFile: null, iconPreview: '' });
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name,
      iconFile: null,
      iconPreview: category.imageUrl || category.icon || ''  
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this category? All associated specialties will also be deleted.`)) {
      return;
    }

    try {
      const response = await categoryApi.deleteCategory(id);

      if (response.success) {
        toast.success(response.message);
        fetchCategories();
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', iconFile: null, iconPreview: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', iconFile: null, iconPreview: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Transform data for the table
  const tableData = filteredCategories.map(category => ({
    key: category.id,
    Name: category.name,
    Status: category.isActive,
    CreatedAt: formatDate(category.createdAt),
    UpdatedAt: formatDate(category.updatedAt),
    fullCategoryData: category
  }));

  const columns = [
    {
      title: "Icon",
      dataIndex: "Icon",
      render: (_: any, record: any) => (
        <div style={{ width: '40px', height: '40px' }}>
          {record.fullCategoryData.imageUrl || record.fullCategoryData.icon ? (
            <img 
              src={record.fullCategoryData.imageUrl || record.fullCategoryData.icon} 
              alt={record.Name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          ) : (
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="feather-image" style={{ color: '#999' }}></i>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "Name",
      render: (text: string, record: any) => (
        <div 
          className="cursor-pointer hover:text-primary"
          onClick={() => handleCategoryClick(record.fullCategoryData)}
          style={{ cursor: 'pointer' }}
        >
          <p className="fs-14 mb-0 fw-medium text-primary-hover">{text}</p>
        </div>
      ),
      sorter: (a: any, b: any) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (isActive: boolean) => (
        <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      sorter: (a: any, b: any) => Number(b.Status) - Number(a.Status),
    },
    {
      title: "Created Date",
      dataIndex: "CreatedAt",
      sorter: (a: any, b: any) => new Date(a.fullCategoryData.createdAt).getTime() - new Date(b.fullCategoryData.createdAt).getTime(),
    },
    {
      title: "Last Updated",
      dataIndex: "UpdatedAt",
      sorter: (a: any, b: any) => new Date(a.fullCategoryData.updatedAt).getTime() - new Date(b.fullCategoryData.updatedAt).getTime(),
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      render: (_: any, record: any) => (
        <div className="d-flex gap-2">
          <Link
            to="#"
            className="btn btn-icon btn-sm bg-success text-white"
            onClick={(e) => {
              e.preventDefault();
              handleEdit(record.fullCategoryData);
            }}
            title="Edit"
          >
            <i className="isax isax-edit-2"></i>
          </Link>
          <Link
            to="#"
            className="btn btn-icon btn-sm bg-danger text-white"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(record.fullCategoryData.id);
            }}
            title="Delete"
          >
            <i className="isax isax-trash"></i>
          </Link>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="main-wrapper">
        <div className="page-content">
          <div className="container">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="page-content">
        <div className="container">
          <ProfileCard/>
          
          <div className="row">
            <AdminSidebar />

            <div className="col-xl-9 col-lg-9">
              <div className="page-title mb-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-2">Manage Categories</h4>
                  <p className="text-muted mb-0">Create and manage course categories ({categories.length})</p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={openCreateModal}
                >
                  <i className="feather-plus me-2"></i>
                  Add Category
                </button>
              </div>

              <div className="card">
                <div className="card-body">
                  <Table 
                    dataSource={tableData} 
                    columns={columns} 
                    Search={true}
                    onSearch={(term: string) => setSearchTerm(term)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Category Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                      required
                      autoFocus
                    />
                  </div>
                  {/* ADD THIS NEW SECTION */}
                  <div className="mb-3">
                    <label className="form-label">
                      Category Icon
                    </label>
                    
                    {/* Preview */}
                    {formData.iconPreview && (
                      <div className="mb-3">
                        <div  style={{ position: 'relative', margin:'auto', width: '240px', height: '240px' }}>
                          <img 
                            src={formData.iconPreview} 
                            alt="Icon preview"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0'
                            }}
                          />
                          <button
                            type="button"
                            className="btn  btn-danger"
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              padding: '2px 6px'
                            }}
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              iconFile: null, 
                              iconPreview: '' 
                            }))}
                          >
                            <i className="isax isax-close-circle"></i>
                          </button>
                        </div>
                      </div>
                    )}
                    {/* File Input */}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <small className="text-muted d-block mt-1">
                      Accepted formats: JPG, PNG, SVG (Max 5MB)
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;