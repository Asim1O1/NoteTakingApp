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
      // Public routes
      { index: true, element: <LandingPage /> },

      // Protected user routes
      {
        element: <AuthChecker requireAuth={true} />,
        children: [
          {
            path: "notes/*",
            children: [
              { index: true, element: <ListNotes /> },
              { path: ":id", element: <NotePage /> },
              { path: "new", element: <NewNotes /> },
              { path: "edit/:id", element: <EditNoteForm /> },
            ],
          },
        ],
      },

      {
        element: <AuthChecker requireAuth={true} adminOnly={true} />,
        children: [
          {
            path: "category/*",
            element: <DashboardLayout />,
            children: [{ index: true, element: <Category /> }],
          },
        ],
      },

      // Error routes
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // Auth routes (separate from MainLayout)
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
]);
