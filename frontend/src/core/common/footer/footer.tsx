import { Link } from 'react-router-dom'
import ImageWithBasePath from '../imageWithBasePath'
import { all_routes } from '../../../feature-module/router/all_routes'

const Footer = () => {

  return (
<>
  {/* Footer */}
  <footer className="footer">
    <div className="footer-bg">
      <ImageWithBasePath
        src="assets/img/bg/footer-bg-01.png"
        className="footer-bg-1"
        alt=""
      />
      <ImageWithBasePath
        src="assets/img/bg/footer-bg-02.png"
        className="footer-bg-2"
        alt=""
      />
    </div>
    <div className="footer-top">
      <div className="container">
        <div className="row row-gap-4">
          <div className="col-lg-6">
            <div className="footer-about">
              <div className="footer-logo">
                <ImageWithBasePath 
                  src="assets/img/logo.svg" 
                  className="img-fluid"
                  alt="logo"
                  style={{ width: '350px' }}
                />
              </div>
              <p>
                Platform designed to help organizations, educators, and learners
                manage, deliver, and track learning and training activities.
              </p>
              {/* <div className="d-flex align-items-center">
                <Link to="#" className="me-2">
                  <ImageWithBasePath src="assets/img/icon/appstore.svg" alt="" />
                </Link>
                <Link to="#">
                  <ImageWithBasePath src="assets/img/icon/googleplay.svg" alt="" />
                </Link>
              </div> */}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row row-gap-4">
              <div className="col-md-6 d-lg-flex justify-content-end">
                <div className="footer-widget footer-menu">
                  <h5 className="footer-title">For Instructor</h5>
                  <ul>
                    <li>
                      <Link to={all_routes.instructorList}>Search Mentors</Link>
                    </li>
                    <li>
                      <Link to={all_routes.login}>Login</Link>
                    </li>
                    <li>
                      <Link to={all_routes.register}>Register</Link>
                    </li>
                    <li>
                      <Link to={all_routes.courseList}>Booking</Link>
                    </li>
                    <li>
                      <Link to={all_routes.instructorDashboard}>
                        Instructor Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 d-lg-flex justify-content-end">
                <div className="footer-widget footer-menu">
                  <h5 className="footer-title">For Student</h5>
                  <ul>
                    <li>
                      <Link to={all_routes.courseGrid}>Appointments</Link>
                    </li>
                    <li>
                      <Link to={all_routes.instructorMessage}>Chat</Link>
                    </li>
                    <li>
                      <Link to={all_routes.login}>Login</Link>
                    </li>
                    <li>
                      <Link to={all_routes.register}>Register</Link>
                    </li>
                    <li>
                      <Link to={all_routes.studentDashboard}>Students Dashboard</Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <div className="col-lg-6">
                <div className="footer-widget footer-contact">
                  <h5 className="footer-title">Newsletter</h5>
                  <div className="subscribe-input">
                    <form action="#">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your Email Address"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm inline-flex align-items-center"
                      >
                        <i className="isax isax-send-2 me-1" />
                        Subscribe
                      </button>
                    </form>
                  </div>
                  <div className="footer-contact-info">
                    <div className="footer-address d-flex align-items-center">
                      <ImageWithBasePath
                        src="assets/img/icon/icon-20.svg"
                        alt="Img"
                        className="img-fluid me-2"
                      />
                      <p>
                        {" "}
                        3556 Beech Street, San Francisco,
                        <br /> California, CA 94108{" "}
                      </p>
                    </div>
                    <div className="footer-address d-flex align-items-center">
                      <ImageWithBasePath
                        src="assets/img/icon/icon-19.svg"
                        alt="Img"
                        className="img-fluid me-2"
                      />
                      <p>support@zyural.com</p>
                    </div>
                    <div className="footer-address d-flex align-items-center">
                      <ImageWithBasePath
                        src="assets/img/icon/icon-21.svg"
                        alt="Img"
                        className="img-fluid me-2"
                      />
                      <p>+19 123-456-7890</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <div className="row row-gap-2">
          <div className="col-md-4">
            <div className="text-center text-md-start">
              <p className="text-white">
                Copyright © 2025 Zyural. All rights reserved.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <ul className="d-flex align-items-center justify-content-center justify-content-md-end footer-link">
                <li>
                  <Link to={all_routes.termsConditions}>Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link to={all_routes.privacyPolicy}>Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className='d-flex align-items-center justify-content-center justify-content-md-end footer-link'>
              <div className="social-icon">
                <Link to="https://www.facebook.com/pages/?category=top&ref=bookmarks">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
                <Link to="https://www.instagram.com/zyrualearning/">
                  <i className="fa-brands fa-instagram" />
                </Link>
                <Link to="https://x.com/learning73864">
                  <i className="fa-brands fa-x-twitter" />
                </Link>
                <Link to="#">
                  <i className="fa-brands fa-youtube" />
                </Link>
                <Link to="https://www.linkedin.com/onboarding/start/people-you-may-know/new/?source=coreg">
                  <i className="fa-brands fa-linkedin" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  {/* /Footer */}
</>


  )
}

export default Footer