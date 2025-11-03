import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { all_routes } from "../../feature-module/router/all_routes";

const GoogleAuthSuccess: React.FC = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const token = searchParams.get('token');

      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem('token', token);

          // Fetch user data
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Redirect based on role
            if (data.data.user.role === 'instructor') {
              navigate(route.instructorDashboard);
            } else if (data.data.user.role === 'admin') {
              navigate(route.adminDashboard); 
            } else {
              navigate(route.studentDashboard);
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Google auth error:', error);
          navigate('/login?error=auth_failed');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleGoogleAuth();
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;