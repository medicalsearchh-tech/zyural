import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Knowledge = () => {
    return (
        <>
            {/* Share your knowledge */}
            <div className="knowledge-sec">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-12 ps-0">
                            <div className="featured-img-1" />
                        </div>
                        <div className="col-lg-6 col-sm-12 p-0" data-aos="fade-up">
                            <div className="joing-group">
                                <div className="section-header">
                                    <h2 className="mb-2">
                                        Want to share your knowledge? Join us a Mentor
                                    </h2>
                                </div>
                                <div className="joing-list">
                                    <ul>
                                        <li data-aos="fade-bottom">
                                            <div className="joing-header">
                                                <span className="joing-icon bg-primary">
                                                    <ImageWithBasePath
                                                        src="assets/img/icons/joing-01.svg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                <div className="joing-content">
                                                    <h5 className="title">Project Management Professional</h5>
                                                    <p>
                                                        A globally recognized certification for project
                                                        managers, PMP validates your ability to lead projects
                                                        efficiently from start to finish.{" "}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li data-aos="fade-bottom">
                                            <div className="joing-header">
                                                <span className="joing-icon bg-warning">
                                                    <ImageWithBasePath
                                                        src="assets/img/icons/joing-02.svg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                <div className="joing-content">
                                                    <h5 className="title">Fosters Personal Growth</h5>
                                                    <p>
                                                        Pursuing certifications pushes you to learn new things
                                                        and grow professionally, increasing your confidence and
                                                        job satisfaction.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li data-aos="fade-bottom">
                                            <div className="joing-header">
                                                <span className="joing-icon bg-success">
                                                    <ImageWithBasePath
                                                        src="assets/img/icons/joing-03.svg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                <div className="joing-content aos">
                                                    <h5 className="title">
                                                        Build skills your way, from labs to courses
                                                    </h5>
                                                    <p>
                                                        Courses come in various formats, including video
                                                        tutorials, interactive assignments, quizzes, reading
                                                        materials, and hands-on projects
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li data-aos="fade-bottom" className="mb-0">
                                            <div className="joing-header">
                                                <span className="joing-icon bg-secondary">
                                                    <ImageWithBasePath
                                                        src="assets/img/icons/joing-04.svg"
                                                        alt="Img"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                <div className="joing-content aos">
                                                    <h5 className="title">
                                                        Get certified with 100+ certification courses
                                                    </h5>
                                                    <p>
                                                        Employers often value certifications when it comes to
                                                        promotions and internal career advancement
                                                        opportunities.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Share your knowledge */}
        </>

    )
}

export default Knowledge
