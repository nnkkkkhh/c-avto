import Main from "../../pages/main-page/ui/Main"
import Login from "../../pages/login-page/ui/Login"
import Register from "../../pages/register-page/ui/Register"
import User from "../../pages/user-page/ui/User"

import { createBrowserRouter } from "react-router-dom";
export const router = createBrowserRouter([
  {
    path: "/main",
    element: <Main />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);
