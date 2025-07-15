import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

export const AuthChecker = ({ requireAuth = true, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;
    const isAdmin = user?.role === "ADMIN";

    // 1. Not authenticated & trying to access protected route
    if (
      requireAuth &&
      !isAuthenticated &&
      !["/", "/login", "/signup"].includes(currentPath)
    ) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    // 2. Authenticated user visiting public-only pages like /login or /signup
    if (!requireAuth && isAuthenticated) {
      const target = isAdmin ? "/category" : "/notes";
      if (currentPath === "/login" || currentPath === "/signup") {
        navigate(target, { replace: true });
      }
      return;
    }

    // 3. Non-admin trying to access admin-only route
    if (adminOnly && isAuthenticated && !isAdmin) {
      navigate("/unauthorized", { replace: true });
      return;
    }

    // 4. Admin trying to access user-only route (optional enforcement)
    if (
      isAuthenticated &&
      isAdmin &&
      !adminOnly &&
      currentPath.startsWith("/notes")
    ) {
      navigate("/category", { replace: true });
      return;
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

  return !isLoading ? <Outlet /> : null;
};
