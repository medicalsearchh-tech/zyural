import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Onlinecourses = () => {
    return (
        <>
            {/*Online Courses */}
            <section className="section student-course student-course-five">
                <div className="container">
                    <div className="course-widget-three">
                        <div className="row row-gap-4">
                            <div className="col-lg-3 col-md-6 d-flex" data-aos="fade-up">
                                <div className="course-details-three">
                                    <div className="align-items-center">
                                        <div className="course-count-three course-count ms-0">
                                            <div className="course-img">
                                                <ImageWithBasePath
                                                    className="img-fluid"
                                                    src="assets/img/icon/course-01.svg"
                                                    alt="Img"
                                                />
                                            </div>
                                            <div className="course-content-three">
                                                <h4 className="text-info">
                                                    <span className="counterUp">750</span>
                                                </h4>
                                                <p>Online Courses</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex" data-aos="fade-up">
                                <div className="course-details-three">
                                    <div className="align-items-center">
                                        <div className="course-count-three course-count ms-0">
                                            <div className="course-img">
                                                <ImageWithBasePath
                                                    className="img-fluid"
                                                    src="assets/img/icon/course-02.svg"
                                                    alt="Img"
                                                />
                                            </div>
                                            <div className="course-content-three">
                                                <h4 className="text-warning">
                                                    <span className="counterUp">150</span>+
                                                </h4>
                                                <p>Expert Tutors</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex" data-aos="fade-up">
                                <div className="course-details-three">
                                    <div className="align-items-center">
                                        <div className="course-count-three course-count ms-0">
                                            <div className="course-img">
                                                <ImageWithBasePath
                                                    className="img-fluid"
                                                    src="assets/img/icon/course-03.svg"
                                                    alt="Img"
                                                />
                                            </div>
                                            <div className="course-content-three">
                                                <h4 className="text-skyblue">
                                                    <span className="counterUp">700</span> +
                                                </h4>
                                                <p>Ceritified Courses</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex" data-aos="fade-up">
                                <div className="course-details-three mb-0">
                                    <div className="align-items-center">
                                        <div className="course-count-three">
                                            <div className="course-img">
                                                <ImageWithBasePath
                                                    className="img-fluid"
                                                    src="assets/img/icon/course-04.svg"
                                                    alt="Img"
                                                />
                                            </div>
                                            <div className="course-content-three course-count">
                                                <h4 className="text-success">
                                                    <span className="counterUp">1700</span> +
                                                </h4>
                                                <p>Online Students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Online Courses */}
        </>

    )
}

export default Onlinecourses
