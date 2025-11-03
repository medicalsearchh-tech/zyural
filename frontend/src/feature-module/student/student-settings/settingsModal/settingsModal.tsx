import { Link } from "react-router-dom";
import CustomSelect from "../../../../core/common/commonSelect";
import {
  City,
  Country,
  State,
} from "../../../../core/common/selectOption/json/selectOption";

const SettingsModal = () => {
  return (
    <>
      <>
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Remove All</h4>
                  <p className="mb-3">
                    Are you sure you want to remove all from wishlist?
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-secondary rounded-pill"
                      data-bs-dismiss="modal"
                    >
                      Yes, Remove All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete_account">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete Account</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6 className="mb-1">Why Are You Deleting Your Account?</h6>
                  <p>
                    We're sorry to see you go! To help us improve, please let us
                    know your reason for deleting your account
                  </p>
                </div>
                <div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="Radio-sm-1"
                    />
                    <label
                      className="fw-medium form-check-label text-gray-9"
                      htmlFor="Radio-sm-1"
                    >
                      No longer using the service
                    </label>
                    <p>
                      I no longer need this service and won’t be using it in the
                      future.
                    </p>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="Radio-sm-2"
                    />
                    <label
                      className="fw-medium form-check-label text-gray-9"
                      htmlFor="Radio-sm-2"
                    >
                      Privacy concerns
                    </label>
                    <p>
                      I am concerned about how my data is handled and want to
                      remove my information.
                    </p>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="Radio-sm-3"
                    />
                    <label
                      className="fw-medium form-check-label text-gray-9"
                      htmlFor="Radio-sm-3"
                    >
                      Too many notifications/emails
                    </label>
                    <p>
                      I’m overwhelmed by the volume of notifications or emails
                      and would like to reduce them.
                    </p>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="Radio-sm-4"
                    />
                    <label
                      className="fw-medium form-check-label text-gray-9"
                      htmlFor="Radio-sm-4"
                    >
                      Poor user experience
                    </label>
                    <p>
                      I’ve had difficulty using the platform, and it didn’t meet
                      my expectations.
                    </p>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="Radio-sm-5"
                    />
                    <label
                      className="fw-medium form-check-label text-gray-9"
                      htmlFor="Radio-sm-5"
                    >
                      Other (Please specify)
                    </label>
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      className="form-control"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn bg-gray-100 rounded-pill me-2"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Keep My Account
                </button>
                <button
                  className="btn btn-secondary rounded-pill"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
      <>
        {/* Add Billing */}
        <div className="modal fade" id="add_billing">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Billing Address</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form>
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Title <span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Address <span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Country <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={Country}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          State <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={State}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          City <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={City}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Postal Code <span className="text-danger"> *</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Add Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Billing */}
        {/* Edit Billing */}
        <div className="modal fade" id="edit_billing">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Billing Address</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form >
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Title <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Home"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Address <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="16 Lake Floyd Circle"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Country <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={Country}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          State <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={State}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          City <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          options={City}
                          className="select d-flex"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Postal Code <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={90001}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-check form-check-md my-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="defaultaccount"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="defaultaccount"
                        >
                          Yes, I'd like to delete my account
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Billing */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Delete Address</h4>
                  <p className="mb-3">
                    Are you sure you want to delete address?
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to="#" className="btn btn-secondary rounded-pill">
                      Yes, Remove All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </>
  );
};

export default SettingsModal;
