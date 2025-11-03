import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";

const SettingsLinks = () => {
  const location = useLocation();
  const route = all_routes;

  const isActive = (path: any) => location.pathname === path;

  return (
    <ul className="settings-nav d-flex align-items-center flex-wrap border bg-light-900 rounded">
      <li>
        <Link
          to={route.studentSettings}
          className={isActive(route.studentSettings) ? "active" : ""}
        >
          Edit Profile
        </Link>
      </li>
      <li>
        <Link
          to={route.studentChangePassword}
          className={isActive(route.studentChangePassword) ? "active" : ""}
        >
          Security
        </Link>
      </li>
      {/* <li>
        <Link
          to={route.studentSocialProfile}
          className={isActive(route.studentSocialProfile) ? "active" : ""}
        >
          Social Profiles
        </Link>
      </li>
      <li>
        <Link
          to={route.studentLinkedAccounts}
          className={isActive(route.studentLinkedAccounts) ? "active" : ""}
        >
          Linked Accounts
        </Link>
      </li>
      <li>
        <Link
          to={route.studentNotification}
          className={isActive(route.studentNotification) ? "active" : ""}
        >
          Notifications
        </Link>
      </li>
      <li>
        <Link
          to={route.studentBillingAddress}
          className={isActive(route.studentBillingAddress) ? "active" : ""}
        >
          Billing Address
        </Link>
      </li> */}
    </ul>
  );
};

export default SettingsLinks;
