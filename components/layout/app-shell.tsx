"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BedDouble,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PackagePlus,
  Search,
  Settings,
  Stethoscope,
  Sun,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToast, logout, toggleTheme } from "@/store/slices/appSlice";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: UsersRound },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Bed management", href: "/beds", icon: BedDouble },
  { label: "Pharmacy", href: "/pharmacy", icon: PackagePlus },
  { label: "Billing", href: "/billing", icon: CircleDollarSign },
];

const routeTitles: Record<string, string> = {
  "/dashboard": "Hospital overview",
  "/patients": "Patient management",
  "/doctors": "Doctor management",
  "/appointments": "Appointments",
  "/beds": "Bed management",
  "/pharmacy": "Pharmacy inventory",
  "/billing": "Billing & invoices",
  "/notifications": "Notifications",
  "/profile": "My profile",
};

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-10 place-items-center rounded-[13px] bg-white text-[#16866f] shadow-lg shadow-black/10">
        <span className="absolute h-5 w-2 rounded-sm bg-current" />
        <span className="absolute h-2 w-5 rounded-sm bg-current" />
      </div>
      <div>
        <p className="text-[17px] font-bold tracking-[-0.035em] text-white">MediCore</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-white/55">Health system</p>
      </div>
    </div>
  );
}

function SidebarContent({ close }: { close?: () => void }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.authUser)!;

  function signOut() {
    dispatch(logout());
    dispatch(addToast({ type: "info", message: "You have been signed out safely." }));
    navigate("/login", { replace: true });
    close?.();
  }

  return (
    <div className="flex h-full flex-col bg-[var(--nav)] text-white">
      <div className="flex h-[76px] items-center px-5"><Logo /></div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Workspace</p>
        <div className="space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              onClick={close}
              className={({ isActive }) => `group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${isActive ? "bg-white text-[#12483c] shadow-sm" : "text-white/68 hover:bg-white/8 hover:text-white"}`}
            >
              {({ isActive }) => <><Icon size={18} strokeWidth={isActive ? 2.4 : 1.9} aria-hidden="true" /><span className="flex-1">{label}</span>{isActive ? <ChevronRight size={15} /> : null}</>}
            </NavLink>
          ))}
        </div>
        <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Account</p>
        <div className="space-y-1">
          <NavLink to="/notifications" onClick={close} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${isActive ? "bg-white text-[#12483c]" : "text-white/68 hover:bg-white/8 hover:text-white"}`}><Bell size={18} />Notifications</NavLink>
          <NavLink to="/profile" onClick={close} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${isActive ? "bg-white text-[#12483c]" : "text-white/68 hover:bg-white/8 hover:text-white"}`}><Settings size={18} />Profile & settings</NavLink>
        </div>
      </nav>
      <div className="border-t border-white/10 p-3">
        <button type="button" onClick={() => { navigate("/profile"); close?.(); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/8">
          <div className="grid size-9 place-items-center rounded-xl bg-[#d8f0e8] text-sm font-bold text-[#146d5b]">{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{profile.name}</p><p className="truncate text-[11px] text-white/50">{profile.role}</p></div>
          <ChevronRight size={15} className="text-white/40" />
        </button>
        <button type="button" onClick={signOut} className="mt-1 flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-semibold text-white/60 hover:bg-red-400/10 hover:text-red-200"><LogOut size={16} />Sign out</button>
      </div>
    </div>
  );
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.app.theme);
  const notifications = useAppSelector((state) => state.app.notifications);
  const profile = useAppSelector((state) => state.app.authUser)!;
  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/patients?search=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] lg:block"><SidebarContent /></aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-[#061b16]/55 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[286px] max-w-[86vw] shadow-2xl">
            <button type="button" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-xl text-white/70 hover:bg-white/10"><X size={19} /></button>
            <SidebarContent close={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 backdrop-blur-xl sm:px-6 lg:px-7">
          <button type="button" aria-label="Open navigation" onClick={() => setDrawerOpen(true)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] lg:hidden"><Menu size={20} /></button>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-semibold">{routeTitles[location.pathname] ?? "MediCore"}</p>
            <p className="text-[11px] text-[var(--muted)]">{new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p>
          </div>
          <form onSubmit={submitSearch} className="relative mx-auto w-full max-w-[390px] md:mx-0">
            <label htmlFor="global-search" className="sr-only">Search patients</label>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]" />
            <input id="global-search" value={search} onChange={(event) => setSearch(event.target.value)} className="field-input h-10 min-h-10 bg-[var(--surface-soft)] pl-9 text-sm" placeholder="Search patients…" />
          </form>
          <button type="button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} onClick={() => dispatch(toggleTheme())} className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--primary)]">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button type="button" aria-label={`Notifications, ${unread} unread`} onClick={() => navigate("/notifications")} className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--primary)]">
            <Bell size={18} />
            {unread ? <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[var(--danger)] px-1 text-[9px] font-bold leading-4 text-white">{unread}</span> : null}
          </button>
          <button type="button" aria-label="Open profile" onClick={() => navigate("/profile")} className="hidden items-center gap-2 rounded-xl p-1.5 hover:bg-[var(--surface-hover)] sm:flex">
            <div className="grid size-8 place-items-center rounded-lg bg-[var(--primary-soft)] text-[11px] font-bold text-[var(--primary)]">{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("") || <UserRound size={16} />}</div>
          </button>
        </header>
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-7">
          <div className="page-enter"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
