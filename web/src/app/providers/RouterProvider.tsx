import { RouterProvider as Provider } from "react-router-dom";
import { router } from "../routing/routes";

export const RouterProvider = () => {
  return <Provider router={router} />;
};
