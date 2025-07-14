import { LogOut, Menu, Music3, X } from "lucide-react";
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

  const navLinks = (
    <>
      <Link to="/notes" className="block px-3 py-2 hover:text-blue-600">
        Notes
      </Link>
      <Link to="/notes/new" className="block px-3 py-2 hover:text-blue-600">
        Add Notes
      </Link>
      {user?.role !== "USER" && (
        <Link to="/category" className="block px-3 py-2 hover:text-blue-600">
          Add Category
        </Link>
      )}
      {user && (
        <button
          onClick={handleLogout}
          className="flex gap-3 px-3 py-2 text-red-600 hover:text-red-700 cursor-pointer "
        >
          <LogOut />
          <span>Logout</span>
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link
          to="/notes"
          className="text-xl font-bold text-gray-800 flex gap-2"
        >
          <Music3 /> MyNotes
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 items-center">
          {navLinks}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 pb-4">
          <div className="flex flex-col text-sm font-medium text-gray-700 space-y-1">
            {navLinks}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
