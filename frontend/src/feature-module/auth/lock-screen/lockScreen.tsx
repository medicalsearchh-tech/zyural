import React, { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
type PasswordField = "password" | "confirmPassword";
const LockScreen = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const route = all_routes;
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault(); 
      const Path = route.instructorDashboard; 
      navigate(Path);
    };
  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="lock-screen">
          <div className="lock-wrapper">
            <div className="d-flex align-items-center justify-content-center lock-header">
              <ImageWithBasePath
                src="assets/img/logo.svg"
                className="img-fluid"
                alt="Logo"
              />
            </div>
            <div className="topic">
              <h1 className="fs-32 fw-bold mb-3 text-center">Welcome Back</h1>
            </div>
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div className="text-center">
                <div className="user-profile rounded-circle mb-3">
                  <ImageWithBasePath
                    src="assets/img/user/user-02.jpg"
                    alt="img"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <h6 className="mb-0">Ronald Richard</h6>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mb-3 pb-3">
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Password <span className="text-danger"> *</span>
                </label>
                <div className="position-relative">
                  <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className="form-control form-control-lg pass-input"
                  />
                  <span
                    className={`isax toggle-passwords fs-14 ${
                      passwordVisibility.password
                        ? "isax-eye"
                        : "isax-eye-slash"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
                </div>
              </div>
              <div className="d-grid">
                <Link to={route.homeone} className="btn btn-secondary btn-lg">
                  Sign In
                  <i className="isax isax-arrow-right-3 ms-1" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default LockScreen;
