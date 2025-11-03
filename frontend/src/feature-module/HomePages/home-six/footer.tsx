import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const Footer = () => {
  return (
    <footer className="footer footer-six">
  {/* Footer Top */}
  <div className="footer-top-five">
    <div className="container">
      <div className="row row-gap-3">
        <div className="col-lg-3 col-md-6 col-sm-12">
          {/* Footer Widget */}
          <div className="footer-contact footer-menu-five">
            <h5 className="footer-title footer-title-five">Get in touch</h5>
            <div className="footer-contact-info">
              <div className="footer-address">
                <h6>Phone Number</h6>
                <p>310-437-2766</p>
              </div>
              <div className="footer-address">
                <h6>Mail Address</h6>
                <p>contact@example.com</p>
              </div>
              <div className="footer-address">
                <h6>Address</h6>
                <p>706 Campfire Ave. Meriden, CT </p>
              </div>
            </div>
          </div>
          {/* /Footer Widget */}
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          {/* Footer Widget */}
          <div className="footer-menu footer-menu-five">
            <h5 className="footer-title footer-title-five">
              <i className="fa-sharp fa-solid fa-dash" />
              For Instructor
            </h5>
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
        <div className="col-lg-2 col-md-3 col-sm-12">
          {/* Footer Widget */}
          <div className="footer-menu footer-menu-five">
            <h5 className="footer-title footer-title-five">For Student</h5>
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
        <div className="col-lg-4 col-md-6 col-12">
          <div className="footer-menu">
            <h5 className="footer-title footer-title-five mb-1">
              Subscription
            </h5>
            <p className="fs-14 text-light">
              Sign up to get updates &amp; news.
            </p>
            {/* Footer Widget */}
            <div className="footer-widget-five mb-3">
              <div className="box-form-newsletter">
                <form className="form-newsletter">
                  <input
                    className="input-newsletter"
                    type="email"
                    placeholder="Enter Email Address"
                  />
                  <button className="btn btn-secondary font-heading icon-send-letter">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Link to="#">
                <ImageWithBasePath src="./assets/img/icon/app-store.svg" alt="img" />
              </Link>
              <Link to="#">
                <ImageWithBasePath src="./assets/img/icon/google-play.svg" alt="img" />
              </Link>
            </div>
            {/* /Footer Widget */}
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Footer Top */}
  {/* Footer Bottom */}
  <div className="footer-bottom footer-bottom-six">
    <div className="container">
      {/* Copyright */}
      <div className="copyright-five">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="copyright-text">
              <p>© 2025 Zyural. All rights reserved.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="social-icon">
              <Link to="#">
                <i className="fa-brands fa-facebook-f" />
              </Link>
              <Link to="#">
                <i className="fa-brands fa-instagram" />
              </Link>
              <Link to="#">
                <i className="fa-brands fa-x-twitter" />
              </Link>
              <Link to="#">
                <i className="fa-brands fa-youtube" />
              </Link>
              <Link to="#">
                <i className="fa-brands fa-linkedin" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* /Copyright */}
    </div>
  </div>
  {/* /Footer Bottom */}
</footer>

  )
}

export default Footer