import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Masterskill = () => {
    return (
        <>
            {/* Master Skill */}
            <div className="section master-skill">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-6 col-md-12">
                            <div className="section-header aos" data-aos="fade-up">
                                <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                                    What’s New
                                </span>
                                <h2>Master the skills to drive your career</h2>
                                <p>
                                    Get certified, master modern tech skills, and level up your career
                                    — whether you’re starting out or a seasoned pro. 95% of eLearning
                                    learners report our hands-on content directly helped their
                                    careers.
                                </p>
                            </div>
                            <div className="career-group aos" data-aos="fade-up">
                                <div className="row row-gap-4">
                                    <div className="col-lg-6 col-md-6 d-flex">
                                        <div className="certified-item d-flex align-items-center flex-fill">
                                            <div className="certified-img ">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-22.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p>Stay motivated with engaging instructors</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 d-flex">
                                        <div className="certified-item d-flex align-items-center flex-fill">
                                            <div className="certified-img ">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-17.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p>Keep up with in the latest in cloud</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 d-flex">
                                        <div className="certified-item d-flex align-items-center flex-fill">
                                            <div className="certified-img ">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-23.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p>Get certified with 100+ certification courses</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 d-flex">
                                        <div className="certified-item d-flex align-items-center flex-fill">
                                            <div className="certified-img ">
                                                <ImageWithBasePath
                                                    src="assets/img/icons/icon-16.svg"
                                                    alt="Img"
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <p>Build skills your way, from labs to courses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="career-img aos" data-aos="fade-up">
                                <ImageWithBasePath
                                    src="assets/img/bg/bg-2.png"
                                    alt="Img"
                                    className="img-fluid master-bg"
                                />
                                <ImageWithBasePath
                                    src="assets/img/feature/feature-16.png"
                                    alt="Img"
                                    className="img-fluid girl-img"
                                />
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-18.svg"
                                    alt="Img"
                                    className="img-fluid float-img-01"
                                />
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-19.svg"
                                    alt="Img"
                                    className="img-fluid float-img-02"
                                />
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-20.svg"
                                    alt="Img"
                                    className="img-fluid float-img-03"
                                />
                                <ImageWithBasePath
                                    src="assets/img/icons/icon-21.svg"
                                    alt="Img"
                                    className="img-fluid float-img-04"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Master Skill */}
        </>

    )
}

export default Masterskill
