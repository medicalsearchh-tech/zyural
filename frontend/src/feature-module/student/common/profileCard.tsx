import { useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from '../../router/all_routes'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { useUser } from '../../../core/context/UserContext'

const ProfileCard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const route = all_routes;

  // Always declare hooks first
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'student') {
        navigate(route.login);
      }
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5 text-center text-white">
        Redirecting...
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const avatarSrc = user.avatar || "assets/img/user/user-02.jpg";

  return (
    <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
      <div className="profile-card-bg">
        <ImageWithBasePath
          src="assets/img/bg/card-bg-01.png"
          className="profile-card-bg-1"
          alt=""
        />
      </div>
      <div className="row align-items-center row-gap-3">
        <div className="col-lg-8">
          <div className="d-flex align-items-center">
            <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
              <ImageWithBasePath src={avatarSrc} alt={fullName} />
              {user.isEmailVerified && (
                <span className="verify-tick">
                  <i className="isax isax-verify5" />
                </span>
              )}
            </span>
            <div>
              <h5 className="mb-1 text-white d-inline-flex align-items-center">
                <Link to={all_routes.studentsDetails}>{fullName}</Link>
                <Link
                  to={all_routes.studentProfile}
                  className="link-light fs-16 ms-2"
                  title="Edit Profile"
                >
                  <i className="isax isax-edit-2" />
                </Link>
              </h5>
              <p className="text-light mb-2">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              {user.bio && (
                <p className="text-light small mb-0">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2">
            {user.role === 'student' && (
              <Link
                to={all_routes.register}
                className="btn btn-white rounded-pill me-3"
              >
                Become an Instructor
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard