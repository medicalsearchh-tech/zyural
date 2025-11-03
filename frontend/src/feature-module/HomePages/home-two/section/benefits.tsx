import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Benefits = () => {
  return (
    <>
  {/* our benefits */}
  <div className="benefits-section">
    <div className="container">
      <div className="section-header text-center aos" data-aos="fade-up">
        <div className="section-badge text-white">Our Benefits</div>
        <h2 className="text-white">Master the skills to drive your career</h2>
        <p className="text-white">
          The right course, guided by an expert mentor, can provide invaluable
          insights, practical skills
        </p>
      </div>
      <div
        className="row justify-content-center row-gap-4 aos"
        data-aos="fade-up"
      >
        <div className="col-md-6 col-lg-4">
          <div className="benefits-item">
            <div className="benefits-img">
              <ImageWithBasePath
                src="assets/img/icons/benefit-icon-01.svg"
                alt="img"
                className="img-fluid"
              />
            </div>
            <h5 className="title">Stay motivated with instructors</h5>
            <p className="text-light mb-0">
              Stay motivated with engaging instructors on our platform, guiding
              you through every course.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="benefits-item">
            <div className="benefits-img">
              <ImageWithBasePath
                src="assets/img/icons/benefit-icon-02.svg"
                alt="img"
                className="img-fluid"
              />
            </div>
            <h5 className="title">Get certified on courses</h5>
            <p className="text-light mb-0">
              Get certified, master modern tech skills, and level up your career
              whether you’re starting.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="benefits-item">
            <div className="benefits-img">
              <ImageWithBasePath
                src="assets/img/icons/benefit-icon-03.svg"
                alt="img"
                className="img-fluid"
              />
            </div>
            <h5 className="title">Build skills on your way</h5>
            <p className="text-light mb-0">
              Build skills your way with hands-on labs and immersive courses,
              tailored to fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /our benefits */}
</>

  )
}

export default Benefits
