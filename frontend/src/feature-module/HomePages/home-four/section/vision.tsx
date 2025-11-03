import ImageWithBasePath from '../../../../core/common/imageWithBasePath'

const Vision = () => {
    return (
        <>
            {/* Vision Section */}
            <div className="vision-section">
                <div className="container">
                    <div className="row row-gap-4">
                        <div className="col-xl-3 col-lg-6 d-flex">
                            <div className="vision-item flex-fill">
                                <span className="vision-icon border">
                                    <ImageWithBasePath src="assets/img/icons/vision-icon-01.svg" alt="img" />
                                </span>
                                <p>Get certified with 100+ certification courses</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 d-flex">
                            <div className="vision-item flex-fill">
                                <span className="vision-icon border">
                                    <ImageWithBasePath src="assets/img/icons/vision-icon-02.svg" alt="img" />
                                </span>
                                <p>Keep up with the latest in cloud</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 d-flex">
                            <div className="vision-item flex-fill">
                                <span className="vision-icon border">
                                    <ImageWithBasePath src="assets/img/icons/vision-icon-03.svg" alt="img" />
                                </span>
                                <p>Build skills your way, from labs to courses</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 d-flex">
                            <div className="vision-item flex-fill">
                                <span className="vision-icon border">
                                    <ImageWithBasePath src="assets/img/icons/vision-icon-04.svg" alt="img" />
                                </span>
                                <p>Stay motivated with engaging instructors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Vision Section */}
        </>

    )
}

export default Vision
