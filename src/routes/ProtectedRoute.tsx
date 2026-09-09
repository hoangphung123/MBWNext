import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
