import { useState } from 'react'
import VideoModal from '../../HomePages/home-one/section/videoModal';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from '../../router/all_routes';

const CourseDetailsTwo = () => {

    const [showModal, setShowModal] = useState(false);
    const videoUrl = 'https://www.youtube.com/embed/1trvO6dqQUI';

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const route = all_routes;

    return (
        <>
            <>
                {/* banner */}
                <section className="inner-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <h1 className="text-white mb-3 mb-sm-2">
                                    The Complete Web Developer Course 2.0
                                </h1>
                                <p className="text-white fs-14 mb-3">
                                    Learn Web Development by building 25 websites and mobile apps using
                                    HTML, CSS, Javascript, PHP, Python
                                </p>
                                <div className="d-flex align-items-center gap-2 gap-sm-3 gap-xl-4 flex-wrap justify-content-md-start justify-content-center">
                                    <p className="fw-medium text-white d-flex align-items-center mb-0">
                                        <ImageWithBasePath
                                            className="me-2"
                                            src="./assets/img/icons/book.svg"
                                            alt="img"
                                        />
                                        12+ Lesson
                                    </p>
                                    <p className="fw-medium text-white d-flex align-items-center mb-0">
                                        <ImageWithBasePath
                                            className="me-2"
                                            src="./assets/img/icons/timer-start.svg"
                                            alt="img"
                                        />
                                        9hr 30min
                                    </p>
                                    <p className="fw-medium text-white d-flex align-items-center mb-0">
                                        <ImageWithBasePath
                                            className="me-2"
                                            src="./assets/img/icons/people.svg"
                                            alt="img"
                                        />
                                        32 students enrolled
                                    </p>
                                    <span className="badge badge-sm rounded-pill bg-warning fs-12">
                                        Web Development
                                    </span>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-sm-between mt-5">
                                    <div className="d-flex text-start align-items-center justify-content-sm-start justify-content-center">
                                        <div className="avatar avatar-lg">
                                            <ImageWithBasePath
                                                className="rounded-circle"
                                                src="./assets/img/avatar/avatar10.jpg"
                                                alt="img"
                                            />
                                        </div>
                                        <div className="ms-2">
                                            <h6 className="fs-18 text-white">
                                                <Link to={route.instructorDetails}>Nicole Brown</Link>
                                            </h6>
                                            <p className="text-white fs-14">Instructor</p>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-sm-0 mt-2 align-items-center justify-content-sm-start justify-content-center">
                                        <i className="fa-solid fa-star text-warning me-1" />
                                        <i className="fa-solid fa-star text-warning me-1" />
                                        <i className="fa-solid fa-star text-warning me-1" />
                                        <i className="fa-solid fa-star text-warning me-1" />
                                        <i className="fa-solid fa-star text-white me-1" />
                                        <p className="text-white fs-14">
                                            <span className="text-warning">4.0</span> (15){" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* banner */}
                {/* Course detail */}
                <section className="course-details">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="course-page-content">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="subs-title mb-3">Overview</h5>
                                            <h6 className="mb-3">Course Description</h6>
                                            <p>
                                                Embark on a transformative journey into AI with Mike Wheeler,
                                                your guide in this Udemy Best Seller course on ChatGPT and
                                                Prompt Engineering. As an experience instructor who has taught
                                                well over 300,000 students, Mike unveils the secrets of
                                                developing your own custom GPTs, ensuring your skills shine in
                                                the thriving digital marketplace.{" "}
                                            </p>
                                            <p>
                                                This course will get your familiar with Generative AI&nbsp;and
                                                the effective use of ChatGPT and is perfect for the beginner.
                                                You will also learn advanced prompting techniques to take your
                                                Prompt Engineering skills to the next level!
                                            </p>
                                            <h6 className="mb-3">What you'll learn</h6>
                                            <ul className="custom-list">
                                                <li className="list-items">Become a UX designer</li>
                                                <li className="list-items">
                                                    You will be able to add UX designer to your CV
                                                </li>
                                                <li className="list-items">Become a UI designer</li>
                                                <li className="list-items">
                                                    Build &amp; test a full website design.
                                                </li>
                                                <li className="list-items">
                                                    Build &amp; test a full mobile app.
                                                </li>
                                            </ul>
                                            <h6 className="mb-3 mt-4">Requirements</h6>
                                            <ul className="custom-list mb-0">
                                                <li className="list-items">
                                                    You will need a copy of Adobe XD 2019 or above. A free trial
                                                    can be downloaded from Adobe.
                                                </li>
                                                <li className="list-items">
                                                    No previous design experience is needed.
                                                </li>
                                                <li className="list-items">
                                                    No previous Adobe XD skills are needed.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between flex-wrap">
                                                <h5 className="subs-title mb-2 mb-sm-3">Course Content</h5>
                                                <h6 className="text-gray-7 mb-3">
                                                    92 Lectures <span className="text-secondary">10:56:11</span>
                                                </h6>
                                            </div>
                                            <div
                                                className="accordion accordion-customicon1 accordions-items-seperate p-0"
                                                id="accordioncustomicon1Example"
                                            >
                                                <div className="accordion-item" data-aos="fade-up">
                                                    <h2 className="accordion-header" id="headingcustomicon1One">
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapsecustomicon1One"
                                                            aria-expanded="false"
                                                            aria-controls="collapsecustomicon1One"
                                                        >
                                                            Getting Started{" "}
                                                            <i className="fa-solid fa-chevron-down" />
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapsecustomicon1One"
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby="headingcustomicon1One"
                                                        data-bs-parent="#accordioncustomicon1Example"
                                                    >
                                                        <div className="accordion-body p-0">
                                                            <ul>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.1 Introduction to the User Experience
                                                                        Course
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.2 Exercise: Your first design challenge
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.3 How to solve the previous exercise
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.4 Find out why smart objects are amazing
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.5 How to use text layers effectively
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="accordion-item"
                                                    data-aos="fade-up"
                                                    data-aos-delay={250}
                                                >
                                                    <h2 className="accordion-header" id="headingcustomicon1Two">
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapsecustomicon1Two"
                                                            aria-expanded="false"
                                                            aria-controls="collapsecustomicon1Two"
                                                        >
                                                            The Brief
                                                            <i className="fa-solid fa-chevron-down" />
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapsecustomicon1Two"
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby="headingcustomicon1Two"
                                                        data-bs-parent="#accordioncustomicon1Example"
                                                    >
                                                        <div className="accordion-body p-0">
                                                            <ul>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.1 Introduction to the User Experience
                                                                        Course
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.2 Exercise: Your first design challenge
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.3 How to solve the previous exercise
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.4 Find out why smart objects are amazing
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.5 How to use text layers effectively
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="accordion-item"
                                                    data-aos="fade-up"
                                                    data-aos-delay={300}
                                                >
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingcustomicon1Three"
                                                    >
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapsecustomicon1Three"
                                                            aria-expanded="false"
                                                            aria-controls="collapsecustomicon1Three"
                                                        >
                                                            Wireframing Low Fidelity
                                                            <i className="fa-solid fa-chevron-down" />
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapsecustomicon1Three"
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby="headingcustomicon1Three"
                                                        data-bs-parent="#accordioncustomicon1Example"
                                                    >
                                                        <div className="accordion-body p-0">
                                                            <ul>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.1 Introduction to the User Experience
                                                                        Course
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.2 Exercise: Your first design challenge
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.3 How to solve the previous exercise
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.4 Find out why smart objects are amazing
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.5 How to use text layers effectively
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="accordion-item mb-0"
                                                    data-aos="fade-up"
                                                    data-aos-delay={350}
                                                >
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingcustomicon1Four"
                                                    >
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapsecustomicon1Four"
                                                            aria-expanded="false"
                                                            aria-controls="collapsecustomicon1Four"
                                                        >
                                                            Type, Color &amp; Icon Introduction
                                                            <i className="fa-solid fa-chevron-down" />
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapsecustomicon1Four"
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby="headingcustomicon1Four"
                                                        data-bs-parent="#accordioncustomicon1Example"
                                                    >
                                                        <div className="accordion-body p-0">
                                                            <ul>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.1 Introduction to the User Experience
                                                                        Course
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.2 Exercise: Your first design challenge
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.3 How to solve the previous exercise
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.4 Find out why smart objects are amazing
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                                <li className="p-4 px-3 pb-0 d-flex justify-content-between">
                                                                    <p className="mb-0">
                                                                        <ImageWithBasePath
                                                                            className="me-2"
                                                                            src="./assets/img/icons/play.svg"
                                                                            alt="img"
                                                                        />
                                                                        Lecture1.5 How to use text layers effectively
                                                                    </p>
                                                                    <div className="d-flex gap-xl-5 gap-3">
                                                                        <Link to="#" className="preview-link">
                                                                            Preview
                                                                        </Link>
                                                                        <p className="mb-0">02:53</p>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="subs-title mb-3">About the instructor</h5>
                                            <div className="d-flex align-items-center justify-content-between mt-4 gap-2 flex-wrap">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-lg">
                                                        <ImageWithBasePath
                                                            className="rounded-circle"
                                                            src="./assets/img/avatar/avatar10.jpg"
                                                            alt="img"
                                                        />
                                                    </div>
                                                    <div className="ms-2">
                                                        <h5 className="fs-18 fw-semibold">
                                                            <Link to={route.instructorDetails}>Nicole Brown</Link>
                                                        </h5>
                                                        <p className="mb-0">UX/UI Designer</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="fa-solid fa-star text-warning me-1" />
                                                    <i className="fa-solid fa-star text-warning me-1" />
                                                    <i className="fa-solid fa-star text-warning me-1" />
                                                    <i className="fa-solid fa-star text-warning me-1" />
                                                    <i className="fa-solid fa-star text-warning me-1" />
                                                    <p className="mb-0">4.5</p>
                                                </div>
                                            </div>
                                            <div className="course-info align-items-center d-flex gap-2 gap-xl-3 mt-3 mb-3 flex-wrap">
                                                <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                                                    <ImageWithBasePath
                                                        className="me-2"
                                                        src="./assets/img/icons/play2.svg"
                                                        alt="img"
                                                    />
                                                    5Courses
                                                </p>
                                                <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                                                    <ImageWithBasePath
                                                        className="me-2"
                                                        src="./assets/img/icons/book2.svg"
                                                        alt="img"
                                                    />
                                                    12+ Lesson
                                                </p>
                                                <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                                                    <ImageWithBasePath
                                                        className="me-2"
                                                        src="./assets/img/icons/timer-start2.svg"
                                                        alt="img"
                                                    />
                                                    9hr 30min
                                                </p>
                                                <p className="fw-medium d-flex align-items-center fs-14 mb-0">
                                                    <ImageWithBasePath
                                                        className="me-2"
                                                        src="./assets/img/icons/people.svg"
                                                        alt="img"
                                                    />
                                                    270,866 students enrolled
                                                </p>
                                            </div>
                                            <p>
                                                UI/UX Designer, with 7+ Years Experience. Guarantee of High
                                                Quality Work.
                                            </p>
                                            <p>
                                                Skills: Web Design, UI Design, UX/UI Design, Mobile Design,
                                                User Interface Design, Sketch, Photoshop, GUI, Html, Css, Grid
                                                Systems, Typography, Minimal, Template, English, Bootstrap,
                                                Responsive Web Design, Pixel Perfect, Graphic Design,
                                                Corporate, Creative, Flat, Luxury and much more.
                                            </p>
                                            <h6 className="fs-16 mb-2">Available for:</h6>
                                            <ol className="order-list mb-0">
                                                <li className="list-items">Full Time Office Work</li>
                                                <li className="list-items">Remote Work</li>
                                                <li className="list-items">Freelance</li>
                                                <li className="list-items">Contract</li>
                                                <li className="list-items">Worldwide</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="subs-title mb-3">Post A comment</h5>
                                            <form className="course-details-form">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-14 fw-medium text-gray-7">
                                                                Name
                                                            </label>
                                                            <input
                                                                className="form-control fs-14 text-gray-7"
                                                                type="text"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-14 fw-medium text-gray-7">
                                                                Email
                                                            </label>
                                                            <input
                                                                className="form-control fs-14 text-gray-7"
                                                                type="email"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-14 fw-medium text-gray-7">
                                                                Subject
                                                            </label>
                                                            <input
                                                                className="form-control fs-14 text-gray-7"
                                                                type="text"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label fs-14 fw-medium text-gray-7">
                                                                Comments
                                                            </label>
                                                            <textarea
                                                                className="form-control fs-14 text-gray-7"
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn post-btn">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="course-sidebar-sec">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="position-relative mb-4">
                                                <Link
                                                    to="#"
                                                    id="openVideoBtn"
                                                    onClick={handleOpenModal}
                                                >
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        src="assets/img/course/video-bg.jpg"
                                                        alt="img"
                                                    />
                                                    <div className="play-icon">
                                                        <i className="ti ti-player-play-filled fs-28" />
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
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h2 className="text-success fs-30">FREE</h2>
                                                <p className="mb-0">
                                                    <span className="text-decoration-line-through me-2">
                                                        $99.00
                                                    </span>
                                                    50% off
                                                </p>
                                            </div>
                                            <div className="d-flex justify-content-between gap-3 wishlist-btns">
                                                <Link
                                                    className="btn d-flex btn-wish"
                                                    to={route.studentWishlist}
                                                >
                                                    <i className="isax isax-heart me-1 fs-18" />
                                                    Add to Wishlist
                                                </Link>
                                                <Link className="btn d-flex btn-wish" to="#">
                                                    <i className="ti ti-share me-1 fs-18" />
                                                    Share
                                                </Link>
                                            </div>
                                            <Link
                                                to={route.courseCart}
                                                className="btn btn-primary w-100 mt-4 btn-enroll"
                                            >
                                                Enroll Now
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="subs-title">Includes</h5>
                                            <p>
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/play.svg"
                                                    alt="img"
                                                />
                                                11 hours on-demand video
                                            </p>
                                            <p>
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/import.svg"
                                                    alt="img"
                                                />
                                                69 downloadable resources
                                            </p>
                                            <p>
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/key.svg"
                                                    alt="img"
                                                />
                                                Full lifetime access
                                            </p>
                                            <p>
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/monitor-mobbile.svg"
                                                    alt="img"
                                                />
                                                Access on mobile and TV
                                            </p>
                                            <p>
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/cloud-lightning.svg"
                                                    alt="img"
                                                />
                                                Assignments
                                            </p>
                                            <p className="mb-0">
                                                <ImageWithBasePath
                                                    className="me-2"
                                                    src="./assets/img/icons/teacher.svg"
                                                    alt="img"
                                                />
                                                Certificate of Completion
                                            </p>
                                        </div>
                                    </div>
                                    <div className="cou-features-card">
                                        <div className="cou-features">
                                            <h5 className="subs-title">Course Features</h5>
                                            <ul>
                                                <li>
                                                    <p className="mb-0">
                                                        <ImageWithBasePath
                                                            className="me-2"
                                                            src="./assets/img/icons/people2.svg"
                                                            alt="img"
                                                        />
                                                        Enrolled: 32 students
                                                    </p>
                                                </li>
                                                <li>
                                                    <p className="mb-0">
                                                        <ImageWithBasePath
                                                            className="me-2"
                                                            src="./assets/img/icons/timer-start3.svg"
                                                            alt="img"
                                                        />
                                                        Duration: 20 hours
                                                    </p>
                                                </li>
                                                <li>
                                                    <p className="mb-0">
                                                        <ImageWithBasePath
                                                            className="me-2"
                                                            src="./assets/img/icons/note.svg"
                                                            alt="img"
                                                        />
                                                        Chapters: 15
                                                    </p>
                                                </li>
                                                <li>
                                                    <p className="mb-0">
                                                        <ImageWithBasePath
                                                            className="me-2"
                                                            src="./assets/img/icons/play3.svg"
                                                            alt="img"
                                                        />
                                                        Video: 12 hours
                                                    </p>
                                                </li>
                                                <li>
                                                    <p className="mb-0">
                                                        <ImageWithBasePath
                                                            className="me-2"
                                                            src="./assets/img/icons/chart.svg"
                                                            alt="img"
                                                        />
                                                        Level: Beginner
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* /Course detail */}
            </>

        </>
    )
}

export default CourseDetailsTwo
