import {
  LuInstagram,
  LuHouse,
  LuSearch,
  LuCompass,
  LuClapperboard,
  LuMessageCircle,
  LuHeart,
  LuCirclePlus,
  LuUser,
  LuMenu,
} from "react-icons/lu";
import Instagram from "../../public/Instagram.svg";
import { NavLink } from "react-router";

function AppSidebar() {
  return (
    <aside className="group fixed top-0 left-0 z-50 flex h-screen w-20 flex-col bg-neutral-900 px-3 py-6 transition-all duration-300 hover:w-[280px]">
      {/* Logo */}
      <div className="mb-10 flex h-14 cursor-pointer items-center px-2">
        <LuInstagram className="shrink-0 text-3xl text-white" />

        <div className="ml-4 max-w-0 overflow-hidden transition-all duration-300 group-hover:max-w-[140px]">
          <img
            src={Instagram}
            alt="Instagram"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        <NavLink to={"/"}>
          <SidebarItem icon={<LuHouse />} label="Home" active />
        </NavLink>
        <SidebarItem icon={<LuSearch />} label="Search" />
        <SidebarItem icon={<LuCompass />} label="Explore" />
        <SidebarItem icon={<LuClapperboard />} label="Reels" />
        <SidebarItem icon={<LuMessageCircle />} label="Messages" />
        <SidebarItem icon={<LuHeart />} label="Notifications" />
        <SidebarItem icon={<LuCirclePlus />} label="Create" />
        <SidebarItem icon={<LuUser />} label="Profile" />
      </nav>

      {/* Bottom */}
      <div>
        <SidebarItem icon={<LuMenu />} label="More" />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`flex h-14 w-full cursor-pointer items-center rounded-xl px-3 transition-colors hover:bg-neutral-800 ${
        active ? "font-semibold text-white" : "text-neutral-400 "
      }`}
    >
      {/* Icon */}
      <span className="flex w-8 shrink-0 justify-center text-2xl">{icon}</span>

      {/* Label */}
      <span className="ml-4 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

export default AppSidebar;
