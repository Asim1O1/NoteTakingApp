import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../sections/Navbar";

import { useAuthStore } from "../stores";

function MainLayout() {
  const { user, isLoading } = useAuthStore();
  console.log("The user is", user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't navigate if still loading auth state
    if (isLoading) return;

    if (location.pathname === "/") {
      if (!user) {
        // Navigate to login if no user
        navigate("/login", { replace: true });
        return;
      }
      // Navigate to notes if user is authenticated
      navigate("/notes", { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]); // Added proper dependencies

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-20 px-4">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
