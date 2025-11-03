import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { all_routes } from '../../router/all_routes'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AdminSidebar from '../common/adminSidebar';
import ProfileCard from '../common/profileCard';
import Table from "../../../core/common/dataTable/index";
import { categoryApi, specialtyApi } from '../../../core/utils/api';

interface Category {
  id: string;
  name: string;
}

interface Specialty {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

const AdminSpecialties: React.FC = () => {
  const location = useLocation();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const urlParams = new URLSearchParams(location.search);
  const categoryIdFromUrl = urlParams.get('category');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryId = urlParams.get('category');
    if (categoryId) {
      setFilterCategory(categoryId);
      setFormData({ name: '', categoryId: categoryId });
    }
    fetchCategories();
    fetchSpecialties();
  }, [location.search]);

  useEffect(() => {
    fetchSpecialties();
  }, [filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await specialtyApi.getSpecialties(filterCategory || undefined);
      if (response.success) {
        setSpecialties(response.data.specialties);
      } else {
        toast.error('Failed to load specialties');
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
      toast.error('Failed to load specialties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Specialty name is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Category is required');
      return;
    }

    try {
      let response;
      
      if (editingSpecialty) {
        response = await specialtyApi.updateSpecialty(editingSpecialty.id, formData);
      } else {
        response = await specialtyApi.createSpecialty(formData);
      }

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        setFormData({ name: '', categoryId: '' });
        setEditingSpecialty(null);
        fetchSpecialties();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving specialty:', error);
      toast.error('Failed to save specialty');
    }
  };

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({ 
      name: specialty.name,
      categoryId: specialty.categoryId 
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specialty?')) {
      return;
    }

    try {
      const response = await specialtyApi.deleteSpecialty(id);

      if (response.success) {
        toast.success(response.message);
        fetchSpecialties();
      } else {
        toast.error(response.message || 'Failed to delete specialty');
      }
    } catch (error) {
      console.error('Error deleting specialty:', error);
      toast.error('Failed to delete specialty');
    }
  };

  const openCreateModal = () => {
    setEditingSpecialty(null);
    setFormData({ name: '', categoryId: categoryIdFromUrl || '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSpecialty(null);
    setFormData({ name: '', categoryId: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Filter specialties based on search
  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Transform data for the table
  const tableData = filteredSpecialties.map(specialty => ({
    key: specialty.id,
    Name: specialty.name,
    Category: specialty.category.name,
    CategoryId: specialty.categoryId,
    Status: specialty.isActive,
    CreatedAt: formatDate(specialty.createdAt),
    UpdatedAt: formatDate(specialty.updatedAt),
    fullSpecialtyData: specialty
  }));

  const columns = [
    {
      title: "Specialty Name",
      dataIndex: "Name",
      render: (text: string) => (
        <div>
          <p className="fs-14 mb-0 fw-medium">{text}</p>
        </div>
      ),
      sorter: (a: any, b: any) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Category",
      dataIndex: "Category",
      render: (text: string) => (
        <span className="badge bg-info text-white">
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Category.localeCompare(b.Category),
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
      sorter: (a: any, b: any) => new Date(a.fullSpecialtyData.createdAt).getTime() - new Date(b.fullSpecialtyData.createdAt).getTime(),
    },
    {
      title: "Last Updated",
      dataIndex: "UpdatedAt",
      sorter: (a: any, b: any) => new Date(a.fullSpecialtyData.updatedAt).getTime() - new Date(b.fullSpecialtyData.updatedAt).getTime(),
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
              handleEdit(record.fullSpecialtyData);
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
              handleDelete(record.fullSpecialtyData.id);
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
                  <h4 className="mb-2">Manage Specialties</h4>
                  <p className="text-muted mb-0">Create and manage course specialties ({specialties.length})</p>
                </div>
                <div className="d-flex gap-2">
                  <Link to={all_routes.adminCategories} className="me-3 mt-2">
                    <i className="isax isax-arrow-left-2" />
                    Back to Categories
                  </Link>
                  <select 
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-primary"
                    onClick={openCreateModal}
                  >
                    <i className="feather-plus me-2"></i>
                    Add Specialty
                  </button>
                </div>
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
                  {editingSpecialty ? 'Edit Specialty' : 'Create New Specialty'}
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
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Specialty Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter specialty name"
                      required
                      autoFocus
                    />
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
                    {editingSpecialty ? 'Update Specialty' : 'Create Specialty'}
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

export default AdminSpecialties;