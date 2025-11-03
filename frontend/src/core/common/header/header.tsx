import React, { useEffect, useState, useCallback } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { header } from "../data/json/header";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";
import { setDataTheme } from "../../redux/themeSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "../../context/UserContext";
import { notifyApi } from '../../../core/utils/api';
import NotificationPanel from "../../../feature-module/Pages/notification/notification";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenu, setIsMegaMenu] = useState(false);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const [basePath, setBasePath] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const { logout, user } = useUser();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleDataThemeChange = (theme: string) => {
    dispatch(setDataTheme(theme));
  };

  const onHandleMobileMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const onhandleCloseMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const toggleSubsidebar2 = (subitem: any) => {
    if (subitem === subsidebar2) {
      setSubsidebar2("");
    } else {
      setSubsidebar2(subitem);
    }
  };

  // Safe notification count fetch with error handling
  const fetchUnreadCount = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await notifyApi.getUnreadNotificationCount();
      if (response && response.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.warn('Failed to fetch notification count:', error);
      // Silently fail - don't set any state that might cause redirects
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Safe notification polling
  useEffect(() => {
    fetchUnreadCount();
    
    // Only start polling if user is logged in
    if (user) {
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, user]);

  useEffect(() => {
    document.documentElement.setAttribute("class", dataTheme);
  }, [dataTheme]);

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/").filter(Boolean);
    setBasePath(pathArray[0]);
  }, [location.pathname]);

  const DarkButton = () => {
    return (
      <div className={`icon-btn ${location.pathname === '/index' ? '' : 'me-2'}`}>
        <Link
          to="#"
          id="dark-mode-toggle"
          className={`theme-toggle ${dataTheme === 'light' && 'activate'}`}
          onClick={() => handleDataThemeChange("dark-mode")}
        >
          <i className="isax isax-sun-15" />
        </Link>
        <Link
          to="#"
          id="light-mode-toggle"
          className={`theme-toggle ${dataTheme === 'dark-mode' && 'activate'}`}
          onClick={() => handleDataThemeChange("light")}
        >
          <i className="isax isax-moon" />
        </Link>
      </div>
    );
  };

  // Notification button component
  const NotificationButton = () => (
    <div className="icon-btn me-2">
      <button
        className="btn btn-link position-relative p-2"
        onClick={() => setShowNotifications(true)}
        style={{ border: 'none', background: 'transparent', color: 'inherit' }}
        aria-label={`Notifications ${unreadCount > 0 ? `${unreadCount} unread` : ''}`}
        type="button"
      >
        <i className="isax isax-notification" style={{ fontSize: '20px' }} />
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
            style={{
              fontSize: '10px',
              padding: '3px 6px',
              minWidth: '18px'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );

  // Render header based on user role or guest
  const renderHeaderButtons = () => {
    // Home page layout
    if (location.pathname === '/index') {
      return (
        <div className="header-btn d-flex align-items-center">
          <div className="dropdown flag-dropdown icon-btn">
            <Link
              to="#"
              className="d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <ImageWithBasePath src="assets/img/flags/us-flag.svg" alt="flag" />
            </Link>
            {/* <ul className="dropdown-menu p-2 mt-2">
              <li>
                <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                  <ImageWithBasePath src="assets/img/flags/us-flag.svg" className="me-2" alt="flag" />
                  ENG
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                  <ImageWithBasePath src="assets/img/flags/arab-flag.svg" className="me-2" alt="flag" />
                  ARA
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                  <ImageWithBasePath src="assets/img/flags/france-flag.svg" className="me-2" alt="flag" />
                  FRE
                </Link>
              </li>
            </ul> */}
          </div>
          <div className="dropdown icon-btn">
            <Link to="#" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="isax isax-dollar-circle4" />
            </Link>
            {/* <ul className="dropdown-menu p-2 mt-2">
              <li><Link className="dropdown-item rounded" to="#">USD</Link></li>
              <li><Link className="dropdown-item rounded" to="#">YEN</Link></li>
              <li><Link className="dropdown-item rounded" to="#">EURO</Link></li>
            </ul> */}
          </div>
          <DarkButton />
          {user ? (
            // Show user profile dropdown for logged in users on home page
            user.role === 'instructor' ? (
              <div className="dropdown profile-dropdown">
                <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
                  <span className="avatar">
                    <ImageWithBasePath
                      src={user.avatar || "assets/img/user/user-01.jpg"}
                      alt="Img"
                      className="img-fluid rounded-circle"
                    />
                  </span>
                </Link>
                <div className="dropdown-menu dropdown-menu-end">
                  <div className="profile-header d-flex align-items-center">
                    <div className="avatar">
                      <ImageWithBasePath
                        src={user.avatar || "assets/img/user/user-01.jpg"}
                        alt="Img"
                        className="img-rfluid ounded-circle"
                      />
                    </div>
                    <div>
                      <h6>{user.firstName} {user.lastName}</h6>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <ul className="profile-body">
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorDashboard}>
                        <i className="isax isax-monitor me-2" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorCourse}>
                        <i className="isax isax-teacher me-2" />
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium2" to={all_routes.instructorEarning}>
                        <i className="isax isax-dollar-circle me-2" />
                        Earnings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorPayout}>
                        <i className="isax isax-coin me-2" />
                        Payouts
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorMessage}>
                        <i className="isax isax-messages-3 me-2" />
                        Messages<span className="message-count">2</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorsettings}>
                        <i className="isax isax-setting-2 me-2" />
                        Settings
                      </Link>
                    </li>
                  </ul>
                  <div className="profile-footer">
                    <Link to={all_routes.homeone} onClick={handleLogout} className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100">
                      <i className="isax isax-logout me-2" />
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
              ) : user.role === 'admin' ? (
                // Admin dropdown
                <div className="dropdown profile-dropdown">
                  <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
                    <span className="avatar">
                      <ImageWithBasePath
                        src={user.avatar || "assets/img/user/user-01.jpg"}
                        alt="Img"
                        className="img-fluid rounded-circle"
                      />
                    </span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="profile-header d-flex align-items-center">
                      <div className="avatar">
                        <ImageWithBasePath
                          src={user.avatar || "assets/img/user/user-01.jpg"}
                          alt="Img"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div>
                        <h6>{user.firstName} {user.lastName}</h6>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <ul className="profile-body">
                      <li>
                        <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminDashboard}>
                          <i className="isax isax-monitor me-2" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminCourse}>
                          <i className="isax isax-teacher me-2" />
                          Courses
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium2" to={all_routes.adminEarning}>
                          <i className="isax isax-dollar-circle me-2" />
                          Earnings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminMessage}>
                          <i className="isax isax-messages-3 me-2" />
                          Messages<span className="message-count">2</span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminsettings}>
                          <i className="isax isax-setting-2 me-2" />
                          Settings
                        </Link>
                      </li>
                    </ul>
                    <div className="profile-footer">
                      <Link to={all_routes.homeone} onClick={handleLogout} className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100">
                        <i className="isax isax-logout me-2" />
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              ): (
              <div className="dropdown profile-dropdown">
                <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
                  <span className="avatar">
                    <ImageWithBasePath
                      src={user.avatar || "assets/img/user/user-02.jpg"}
                      alt="Img"
                      className="img-fluid rounded-circle"
                    />
                  </span>
                </Link>
                <div className="dropdown-menu dropdown-menu-end">
                  <div className="profile-header d-flex align-items-center">
                    <div className="avatar">
                      <ImageWithBasePath
                        src={user.avatar || "assets/img/user/user-02.jpg"}
                        alt="Img"
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    <div>
                      <h6>{user.firstName} {user.lastName}</h6>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="profile-actions p-3 border-bottom">
                    <Link 
                      to={all_routes.resumeCourses} 
                      className="btn btn-white rounded-pill me-3 d-inline-flex align-items-center justify-content-center w-100 mb-2"
                      style={{border: '1px solid #000'}}
                    >
                      <i className="isax isax-play-circle me-2" />
                      Continue Learning
                    </Link>
                  </div>
                  <ul className="profile-body">
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentCertificates}>
                    <img
                      src={'/assets/img/icon/dashboard-cert.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Claim Certificates
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentDashboard}>
                    <img
                      src={'/assets/img/icon/dashboard-dashboard.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentQuiz}>
                    <img
                      src={'/assets/img/icon/dashboard-quiz.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Quiz Attempts
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentMessage}>
                    <img
                      src={'/assets/img/icon/dashboard-message.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Messages
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentSettings}>
                    <img
                      src={'/assets/img/icon/dashboard-setting.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Settings
                  </Link>
                </li>
                  </ul>
                  <div className="profile-footer">
                    <Link to={all_routes.homeone} onClick={handleLogout} className="dropdown-item d-inline-flex align-items-center rounded fw-medium">
                      <img
                          src={'/assets/img/icon/dashboard-logout.svg'}
                          className="img-fluid me-2 rounded-2"
                        />
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            )
          ) : (
            <>
              <Link to={all_routes.login} className="btn btn-primary d-inline-flex align-items-center me-2">
                Sign&nbsp;In
              </Link>
              <Link to={all_routes.register} className="btn btn-secondary me-0">
                Register
              </Link>
            </>
          )}
        </div>
      );
    }

    // Admin layout
    if (user && user.role === 'admin') {
      return (
        <div className="header-btn d-flex align-items-center">
          <DarkButton />
          <NotificationButton />
          <div className="dropdown profile-dropdown">
            <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
              <span className="avatar">
                <ImageWithBasePath
                  src={user.avatar || "assets/img/user/user-01.jpg"}
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="profile-header d-flex align-items-center">
                <div className="avatar">
                  <ImageWithBasePath
                    src={user.avatar || "assets/img/user/user-01.jpg"}
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div>
                  <h6>{user.firstName} {user.lastName}</h6>
                  <p>{user.email}</p>
                </div>
              </div>
              <ul className="profile-body">
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminDashboard}>
                    <i className="isax isax-monitor me-2" />
                    Dashboard
                  </Link>
                </li>
                {/* <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminProfile}>
                    <i className="isax isax-security-user me-2" />
                    My Profile
                  </Link>
                </li> */}
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminCourse}>
                    <i className="isax isax-teacher me-2" />
                    Courses
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium2" to={all_routes.adminEarning}>
                    <i className="isax isax-dollar-circle me-2" />
                    Earnings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminMessage}>
                    <i className="isax isax-messages-3 me-2" />
                    Messages<span className="message-count">2</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.adminsettings}>
                    <i className="isax isax-setting-2 me-2" />
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="profile-footer">
                <Link to={all_routes.homeone} onClick={handleLogout} className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100">
                  <i className="isax isax-logout me-2" />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Instructor layout
    if (user && user.role === 'instructor') {
      return (
        <div className="header-btn d-flex align-items-center">
          <DarkButton />
          <NotificationButton />
          <div className="dropdown profile-dropdown">
            <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
              <span className="avatar">
                <ImageWithBasePath
                  src={user.avatar || "assets/img/user/user-01.jpg"}
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="profile-header d-flex align-items-center">
                <div className="avatar">
                  <ImageWithBasePath
                    src={user.avatar || "assets/img/user/user-01.jpg"}
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div>
                  <h6>{user.firstName} {user.lastName}</h6>
                  <p>{user.email}</p>
                </div>
              </div>
              <ul className="profile-body">
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorDashboard}>
                    <i className="isax isax-monitor me-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorCourse}>
                    <i className="isax isax-teacher me-2" />
                    Courses
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium2" to={all_routes.instructorEarning}>
                    <i className="isax isax-dollar-circle me-2" />
                    Earnings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorPayout}>
                    <i className="isax isax-coin me-2" />
                    Payouts
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorMessage}>
                    <i className="isax isax-messages-3 me-2" />
                    Messages<span className="message-count">2</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.instructorsettings}>
                    <i className="isax isax-setting-2 me-2" />
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="profile-footer">
                <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.login}>
                  <i className="isax isax-arrow-2 me-2" />
                  Log in as Student
                </Link>
                <Link to={all_routes.homeone} onClick={handleLogout} className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100">
                  <i className="isax isax-logout me-2" />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Student layout
    if (user && user.role === 'student') {
      return (
        <div className="header-btn d-flex align-items-center">
          <Link 
            to={all_routes.resumeCourses} 
            className="btn btn-white rounded-pill me-3 d-inline-flex align-items-center me-2"
            style={{ 
              fontSize: '14px', 
              padding: '8px 16px',
              whiteSpace: 'nowrap',
              border: '1px solid #000',
            }}
          >
            <i className="isax isax-play-circle me-1" />
            Continue Learning
          </Link>
          <DarkButton />
          <NotificationButton />
          <div className="dropdown profile-dropdown">
            <Link to="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
              <span className="avatar">
                <ImageWithBasePath
                  src={user.avatar || "assets/img/user/user-02.jpg"}
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="profile-header d-flex align-items-center">
                <div className="avatar">
                  <ImageWithBasePath
                    src={user.avatar || "assets/img/user/user-02.jpg"}
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div>
                  <h6>{user.firstName} {user.lastName}</h6>
                  <p>{user.email}</p>
                </div>
              </div>
              <ul className="profile-body">
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentCertificates}>
                    <img
                      src={'/assets/img/icon/dashboard-cert.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Claim Certificates
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentDashboard}>
                    <img
                      src={'/assets/img/icon/dashboard-dashboard.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentQuiz}>
                    <img
                      src={'/assets/img/icon/dashboard-quiz.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Quiz Attempts
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentMessage}>
                    <img
                      src={'/assets/img/icon/dashboard-message.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Messages
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-inline-flex align-items-center rounded fw-medium" to={all_routes.studentSettings}>
                    <img
                      src={'/assets/img/icon/dashboard-setting.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="profile-footer">
                <Link to={all_routes.homeone} onClick={handleLogout} className="dropdown-item d-inline-flex align-items-center rounded fw-medium">
                  <img
                      src={'/assets/img/icon/dashboard-logout.svg'}
                      className="img-fluid me-2 rounded-2"
                    />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Guest layout (not logged in)
    return (
      <div className="header-btn d-flex align-items-center">
        <DarkButton />
        
        <Link to={all_routes.login} className="btn btn-light d-inline-flex align-items-center me-2">
          <i className="isax isax-lock-circle me-2" />
          Sign&nbsp;In
        </Link>
        <Link to={all_routes.register} className="btn btn-secondary me-0">
          <i className="isax isax-user-edit me-2" />
          Register
        </Link>
      </div>
    );
  };

  return (
    <>
      {/* Header Topbar*/}
      {location.pathname === '/index' ? null : (
        <div className="header-topbar text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                  {/* <p className="d-flex align-items-center fw-medium fs-14 mb-2 me-3">
                    <i className="isax isax-location5 me-2" />
                    1442 Crosswind Drive Madisonville
                  </p>
                  <p className="d-flex align-items-center fw-medium fs-14 mb-2">
                    <i className="isax isax-call-calling5 me-2" />
                    +1 45887 77874
                  </p> */}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-end">
                  <div className="dropdown flag-dropdown mb-2 me-3">
                    <Link to="#" className="d-inline-flex align-items-center me-3" data-bs-toggle="dropdown" aria-expanded="false">
                      <ImageWithBasePath src="assets/img/flags/us-flag.svg" className="me-2" alt="flag" />
                      ENG
                    </Link>
                    {/* <ul className="dropdown-menu p-2 mt-2">
                      <li>
                        <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                          <ImageWithBasePath src="assets/img/flags/us-flag.svg" className="me-2" alt="flag" />
                          ENG
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                          <ImageWithBasePath src="assets/img/flags/arab-flag.svg" className="me-2" alt="flag" />
                          ARA
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item rounded d-flex align-items-center" to="#">
                          <ImageWithBasePath src="assets/img/flags/france-flag.svg" className="me-2" alt="flag" />
                          FRE
                        </Link>
                      </li>
                    </ul> */}
                  </div>
                  {/* <div className="dropdown mb-2 me-3">
                    <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      USD
                    </Link>
                    <ul className="dropdown-menu p-2 mt-2">
                      <li><Link className="dropdown-item rounded" to="#">USD</Link></li>
                      <li><Link className="dropdown-item rounded" to="#">YEN</Link></li>
                      <li><Link className="dropdown-item rounded" to="#">EURO</Link></li>
                    </ul>
                  </div> */}
                  <ul className="social-icon d-flex align-items-center mb-2">
                    <li className="me-2"><Link to="https://www.facebook.com/pages/?category=top&ref=bookmarks"><i className="fa-brands fa-facebook-f" /></Link></li>
                    <li className="me-2"><Link to="https://www.instagram.com/zyrualearning/"><i className="fa-brands fa-instagram" /></Link></li>
                    <li className="me-2"><Link to="https://x.com/learning73864"><i className="fa-brands fa-x-twitter" /></Link></li>
                    <li className="me-2"><Link to="#"><i className="fa-brands fa-youtube" /></Link></li>
                    <li><Link to="https://www.linkedin.com/onboarding/start/people-you-may-know/new/?source=coreg"><i className="fa-brands fa-linkedin" /></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Header Topbar*/}

      {/* Header */}
      <header className={`${location.pathname === '/index' ? 'header-five header-two' : 'header-two'} ${scrolled ? "fixed" : ""}`}>
        <div className="container">
          <div className="header-nav">
            <div className="navbar-header">
              <Link id="mobile_btn" to="#" onClick={() => onHandleMobileMenu()}>
                <span className="bar-icon">
                  <i className="isax isax-menu"></i>
                </span>
              </Link>
              <div className="navbar-logo">
                <Link className="logo-white header-logo" to={all_routes.homeone}>
                  <ImageWithBasePath src="assets/img/logo.svg" className="logo" alt="Logo" style={{maxHeight: "80px", minHeight: "80px", marginTop: "10px;"}} />
                </Link>
                <Link className="logo-dark header-logo" to={all_routes.homeone}>
                  <ImageWithBasePath src="assets/img/logo.svg" className="logo" alt="Logo" style={{maxHeight: "80px", minHeight: "80px", marginTop: "10px;"}} />
                </Link>
              </div>
            </div>
            <div className={`main-menu-wrapper ${isMegaMenu ? 'active' : ''}`}>
              <div className="menu-header">
                <Link to={all_routes.homeone} className="menu-logo">
                  <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
                </Link>
                <Link id="menu_close" className="menu-close" to="#" onClick={() => onhandleCloseMenu()}>
                  <i className="fas fa-times" />
                </Link>
              </div>
              <ul className={`main-nav ${isMegaMenu ? 'active' : ''}`}>
                {header.map((mainMenus: any, mainIndex) => (
                  <React.Fragment key={mainIndex}>
                    {mainMenus.separateRoute ? (
                      <li
                        key={mainIndex}
                        className={`has-submenu megamenu ${location.pathname.includes('index') ? "active" : ""}`}
                        onClick={() => toggleSidebar(mainMenus.tittle)}
                        onMouseOver={() => setIsMegaMenu(true)}
                        onMouseLeave={() => setIsMegaMenu(false)}
                      >
                        <Link to='#'>{mainMenus.tittle}<i className={`${basePath === 'instructor' || basePath === 'admin' || basePath === 'student' ? "isax isax-add" : "fas fa-chevron-down"}`} /></Link>
                        <ul className={`submenu mega-submenu ${subOpen === mainMenus.tittle ? "d-block" : ""}`} onMouseOver={() => setIsMegaMenu(true)} onMouseLeave={() => setIsMegaMenu(false)}>
                          <li>
                            <div className="megamenu-wrapper">
                              <div className="row">
                                {mainMenus.menu.map((menu: any, idx: any) => (
                                  <div className="col-lg-2" key={idx}>
                                    <div className={`single-demo ${location.pathname === menu.route ? 'active' : ''}`}>
                                      <div className="demo-img">
                                        <Link to={menu.route} className="inner-demo-img">
                                          <ImageWithBasePath src={menu.img} className="img-fluid" alt="img" />
                                        </Link>
                                      </div>
                                      <div className="demo-info">
                                        <Link to={menu.route} className="inner-demo-img">
                                          {menu.menuValue}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        </ul>

                      </li>
                    ) : (
                      <li className={`has-submenu ${mainMenus?.menu?.some((item: any) => item?.route?.includes(location.pathname)) || basePath === mainMenus.base || basePath === mainMenus.base2 ? "active" : ""}`}>
                        <Link to="#" onClick={() => toggleSidebar(mainMenus.tittle)}>
                          {mainMenus.tittle}{" "}
                          <i className={`${basePath === 'instructor' || basePath === 'admin' || basePath === 'student' ? "isax isax-add" : "fas fa-chevron-down"}`}></i>
                        </Link>
                        <ul className={`submenu ${subOpen === mainMenus.tittle ? "d-block" : ""}`}>
                          {mainMenus.menu?.map((menu: any, menuIndex: any) => (
                            <React.Fragment key={`${mainIndex}-${menuIndex}`}>
                              {menu.hasSubRoute ? (
                                <li key={`${mainIndex}-${menuIndex}`} className={`${menu.hasSubRoute ? "has-submenu" : ""} ${menu?.subMenus?.some((item: any) => item?.route?.includes(location.pathname)) || basePath === menu.base ? "active" : ""}`}>
                                  <Link to="#" className={`hideonmob`} onClick={() => { toggleSubsidebar(menu.menuValue) }}>{menu.menuValue}</Link>
                                  <ul className={`submenu showonmob ${subsidebar === menu.menuValue ? "d-block" : ""}`}>
                                    {menu.subMenus?.map((subMenu: any, subMenuIndex: any) => (
                                      <React.Fragment key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}>
                                        {subMenu.hasSubRoute ?
                                          <li className={`${menu.hasSubRoute ? "has-submenu" : ""} ${subMenu?.subMenus?.some((item: any) => item?.route?.includes(location.pathname)) ? "active" : ""}`}>
                                            <Link to="#" onClick={() => { toggleSubsidebar2(subMenu.menuValue) }}>{subMenu.menuValue}</Link>
                                            <ul className={`submenu ${subsidebar2 === subMenu.menuValue ? "d-block" : ""}`}>
                                              {subMenu.subMenus?.map((menu: any, menuIndex2: any) => (
                                                <li key={menuIndex2} className={location.pathname === menu.route ? 'active' : ''}><Link to={menu.route}>{menu.menuValue}</Link></li>
                                              ))}
                                            </ul>
                                          </li>
                                          :
                                          <li className={location.pathname === subMenu.route ? 'active' : ''} key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}>
                                            <Link to={subMenu.route}>
                                              {subMenu.menuValue}
                                            </Link>
                                          </li>
                                        }
                                      </React.Fragment>
                                    ))}
                                  </ul>
                                </li>
                              ) : (
                                <li key={`${mainIndex}-${menuIndex}`} className={location.pathname.includes(menu.route || "") ? "active" : ""}>
                                  <Link to={menu.route}>{menu.menuValue}</Link>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                  ))
                }
              </ul>
              {/* Add Mobile Login/Register Buttons */}
              <div className="mobile-auth-buttons d-lg-none">
                {!user ? (
                  <div className="d-flex flex-column gap-2 p-3">
                    <Link 
                      to={all_routes.login} 
                      className="btn btn-primary d-inline-flex align-items-center justify-content-center"
                      onClick={() => onhandleCloseMenu()}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to={all_routes.register} 
                      className="btn btn-secondary d-inline-flex align-items-center justify-content-center"
                      onClick={() => onhandleCloseMenu()}
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mobile-user-info p-3 border-top">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar me-3">
                        <ImageWithBasePath
                          src={user.avatar || "assets/img/user/user-01.jpg"}
                          alt="User"
                          className="img-rfluid rounded-circle"
                        />
                      </div>
                      <div>
                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                    {user.role === 'student' && (
                      <Link 
                        to={all_routes.resumeCourses} 
                        className="btn btn-white rounded-pill me-3 d-inline-flex align-items-center justify-content-center w-100 mb-2"
                        style={{border: '1px solid #000'}}
                        onClick={() => onhandleCloseMenu()}
                      >
                        <i className="isax isax-play-circle me-2"></i>
                        Continue Learning
                      </Link>
                    )}
                    <Link 
                      to={all_routes.homeone} 
                      className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                      onClick={(e) => {
                        onhandleCloseMenu();
                        handleLogout(e);
                      }}
                    >
                      <i className="isax isax-logout me-2"></i>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {renderHeaderButtons()}
          </div>
        </div>
      </header>
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      {/* /Header */}
    </>
  )
}
  
export default Header