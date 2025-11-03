import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";

const ComingSoon = () => {

      const [seconds, setSeconds] = useState(60);
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          if (seconds > 0) {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);
        return () => clearInterval(intervalId);
      }, [seconds]);
    
      const formatTime = (time: number) => {
        // Add leading zero for single-digit numbers
        return time < 10 ? `0${time}` : time;
      };

      const route = all_routes

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="error-box coming-soon-content">
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
              <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className="coming-soon-topic">
            <h3 className="h2 mb-3">
              We are Coming<span className="text-secondary ms-1"> Soon!!!</span>
            </h3>
            <p>Stay tuned for something amazing</p>
          </div>
          <ul className="coming-soon-timer">
            <li>
              <span className="days">54</span>days
            </li>
            <li className="seperate-dot" />
            <li>
              <span className="hours">10</span>Hrs
            </li>
            <li className="seperate-dot" />
            <li>
              <span className="minutes">47</span>Min
            </li>
            <li className="seperate-dot" />
            <li>
              <span className="seconds">{formatTime(seconds)}</span>Sec
            </li>
          </ul>
          <div className="error-box-img coming-soon-img">
            <ImageWithBasePath
              src="assets/img/error/coming-soon.svg"
              alt="Img"
              className="img-fluid"
            />
          </div>
          <form className="mt-5">
            <b>Notify me when the website is launched</b>
            <div className="bg-white border rounded-2 p-2 mt-2 mb-3">
              <div className="input-group">
                <input
                  className="form-control focus-shadow-none border-0 me-1"
                  type="email"
                  placeholder="Enter your email"
                />
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 mb-0"
                >
                  Notify Me!
                </button>
              </div>
            </div>
          </form>
          <div className="d-flex align-items-center justify-content-center">
            <Link
              to="#"
              className="coming-soon media-btn rounded-circle d-inline-flex align-items-center justify-content-center me-2"
            >
              <i className="fa-brands fa-facebook-f" />
            </Link>
            <Link
              to="#"
              className="coming-soon media-btn rounded-circle d-inline-flex align-items-center justify-content-center me-2"
            >
              <i className="fa-brands fa-instagram" />
            </Link>
            <Link
              to="#"
              className="coming-soon media-btn rounded-circle d-inline-flex align-items-center justify-content-center me-2"
            >
              <i className="fa-brands fa-x-twitter" />
            </Link>
            <Link
              to="#"
              className="coming-soon media-btn rounded-circle d-inline-flex align-items-center justify-content-center"
            >
              <i className="fa-brands fa-linkedin-in" />
            </Link>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default ComingSoon;
