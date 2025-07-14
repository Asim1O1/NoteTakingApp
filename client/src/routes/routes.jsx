import { createBrowserRouter } from "react-router-dom";
import { AuthChecker } from "../components/AuthChecker";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";
import MainLayout from "../layout/MainLayout";
import {
  Category,
  EditNoteForm,
  LandingPage,
  ListNotes,
  Login,
  NewNotes,
  NotePage,
  NotFound,
  Signup,
  Unauthorized,
} from "../pages/_pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },

      // Guest-only routes (blocked if authenticated)
      {
        element: <AuthChecker requireAuth={false} />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login", element: <Login /> },
              { path: "signup", element: <Signup /> },
            ],
          },
        ],
      },

      // User-only routes (blocked if not authenticated or if admin)
      {
        element: <AuthChecker requireAuth={true} />,
        children: [
          {
            path: "notes/*",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <ListNotes /> },
              { path: ":id", element: <NotePage /> },
              { path: "new", element: <NewNotes /> },
              { path: "edit/:id", element: <EditNoteForm /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },

  // Admin-only route (not under MainLayout)
  {
    path: "/category",
    element: <AuthChecker requireAuth={true} adminOnly={true} />,
    children: [{ index: true, element: <Category /> }],
  },

  // Unauthorized access
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
