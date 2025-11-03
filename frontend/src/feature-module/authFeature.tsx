import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthFeature = () => {
  const location = useLocation();
  const [isError, setIsError] = React.useState(false)
  useEffect(() => {
    const layoutPages = location.pathname === "/under-maintenance" || location.pathname === "/error-404" || location.pathname === "/error-500"
    if (layoutPages) {
      document.body.classList.add('bg-primary-transparent')
      setIsError(true)
    } else {
      setIsError(false)
      document.body.classList.remove('bg-primary-transparent')
    }

    return () => {
      document.body.classList.remove('bg-primary-transparent')
    }
  }, [location.pathname])

  const comingSoon = location.pathname === "/pages/coming-soon"

  return (
    <>
      {isError ?
        <Outlet />
        :
        <div className={`"main-wrapper authentication-wrapper" ${comingSoon ? 'coming-soon-wrapper' : ''}`}>
          <div className="container-fuild">
            <Outlet />
          </div>
        </div>}

    </>
  );
};

export default AuthFeature;
