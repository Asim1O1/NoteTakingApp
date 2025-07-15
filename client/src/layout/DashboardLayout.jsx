import { Outlet } from "react-router-dom";

function DashboardLayout() {
  console.log("enterd the dashboard layout");
  return <Outlet />;
}

export default DashboardLayout;
