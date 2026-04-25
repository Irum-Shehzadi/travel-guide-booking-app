import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/traveler-signin" replace />;
  }

  // Check if user's role is allowed (Admins are always allowed)
  if (allowedRoles && user?.type && user.type !== 'admin' && !allowedRoles.includes(user.type)) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = '/traveler-dashboard';
    if (user.type === 'guide') redirectPath = '/guide-dashboard';
    if (user.type === 'admin') redirectPath = '/admin-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;