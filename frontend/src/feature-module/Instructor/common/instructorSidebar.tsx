import { instructorSidebarData } from '../../../core/common/data/json/instructor-sidebar'
import { Link, useLocation } from 'react-router-dom'
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext'

const InstructorSidebar = () => {
  const location = useLocation();
  const { logout } = useUser();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  return (
    <div className="col-lg-3 ">
    <div className="settings-sidebar mb-lg-0 theiaStickySidebar">
      <div>
        <h6 className="mb-3">Main Menu</h6>
        <ul className="mb-3 pb-1">
          {instructorSidebarData.map((menu:any ,index:any)=>(
            <li key={index}>
            <Link
              to={menu.route}
              className={`d-inline-flex align-items-center ${location.pathname === menu.route || location.pathname === menu.subRoute  ? 'active' : ''}`}
            >
              <i className={`${menu.icon} me-2`} />
              {menu.title}
            </Link>
          </li>
          ))}
          
        </ul>
        <hr />
        <h6 className="mb-3">Account Settings</h6>
        <ul>
          <li>
            <Link
              to={all_routes.instructorsettings}
              className={`d-inline-flex align-items-center ${location.pathname.includes('settings') ? 'active' : ''}`}
            >
              <i className="isax isax-setting-25 me-2" />
              Settings
            </Link>
          </li>
          <li>
            <Link
              to={"#"}
              onClick={handleLogout}
              className="d-inline-flex align-items-center"
            >
              <i className="isax isax-logout5 me-2" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
  )
}

export default InstructorSidebar