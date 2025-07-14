import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

export const AuthChecker = ({ requireAuth = true, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const initialCheck = useRef(true);

  useEffect(() => {
    if (isLoading) return;

    if (initialCheck.current || !initialCheck.current) {
      const currentPath = location.pathname;
      const isAdmin = user?.role === "ADMIN";

      // Unauthenticated users trying to access protected routes
      if (requireAuth && !isAuthenticated && currentPath !== "/login") {
        navigate("/login", { state: { from: location }, replace: true });
        return;
      }

      // Authenticated users trying to access guest-only routes
      if (!requireAuth && isAuthenticated) {
        if (isAdmin) {
          navigate("/category", { replace: true });
        } else {
          navigate("/notes", { replace: true });
        }
        return;
      }

      // Admin trying to access non-admin route
      if (
        !adminOnly &&
        isAuthenticated &&
        isAdmin &&
        !currentPath.startsWith("/category")
      ) {
        navigate("/unauthorized", { replace: true });
        return;
      }

      // Non-admin trying to access admin route
      if (adminOnly && isAuthenticated && !isAdmin) {
        navigate("/unauthorized", { replace: true });
        return;
      }

      initialCheck.current = false;
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    location,
    requireAuth,
    adminOnly,
    user,
  ]);

  return <Outlet />;
};
