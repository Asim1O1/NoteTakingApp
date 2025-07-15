import { Outlet } from "react-router-dom";
import Navbar from "../sections/Navbar";
import { useAuthStore } from "../stores";

function MainLayout() {
  const { isLoading } = useAuthStore();
  console.log("entered the main layout");

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
