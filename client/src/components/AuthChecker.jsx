import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

export const AuthChecker = ({ requireAuth = true, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return; // Wait until auth state is loaded

    const currentPath = location.pathname;
    const isAdmin = user?.role === "ADMIN";

    // 1. Handle unauthenticated users trying to access protected routes
    if (
      requireAuth &&
      !isAuthenticated &&
      !["/", "/login", "/signup"].includes(currentPath)
    ) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    // 2. Handle authenticated users trying to access guest-only routes (login/signup)
    if (!requireAuth && isAuthenticated) {
      navigate(isAdmin ? "/category" : "/notes", { replace: true });
      return;
    }

    // 3. Handle non-admin users trying to access admin-only routes
    if (adminOnly && isAuthenticated && !isAdmin) {
      navigate("/unauthorized", { replace: true });
      return;
    }

    // 4. NEW: Handle admin users trying to access non-admin routes
    if (
      isAuthenticated &&
      isAdmin &&
      !adminOnly &&
      !currentPath.startsWith("/category")
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
