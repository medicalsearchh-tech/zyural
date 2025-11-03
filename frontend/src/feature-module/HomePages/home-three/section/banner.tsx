import React from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { BannerSelect } from '../../../../core/common/selectOption/json/selectOption'
import CustomSelect from '../../../../core/common/commonSelect'
import CountUp from 'react-countup'
import { all_routes } from '../../../router/all_routes'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const route = all_routes
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        const Path = route.courseList; 
        navigate(Path);
      };
    return (
        <>
            {/* Home Banner */}
            <section className="banner-section-three d-flex align-items-center">
                <ImageWithBasePath
                    src="assets/img/bg/bg-3.png"
                    alt="img"
                    className="img-fluid banner-bg-01"
                />
                <ImageWithBasePath
                    src="assets/img/bg/bg-4.png"
                    alt="img"
                    className="img-fluid banner-bg-02"
                />
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="home-slide-face aos" data-aos="fade-up">
                                <div className="home-slide-text ">
                                    <span className="fw-bold text-uppercase">
                                        The Leader in Online Learning
                                    </span>
                                    <h1 className="mt-4">
                                        Engaging &amp; Accessible{" "}
                                        <span className="text-secondary">Online Courses</span> For All
                                    </h1>
                                    <p className="mt-4">
                                        Our specialized online courses are designed to bring the
                                        classroom experience to you, no matter where you are.
                                    </p>
                                </div>
                                <div className="banner-content">
                                    <form onSubmit={handleSubmit} className="form">
                                        <div className="form-inner">
                                            <div className="input-group">
                                                <i className="fa-solid fa-magnifying-glass search-icon" />
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Search School, Online eductional centers, etc"
                                                />
                                                <span className="drop-detail">
                                                    <CustomSelect
                                                        options={BannerSelect}
                                                        className="select d-flex"
                                                        placeholder="Select"
                                                    />
                                                </span>
                                                <button className="btn sub-btn" type="submit">
                                                    <i className="fas fa-arrow-right" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="trust-user">
                                    <h5>Trusted by over 15K Users worldwide since 2022</h5>
                                    <div className="trust-rating d-flex align-items-center">
                                        <div className="rate-head">
                                            <h2>
                                                <span><CountUp end={1000} /></span>+
                                            </h2>
                                        </div>
                                        <div className="rating d-flex align-items-center">
                                            <h2 className="d-inline-block average-rating">4.4</h2>
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                            <i className="fas fa-star filled" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex align-items-center">
                            <div className="banner-image aos" data-aos="fade-up">
                                <ImageWithBasePath src="assets/img/hero/hero-2.png" alt="Img" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Home Banner */}

            <div className="section student-course">
                <div className="container">
                    <div className="course-widget">
                        <div className="row row-gap-4">
                            <div className="col-lg-3 col-md-6 d-flex">
                                <div className="expert-item flex-fill aos" data-aos="fade-up">
                                    <div className="expert-img">
                                        <ImageWithBasePath src="assets/img/icons/icon-24.svg" alt="Img" />
                                    </div>
                                    <div className="expert-content">
                                        <h4>
                                            <span className="counterup"><CountUp end={10}/>10</span>K
                                        </h4>
                                        <p>Online Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex">
                                <div className="expert-item flex-fill aos" data-aos="fade-up">
                                    <div className="expert-img">
                                        <ImageWithBasePath src="assets/img/icons/icon-25.svg" alt="Img" />
                                    </div>
                                    <div className="expert-content">
                                        <h4>
                                            <span className="counterup"><CountUp end={200}/></span>K
                                        </h4>
                                        <p>Expert Tutors</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex">
                                <div className="expert-item flex-fill aos" data-aos="fade-up">
                                    <div className="expert-img">
                                        <ImageWithBasePath src="assets/img/icons/icon-26.svg" alt="Img" />
                                    </div>
                                    <div className="expert-content">
                                        <h4>
                                            <span className="counterup"><CountUp end={6} /></span>K
                                        </h4>
                                        <p>Ceritified Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 d-flex">
                                <div className="expert-item flex-fill aos" data-aos="fade-up">
                                    <div className="expert-img">
                                        <ImageWithBasePath src="assets/img/icons/icon-27.svg" alt="Img" />
                                    </div>
                                    <div className="expert-content">
                                        <h4>
                                            <span className="counterup"><CountUp end={60} /></span>K
                                        </h4>
                                        <p>Online Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Banner
