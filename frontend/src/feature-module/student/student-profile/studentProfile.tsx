import { useState, useEffect } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
import { userApi } from "../../../core/utils/api";

// Define the user data type based on your localStorage structure
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  isEmailVerified: boolean;
  lastLoginAt: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
}

const StudentProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getProfile();
      const data = response.data;
      console.log(data.user);
      
      if (response.success) {
        setUserData(data.user);
        
      } 
    } catch (error) {
      console.error('Error fetching profile:', error);
    } 
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to calculate age from DOB (if you add DOB to user data later)
  const calculateAge = (dob: string | undefined): string | number => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Show loading state if user data is not yet loaded
  if (!userData) {
    return (
      <>
        <Breadcrumb title="My Profile" />
        <div className="content">
          <div className="container">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div>Loading profile...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="My Profile" />

      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard />
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">My Profile</h5>
                <Link to="/student/student-settings" className="edit-profile-icon">
                  <i className="isax isax-edit-2" />
                </Link>
              </div>
              <div className="card mb-0">
                <div className="card-body">
                  <h6 className="fs-18 page-title fw-bold">
                    Basic Information
                  </h6>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>First Name</h6>
                        <span>{userData.firstName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Last Name</h6>
                        <span>{userData.lastName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Last Login</h6>
                        <span>{formatDate(userData.lastLoginAt)}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>User ID</h6>
                        <span>{userData.id ? userData.id.substring(0, 8) + '...' : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Phone Number</h6>
                        <span>{userData.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Email</h6>
                        <span>{userData.email || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Role</h6>
                        <span style={{ textTransform: 'capitalize' }}>{userData.role || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Email Verified</h6>
                        <span>
                          {userData.isEmailVerified ? (
                            <span className="text-success">✓ Verified</span>
                          ) : (
                            <span className="text-warning">⚠ Not Verified</span>
                          )}
                        </span>
                      </div>
                    </div>
                    {userData.dateOfBirth && (
                      <div className="col-md-4">
                        <div className="mb-3">
                          <h6>Age</h6>
                          <span>{calculateAge(userData.dateOfBirth)}</span>
                        </div>
                      </div>
                    )}
                    <div className="col-md-12">
                      <div>
                        <h6>Bio</h6>
                        <span>
                          {userData.bio || `Hello! I'm ${userData.firstName} ${userData.lastName}. Welcome to my profile!`}
                        </span>
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
  );
};

export default StudentProfile;