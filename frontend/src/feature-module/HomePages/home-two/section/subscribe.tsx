import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Subscribe = () => {
    return (
        <>
            {/* subscribe section */}
            <div className="subsribe-section">
                <div className="container position-relative">
                    <ImageWithBasePath
                        src="assets/img/icons/banner-icon-03.svg"
                        alt="img"
                        className="img-fluid bg-05  d-none d-lg-flex"
                    />
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="contact-section">
                                <div className="mb-4 aos" data-aos="fade-up">
                                    <h2 className="text-white mb-1">Transform Access To Education</h2>
                                    <p className="text-light fs-16">
                                        Create Account to Receive Our Newsletter, Course Recommend &amp;
                                        Promotions.
                                    </p>
                                </div>
                                <form action="#" className="subcribe-form">
                                    <span>
                                        <i className="isax isax-message-text" />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="form-control"
                                    />
                                    <button type="submit" className="btn btn-secondary btn-xl">
                                        Subcribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 position-relative">
                            <ImageWithBasePath
                                src="assets/img/bg/subscribe-bg-01.png"
                                alt="img"
                                className="img-fluid bg-01 d-none d-lg-flex aos"
                                data-aos="fade-down"
                            />
                            <ImageWithBasePath
                                src="assets/img/feature/feature-22.png"
                                alt="img"
                                className="img-fluid bg-02 d-none d-lg-flex aos"
                                data-aos="fade-down"
                            />
                            <ImageWithBasePath
                                src="assets/img/icons/subscribe-icon-02.svg"
                                alt="img"
                                className="img-fluid bg-03 d-none d-lg-flex"
                            />
                            <ImageWithBasePath
                                src="assets/img/icons/subscribe-icon-01.svg"
                                alt="img"
                                className="img-fluid bg-04 d-none d-lg-flex"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* /subscribe section */}
        </>

    )
}

export default Subscribe
