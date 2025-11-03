import { useState } from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import VideoModal from './videoModal';
import { all_routes } from '../../../router/all_routes';

const Trust = () => {

    const [showModal, setShowModal] = useState(false);
      const videoUrl = 'https://youtu.be/NSAOrGb9orM';
    
      const handleOpenModal = () => setShowModal(true);
      const handleCloseModal = () => setShowModal(false);

      const route = all_routes
  return (
    <>
    {/* trust */}
    <section className="trust-sec">
      <div className="container">
        <div className="video-showcase">
          <ImageWithBasePath
            src="assets/img/feature/feature-1.jpg"
            className="img-fluid w-100 rounded-2"
            alt="banner"
          />
          <div className="video-play">
            <Link to="#" data-fancybox="" onClick={handleOpenModal}>
              <i className="isax isax-play5" />
            </Link>
            <VideoModal show={showModal} handleClose={handleCloseModal} videoUrl={videoUrl} />
          </div>
        </div>
        <div className="trust-content">
          <ImageWithBasePath
            src="./assets/img/bg/bg-19.png"
            alt="img"
            className="w-100 trust-bg"
          />
          <div className="row justify-content-between">
            <div className="col-md-4">
              <h4>
                Trusted by the 15,000+ happy students and online users since 2000
              </h4>
              <div className="d-flex align-items-center flex-wrap mt-5 gap-2">
                <Link to={route.login} className="btn btn-secondary">
                  Enroll as Student
                </Link>
                <Link to={route.becomeAnInstructor} className="btn btn-dark">
                  Apply as Tutor
                </Link>
              </div>
            </div>
            <div className="col-md-7">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="text-white mb-2">9.8/10</h4>
                  <h5 className="text-white mb-2">Course Approval Score</h5>
                  <p className="text-white mb-5">
                    Achieving a complete course approval score is a significant.
                  </p>
                </div>
                <div className="col-md-6">
                  <h4 className="text-white mb-2">13k</h4>
                  <h5 className="text-white mb-2">
                    Satisfied Students Worldwide
                  </h5>
                  <p className="text-white mb-5">
                    Satisfied students worldwide share a common thread of
                    happiness.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white user-goal p-2">
                <div className="avatar avatar-lg flex-shrink-0">
                  <ImageWithBasePath
                    className="rounded-pill"
                    src="./assets/img/user/user-28.jpg"
                    alt="img"
                  />
                </div>
                <p className="text-gray-9 mb-0">
                  “All courses are incredibly help people to achieve their goals”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* /trust */}
  </>
  
  )
}

export default Trust
