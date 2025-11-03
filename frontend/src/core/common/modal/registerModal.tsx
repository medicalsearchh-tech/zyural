import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../imageWithBasePath';
type PasswordField = "password" | "confirmPassword";
const RegisterModal = () => {
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
  return (
    <>
      {/* Register Modal */}
  <div className="modal fade" id="register-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
          <Link
            to="#"
            data-bs-dismiss="modal"
          >
            <i className="ti ti-x fs-20" />
          </Link>
        </div>
        <div className="modal-body p-4 pt-0">
          <form >
            <div className="text-center border-bottom mb-3">
              <h5 className="mb-1">Sign Up</h5>
              <p className="mb-3">Create your DreamsTour Account</p>
            </div>
            <div className="mb-2">
              <label className="form-label">Name</label>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <i className="isax isax-user" />
                </span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Full Name"
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <i className="isax isax-message" />
                </span>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter Email"
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <i className="isax isax-lock" />
                </span>
                
                <input
                        type={
                          passwordVisibility.password
                            ? "text"
                            : "password"
                        }
                        className="form-control form-control-lg pass-input"
                         placeholder='Enter Password'
                      />
                      <span
                        className={`isax toggle-passwords ${passwordVisibility.password
                          ? "isax-eye"
                          : "isax-eye-slash"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility("password")
                        }
                      ></span>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <i className="isax isax-lock" />
                </span>
               
                <input
                        type={
                          passwordVisibility.confirmPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control form-control-lg pass-input"
                         placeholder='Enter Password'
                      />
                      <span
                        className={`isax toggle-passwords ${passwordVisibility.confirmPassword
                            ? "isax-eye"
                            : "isax-eye-slash"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      ></span>
              </div>
            </div>
            <div className="mt-3 mb-3">
              <div className="d-flex">
                <div className="form-check d-flex align-items-center mb-2">
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    defaultValue=""
                    id="agree"
                  />
                  <label
                    className="form-check-label ms-2 text-gray-9 fs-14"
                    htmlFor="agree"
                  >
                    I agree with the&nbsp;
                    <Link
                      to="#"
                      className="link-primary fw-medium"
                    >
                      Terms Of Service.
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-xl btn-primary d-flex align-items-center justify-content-center w-100"
              >
                Register
                <i className="isax isax-arrow-right-3 ms-2" />
              </button>
            </div>
            <div className="login-or mb-3">
              <span className="span-or">Or</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Link
                to="#"
                className="btn btn-light flex-fill d-flex align-items-center justify-content-center me-2"
              >
                <ImageWithBasePath
                  src="assets/img/icons/google-icon.svg"
                  className="me-2"
                  alt="Img"
                />
                Google
              </Link>
              <Link
                to="#"
                className="btn btn-light flex-fill d-flex align-items-center justify-content-center"
              >
                <ImageWithBasePath
                  src="assets/img/icons/fb-icon.svg"
                  className="me-2"
                  alt="Img"
                />
                Facebook
              </Link>
            </div>
            <div className="d-flex justify-content-center">
              <p className="fs-14">
                Already have an account?{" "}
                <Link
                  to="#"
                  className="link-primary fw-medium"
                  data-bs-toggle="modal"
                  data-bs-target="#login-modal"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Register Modal */}
    </>
  )
}

export default RegisterModal