import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { authApi } from "../../../core/utils/api";
import { useUser } from '../../../core/context/UserContext';
import GoogleLoginButton from '../../../core/common/GoogleLoginButton';

type PasswordField = "password" | "confirmPassword";

const Login = () => {
  const loginSLider = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true, // Uncomment if needed
  };

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setUser } = useUser(); // Get setUser from context

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const route = all_routes;
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Basic validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
          email: formData.email.trim(),
          password: formData.password,
      });

      if (response.success && response.data) {
        // Login successful
        console.log("Login successful:", response);
        const storage = rememberMe ? localStorage : localStorage;
        
        // Store token
        if (response.data.token) {
            storage.setItem("token", response.data.token);
            storage.setItem("user", JSON.stringify(response.data.user));
            
            setUser(response.data.user);
        }

        // Clear any pending verification email
        localStorage.removeItem("pendingVerificationEmail");

        // Navigate based on user role
        if (response.data.user.role === "instructor") {
          navigate(route.instructorDashboard);
        } else if (response.data.user.role === "admin") {
          navigate(route.adminDashboard); 
        } else if (response.data.user.role === "student") {
          navigate(route.studentDashboard || route.homeone); // fallback to home
        } else {
          navigate(route.homeone); // default fallback
        }
      } else {
          setError(response.message || "Login failed. Please try again.");
      }
      
    } catch (error: any) {
        console.error("Login error:", error);
        
        // Enhanced error handling
        let errorMessage = "Login failed. Please try again.";
        
        if (error.message) {
          if (error.message.includes('401')) {
            errorMessage = "Invalid email or password";
          } else if (error.message.includes('429')) {
            errorMessage = "Too many login attempts. Please try again later.";
          } else if (error.message.includes('500')) {
            errorMessage = "Server error. Please try again later.";
          } else if (error.message.includes('Network') || error.message.includes('fetch')) {
            errorMessage = "Network error. Please check your connection.";
          }
        }
        
        setError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

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
                    <h1 className="fs-32 fw-bold topic">
                      Sign into Your Account
                    </h1>

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
                            disabled={isLoading}
                          />
                          <span>
                            <i className="isax isax-sms input-icon text-gray-7 fs-14" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3 position-relative">
                        <label className="form-label">
                          Password <span className="text-danger ms-1">*</span>
                        </label>
                        <div className="position-relative" id="passwordInput">
                          <input
                            type={
                              passwordVisibility.password ? "text" : "password"
                            }
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control form-control-lg pass-input"
                            required
                            disabled={isLoading}
                          />
                          <span
                            className={`isax toggle-passwords fs-14 ${
                              passwordVisibility.password
                                ? "isax-eye"
                                : "isax-eye-slash"
                            }`}
                            onClick={() => togglePasswordVisibility("password")}
                            style={{ cursor: "pointer" }}
                          ></span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="remember-me d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor="flexCheckDefault"
                          >
                            Remember Me
                          </label>
                        </div>
                        <div className="">
                          <Link to={route.forgotpassword} className="link-2">
                            Forgot Password ?
                          </Link>
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
                              Logging in...
                            </>
                          ) : (
                            <>
                              Login <i className="isax isax-arrow-right-3 ms-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    <div className="d-flex align-items-center justify-content-center or fs-14 mb-3">
                      Or
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      {/* Google Login Button */}
                      <GoogleLoginButton />
                    </div>
                    <div className="fs-14 fw-normal d-flex align-items-center justify-content-center">
                      Don't you have an account?
                      <Link to={route.register} className="link-2 ms-1">
                        {" "}
                        Sign up
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

export default Login;