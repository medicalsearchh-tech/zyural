import { useState } from 'react'
import { Link } from 'react-router-dom'
type PasswordField = "password" | "confirmPassword";

const ChangePasswordModal = () => {
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
  {/* Change Password */}
  <div className="modal fade" id="change-password">
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
          <form>
            <div className="text-center border-bottom mb-3">
              <h5 className="mb-1">Change Password</h5>
              <p className="mb-3">Enter Details to Change Password</p>
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
                      className="pass-input form-control"
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
            <div className="mb-3">
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
                      className="pass-input form-control"
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
            <div className="mb-0">
              <button
                type="button"
                className="btn btn-xl btn-primary d-flex align-items-center justify-content-center w-100"
                data-bs-toggle="modal"
                data-bs-target="#login-modal"
              >
                Change Password
                <i className="isax isax-arrow-right-3 ms-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Change Password */}

</>

  )
}

export default ChangePasswordModal