import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router";

function AppLayout() {
  return (
    <div>
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export default AppLayout;
