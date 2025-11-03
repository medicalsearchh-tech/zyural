import { Link } from 'react-router-dom'

const AddFaq = () => {
  return (
    <div>

      {/* Add New FAQ */}
      <div className="modal fade" id="add_faq" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Add New FAQ</h5>
              <button
                data-bs-dismiss="modal"
                aria-label="close"
                className="btn-close"
              />
            </div>
            <form >
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Question <span className="text-danger"> *</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div>
                  <label className="form-label">
                    Answer <span className="text-danger"> *</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end m-0">
                  <Link
                   to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-sm btn-light me-2"
                  >
                    Cancel
                  </Link>
                  <Link to="#"  data-bs-dismiss="modal" className="btn btn-sm btn-primary">
                    Add FAQ
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add New FAQ */}


    </div>
  )
}

export default AddFaq
