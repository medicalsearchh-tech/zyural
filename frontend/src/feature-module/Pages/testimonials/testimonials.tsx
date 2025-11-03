import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";

const Testimonials = () => {

    const route = all_routes

  return (
    <>
      <Breadcrumb title="Testimonials" />

      <div className="testimonials-sec-two mb-0 position-relative">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Flexible Learning</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  Working with this team has been a game-changer for my
                  business. Their professionalism and attention to helped me
                  streamline operations and expand my reach.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-04.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Johnathan Smith</Link>
                      <p className="fs-12">Entrepreneur</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Design Concept</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  I was blown away by the results! The strategies they
                  implemented helped my brand gain significant visibility. The
                  team is knowledgeable, friendly, and dedicated.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-53.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Emily Jackson</Link>
                      <p className="fs-12">Marketing Specialist</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>AI Learning</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  I’ve worked with many agencies, but the team’s ability to
                  understand the unique needs of educators was outstanding.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-54.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Adriana Hrit</Link>
                      <p className="fs-12">Digital Marketing User</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Certification</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  This team offered innovative solutions that made my course
                  materials more accessible and interactive. I saw an immediate
                  increase in student engagement.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-55.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Michael Andrews</Link>
                      <p className="fs-12">Software Engineering</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>New Onboarding </h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  They offered insights and strategies that helped me refine my
                  curriculum, making it more relevant and impactful for my
                  diverse group of students.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-56.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Sarah Wilson</Link>
                      <p className="fs-12">Global Business Leadership</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Flexible Time to Read</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  I’m now able to offer more engaging, informative, and valuable
                  content to my students, thanks to their expert support.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-50.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>David Lee</Link>
                      <p className="fs-12">Personal Finance Education</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Change of Course</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  I’ve seen a real improvement in how engaged my students are,
                  and I am grateful for their innovative approach to teaching.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-57.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Anna Roberts</Link>
                      <p className="fs-12">Visual Arts Program</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Appreciation</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  The team helped me streamline the development of my medical
                  training courses, making them both more comprehensive and
                  easier for students to understand.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-51.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Chris Turner</Link>
                      <p className="fs-12">Medical Training Academy</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 d-flex">
              <div className="testimonial-item flex-fill">
                <div className="d-flex justify-content-between mb-1">
                  <h6>Useful Course</h6>
                  <i className="isax isax-quote-up5 fs-24 text-primary text-opacity-50" />
                </div>
                <p className="mb-3">
                  Our employees can now access training materials from anywhere,
                  on any device. The LMS has given our team the flexibility to
                  learn at their own pace.
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to={route.studentsDetails}
                      className="avatar avatar-lg rounded-circle"
                    >
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-52.jpg"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <Link to={route.studentsDetails}>Jerome Marshall</Link>
                      <p className="fs-12">CEO, Tech Solutions Inc.</p>
                    </div>
                  </div>
                  <div>
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                    <i className="fa-solid fa-star text-warning fs-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
