import { Sun, SunMoon } from "lucide-react";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { router } from "./routes/routes";
import { useAuthStore } from "./stores";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme || (prefersDark ? "dark" : "light");
  });

  const { initializeAuth, isLoading, error } = useAuthStore();

  // Initialize authentication
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuth();
      } catch (err) {
        toast.error("Failed to initialize authentication");
        console.error("Auth initialization error:", err);
      }
    };
    init();
  }, []); // Remove initializeAuth from dependencies to prevent re-initialization

  // Handle theme changes and persistence
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      return newTheme;
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Loading application...</p>
      </div>
    );
  }

  // Show error state if authentication initialization failed
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full bottom-10 right-10 z-50 shadow-md hover:scale-110 transition-transform duration-200"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <SunMoon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>

      <RouterProvider router={router} />

      <Toaster
        position="top-center"
        richColors
        theme={theme === "dark" ? "dark" : "light"}
        expand={true}
        closeButton
      />
    </>
  );
}

export default App;
