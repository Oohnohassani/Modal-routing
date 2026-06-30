import { LuBadgeCheck } from "react-icons/lu";

function RightSidebar() {
  return (
    <aside className="absolute top-0 right-0 hidden w-80 flex-col gap-6 px-6 py-8 md:right-0 md:flex lg:right-10 xl:right-30">
      {/* Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="profile"
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              your_username
            </span>
            <span className="text-xs text-neutral-500">Your Name</span>
          </div>
        </div>

        <button className="text-xs font-semibold text-blue-500 hover:text-blue-400">
          Switch
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-400">
          Suggested for you
        </span>
        <button className="text-xs font-semibold text-white hover:text-neutral-400">
          See All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <Suggestion username="alex_dev" />
        <Suggestion username="design_daily" />
        <Suggestion username="react_world" />
        <Suggestion username="ui_inspo" />
      </div>

      {/* Footer */}
      <footer className="mt-6 text-[11px] leading-5 text-neutral-600">
        <div className="flex flex-wrap gap-x-2">
          <FooterLink label="About" />
          <FooterLink label="Help" />
          <FooterLink label="Press" />
          <FooterLink label="API" />
          <FooterLink label="Jobs" />
          <FooterLink label="Privacy" />
          <FooterLink label="Terms" />
          <FooterLink label="Locations" />
          <FooterLink label="Language" />
          <FooterLink label="Meta Verified" />
        </div>

        <p className="mt-3">© 2026 Instagram from Meta</p>
      </footer>
    </aside>
  );
}

/* ---------------- Suggestions ---------------- */

function Suggestion({ username }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/150?u=${username}`}
          alt={username}
          className="h-8 w-8 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm text-white">{username}</span>
            <LuBadgeCheck className="text-sm text-blue-500" />
          </div>
          <span className="text-xs text-neutral-500">Suggested for you</span>
        </div>
      </div>

      <button className="text-xs font-semibold text-blue-500 hover:text-blue-400">
        Follow
      </button>
    </div>
  );
}

/* ---------------- Footer Link ---------------- */

function FooterLink({ label }) {
  return (
    <a
      href="#"
      className="cursor-pointer hover:text-neutral-400 hover:underline"
    >
      {label}
    </a>
  );
}

export default RightSidebar;
