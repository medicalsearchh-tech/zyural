import { all_routes } from "../../../router/all_routes";
import { Link, useLocation } from "react-router-dom";

const AdminSettingsLink = () => {
    const route = all_routes;

    const location = useLocation();

  return (
    <>
      <ul className="settings-nav d-flex align-items-center flex-wrap border bg-light-900 rounded">
        <li>
          <Link to={route.adminsettings} className={`${location.pathname === '/admin/admin-settings' ? 'active' : ''}`}>
            Profile
          </Link>
        </li>
        <li>
          <Link to={route.adminChangePassword} className={`${location.pathname === '/admin/admin-change-password' ? 'active' : ''}`}>Security</Link>
        </li>
        <li>
          <Link to={route.adminPlan} className={`${location.pathname === '/admin/admin-plans' ? 'active' : ''}`}>Plans</Link>
        </li>
        <li>
          <Link to={route.adminSocialProfiles} className={`${location.pathname === '/admin/admin-social-profiles' ? 'active' : ''}`}>Social Profiles</Link>
        </li>
        <li>
          <Link to={route.adminLinkedAccounts} className={`${location.pathname === '/admin/admin-linked-accounts' ? 'active' : ''}`}>Linked Accounts</Link>
        </li>
        <li>
          <Link to={route.adminNotification} className={`${location.pathname === '/admin/admin-notifications' ? 'active' : ''}`}>Notifications</Link>
        </li>
        <li>
          <Link to={route.adminIntegrations} className={`${location.pathname === '/admin/admin-integrations' ? 'active' : ''}`}>Integrations</Link>
        </li>
        <li>
          <Link to={route.adminWithdraw} className={`${location.pathname === '/admin/admin-withdraw' ? 'active' : ''}`}>Withdraw</Link>
        </li>
      </ul>
    </>
  );
};

export default AdminSettingsLink;
