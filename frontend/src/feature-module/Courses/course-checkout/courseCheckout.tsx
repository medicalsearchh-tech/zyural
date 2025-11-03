import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'

const CourseCheckout = () => {

  const route = all_routes

  return (
    <>
      <Breadcrumb title='Checkout' />
      <>
        {/* Checkout */}
        <div className="content">
          <div className="container">
            <div className="checkout-content">
              <div className="row">
                <div className="col-lg-8">
                  <div className="checkout-item-1">
                    <div className="border-bottom pb-3 mb-3">
                      <h5>Billing Address</h5>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            First Name<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block">
                          <label className="form-label">
                            Last Name<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Phone Number (Optional)
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Address Line 1<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="input-block">
                          <label className="form-label">
                            Address Line 2 (Optional)
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">
                            Country<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">
                            State<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-block">
                          <label className="form-label">
                            City<span className="text-danger ms-1">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="d-flex align-items-center mb-3">
                          <div className="form-check d-flex">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="flexCheckDefault1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault1"
                            >
                              Shipping address is the same as my billing address
                            </label>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="form-check d-flex">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              Save this information for next time
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="checkout-item-1">
                    <div className="border-bottom pb-3 mb-3">
                      <h5>Payment Method </h5>
                    </div>
                    <ul
                      className="nav-tabs mb-3 nav-justified border-0 nav-style-1 d-sm-flex d-block"
                      role="tablist"
                    >
                      <li className="nav-item active">
                        <Link
                          className="btn nav-link p-3 active"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#overview"
                          aria-selected="false"
                        >
                          <div className="d-flex justify-content-center align-items-center">
                            <ImageWithBasePath
                              src="assets/img/icons/card.svg"
                              alt="card"
                              className="img-fluid me-2"
                            />
                            <p className="fw-medium">Card</p>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="btn nav-link p-3"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#notes"
                          aria-selected="false"
                        >
                          <div className="d-flex justify-content-center align-items-center">
                            <ImageWithBasePath
                              src="assets/img/icons/paypal-2.svg"
                              alt="card"
                              className="img-fluid me-2"
                            />
                            <p className="fw-medium">Paypal</p>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="btn nav-link p-3"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#faq"
                          aria-selected="true"
                        >
                          <div className="d-flex justify-content-center align-items-center">
                            <ImageWithBasePath
                              src="assets/img/icons/stripe.svg"
                              alt="card"
                              className="img-fluid me-2"
                            />
                            <p className="fw-medium">Stripe</p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane active show"
                        id="overview"
                        role="tabpanel"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Card Number<span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Name on Card
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Expiry Date<span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Security Number
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="d-flex align-items-center justify-content-end">
                              <Link to="#" className="btn btn-secondary rounded-pill">
                                Pay $200.25
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="notes" role="tabpanel">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Email Address
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Password<span className="text-danger ms-1">*</span>
                              </label>
                              <input type="password" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="d-flex align-items-center justify-content-end">
                              <Link to="#" className="btn btn-secondary rounded-pill">
                                Pay $200.25
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane" id="faq" role="tabpanel">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Email Address
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">
                                Password<span className="text-danger ms-1">*</span>
                              </label>
                              <input type="password" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="d-flex align-items-center justify-content-end">
                              <Link to="#" className="btn btn-secondary rounded-pill">
                                Pay $200.25
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="checkout-item-2">
                    <div className="pb-3 border-bottom mb-3">
                      <h5 className="mb-0">Order Details</h5>
                    </div>
                    <div className="checkout-item-3 bg-light p-3 rounded-3 border mb-3">
                      <div className="row row-gap-2 mb-3">
                        <div className="col-md-12 d-flex align-items-center">
                          <div className="order-img flex-shrink-0 me-3">
                            <ImageWithBasePath
                              src="assets/img/course/course-01.jpg"
                              alt="img"
                              className="img-fluid h-100 w-100"
                            />
                            <Link
                              to="#"
                              className="btn p-1 rounded-circle"
                            >
                              <i className="isax isax-trash" />
                            </Link>
                          </div>
                          <div>
                            <h6 className="mb-2">
                              <Link to={route.courseDetails}>
                                Information About UI/UX Design Degree
                              </Link>
                            </h6>
                            <h6 className="text-secondary">$120</h6>
                          </div>
                        </div>
                      </div>
                      <div className="row row-gap-2">
                        <div className="col-md-12 d-flex align-items-center">
                          <div className="order-img flex-shrink-0 me-3">
                            <ImageWithBasePath
                              src="assets/img/course/course-03.jpg"
                              alt="img"
                              className="img-fluid h-100 w-100"
                            />
                            <Link
                              to="#"
                              className="btn p-1 rounded-circle"
                            >
                              <i className="isax isax-trash" />
                            </Link>
                          </div>
                          <div>
                            <h6 className="mb-2">
                              <Link to={route.courseDetails}>
                                Sketch from A to Z (2024): Become an app designer
                              </Link>
                            </h6>
                            <h6 className="text-secondary">$160</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Sub Total</p>
                      <p className="text-gray-9 fw-medium mb-0">$200.20</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                      <p className="mb-0">Tax (VAT)</p>
                      <p className="text-gray-9 fw-medium mb-0">$25</p>
                    </div>
                    <div className="total d-flex align-items-center justify-content-between">
                      <h6 className="mb-0">Total</h6>
                      <h4 className="mb-0">$225.20</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Checkout */}
      </>

    </>
  )
}

export default CourseCheckout
