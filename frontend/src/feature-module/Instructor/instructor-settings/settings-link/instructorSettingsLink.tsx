import { all_routes } from "../../../router/all_routes";
import { Link, useLocation } from "react-router-dom";

const InstructorSettingsLink = () => {
    const route = all_routes;

    const location = useLocation();

  return (
    <>
      <ul className="settings-nav d-flex align-items-center flex-wrap border bg-light-900 rounded">
        <li>
          <Link to={route.instructorsettings} className={`${location.pathname === '/instructor/instructor-settings' ? 'active' : ''}`}>
            Profile
          </Link>
        </li>
        <li>
          <Link to={route.instructorChangePassword} className={`${location.pathname === '/instructor/instructor-change-password' ? 'active' : ''}`}>Security</Link>
        </li>
        {/* <li>
          <Link to={route.instructorPlan} className={`${location.pathname === '/instructor/instructor-plans' ? 'active' : ''}`}>Plans</Link>
        </li>
        <li>
          <Link to={route.instructorSocialProfiles} className={`${location.pathname === '/instructor/instructor-social-profiles' ? 'active' : ''}`}>Social Profiles</Link>
        </li>
        <li>
          <Link to={route.instructorLinkedAccounts} className={`${location.pathname === '/instructor/instructor-linked-accounts' ? 'active' : ''}`}>Linked Accounts</Link>
        </li>
        <li>
          <Link to={route.instructorNotification} className={`${location.pathname === '/instructor/instructor-notifications' ? 'active' : ''}`}>Notifications</Link>
        </li>
        <li>
          <Link to={route.instructorIntegrations} className={`${location.pathname === '/instructor/instructor-integrations' ? 'active' : ''}`}>Integrations</Link>
        </li>
        <li>
          <Link to={route.instructorWithdraw} className={`${location.pathname === '/instructor/instructor-withdraw' ? 'active' : ''}`}>Withdraw</Link>
        </li> */}
      </ul>
    </>
  );
};

export default InstructorSettingsLink;
