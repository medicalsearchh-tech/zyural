import React, { useState, useEffect } from "react";
import { all_routes } from "../../../router/all_routes";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import ProfileCard from "../../common/profileCard";
import InstructorSidebar from "../../common/instructorSidebar";
import InstructorSettingsLink from "../settings-link/instructorSettingsLink";
import { Link } from "react-router-dom";
import CustomSelect from "../../../../core/common/commonSelect";
import type { OptionType } from "../../../../core/common/commonSelect";
import { Gender } from "../../../../core/common/selectOption/json/selectOption";
import { DatePicker } from "antd";
import { userApi } from "../../../../core/utils/api";
import { toast } from "react-toastify";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

const InstructorProfileSettings = () => {
  const route = all_routes;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bio: ""
  });

  const currentGenderOption = Gender.find(option => option.value === formData.gender);

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      const data = response.data;
      console.log(data.user);
      
      if (response.success) {
        setUserProfile(data.user);
        
      } else {
        toast.error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        gender: userProfile.gender || 'male',
        dateOfBirth: userProfile.dateOfBirth || '',
        // Add other fields as needed
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    // Extract the string value (for single DatePicker, it will be a string)
    const dateValue = Array.isArray(dateString) ? dateString[0] : dateString;
    console.log(date);

    setFormData(prev => ({
      ...prev,
      dateOfBirth: dateValue
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      setLoading(true);
      const response = await userApi.updateProfile(formData);

      const data = response.data;
      
      if (response.success) {
        toast.success(response.message || 'Profile updated successfully');
        if (response.data) {
          setUserProfile(data.user);
        }
      } else {
          toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file');
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File size must be less than 5MB');
      return;
    }
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);
      
      console.log(formData);
      

      const response = await userApi.uploadAvatar(formData);

      const data = response.data;
      
      if (response.success && response.data) {
        toast.success(response.message || 'Avatar uploaded successfully');
        // Update user profile with new avatar
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            avatar: data.avatarUrl
          });
        }
      } else {
        toast.error(response.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploadingAvatar(true);
      // You might need to implement a delete avatar endpoint in your backend
      // For now, we'll just update the user profile to remove the avatar
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar: null })
      });

      const data: ApiResponse<{ user: UserProfile }> = await response.json();
      
      if (data.success) {
        toast.success('Avatar deleted successfully');
        if (data.data) {
          setUserProfile(data.data.user);
        }
      } else {
        toast.error(data.message || 'Failed to delete avatar');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Failed to delete avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // You'll need to implement this endpoint in your backend
      const response = await fetch('/api/users/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data: ApiResponse<any> = await response.json();
      
      if (data.success) {
        toast.success('Account deleted successfully');
        // Clear auth token and redirect to home or login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else {
        toast.error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getModalContainer = () => {
    const modalElement = document.getElementById("add_assignment");
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  };

  if (loading && !userProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="My Profile" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* Sidebar */}
            <InstructorSidebar />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <InstructorSettingsLink />
              <div>
                <div className="card">
                  <div className="card-body">
                    <form className="mb-5" onSubmit={handleUpdateProfile}>
                      <div className="profile-upload-group">
                        <div className="d-flex align-items-center">
                          <Link
                            to={route.instructorProfile}
                            className="avatar flex-shrink-0 avatar-xxxl avatar-rounded border me-3"
                          >
                            {userProfile?.avatar ? (
                              <img
                                src={userProfile.avatar}
                                alt="Profile"
                                className="img-fluid"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <ImageWithBasePath
                                src="assets/img/user/user-02.jpg"
                                alt="Default Avatar"
                                className="img-fluid"
                              />
                            )}
                          </Link>
                          <div className="profile-upload-head">
                            <h6>
                              <Link to={route.instructorProfile}>Profile Photo</Link>
                            </h6>
                            <p className="fs-14 mb-0">
                              PNG or JPG no bigger than 5MB
                            </p>
                            <div className="new-employee-field">
                              <div className="d-flex align-items-center mt-2">
                                <div className="image-upload position-relative mb-0 me-2">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                  />
                                  <label
                                    htmlFor="avatar-upload"
                                    className={`btn bg-gray-100 btn-sm rounded-pill ${uploadingAvatar ? 'disabled' : ''}`}
                                    style={{ cursor: uploadingAvatar ? 'not-allowed' : 'pointer' }}
                                  >
                                    {uploadingAvatar ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" />
                                        Uploading...
                                      </>
                                    ) : (
                                      'Upload'
                                    )}
                                  </label>
                                </div>
                                {userProfile?.avatar && (
                                  <div className="img-delete">
                                    <button
                                      type="button"
                                      onClick={handleDeleteAvatar}
                                      className="btn btn-secondary btn-sm rounded-pill"
                                      disabled={uploadingAvatar}
                                    >
                                      {uploadingAvatar ? 'Deleting...' : 'Delete'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="edit-profile-info mb-3">
                          <h5 className="mb-1 fs-18">Personal Details</h5>
                          <p>Edit your personal information</p>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                minLength={2}
                                maxLength={50}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                minLength={2}
                                maxLength={50}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                value={userProfile?.email || ""}
                                disabled
                                style={{ backgroundColor: '#f8f9fa' }}
                              />
                              <small className="text-muted">Email cannot be changed</small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Phone Number{" "}
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Gender <span className="text-danger"> *</span>
                              </label>
                              <CustomSelect
                                options={Gender}
                                className="select d-flex" 
                                placeholder="Select Gender"
                                value={currentGenderOption}
                                onChange={(value: OptionType) => handleSelectChange('gender', String(value.value))}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Birth <span className="text-danger"> *</span>
                              </label>
                              <div className="input-icon-end position-relative">
                                <DatePicker
                                  className="form-control datetimepicker"
                                  getPopupContainer={getModalContainer}
                                  placeholder="dd/mm/yyyy"
                                  onChange={handleDateChange}
                                  style={{ width: '100%' }}
                                  required
                                />
                                <span className="input-icon-addon">
                                  <i className="isax isax-calendar" />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-4">
                              <label className="form-label">
                                Bio <span className="text-danger"> *</span>
                              </label>
                              <textarea
                                rows={4}
                                name="bio"
                                className="form-control"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                maxLength={1000}
                              />
                              <small className="text-muted">
                                {formData.bio?.length || 0}/1000 characters
                            </small>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <button
                              className="btn btn-primary rounded-pill"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                                  Updating...
                                </>
                              ) : (
                                'Update Profile'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <form>
                      <div>
                        <div>
                          <div className="mt-3 mb-3">
                            <h5 className="mb-1 fs-18">Educational Details</h5>
                            <p>Edit your Educational information</p>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-7">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Degree
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        University
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-5">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        From Date
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <div className="input-icon position-relative calender-input">
                                        <span className="input-icon-addon">
                                          <i className="isax isax-calendar z-1" />
                                        </span>
                                        <DatePicker
                                          className="form-control datetimepicker"
                                          getPopupContainer={getModalContainer}
                                          placeholder="dd/mm/yyyy"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        To Date
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <div className="input-icon position-relative calender-input">
                                        <span className="input-icon-addon calender-input">
                                          <i className="isax isax-calendar z-1" />
                                        </span>
                                        <DatePicker
                                          className="form-control datetimepicker"
                                          getPopupContainer={getModalContainer}
                                          placeholder="dd/mm/yyyy"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Link
                              to="#"
                              className="d-inline-flex align-items-center text-secondary fw-medium mb-3"
                              id="add-new-topic-btn"
                            >
                              <i className="isax isax-add me-1" /> Add New
                            </Link>
                          </div>
                          <div className="mt-3 mb-3">
                            <h5 className="mb-1 fs-18">Experience</h5>
                            <p>Edit your Experience</p>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xl-7">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Company
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Position
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue=""
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-5">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        From Date
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <div className="input-icon position-relative calender-input">
                                        <span className="input-icon-addon">
                                          <i className="isax isax-calendar z-1" />
                                        </span>
                                        <DatePicker
                                          className="form-control datetimepicker"
                                          getPopupContainer={getModalContainer}
                                          placeholder="dd/mm/yyyy"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        To Date
                                        <span className="text-danger"> *</span>
                                      </label>
                                      <div className="input-icon position-relative calender-input">
                                        <span className="input-icon-addon calender-input">
                                          <i className="isax isax-calendar z-1" />
                                        </span>
                                        <DatePicker
                                          className="form-control datetimepicker"
                                          getPopupContainer={getModalContainer}
                                          placeholder="dd/mm/yyyy"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Link
                              to="#"
                              className="d-inline-flex align-items-center text-secondary fw-medium mb-3"
                              id="add-new-topic-btn2"
                            >
                              <i className="isax isax-add me-1" /> Add New
                            </Link>
                          </div>
                          <div className="col-md-12">
                            <button
                              className="btn btn-secondary rounded-pill"
                              type="submit"
                            >
                              Update Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="card mb-0">
                  <div className="card-body">
                    <h5 className="fs-18 mb-3 text-danger">Delete Account</h5>
                    <h6 className="mb-1">
                      Are you sure you want to delete your account?
                    </h6>
                    <p className="mb-3">
                      This action will permanently remove your account and all associated data 
                      including enrollments, progress, and certificates. This action cannot be undone.
                    </p>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Delete Account</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className="avatar avatar-xl avatar-rounded bg-danger-transparent mb-3">
                    <i className="ti ti-trash text-danger fs-24"></i>
                  </div>
                  <h6 className="mb-2">Are you absolutely sure?</h6>
                  <p className="mb-3">
                    This action cannot be undone. This will permanently delete your account 
                    and remove all your data from our servers including:
                  </p>
                  <ul className="text-start mb-3">
                    <li>All course enrollments and progress</li>
                    <li>Certificates and achievements</li>
                    <li>Personal profile information</li>
                    <li>Payment history</li>
                  </ul>
                  <p className="text-muted small">
                    Please type "DELETE" to confirm account deletion.
                  </p>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Type DELETE to confirm"
                    id="delete-confirmation"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn bg-gray-100 rounded-pill me-2"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmInput = document.getElementById('delete-confirmation') as HTMLInputElement;
                    if (confirmInput?.value === 'DELETE') {
                      handleDeleteAccount();
                    } else {
                      toast.error('Please type "DELETE" to confirm');
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default InstructorProfileSettings;
