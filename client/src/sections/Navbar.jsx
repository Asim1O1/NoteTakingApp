import { Home, LogOut, Menu, Music3, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/login");
  };

  // Admin UI components
  const AdminUI = () => (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Hi Admin</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );

  // Regular user navigation links
  const UserNavLinks = () => (
    <>
      <Link
        to="/notes"
        className="px-3 py-2 hover:text-blue-600 transition-colors"
      >
        Notes
      </Link>
      <Link
        to="/notes/new"
        className="px-3 py-2 hover:text-blue-600 transition-colors"
      >
        Add Notes
      </Link>
      {user?.role !== "USER" && (
        <Link
          to="/category"
          className="px-3 py-2 hover:text-blue-600 transition-colors"
        >
          Categories
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </>
  );

  // Unauthenticated navigation
  if (!user) {
    return (
      <nav className="bg-white border-b shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Music3 className="h-5 w-5" /> MyNotes
          </div>

          {/* Desktop Navigation - Unauthenticated */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 text-green-600 hover:text-green-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Unauthenticated */}
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 text-sm space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 text-green-600 hover:text-green-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link
          to={user?.role === "ADMIN" ? "/category" : "/notes"}
          className="text-xl font-bold text-gray-800 flex items-center gap-2"
        >
          <Music3 className="h-5 w-5" /> MyNotes
        </Link>

        {/* Desktop Navigation - Authenticated */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          {user?.role === "ADMIN" ? <AdminUI /> : <UserNavLinks />}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Authenticated */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4">
          <div className="flex flex-col space-y-2 text-sm">
            {user?.role === "ADMIN" ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-gray-700">Hi Admin</div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <UserNavLinks />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
