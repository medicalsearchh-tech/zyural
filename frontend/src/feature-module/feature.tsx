import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Header from "../core/common/header/header";
import BackToTop from "../core/common/backtotop/backToTop";
import Footer from "../core/common/footer/footer";

const Feature = () => {

  const location = useLocation();
 

  useEffect(() => {

    window.scrollTo(0, 0);
  }, [location.pathname])
  
  return (
    <>
 
    <div className="main-wrapper">
    <div className={location.pathname === '/index-3' ? 'home-3' : location.pathname === '/index-4' ? 'home-4' : location.pathname === '/index-6' ? 'home-six' : ''}>
            <Header/>
            <Outlet />
            {location.pathname === '/index' || location.pathname === '/index-3' || location.pathname === '/index-4' 
        || location.pathname === '/index-5' || location.pathname === '/index-6' ? <></>:<Footer/>}
            
            <BackToTop/>
          </div>

      <div className="sidebar-overlay"></div>
    </div>
    </>
  );
};

export default Feature;
