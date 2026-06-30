import Status from "../features/status/Status";
import RightSidebar from "../components/RightSidebar";
import { Outlet } from "react-router";

function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-900">
      <Status />
      <Outlet />
      <RightSidebar />
    </div>
  );
}

export default Home;
