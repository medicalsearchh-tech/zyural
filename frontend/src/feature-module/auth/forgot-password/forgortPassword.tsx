import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Slider from "react-slick";
import { authApi } from "../../../core/utils/api";

const ForgotPassword = () => {
  const route = all_routes;
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 5000); // auto-close error after 5s
    }
    if (success) {
      timer = setTimeout(() => {
        setSuccess("");
      }, 3000); // auto-close success after 3s
    }
    return () => clearTimeout(timer);
  }, [error, success]);

  const loginSLider = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true, // Uncomment if needed
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({
          email: email.trim(),
      });

      if (response.success) {
        // Success - show message and optionally redirect
        setSuccess(response.message || "Password reset email sent successfully. Please check your inbox.");
        setEmail(""); // Clear the form
        
        // Optional: Redirect to login after a delay
        setTimeout(() => {
          navigate(route.login);
        }, 3000);
      } else {
        // Handle error response
        setError(response.message || "Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess(""); // Clear success message if user starts typing again
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
                    <div className="d-flex align-items-center justify-content-between login-header">
                      <ImageWithBasePath
                        src="assets/img/logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                      <Link to={route.homeone} className="link-1">
                        Back to Home
                      </Link>
                    </div>
                    <div className="topic">
                      <h1 className="fs-32 fw-bold mb-3">Forgot Password</h1>
                      <p className="fs-14 fw-normal mb-0">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>

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

                    {/* Success Message */}
                    {success && (
                      <div className="alert-fixed">
                        <div className="alert-success-custom alert alert-success border-0 shadow-lg rounded-3 d-flex align-items-center p-3 m-0">
                          <div className="me-3">
                            <i className="isax isax-tick-circle fs-20"></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fs-14 alert-text">
                              {success}
                            </div>
                            <small className="text-light opacity-75">
                              Redirecting to login page in 3 seconds...
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2 alert-close"
                            aria-label="Close"
                            onClick={() => setSuccess("")}
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
                            value={email}
                            onChange={handleEmailChange}
                            className="form-control form-control-lg"
                            placeholder="Enter your email address"
                            required
                            disabled={isLoading || !!success}
                          />
                          <span>
                            <i className="isax isax-sms input-icon text-gray-7 fs-14" />
                          </span>
                        </div>
                      </div>
                      <div className="d-grid">
                        <button
                          className="btn btn-secondary btn-lg"
                          type="submit"
                          disabled={isLoading || !!success}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : success ? (
                            <>
                              Email Sent!
                              <i className="isax isax-tick-circle ms-1" />
                            </>
                          ) : (
                            <>
                              Send Reset Link
                              <i className="isax isax-arrow-right-3 ms-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {!success && (
                      <p className="fs-14 fw-normal d-flex align-items-center justify-content-center">
                        Remember Password?
                        <Link to={route.login} className="link-2 ms-1">
                          {" "}
                          Sign In
                        </Link>
                      </p>
                    )}

                    {success && (
                      <div className="text-center">
                        <p className="fs-14 fw-normal mb-2">
                          Didn't receive the email? Check your spam folder or
                        </p>
                        <button
                          type="button"
                          onClick={() => setSuccess("")}
                          className="btn btn-link link-2 p-0"
                        >
                          Try again
                        </button>
                      </div>
                    )}
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

export default ForgotPassword;