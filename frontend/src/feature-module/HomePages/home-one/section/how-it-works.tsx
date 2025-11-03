import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Howitworks = () => {
  return (
    <>
    {/* how it works */}
    <div className="how-it-works-sec-two">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="me-5" data-aos="fade-up">
              <ImageWithBasePath
                src="assets/img/feature/feature-27.jpg"
                className="img-fluid rounded-5"
                alt="img"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="how-it-works-content aos" data-aos="fade-up">
              <div className="section-header">
                <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                  How it Works
                </span>
                <h2 className="mb-1">Start your Learning Journey Today!</h2>
                <p>
                  Unlock Your Potential and Achieve Your Dreams with Our
                  Comprehensive Learning Resources!
                </p>
              </div>
              <div className="d-flex align-items-center works-items">
                <span className="count">01</span>
                <div>
                  <h5 className="mb-1">Sign-Up or Register</h5>
                  <p>
                    Once you're on the website's homepage, look for the Sign-Up,
                    Register, or Create Account button.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center works-items">
                <span className="count">02</span>
                <div>
                  <h5 className="mb-1">Complete Your Profile</h5>
                  <p>
                    After verifying your email, you may be asked to complete
                    additional profile information.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center works-items">
                <span className="count">03</span>
                <div>
                  <h5 className="mb-1">Choose Courses or Programs</h5>
                  <p>
                    Depending on the website, after registration, you might be
                    able to browse and choose courses or programs to enroll in.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center works-items mb-0 pb-0 border-0">
                <span className="count">04</span>
                <div>
                  <h5 className="mb-1">Access Your Account</h5>
                  <p>
                    Should have access to the website’s features, such as
                    enrolling in courses, materials, or tracking progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* how it works */}
  </>
  
  )
}

export default Howitworks
