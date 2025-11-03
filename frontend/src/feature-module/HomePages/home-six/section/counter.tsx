import CountUp from 'react-countup'

const Counter = () => {
    return (
        <>
            {/* Counter Five*/}
            <section className="counter-section-five">
                <div className="container">
                    <div className="row align-items-center text-center justify-content-between">
                        {/* col */}
                        <div className="col-lg-3 col-md-3 col-sm-12" data-aos="fade-down">
                            <div className="count-five">
                                <div className="count-content-five course-count ms-0">
                                    <h4>
                                        <span className="counterUp"> <CountUp end={145} /> </span>
                                    </h4>
                                    <p className="mb-0">Expert Tutors</p>
                                </div>
                            </div>
                        </div>
                        {/*/ col */}
                        {/* col */}
                        <div className="col-lg-3 col-md-3 col-sm-12" data-aos="fade-down">
                            <div className="count-five">
                                <div className="count-content-five course-count ms-0">
                                    <h4>
                                        <span className="counterUp"> <CountUp end={23495}/> </span>
                                    </h4>
                                    <p className="mb-0">Cetified Courses</p>
                                </div>
                            </div>
                        </div>
                        {/*/ col */}
                        {/* col */}
                        <div className="col-lg-3 col-md-3 col-sm-12" data-aos="fade-down">
                            <div className="count-five">
                                <div className="count-content-five course-count ms-0">
                                    <h4>
                                        <span className="counterUp"><CountUp end={20}/></span>+
                                    </h4>
                                    <p className="mb-0">Online students</p>
                                </div>
                            </div>
                        </div>
                        {/*/ col */}
                        {/* col */}
                        <div className="col-lg-3 col-md-3 col-sm-12" data-aos="fade-down">
                            <div className="count-five count-five-last count-five-0">
                                <div className="count-content-five course-count ms-0">
                                    <h4>
                                        <span className="counterUp"><CountUp end={58370}/></span>
                                    </h4>
                                    <p className="mb-0">Online Courses</p>
                                </div>
                            </div>
                        </div>
                        {/*/ col */}
                    </div>
                </div>
            </section>
            {/* /Counter Five*/}
        </>

    )
}

export default Counter
