import { useState } from 'react';
import { adminSidebarData } from '../../../core/common/data/json/admin-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import { useUser } from '../../../core/context/UserContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useUser();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isSubmenuActive = (submenus: any[]) => {
    return submenus.some(submenu => 
      location.pathname === submenu.route || 
      location.pathname === submenu.subRoute
    );
  };

  return (
    <div className="col-lg-3">
      <div className="settings-sidebar mb-lg-0 theiaStickySidebar">
        <div>
          <h6 className="mb-3">Main Menu</h6>
          <ul className="mb-3 pb-1">
            {adminSidebarData.map((menu: any, index: any) => (
              <li key={index}>
                {menu.type === 'single' ? (
                  <Link
                    to={menu.route}
                    className={`d-inline-flex align-items-center ${
                      location.pathname === menu.route ? 'active' : ''
                    }`}
                  >
                    <i className={`${menu.icon} me-2`} />
                    {menu.title}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu(menu.title);
                      }}
                      className={`d-inline-flex align-items-center justify-content-between w-100 ${
                        isSubmenuActive(menu.submenus) ? 'active' : ''
                      }`}
                    >
                      <span>
                        <i className={`${menu.icon} me-2`} />
                        {menu.title}
                      </span>
                      <i
                        className={`fas fa-chevron-${
                          openMenus.includes(menu.title) ? 'down' : 'right'
                        } ms-auto`}
                        style={{ fontSize: '10px' }}
                      />
                    </Link>
                    {openMenus.includes(menu.title) && (
                      <ul className="submenu ms-3 mt-2">
                        {menu.submenus.map((submenu: any, subIndex: any) => (
                          <li key={subIndex}>
                            <Link
                              to={submenu.route}
                              className={`d-inline-flex align-items-center ${
                                location.pathname === submenu.route ||
                                location.pathname === submenu.subRoute
                                  ? 'active'
                                  : ''
                              }`}
                            >
                              <i className={`${submenu.icon} me-2`} style={{ fontSize: '14px' }} />
                              {submenu.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <hr />
          <h6 className="mb-3">Account Settings</h6>
          <ul>
            <li>
              <Link
                to={all_routes.adminsettings}
                className={`d-inline-flex align-items-center ${
                  location.pathname.includes('settings') ? 'active' : ''
                }`}
              >
                <i className="isax isax-setting-25 me-2" />
                Settings
              </Link>
            </li>
            <li>
              <Link
                to={'#'}
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
  );
};

export default AdminSidebar;