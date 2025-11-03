const EditFaq = () => {
  return (
    <>
      {/* Faq Modal */}
      <div className="modal fade" id="edit_faq" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit FAQ</h5>
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
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Does offer free cancellation for a full refund?"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Answer <span className="text-danger"> *</span>
                  </label>
                  <input type="text" className="form-control" defaultValue="yes" />
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end m-0">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-sm btn-light me-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Save FAQ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Faq Modal */}
    </>

  )
}

export default EditFaq
