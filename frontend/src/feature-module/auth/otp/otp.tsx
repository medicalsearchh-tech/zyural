import { Input } from "antd";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { authApi } from "../../../core/utils/api";
import { useUser } from '../../../core/context/UserContext';

const Otp = () => {
  const loginSLider = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true, // Uncomment if needed
  };

  const route = all_routes;
  const navigate = useNavigate();

  // State management
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [seconds, setSeconds] = useState<number>(600); // 10 minutes = 600 seconds
  const [canResend, setCanResend] = useState<boolean>(false);
  const { setUser } = useUser();

  // Get email from localStorage on component mount
  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      // If no pending email, redirect to register
      navigate(route.register);
    }
  }, [navigate, route.register]);

  useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [error]);

  // Timer countdown effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        setCanResend(true);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {

      const otpData = {
          email: email.trim(),
          otp: otp,
      };
      const response = await authApi.verifyOTP(otpData);

      if (response.success && response.data) {
        // OTP verification successful
        console.log("OTP verification successful:", response);
        
        // Store the JWT token
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setUser(response.data.user);
        }
        
        // Store user data if needed
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Clear pending verification email
        localStorage.removeItem("pendingVerificationEmail");

        // Navigate based on user role
        if (response.data.user.role === "instructor") {
          navigate(route.instructorDashboard);
        } else if (response.data.user.role === "admin") {
          navigate(route.adminDashboard); 
        } else {
          navigate(route.studentDashboard || route.login); // fallback to login if student dashboard not defined
        }
      } else {
        // Handle error response
        setError(response.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      
      const response = await authApi.resendOTP({
          email: email.trim(),
      });
      
      if (response.success) {
        // Reset timer and disable resend
        setSeconds(600); // 10 minutes
        setCanResend(false);
        setOtp(""); // Clear current OTP input
        // Show success message (you might want to add a success state)
        console.log("OTP resent successfully");
      } else {
        setError(response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (value: string) => {
    setOtp(value);
    setError(""); // Clear error when user starts typing
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return "******@example.com";
    const [localPart, domain] = email.split("@");
    if (!domain) return "******@example.com";
    
    const maskedLocal = localPart.length > 2 
      ? localPart.substring(0, 2) + "****" 
      : "****";
    
    return `${maskedLocal}@${domain}`;
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
                      <h1 className="fs-32 fw-bold mb-3">Email OTP</h1>
                      <p className="fs-14 fw-normal mb-0">
                        OTP sent to your Email Address ending&nbsp;
                        <strong>{maskEmail(email)}</strong>
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

                    <form onSubmit={handleSubmit} className="mb-3 pb-3">
                      <div className="d-flex align-items-center mb-3 justify-content-center">
                        <Input.OTP
                          length={6}
                          value={otp}
                          onChange={handleOTPChange}
                          formatter={(str) => str.replace(/\D/g, "")} // Only allow digits
                          size="large"
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="timer-cover d-flex align-items-center justify-content-center mb-3">
                        <div className={`badge ${seconds > 0 ? 'badge-soft-danger' : 'badge-soft-secondary'} rounded-pill d-flex align-items-center`}>
                          <i className="isax isax-clock me-1" />
                          <span id="otp_timer">{formatTime(seconds)}</span>
                          {seconds > 0 && <span className="ms-1">remaining</span>}
                          {seconds === 0 && <span className="ms-1">expired</span>}
                        </div>
                      </div>

                      <div className="d-grid">
                        <button
                          className="btn btn-secondary btn-lg"
                          type="submit"
                          disabled={isLoading || !otp || otp.length !== 6}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify &amp; Proceed
                              <i className="isax isax-arrow-right-3 ms-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    
                    <div className="fs-14 fw-normal d-flex align-items-center justify-content-center">
                      Didn't get the OTP?
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="btn btn-link link-2 ms-1 p-0"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Resend OTP"}
                        </button>
                      ) : (
                        <span className="text-muted ms-1">
                          Resend in {formatTime(seconds)}
                        </span>
                      )}
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

export default Otp;