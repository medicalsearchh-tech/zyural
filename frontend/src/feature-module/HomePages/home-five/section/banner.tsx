// import React from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
// import CustomSelect from '../../../../core/common/commonSelect'
// import { BannerSelect } from '../../../../core/common/selectOption/json/selectOption'
// import { all_routes } from '../../../router/all_routes'
// import { useNavigate } from 'react-router-dom'

const Banner = () => {
    // const route = all_routes
    // const navigate = useNavigate();
    // const handleSubmit = (event: React.FormEvent) => {
    //     event.preventDefault(); 
    //     const Path = route.courseList; 
    //     navigate(Path);
    //   };
    return (
        <>
            {/* Home Banner */}
            <section className="banner-five mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div
                            className="col-xl-6 col-lg-7 col-md-12 d-flex col-12"
                            data-aos="fade-down"
                        >
                            <div className="home-five-slide-face flex-fill">
                                <div className="home-five-slide-text">
                                    <span className="text-white d-inline-block bg-secondary small rounded-pill px-3 py-2 mb-3 mb-sm-4">
                                        <span className="badge bg-white text-secondary rounded-pill me-1">
                                            New
                                        </span>
                                        🎯 94% Career Success Rate
                                    </span>
                                    <h1>
                                        Learn Today, Lead Tomorrow <span>&amp;</span> Your Career Transformation Starts Here
                                    </h1>
                                    <p>
                                        From beginner to pro with our immersive learning paths. Real skills for real careers.
                                    </p>
                                </div>
                                <div className="banner-three-content">
                                    
                                </div>
                            </div>
                        </div>
                        <div
                            className="offset-lg-1 col-lg-5 col-12 text-center"
                            data-aos="fade-up"
                        >
                            <div className="banner-slide-img flex-fill aos">
                                <ImageWithBasePath
                                    className="img-fluid ps-lg-5"
                                    src="assets/img/hero/hero-6.png"
                                    alt="Img"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Home Banner */}
        </>

    )
}

export default Banner
