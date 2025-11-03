import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Slider from "react-slick";
import { all_routes } from "../../router/all_routes";
import { authApi } from "../../../core/utils/api";
import { useUser } from '../../../core/context/UserContext';

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
  return "poor"; // Default return to ensure it's always a string
};

const Register: React.FC = () => {
  const [eye, setEye] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<number>(0);
  const [strength, setStrength] = useState<string>("");
  const [eyeConfirmPassword, setEyeConfirmPassword] = useState<boolean>(true);
  
  // New state for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "student" // default role
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const { setUser } = useUser();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const route = all_routes;
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Clear previous errors
    setError("");
    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to Terms of Service and Privacy Policy");
      return;
    }
    setIsLoading(true);

    try {
      const registerData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: password,
          role: formData.role
      };

      const response = await authApi.register(registerData);

      if (response.success && response.data) {
        // Registration successful
        console.log("Registration successful:", response.data);
        
        // Check if OTP verification is required
        if (response.data.requiresOTPVerification) {
          // Store user email for OTP verification
          localStorage.setItem("pendingVerificationEmail", response.data.user.email);
          // Navigate to OTP verification screen
          navigate(route.otp);
        } else {
          // If no OTP required, store token and redirect
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            setUser(response.data.user);
          }
          navigate(route.login);
        }
      } else {
        // Handle error response
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onEyeClick = () => {
    setEye((prev) => !prev);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

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

  const loginSLider = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true, // Uncomment if needed
  };

  const messages = () => {
    switch (validationError) {
      case 2:
        return (
          <span
            id="poor"
            className="active mt-2"
            style={{ fontSize: 14, color: "#DC3545", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/angry.svg"
              className="me-2"
              alt=""
            />{" "}
            Weak. Must contain at least 8 characters
          </span>
        );
      case 3:
        return (
          <span
            id="weak"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#FFC107", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/anguish.svg"
              className="me-2"
              alt=""
            />{" "}
            Average. Must contain at least 1 letter or number
          </span>
        );
      case 4:
        return (
          <span
            id="strong"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#0D6EFD", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/smile.svg"
              className="me-2"
              alt=""
            />{" "}
            Almost. Must contain special symbol
          </span>
        );
      case 5:
        return (
          <span
            id="heavy"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#4BB543", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/smile.svg"
              className="me-2"
              alt=""
            />{" "}
            Awesome! You have a secure password.
          </span>
        );
      default:
        return null;
    }
  };

  const strengthIndicator = (value: string): number => {
    let strengths = 0;
    if (value.length >= 8) strengths = 1;
    if (hasNumber(value) && value.length >= 8) strengths = 2;
    if (hasSpecial(value) && value.length >= 8 && hasNumber(value))
      strengths = 3;
    if (
      hasMixed(value) &&
      hasSpecial(value) &&
      value.length >= 8 &&
      hasNumber(value)
    )
      strengths = 3;
    return strengths;
  };

  useEffect(() => {
    if (password) {
      let strengthValue = strengthIndicator(password);
      let color = strengthColor(strengthValue);
      setStrength(color);
    } else {
      setStrength("");
    }
  }, [password]);

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="login-content">
          <div className="row">
            {/* Login Banner */}
            <div className="col-md-6 login-bg d-none d-lg-flex">
              <Slider {...loginSLider} className="login-carousel">
                <div>
                  <div className="login-carousel-section mb-3">
                    <div className="login-banner">
                      <ImageWithBasePath
                        src="assets/img/auth/auth-1.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="mentor-course text-center">
                      <h3 className="mb-2">
                        Welcome to <br />
                        Dreams<span className="text-secondary">LMS</span>{" "}
                        Courses.
                      </h3>
                      <p>
                        Platform designed to help organizations, educators, and
                        learners manage, deliver, and track learning and
                        training activities.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="login-carousel-section mb-3">
                    <div className="login-banner">
                      <ImageWithBasePath
                        src="assets/img/auth/auth-1.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="mentor-course text-center">
                      <h3 className="mb-2">
                        Welcome to <br />
                        Dreams<span className="text-secondary">LMS</span>{" "}
                        Courses.
                      </h3>
                      <p>
                        Platform designed to help organizations, educators, and
                        learners manage, deliver, and track learning and
                        training activities.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="login-carousel-section mb-3">
                    <div className="login-banner">
                      <ImageWithBasePath
                        src="assets/img/auth/auth-1.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="mentor-course text-center">
                      <h3 className="mb-2">
                        Welcome to <br />
                        Dreams<span className="text-secondary">LMS</span>{" "}
                        Courses.
                      </h3>
                      <p>
                        Platform designed to help organizations, educators, and
                        learners manage, deliver, and track learning and
                        training activities.
                      </p>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
            {/* /Login Banner */}
            <div className="col-md-6 login-wrap-bg">
              {/* Login */}
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="w-100">
                    <Link
                      id="backtohome"
                      to={route.homeone} 
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                    >
                      <i className="isax isax-arrow-left-2 me-2 fs-12"></i>
                      Back to Home
                    </Link>
                    <div className="d-flex align-items-center justify-content-between login-header">
                      <ImageWithBasePath
                        src="assets/img/logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <h1 className="fs-32 fw-bold topic">Sign up</h1>
                    
                    {/* Error Message */}
                    {error && (
                      <div className="alert-fixed">
                        <div className="alert-custom alert alert-danger border-0 shadow-lg rounded-3 d-flex align-items-center p-3 m-0">
                          <div className="me-3">
                            <i className="isax isax-danger fs-20"></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fs-14 alert-text">
                              {error}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2 alert-close"
                            aria-label="Close"
                            onClick={() => setError("")}
                          ></button>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mb-3 pb-3">
                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          First Name<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            required
                          />
                          <span>
                            <i className="isax isax-user input-icon text-gray-7 fs-14" />
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          Last Name<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            required
                          />
                          <span>
                            <i className="isax isax-user input-icon text-gray-7 fs-14" />
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          Email<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            required
                          />
                          <span>
                            <i className="isax isax-sms input-icon text-gray-7 fs-14" />
                          </span>
                        </div>
                      </div>

                      {/* Role Selection (Optional) */}
                      <div className="mb-3 position-relative">
                        <div className="d-flex justify-content-around">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              value="student"
                              id="roleStudent"
                              checked={formData.role === "student"}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="roleStudent">
                              Student
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              value="instructor"
                              id="roleInstructor"
                              checked={formData.role === "instructor"}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="roleInstructor">
                              Instructor
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          New Password <span className="text-danger"> *</span>
                        </label>
                        <div className="position-relative" id="passwordInput">
                          <input
                            className="form-control pass-input"
                            type={eye ? "password" : "text"}
                            value={password}
                            onChange={handlePasswordChange}
                            required
                          />
                          <span
                            onClick={onEyeClick}
                            className={`toggle-passwords text-gray-7 fs-14 isax isax-eye-slash" ${
                              eye ? "isax-eye-slash" : "isax-eye"
                            }`}
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
                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          Confirm Password{" "}
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={eyeConfirmPassword ? "password" : "text"}
                            className="pass-inputa form-control form-control-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <span
                            className={`isax toggle-passworda ${
                              eyeConfirmPassword ? "isax-eye-slash" : "isax-eye"
                            } text-gray-7 fs-14`}
                            onClick={() =>
                              setEyeConfirmPassword((prev) => !prev)
                            }
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </div>
                        {/* Password match validation */}
                        {confirmPassword && password !== confirmPassword && (
                          <small className="text-danger">Passwords do not match</small>
                        )}
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="remember-me d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                          />
                          <label
                            className="form-check-label mb-0 d-inline-flex remember-me fs-14"
                            htmlFor="flexCheckDefault"
                          >
                            I agree with{" "}
                            <Link
                              to={route.termsConditions}
                              className="link-2 mx-2"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to={route.privacyPolicy}
                              className="link-2 mx-2"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </div>
                      <div className="d-grid">
                        <button
                          className="btn btn-secondary btn-lg"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Signing Up...
                            </>
                          ) : (
                            <>
                              Sign Up <i className="isax isax-arrow-right-3 ms-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    <div className="fs-14 fw-normal d-flex align-items-center justify-content-center">
                      Already you have an account?
                      <Link to={route.login} className="link-2 ms-1">
                        {" "}
                        Login
                      </Link>
                    </div>
                    {/* /Login */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default Register;