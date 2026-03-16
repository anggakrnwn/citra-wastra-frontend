import { useWastra } from "../context/WastraContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly, superAdminOnly }: ProtectedRouteProps) => {
  const { user, loading } = useWastra();

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading || !user) {
    return null;
  }

  if (superAdminOnly && user.role !== "super_admin") {
    return <Navigate to="/forbidden" replace />;
  }

  if (adminOnly && user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;