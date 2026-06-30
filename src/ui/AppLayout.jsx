import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router";
import AppSidebar from "../components/AppSidebar";

function AppLayout() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-900 py-6">
      <AppSidebar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export default AppLayout;
