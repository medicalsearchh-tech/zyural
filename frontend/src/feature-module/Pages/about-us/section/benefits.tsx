import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Benefits = () => {
  return (
    <>
      {/* benefits */}
      <section className="benefit-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
              Our Benefits
            </span>
            <h2>Master the Skills to Drive your Career</h2>
            <p>
              The right course, guided by an expert mentor, can provide
              invaluable insights, practical skills.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="./assets/img/shapes/bg-1.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-primary-transparent d-inline-flex">
                    <i className="isax isax-book-1 fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Flexible Learning</h5>
                  <p>
                    We believe that high-quality education should be accessible
                    to everyone. Our pricing form in models are designed.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-2.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-secondary-transparent d-inline-flex">
                    <i className="isax isax-bookmark5 fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Lifetime Access</h5>
                  <p>
                    When you enroll in our courses, you’re not just signing up
                    for a temporary learning to experience you’re making.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-3.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-skyblue-transparent d-inline-flex">
                    <i className="isax isax-chart-26 fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Expert Instruction</h5>
                  <p>
                    Our instructors are seasoned professionals with years of
                    experience in their respective fields &amp; Experts advice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* benefits */}
    </>
  );
};

export default Benefits;
