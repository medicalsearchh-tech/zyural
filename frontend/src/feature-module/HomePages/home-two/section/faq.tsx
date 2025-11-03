import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

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
                                    alt="img"
                                />
                                <div className="bg-warning text-center p-3 rounded-5 position-absolute top-0 end-0 z-index-1 d-none d-sm-block my-3 mx-3">
                                    <i className="isax isax-message-question5 heading-color fs-46" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="section-header">
                                <span className="fw-medium text-secondary mb-2 d-inline-block section-badge">
                                    FAQs
                                </span>
                                <h2>Frequently Asked Questions</h2>
                                <p>
                                    Explore detailed answers to the most common questions about our
                                    platform.
                                </p>
                            </div>
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
                                            What’s DreamLMS want to give you?{" "}
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
                                                DreamLMS aims to provide you with a comprehensive and
                                                intuitive learning platform that enhances your educational
                                                experience.
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
                                            aria-controls="collapsecustomicon1One"
                                        >
                                            Why choose us for your education?{" "}
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
                                                DreamLMS aims to provide you with a comprehensive and
                                                intuitive learning platform that enhances your educational
                                                experience.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion-item"
                                    data-aos="fade-up"
                                    data-aos-delay={250}
                                >
                                    <h2 className="accordion-header" id="headingcustomicon1Three">
                                        <Link
                                            to="#"
                                            className="accordion-button collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapsecustomicon1Three"
                                            aria-expanded="false"
                                            aria-controls="collapsecustomicon1One"
                                        >
                                            How We Provide Service For you?{" "}
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
                                                DreamLMS aims to provide you with a comprehensive and
                                                intuitive learning platform that enhances your educational
                                                experience.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion-item"
                                    data-aos="fade-up"
                                    data-aos-delay={250}
                                >
                                    <h2 className="accordion-header" id="headingcustomicon1Four">
                                        <Link
                                            to="#"
                                            className="accordion-button collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapsecustomicon1Four"
                                            aria-expanded="false"
                                            aria-controls="collapsecustomicon1One"
                                        >
                                            Do you have a monthly plan?{" "}
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
                                                DreamLMS aims to provide you with a comprehensive and
                                                intuitive learning platform that enhances your educational
                                                experience.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion-item"
                                    data-aos="fade-up"
                                    data-aos-delay={250}
                                >
                                    <h2 className="accordion-header" id="headingcustomicon1Five">
                                        <Link
                                            to="#"
                                            className="accordion-button collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapsecustomicon1Five"
                                            aria-expanded="false"
                                            aria-controls="collapsecustomicon1One"
                                        >
                                            Are you Affordable For Your Course{" "}
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
                                                DreamLMS aims to provide you with a comprehensive and
                                                intuitive learning platform that enhances your educational
                                                experience.
                                            </p>
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

    )
}

export default Faq
