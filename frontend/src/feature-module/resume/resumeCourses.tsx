import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeCoursesApi } from '../../core/utils/api';
import { all_routes } from '../router/all_routes';

const ResumeCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToLastCourse = async () => {
      try {
        setLoading(true);
        const response = await resumeCoursesApi.getLastCourse();
        
        if (response.success) {
          // Redirect to the learning page
          navigate(response.data.redirectTo);
        } else {
          setError(response.message || 'No active courses found');
          // Redirect to courses page after 2 seconds
          setTimeout(() => {
            navigate(all_routes.courseGrid);
          }, 2000);
        }
      } catch (err) {
        console.error('Error redirecting to last course:', err);
        setError('Failed to redirect to your course');
        setTimeout(() => {
          navigate(all_routes.courseGrid);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    redirectToLastCourse();
  }, [navigate]);

  return (
    <div className="content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            {loading && (
              <div className="py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Redirecting to your last course...</p>
              </div>
            )}
            
            {error && (
              <div className="py-5">
                <p>Redirecting to courses page...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCourses;