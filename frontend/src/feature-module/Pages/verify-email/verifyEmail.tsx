import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { authApi } from "../../../core/utils/api";
import { toast } from "react-toastify";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const route = all_routes;

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        if (res.success) {
          setStatus("success");
          setMessage("🎉 Your email has been verified successfully!");
          toast.success("🎉 Your email has been verified successfully!");

          setTimeout(() => {
            navigate(route.login);
          }, 1000);

        } else {
          setStatus("error");
          setMessage(res.message || "Verification failed.");
          toast.error(res.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Server error. Please try again later.");
        toast.error("Server error. Please try again later.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="">
      <div className="d-flex justify-content-center align-items-center">
        {status === "loading" && (
            <div className="mb-5 p-5">
                <div className="text-center text-black">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                </div>
            </div>
        )}

        {status === "success" && (
          <div>
            <div className="main-wrapper" style={{height: "100vh"}}>
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
                    
                    </div>
                    <h3 className="h2 mb-3 mt-5">
                    {" "}
                    {message}
                    </h3>
                    <p className="h4 font-weight-normal">
                    You can now log in and start using your account 🚀
                    </p>
                    <Link to={route.login} className="btn back-to-home-btn">
                    <i className="isax isax-arrow-left-2 me-1" /> Login
                    </Link>
                </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="main-wrapper" style={{height: "100vh"}}>
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
                
                </div>
                <h3 className="h2 mb-3 mt-5">
                {" "}
                {message}
                </h3>
                <p className="h4 font-weight-normal">
                The link may have expired or already been used.
                </p>
                <Link to={route.homeone} className="btn back-to-home-btn">
                <i className="isax isax-arrow-left-2 me-1" /> Back to Home
                </Link>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
