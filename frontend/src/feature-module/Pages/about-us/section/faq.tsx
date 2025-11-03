import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Faq = () => {
  return (
    <>
      {/* faq */}
      <section className="faq-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 pe-md-5">
              <div className="position-relative">
                <ImageWithBasePath
                  className="img-fluid rounded-4"
                  src="assets/img/about/about-1.jpg"
                  alt="Medical education platform"
                />
                <div className="bg-warning text-center p-3 rounded-5 position-absolute top-0 end-0 z-index-1 d-none d-sm-block my-3 mx-3">
                  <i className="isax isax-message-question5 heading-color fs-46" />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="section-header">
                <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                  FAQs
                </span>
                <h2>Frequently Asked Questions</h2>
                <p>
                  Everything you need to know about Zyural's accredited medical education platform.
                </p>
              </div>
              <div className="faq-content">
                <div
                  className="accordion accordion-customicon1 accordions-items-seperate"
                  id="accordioncustomicon1Example"
                >
                  <div className="accordion-item" data-aos="fade-up">
                    <h2 className="accordion-header" id="headingcustomicon1One">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1One"
                        aria-expanded="true"
                        aria-controls="collapsecustomicon1One"
                      >
                        How does Zyural's pay-for-certificate model work?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1One"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1One"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          All course content on Zyural is free to access. Browse, enroll, and complete courses at no cost. 
                          You only pay when you want to receive your accredited CME/CPD certificate with official credit hours. 
                          This means you can learn for free and only invest when you need recognized professional credits.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2 className="accordion-header" id="headingcustomicon1Two">
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Two"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Two"
                      >
                        What accreditation bodies does Zyural work with?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Two"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Two"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Zyural partners with recognized medical accreditation bodies to ensure our certificates 
                          meet professional standards. Each course displays its accreditation details including the 
                          accrediting body, credit hours, and validity period. All certificates include unique 
                          verification codes and QR links for authentication.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Three"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Three"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Three"
                      >
                        Can I create and upload my own courses?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Three"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Three"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Yes! Medical professionals and educators can become instructors on Zyural. After registration, 
                          you can create courses, upload content, and submit them for accreditation review. All instructor-created 
                          courses go through our quality and accreditation approval process before publication. You'll earn 
                          revenue share on certificate purchases for your courses.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Four"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Four"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Four"
                      >
                        How do I track my CME/CPD credits?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Four"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Four"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Your dashboard includes a comprehensive Credit Ledger that automatically tracks all earned CME/CPD hours. 
                          View credits by type, specialty, and time period. Access all your certificates in one place and 
                          download transcripts for license renewal or professional reporting. Credits are added immediately 
                          upon certificate purchase.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Five"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Five"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Five"
                      >
                        What happens if accreditation expires for a course I completed?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Five"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Five"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Your certificate remains valid if you earned it before the accreditation expiry date. 
                          The credits you received are yours permanently. However, new learners cannot earn credits 
                          from expired courses. We notify you before expiry and update course badges accordingly. 
                          Your Credit Ledger maintains a complete historical record of all earned credits.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Six"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Six"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Six"
                      >
                        Are there any prerequisites for taking courses?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Six"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Six"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Course prerequisites vary by specialty and level. Each course page clearly displays its 
                          target audience, required level (Beginner/Intermediate/Advanced), and any specific prerequisites. 
                          Most courses are designed for practicing healthcare professionals, but some foundational courses 
                          are open to students and allied health professionals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* faq */}
    </>
  );
};

export default Faq;