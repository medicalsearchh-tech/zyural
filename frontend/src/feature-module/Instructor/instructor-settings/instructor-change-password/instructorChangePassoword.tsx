import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../../common/profileCard";
import InstructorSidebar from "../../common/instructorSidebar";
import InstructorSettingsLink from "../settings-link/instructorSettingsLink";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { userApi } from "../../../../core/utils/api";
import { toast } from "react-toastify";
import { all_routes } from "../../../router/all_routes";
import { useUser } from '../../../../core/context/UserContext'; 

// Password validation functions
const hasNumber = (value: string): boolean => {
  return /[0-9]/.test(value);
};

const hasMixed = (value: string): boolean => {
  return /[a-z]/.test(value) && /[A-Z]/.test(value);
};

const hasSpecial = (value: string): boolean => {
  return /[!#@$%^&*)(+=._-]/.test(value);
};

const strengthColor = (count: number): string => {
  if (count < 1) return "poor";
  if (count < 2) return "weak";
  if (count < 3) return "strong";
  if (count < 4) return "heavy";
  return "poor";
};

// Password confirmation modal component
const PasswordConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword.trim()) {
      onConfirm(currentPassword);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Please enter your current password to confirm this change.</p>
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Current Password <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <span
                    className="input-icon-addon toggle-password fs-14"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i
                      className={`isax ${
                        showPassword ? "isax-eye" : "isax-eye-slash"
                      }`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary ms-2"
                disabled={!currentPassword.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Confirming...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InstructorChangePassword = () => {
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<number>(0);
  const [strength, setStrength] = useState<string>("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email change states
  const { user } = useUser();
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState(""); 
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const validatePassword = (value: string) => {
    if (!value) {
      setValidationError(1);
    } else if (value.length < 8) {
      setValidationError(2);
    } else if (!/[0-9]/.test(value)) {
      setValidationError(3);
    } else if (!/[!@#$%^&*()]/.test(value)) {
      setValidationError(4);
    } else {
      setValidationError(5);
    }
  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const strengthIndicator = (value: string): number => {
    let strengths = 0;
    if (value.length >= 8) strengths = 1;
    if (hasNumber(value) && value.length >= 8) strengths = 2;
    if (hasSpecial(value) && value.length >= 8 && hasNumber(value)) strengths = 3;
    if (hasMixed(value) && hasSpecial(value) && value.length >= 8 && hasNumber(value)) strengths = 3;
    return strengths;
  };

  useEffect(() => {
    if (user?.email) {
      setCurrentEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (newPassword) {
      let strengthValue = strengthIndicator(newPassword);
      let color = strengthColor(strengthValue);
      setStrength(color);
    } else {
      setStrength("");
    }
  }, [newPassword]);

  const messages = () => {
    switch (validationError) {
      case 2:
        return (
          <span id="poor" className="active mt-2" style={{ fontSize: 14, color: "#DC3545", marginTop: "8px" }}>
            <ImageWithBasePath src="assets/img/icon/angry.svg" className="me-2" alt="" />
            Weak. Must contain at least 8 characters
          </span>
        );
      case 3:
        return (
          <span id="weak" className="active mt-2" style={{ fontSize: 14, color: "#FFC107", marginTop: "8px" }}>
            <ImageWithBasePath src="assets/img/icon/anguish.svg" className="me-2" alt="" />
            Average. Must contain at least 1 letter or number
          </span>
        );
      case 4:
        return (
          <span id="strong" className="active mt-2" style={{ fontSize: 14, color: "#0D6EFD", marginTop: "8px" }}>
            <ImageWithBasePath src="assets/img/icon/smile.svg" className="me-2" alt="" />
            Almost. Must contain special symbol
          </span>
        );
      case 5:
        return (
          <span id="heavy" className="active mt-2" style={{ fontSize: 14, color: "#4BB543", marginTop: "8px" }}>
            <ImageWithBasePath src="assets/img/icon/smile.svg" className="me-2" alt="" />
            Awesome! You have a secure password.
          </span>
        );
      default:
        return null;
    }
  };

  // Handle password change form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (validationError !== 5) {
      toast.error("Please ensure your new password meets all requirements");
      return;
    }

    try {
      setPasswordLoading(true);
      
      const passwordData = {
        currentPassword,
        newPassword
      };

      const response = await userApi.changePassword(passwordData);
      
      if (response.success) {
        toast.success("Password changed successfully");
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setValidationError(0);
        setStrength("");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle email change form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      toast.error("Please enter a new email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setShowPasswordModal(true);
  };

  // Handle password confirmation for email change
  const handleEmailPasswordConfirm = async (password: string) => {
    try {
      setEmailLoading(true);

      const emailData = {
        newEmail,
        currentPassword: password
      };

      // This will be implemented when you create the backend API
      const response = await userApi.changeEmail(emailData);
      
      if (response.success) {
        toast.success("Please check your new email for confirmation.");
        setCurrentEmail(response.data.newEmail); 
        setNewEmail("");
        setShowPasswordModal(false);
        setEmailLoading(false);
      } else {
        toast.error(response.message || "Failed to change Email");
      }
      

    } catch (error: any) {
      console.error("Email change error:", error);
      toast.error(error.response?.data?.message || "Failed to change email");
      setEmailLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb title="Settings" />
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <InstructorSidebar />
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Settings</h5>
              </div>
              <InstructorSettingsLink />
              
              <div className="card mb-0">
                <div className="card-body">
                  {/* Change Password Section */}
                  <div className="border-bottom mb-4 pb-4">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-3">
                          <h5 className="mb-1 fs-18">Change Password</h5>
                          <p>
                            Can't remember your current password?&nbsp;
                            <Link to={all_routes.forgotpassword} className="text-decoration-underline">
                              Reset your password via email
                            </Link>
                          </p>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit}>
                          {/* Current Password */}
                          <div className="mb-3 position-relative">
                            <label className="form-label">
                              Current Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                className="form-control form-control-lg pass-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                              />
                              <span
                                className="input-icon-addon toggle-password fs-14"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={{ cursor: 'pointer' }}
                              >
                                <i
                                  className={`isax ${
                                    showCurrentPassword ? "isax-eye" : "isax-eye-slash"
                                  }`}
                                ></i>
                              </span>
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="mb-3 position-relative">
                            <label className="form-label">
                              New Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative" id="passwordInput">
                              <input
                                className="form-control pass-input"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                required
                              />
                              <span
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className={`toggle-passwords text-gray-7 fs-14 isax ${
                                  showNewPassword ? "isax-eye" : "isax-eye-slash"
                                }`}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                            
                            <div
                              id="passwordStrength"
                              style={{ display: "flex" }}
                              className={`password-strength ${
                                strength === "poor"
                                  ? "poor-active"
                                  : strength === "weak"
                                  ? "avg-active"
                                  : strength === "strong"
                                  ? "strong-active"
                                  : strength === "heavy"
                                  ? "heavy-active"
                                  : ""
                              }`}
                            >
                              <span id="poor" className="active"></span>
                              <span id="weak" className="active"></span>
                              <span id="strong" className="active"></span>
                              <span id="heavy" className="active"></span>
                            </div>
                            <div id="passwordInfo">{messages()}</div>
                          </div>

                          {/* Confirm Password */}
                          <div className="mb-3 position-relative">
                            <label className="form-label">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="pass-inputa form-control form-control-lg"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                              />
                              <span
                                className={`isax toggle-passworda ${
                                  showConfirmPassword ? "isax-eye" : "isax-eye-slash"
                                } text-gray-7 fs-14`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                              />
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                              <small className="text-danger mt-1">
                                Passwords do not match
                              </small>
                            )}
                          </div>
                          
                          <div>
                            <button 
                              className="btn btn-secondary" 
                              type="submit"
                              disabled={passwordLoading}
                            >
                              {passwordLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Changing Password...
                                </>
                              ) : (
                                'Change Password'
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Change Email Section */}
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <h5 className="mb-1 fs-18">Change Email</h5>
                        <p>
                          Your current email address is&nbsp;
                          <Link to="#" className="fw-semibold">
                            {currentEmail || 'Loading...'}
                          </Link>
                        </p>
                      </div>
                      
                      <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                          <label className="form-label">
                            New Email Address <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="email" 
                            className="form-control"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <button 
                            className="btn btn-secondary" 
                            type="submit"
                            disabled={emailLoading}
                          >
                            {emailLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleEmailPasswordConfirm}
        isLoading={emailLoading}
      />
    </div>
  );
};

export default InstructorChangePassword;