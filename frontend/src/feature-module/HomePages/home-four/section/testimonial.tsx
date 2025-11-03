import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import CountUp from 'react-countup'

const Testimonial = () => {
    return (
        <>
            {/* Testimonial */}
            <section className="testimonial-sec">
                <div className="container">
                    <div className="testimonial-two-img">
                        <ImageWithBasePath src="assets/img/bg/bg-14.png" alt="Img" className="img-fluid" />
                    </div>
                    <div className="testimonial-subhead-two">
                        <div className="col-md-12" data-aos="fade-down">
                            <div className="testimonial-inner">
                                <div className="section-header text-center">
                                    <h2 data-aos="fade-down">Join over 5 Million Students</h2>
                                    <p>
                                        Get certified, master modern tech skills, and level up your
                                        career{" "}
                                    </p>
                                </div>
                                <div className="row text-center">
                                    <div className="col-md-4 col-sm-12" data-aos="fade-up">
                                        <div className="course-count-two course-count border">
                                            <h4>
                                                <span className="counterUp text-secondary"> <CountUp end={253085} /></span>
                                            </h4>
                                            <p>Students Enrolled</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-12" data-aos="fade-up">
                                        <div className="course-count-two  course-count border">
                                            <h4>
                                                <span className="counterUp text-success"><CountUp end={1205} /></span>
                                            </h4>
                                            <p>Total Courses</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-12" data-aos="fade-up">
                                        <div className="course-count-two  course-count border">
                                            <h4>
                                                <span className="counterUp text-primary"><CountUp end={253085} /></span>
                                            </h4>
                                            <p>Students Worldwide</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Testimonial */}
        </>

    )
}

export default Testimonial
