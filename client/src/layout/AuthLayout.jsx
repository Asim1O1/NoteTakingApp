import { Outlet } from "react-router-dom";

function AuthLayout() {
  console.log("enterd the authlaout");
  return <Outlet />;
}

export default AuthLayout;
