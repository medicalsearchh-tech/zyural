import React from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import CustomSelect from '../../../../core/common/commonSelect'
import { BannerSelectfour } from '../../../../core/common/selectOption/json/selectOption'
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
            <section className="banner-section-four d-flex align-items-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12" data-aos="fade-up">
                            <div className="home-slide-face">
                                <div className="banner-content">
                                    <h6>The Leader in Online Learning</h6>
                                    <h1>Engaging &amp; Accessible Online Courses For All</h1>
                                    <p>
                                        Our specialized online courses are designed to bring the
                                        classroom experience to you, no matter where you are.
                                    </p>
                                </div>
                                <div className="banner-form">
                                    <form
                                    onSubmit={handleSubmit}
                                        className="form"
                                        name="store"
                                        id="store"
                                        method="post"
                                    >
                                        <div className="form-inner1">
                                            <div className="input-group">
                                                <span className="drop-detail">
                                                    <CustomSelect
                                                        options={BannerSelectfour}
                                                        className="select d-flex"
                                                        placeholder="Select"
                                                    />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search for Courses, Instructors"
                                                />
                                                <button
                                                    className="btn btn-secondary sub-btn1"
                                                    type="submit"
                                                >
                                                    <i className="fa-solid fa-magnifying-glass me-2" />
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="trust-user">
                                    <p>Trusted by over 15K Users worldwide since 2024</p>
                                    <div className="rating">
                                        <i className="fas fa-star filled" />
                                        <i className="fas fa-star filled" />
                                        <i className="fas fa-star filled" />
                                        <i className="fas fa-star filled" />
                                        <i className="fas fa-star filled" />
                                        <span>4.9 / 200 Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="banner-image">
                                <div className="row position-relative">
                                    <div className="logo-cover">
                                        <ImageWithBasePath
                                            src="assets/img/icons/icon-30.svg"
                                            alt="img"
                                            className="img-fluid img-05 d-none d-xl-flex aos"
                                            data-aos="zoom-in"
                                        />
                                    </div>
                                    <div className="col-md-6 d-flex">
                                        <div className="flex-fill">
                                            <ImageWithBasePath
                                                src="assets/img/hero/hero-3.jpg"
                                                alt="img"
                                                className="img-fluid h-100 flex-fill img-01 aos"
                                                data-aos="fade-bottm"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex flex-column">
                                        <div className="flex-fill mb-3">
                                            <ImageWithBasePath
                                                src="assets/img/hero/hero-4.jpg"
                                                alt="img"
                                                className="img-fluid img-02 aos"
                                                data-aos="fade-down"
                                            />
                                        </div>
                                        <div className="flex-fill">
                                            <ImageWithBasePath
                                                src="assets/img/hero/hero-5.jpg"
                                                alt="img"
                                                className="img-fluid img-03 aos"
                                                data-aos="fade-up"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Shapes */}
                    <div className="shapes">
                        <ImageWithBasePath className="shapes-one" src="assets/img/bg/bg-10.png" alt="Img" />
                        <ImageWithBasePath className="shapes-two" src="assets/img/bg/bg-11.png" alt="Img" />
                        <ImageWithBasePath
                            className="shapes-middle"
                            src="assets/img/bg/bg-12.png"
                            alt="Img"
                        />
                    </div>
                    {/* /Shapes */}
                </div>
            </section>
            {/* /Home Banner */}
        </>

    )
}

export default Banner
