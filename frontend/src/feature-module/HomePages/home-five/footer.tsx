import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const Footer = () => {
  return (
    <footer className="footer footer-five">
      {/* Footer Top */}
      <div className="footer-three-top" data-aos="fade-up">
        <div className="container">
          <div className="footer-three-top-content">
            <div className="row align-items-center gy-4">
              <div className="col-lg-6">
                {/* Footer Widget */}
                <div className="footer-widget-three footer-about">
                  <div className="footer-three-logo">
                    <ImageWithBasePath
                      className="img-fluid"
                      src="assets/img/logo.svg"
                      alt="logo"
                      style={{ width: '350px' }}
                    />
                  </div>
                  <div className="footer-three-about">
                    <p>
                      Platform designed to help organizations, educators, and
                      learners manage, deliver, and track learning and training activities.
                    </p>
                  </div>
                  {/* <div className="box-form-newsletter">
                    <form className="form-newsletter">
                      <input
                        className="input-newsletter"
                        type="text"
                        placeholder="Enter your email here"
                      />
                      <button className="btn btn-secondary font-heading icon-send-letter">
                        Subscribe
                      </button>
                    </form>
                  </div> */}
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-6">
                <div className="row gy-4">
                  <div className="col-md-6 d-lg-flex justify-content-end">
                    {/* Footer Widget */}
                    <div className="footer-widget-three footer-menu-three footer-three-right">
                      <h5 className="footer-three-title">For Instructor</h5>
                      <ul>
                        <li>
                          <Link to={all_routes.instructorProfile}>Profile</Link>
                        </li>
                        <li>
                          <Link to={all_routes.login}>Login</Link>
                        </li>
                        <li>
                          <Link to={all_routes.register}>Register</Link>
                        </li>
                        <li>
                          <Link to={all_routes.instructorList}>Instructor</Link>
                        </li>
                        <li>
                          <Link to={all_routes.instructorDashboard}> Dashboard</Link>
                        </li>
                      </ul>
                    </div>
                    {/* /Footer Widget */}
                  </div>
                  <div className="col-md-6 d-lg-flex justify-content-end">
                    {/* Footer Widget */}
                    <div className="footer-widget-three footer-menu-three">
                      <h5 className="footer-three-title">For Student</h5>
                      <ul>
                        <li>
                          <Link to={all_routes.studentProfile}>Profile</Link>
                        </li>
                        <li>
                          <Link to={all_routes.login}>Login</Link>
                        </li>
                        <li>
                          <Link to={all_routes.register}>Register</Link>
                        </li>
                        <li>
                          <Link to={all_routes.studentsList}>Student</Link>
                        </li>
                        <li>
                          <Link to={all_routes.studentDashboard}> Dashboard</Link>
                        </li>
                      </ul>
                    </div>
                    {/* /Footer Widget */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Footer Top */}
      <div className="footer-bottom-five">
        <div className="container">
          {/* Copyright */}
          <div className="row row-gap-3">
            <div className="col-lg-4">
              <div className="copyright-text">
                <p>
                  Copyright 2025 © <Link to="#">Zyural</Link>. All
                  right reserved.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="privacy-link">
                <Link to={all_routes.termsConditions} className="mb-0">
                  Terms &amp; Policy
                </Link>
                <Link to={all_routes.privacyPolicy}>Privacy Policy</Link>
              </div>
            </div>
            <div className="col-lg-4">
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
          {/* /Copyright */}
        </div>
      </div>
    </footer>
  )
}

export default Footer