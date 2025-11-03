import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Masterskill = () => {
    return (
        <>
            {/* Master skills Career */}
            <section className="master-skill-three">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-5 col-lg-6 col-md-12" data-aos="fade-up">
                            <div className="master-three-images">
                                <div className="master-img">
                                     <ImageWithBasePath
                                        className="img-fluid master-bg1"
                                        src="assets/img/shapes/shape-10.svg"
                                        alt="img"
                                    />
                                     <ImageWithBasePath
                                        className="img-fluid master-bg2"
                                        src="assets/img/shapes/shape-7.svg"
                                        alt="img"
                                    />
                                     <ImageWithBasePath
                                        className="img-fluid master-skill-image1"
                                        src="assets/img/feature/feature-10.jpg"
                                        alt="img"
                                    />
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-6 col-md-12" data-aos="fade-up">
                            <div className="master-skill-content">
                                <div className="home-five-head" data-aos="fade-up">
                                    <h2>Develop Skills That Drive Career Growth and Innovation</h2>
                                </div>
                                <div className="home-five-content" data-aos="fade-up">
                                    <p>
                                       Acquire cutting-edge skills with industry-approved courses designed for today's job market. 92% of our learners achieve career milestones within 6 months - from rapid promotions to exciting new roles through hands-on, real-world learning experiences.
                                    </p>
                                </div>
                                <div className="skils-group">
                                    <div className="row row-gap-4">
                                        <div
                                            className="col-lg-6 col-xs-12 col-sm-6"
                                            data-aos="fade-down"
                                        >
                                            <div className="skils-icon-item">
                                                <div className="skils-icon">
                                                     <ImageWithBasePath
                                                        className="img-fluid"
                                                        src="assets/img/icon/career-01.svg"
                                                        alt="certified"
                                                    />
                                                </div>
                                                <div className="skils-content">
                                                    <h5 className="mb-2">Industry-Recognized Certifications</h5>
                                                    <p className="mb-0">
                                                        Earn credentials valued by top employers with 200+ accredited certification programs
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-12 col-sm-6" data-aos="fade-up">
                                            <div className="skils-icon-item">
                                                <div className="skils-icon">
                                                     <ImageWithBasePath
                                                        className="img-fluid"
                                                        src="assets/img/icon/career-02.svg"
                                                        alt="Build skills"
                                                    />
                                                </div>
                                                <div className="skils-content">
                                                    <h5 className="mb-2">Project-Based Learning</h5>
                                                    <p className="mb-0">
                                                        Build practical expertise through real-world projects and portfolio development
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-12 col-sm-6" data-aos="fade-up">
                                            <div className="skils-icon-item">
                                                <div className="skils-icon">
                                                     <ImageWithBasePath
                                                        className="img-fluid"
                                                        src="assets/img/icon/career-03.svg"
                                                        alt="Stay Motivated"
                                                    />
                                                </div>
                                                <div className="skils-content">
                                                    <h5 className="mb-2">Expert-Led Instruction</h5>
                                                    <p className="mb-0">
                                                        Learn from industry leaders and professionals shaping the future of technology
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-12 col-sm-6" data-aos="fade-up">
                                            <div className="skils-icon-item">
                                                <div className="skils-icon">
                                                    <ImageWithBasePath
                                                        className="img-fluid"
                                                        src="assets/img/icon/career-04.svg"
                                                        alt="latest cloud"
                                                    />
                                                </div>
                                                <div className="skils-content">
                                                    <h5 className="mb-2">Career Advancement</h5>
                                                    <p className="mb-0">Accelerate your job search with high-demand skills companies are hiring for now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Master skills Career */}
        </>

    )
}

export default Masterskill
