import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        return <div className="p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
            <p>You do not have permission to access this page.</p>
        </div>;
        // Or redirect to their default dashboard
    }

    return <Outlet />;
};

export default ProtectedRoute;
