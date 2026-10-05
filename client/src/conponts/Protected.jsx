import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();
  const location = useLocation();

  // /me hasn't answered yet: don't redirect, or logged-in users get bounced on refresh
  if (checkingAuth) return <div>Loading...</div>;

  if (!user) {
    return (
      <Navigate to="/signup" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
