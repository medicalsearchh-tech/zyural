import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Error500 = () => {

    const route = all_routes

  return (
    <>
      <>
        {/* Main Wrapper */}
        <div className="main-wrapper">
          <div className="error-box">
            <ImageWithBasePath
              src="assets/img/error/img-01.svg"
              alt="img"
              className="img-fluid bg-01"
            />
             <ImageWithBasePath
              src="assets/img/error/img-02.svg"
              alt="img"
              className="img-fluid bg-02"
            />
             <ImageWithBasePath
              src="assets/img/error/img-03.svg"
              alt="img"
              className="img-fluid bg-03"
            />
             <ImageWithBasePath
              src="assets/img/error/img-04.svg"
              alt="img"
              className="img-fluid bg-04"
            />
             <ImageWithBasePath
              src="assets/img/error/img-05.svg"
              alt="img"
              className="img-fluid bg-05"
            />
             <ImageWithBasePath
              src="assets/img/error/img-06.svg"
              alt="img"
              className="img-fluid bg-06"
            />
            <div className="error-logo">
              <Link to={route.homeone}>
                 <ImageWithBasePath
                  src="assets/img/logo.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="error-box-img">
               <ImageWithBasePath
                src="assets/img/error/error-02.svg"
                alt="Img"
                className="img-fluid"
              />
            </div>
            <h3 className="h2 mb-3">
              Oops! 500 Internal
              <span className="text-secondary ms-1"> Server Error</span>
            </h3>
            <p className="h4 font-weight-normal">
              We apologise and are fixing the problem. Please try again at a
              later stage
            </p>
            <Link
              to={route.homeone}
              className="btn back-to-home-btn d-inline-flex align-items-center"
            >
              <i className="isax isax-arrow-left-2 me-1" /> Back to Home
            </Link>
          </div>
        </div>
        {/* /Main Wrapper */}
      </>
    </>
  );
};

export default Error500;
