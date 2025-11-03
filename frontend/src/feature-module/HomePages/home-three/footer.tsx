import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { all_routes } from '../../router/all_routes'

const Footer = () => {
  return (
    <footer className="footer footer-three">
    {/* Footer Top */}
    <div className="footer-top aos" data-aos="fade-up">
      <div className="container">
        <div className="row justify-content-between row-gap-4">
          <div className="col-lg-4 col-md-12">
            {/* Footer Widget */}
            <div className="footer-widget footer-about">
              <div className="footer-logo">
                <ImageWithBasePath src="assets/img/logo.svg" alt="logo" />
              </div>
              <div className="footer-about-content">
                <p>
                  Platform designed to help organizations, educators, and learners
                  manage, deliver, and track learning and training activities.
                </p>
              </div>
              {/* <div className="d-flex align-items-center gap-2 flex-wrap">
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/appstore.svg"
                    alt=""
                    className="img-fluid"
                  />
                </Link>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/googleplay.svg"
                    alt=""
                    className="img-fluid"
                  />
                </Link>
              </div> */}
            </div>
            {/* /Footer Widget */}
          </div>
          <div className="col-lg-8">
            <div className="row row-gap-4">
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-menu">
                  <h6 className="footer-title">Support</h6>
                  <ul>
                    <li>
                      <Link to={all_routes.courseGrid}>Education</Link>
                    </li>
                    <li>
                      <Link to="#">Enroll a Course</Link>
                    </li>
                    <li>
                      <Link to={all_routes.register}>Orders</Link>
                    </li>
                    <li>
                      <Link to={all_routes.pricingPlan}>Payments</Link>
                    </li>
                    <li>
                      <Link to={all_routes.contactUs}>Contact Us</Link>
                    </li>
                  </ul>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-menu">
                  <h6 className="footer-title">About</h6>
                  <ul>
                    <li>
                      <Link to={all_routes.courseCategory}>Categories</Link>
                    </li>
                    <li>
                      <Link to={all_routes.courseCategory}>Services</Link>
                    </li>
                    <li>
                      <Link to={all_routes.about_us}>About Us</Link>
                    </li>
                    <li>
                      <Link to={all_routes.FAQ}>FAQ</Link>
                    </li>
                    <li>
                      <Link to={all_routes.blogGrid3}>Blog</Link>
                    </li>
                  </ul>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-menu">
                  <h6 className="footer-title">Useful Links</h6>
                  <ul>
                    <li>
                      <Link to="#">Our values</Link>
                    </li>
                    <li>
                      <Link to="#">Advisory board</Link>
                    </li>
                    <li>
                      <Link to="#">Our partners</Link>
                    </li>
                    <li>
                      <Link to="#">Become a partner</Link>
                    </li>
                    <li>
                      <Link to="#">Future Learn</Link>
                    </li>
                  </ul>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-contact">
                  <h6 className="footer-title">Contact Info</h6>
                  <ul>
                    <li>
                      <div className="contact-infos">
                        <span>Phone Number</span>
                        <p>310-437-2766</p>
                      </div>
                    </li>
                    <li>
                      <div className="contact-infos">
                        <span>Mail Address</span>
                        <p>contact@example.com</p>
                      </div>
                    </li>
                    <li>
                      <div className="contact-infos">
                        <span>Address</span>
                        <p>706 Campfire Ave. Meriden, CT </p>
                      </div>
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
    {/* /Footer Top */}
    {/* Footer Bottom */}
    <div className="footer-bottom">
      <div className="container">
        {/* Copyright */}
        <div className="row row-gap-3">
          <div className="col-md-4">
            <div className="copyright-text">
              <p>
                Copyright 2025 © <Link to="#">Zyural</Link>. All
                right reserved.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/icons/fb.svg"
                  alt="facebook"
                  className="img-fluid"
                />
              </Link>
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/icons/instagram.svg"
                  alt="facebook"
                  className="img-fluid"
                />
              </Link>
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/icons/be.svg"
                  alt="facebook"
                  className="img-fluid"
                />
              </Link>
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/icons/linkedin.svg"
                  alt="facebook"
                  className="img-fluid"
                />
              </Link>
              <Link to="#">
                <ImageWithBasePath
                  src="assets/img/icons/x.svg"
                  alt="facebook"
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="privacy-link">
              <Link to={all_routes.termsConditions} className="mb-0">
                Terms &amp; Policy
              </Link>
              <Link to={all_routes.privacyPolicy}>Privacy Policy</Link>
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