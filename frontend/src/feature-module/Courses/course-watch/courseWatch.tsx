import { useState } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import VideoModal from '../../HomePages/home-one/section/videoModal';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

const CourseWatch = () => {

    const [showModal, setShowModal] = useState(false);
        const videoUrl = 'https://www.youtube.com/embed/1trvO6dqQUI';
      
        const handleOpenModal = () => setShowModal(true);
        const handleCloseModal = () => setShowModal(false)

  return (
    <>
      <Breadcrumb title='Course watch' />
      <>
        {/* Course watch */}
        <div className="content pt-0">
          <div className="container-fluid">
            <div className="course-watch-section">
              <div className="row">
                <div className="col-lg-4  border-end">
                  <div className="progress-overview-section">
                    <div className="mb-4">
                      <Link to="#" className="back-to-course">
                        <i className="isax isax-arrow-left me-1" />
                        Back to Course
                      </Link>
                    </div>
                    <h3>Learn Responsive Web Design Essentials</h3>
                    <div className="mb-4">
                      <p className="mb-1">46% Complete</p>
                      <div
                        className="progress progress-xs mb-2"
                        role="progressbar"
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="progress-bar bg-success"
                          style={{ width: "70%" }}
                        />
                      </div>
                      <span className="fw-medium">
                        Last activity on April 20, 2025
                      </span>
                    </div>
                    <div
                      className="accordions-items-seperate"
                      id="accordionSpacingExample"
                    >
                      <div className="accordion-item">
                        <div className="accordion-header" id="headingSpacingOne3">
                          <div
                            className="accordion-button collapsed"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#SpacingOne"
                            aria-expanded="false"
                            aria-controls="SpacingOne"
                          >
                            <div>
                              <span className="d-block mb-1">Section 1</span>
                              <h6 className="mb-0">Html Introduction</h6>
                            </div>
                          </div>
                        </div>
                        <div
                          id="SpacingOne"
                          className="accordion-collapse collapse show"
                          aria-labelledby="headingSpacingOne3"
                          data-bs-parent="#accordionSpacingExample"
                        >
                          <div className="accordion-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">Introduction</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">What is HTML</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">
                                  What is a Web page?
                                </p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <div className="accordion-header" id="headingSpacingTwo">
                          <div
                            className="accordion-button collapsed"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#SpacingTwo"
                            aria-expanded="false"
                            aria-controls="SpacingTwo"
                          >
                            <div>
                              <span className="d-block mb-1">Section 2</span>
                              <h6 className="mb-0">Your First webpage</h6>
                            </div>
                          </div>
                        </div>
                        <div
                          id="SpacingTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingSpacingTwo"
                          data-bs-parent="#accordionSpacingExample"
                        >
                          <div className="accordion-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">Introduction</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">What is HTML</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">
                                  What is a Web page?
                                </p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <div className="accordion-header" id="headingSpacingThree">
                          <div
                            className="accordion-button collapsed"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#SpacingThree"
                            aria-expanded="false"
                            aria-controls="SpacingThree"
                          >
                            <div>
                              <span className="d-block mb-1">Section 3</span>
                              <h6 className="mb-0">Your First webpage</h6>
                            </div>
                          </div>
                        </div>
                        <div
                          id="SpacingThree"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingSpacingThree"
                          data-bs-parent="#accordionSpacingExample"
                        >
                          <div className="accordion-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">Introduction</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">What is HTML</p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <span className="d-flex">
                                  <i className="isax isax-play-circle5 text-success fs-24 me-1" />
                                </span>
                                <p className="accordian-content mb-0">
                                  What is a Web page?
                                </p>
                              </div>
                              <span>2m 10s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="course-watch-content">
                    <div className="position-relative video-btn">
                      <Link
                        to=""
                        id="openVideoBtn" onClick={handleOpenModal}
                      >
                        <ImageWithBasePath
                          className="img-fluid"
                          src="assets/img/course/course-27.jpg"
                          alt="img"
                        />
                        <div className="play-icon">
                          <i className="fa-solid fa-play fs-28" />
                        </div>
                      </Link>
                    </div>
                    <div id="videoModal">
                      <div className="modal-content1">
                        <span className="close-btn" id="closeModal">
                          ×
                        </span>
                        <VideoModal show={showModal} handleClose={handleCloseModal} videoUrl={videoUrl} />
                      </div>
                    </div>
                    <ul
                      className="nav-tabs mb-4 nav-justified border-0 nav-style-1 d-sm-flex d-block"
                      role="tablist"
                    >
                      <li className="nav-item active">
                        <Link
                          className="btn nav-link active"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#overview"
                          aria-selected="false"
                        >
                          Overview
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="btn nav-link"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#notes"
                          aria-selected="false"
                        >
                          Notes
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="btn nav-link"
                          data-bs-toggle="tab"
                          role="tab"
                          to="#faq"
                          aria-selected="true"
                        >
                          FAQ
                        </Link>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane active show"
                        id="overview"
                        role="tabpanel"
                      >
                        <div className="mb-4">
                          <h6 className="fs-18 fw-semibold mb-1">
                            About this course
                          </h6>
                          <p>Learn Web Development Without Writing Much Code</p>
                        </div>
                        <div className="mb-4">
                          <h6 className="fs-18 fw-semibold mb-2">Description</h6>
                          <p>
                            Embark on a transformative journey into AI with Mike
                            Wheeler, your guide in this Udemy Best Seller course on
                            ChatGPT and Prompt Engineering. As an experience
                            instructor who has taught well over 300,000 students, Mike
                            unveils the secrets of developing your own custom GPTs,
                            ensuring your skills shine in the thriving digital
                            marketplace.
                          </p>
                          <p className="mb-1">
                            This course will get your familiar with Generative
                            AI&nbsp;and the effective use of ChatGPT and is perfect
                            for the beginner. You will also learn advanced prompting
                            techniques to take your Prompt Engineering skills to the
                            next level!
                          </p>
                          <Link to="#" className="readmore-btn">
                            Readmore
                          </Link>
                        </div>
                        <div className="mb-4">
                          <h6 className="fs-18 fw-semibold mb-2">
                            What You’ll Learn
                          </h6>
                          <ul
                            className="list-unstyled what-you-learn ms-4"
                            style={{ listStyleType: "disc" }}
                          >
                            <li className="mb-2">Setting up the environment</li>
                            <li className="mb-2">Advanced HTML Practices</li>
                            <li className="mb-2">Build a portfolio website</li>
                            <li className="mb-2">Responsive Designs</li>
                            <li className="mb-2">Understand HTML Programming</li>
                            <li className="mb-2">Code HTML</li>
                            <li className="mb-0">
                              Start building beautiful websites
                            </li>
                          </ul>
                        </div>
                        <div className="mb-0">
                          <h6 className="fs-18 fw-semibold mb-2">Requirements</h6>
                          <ul
                            className="list-unstyled what-you-learn ms-4"
                            style={{ listStyleType: "disc" }}
                          >
                            <li className="mb-2">
                              Any computer will work: Windows, macOS or Linux
                            </li>
                            <li className="mb-2">Basic programming HTML and CSS.</li>
                            <li className="mb-0">
                              Basic/Minimal understanding of JavaScript
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tab-pane" id="notes" role="tabpanel">
                        <div className="mb-0">
                          <h6 className="fs-18 fw-semibold mb-1">Notes</h6>
                          <p>
                            Embark on a transformative journey into AI with Mike
                            Wheeler, your guide in this Udemy Best Seller course on
                            ChatGPT and Prompt Engineering. As an experience
                            instructor who has taught well over 300,000 students, Mike
                            unveils the secrets of developing your own custom GPTs,
                            ensuring your skills shine in the thriving digital
                            marketplace.
                          </p>
                          <p className="mb-0">
                            This course will get your familiar with Generative
                            AI&nbsp;and the effective use of ChatGPT and is perfect
                            for the beginner. You will also learn advanced prompting
                            techniques to take your Prompt Engineering skills to the
                            next level!
                          </p>
                        </div>
                      </div>
                      <div className="tab-pane" id="faq" role="tabpanel">
                        <div className="faq-accordion">
                          <div
                            className="accordions-items-seperate"
                            id="accordionSpacingExample2"
                          >
                            <div className="accordion-item">
                              <div
                                className="accordion-header"
                                id="headingSpacingOne2"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionOne"
                                  aria-expanded="false"
                                  aria-controls="accordionOne"
                                >
                                  How do I enroll in a course?
                                </button>
                              </div>
                              <div
                                id="accordionOne"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingSpacingOne2"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id="headingSpacingTwo2"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionTwo"
                                  aria-expanded="false"
                                  aria-controls="accordionTwo"
                                >
                                  How long do I have access to a course?
                                </button>
                              </h2>
                              <div
                                id="accordionTwo"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingSpacingTwo2"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id="headingSpacingTwo3"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionThree"
                                  aria-expanded="false"
                                  aria-controls="accordionThree"
                                >
                                  What payment methods are accepted?
                                </button>
                              </h2>
                              <div
                                id="accordionThree"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingSpacingTwo3"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id="headingSpacingTwo4"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionFour"
                                  aria-expanded="false"
                                  aria-controls="accordionFour"
                                >
                                  Will I receive a certificate after completing a
                                  course?
                                </button>
                              </h2>
                              <div
                                id="accordionFour"
                                className="accordion-collapse collapse show"
                                aria-labelledby="headingSpacingTwo4"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id="headingSpacingTwo5"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionFive"
                                  aria-expanded="false"
                                  aria-controls="accordionFive"
                                >
                                  What is the purpose of this DreamLMS ?
                                </button>
                              </h2>
                              <div
                                id="accordionFive"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingSpacingTwo5"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id="headingSpacingTwo6"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#accordionSix"
                                  aria-expanded="false"
                                  aria-controls="accordionSix"
                                >
                                  What can I do with my certificate?
                                </button>
                              </h2>
                              <div
                                id="accordionSix"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingSpacingTwo6"
                                data-bs-parent="#accordionSpacingExample2"
                              >
                                <div className="accordion-body">
                                  <p className="mb-0">
                                    Many websites offer a Certificate of Completion
                                    for paid courses. Free courses may or may not
                                    include a certificate, depending on the platform’s
                                    policies.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Course watch */}
      </>

    </>
  )
}

export default CourseWatch
