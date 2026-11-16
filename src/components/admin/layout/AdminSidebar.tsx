import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Compass,
  LayoutDashboard,
  Package,
  LogOut,
  Settings,
  Ticket,
  X,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/footer_logo.svg";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { signOut } from "@/adminSlice";
import { avatarToneFor } from "@/lib/adminFormat";
import { Avatar } from "@/components/admin/ui/Avatar";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "MANAGE",
    items: [
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/tours", label: "Tours", icon: Compass },
      { to: "/admin/extras", label: "Extras", icon: Package },
      { to: "/admin/bookings", label: "Bookings", icon: Ticket },
    ],
  },
  {
    title: "SYSTEM",
    items: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.admin.email) ?? "Administrator";

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/admin/login");
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col gap-[22px] border-r border-admin-border-side bg-white px-4 pt-[22px] pb-5 transition-transform",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-[10px]">
          <img src={logo} alt="" className="h-[42px] w-[35.8px] shrink-0" />
          <div className="flex flex-1 flex-col gap-[2px] font-semibold whitespace-nowrap">
            <span className="text-[15px] text-admin-text">Afro Nyanka</span>
            <span className="text-[10.5px] tracking-[0.525px] text-admin-muted">TOUR OPERATIONS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="cursor-pointer text-admin-subtle lg:hidden"
          >
            <X size={18} strokeWidth={1.85} absoluteStrokeWidth />
          </button>
        </div>

        <nav aria-label="Admin" className="flex flex-col gap-[18px]">
          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-[6px]">
              <p className="pl-[10px] text-[10px] font-semibold tracking-[0.6px] text-admin-muted">
                {group.title}
              </p>
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-[10px]">
          <Avatar name={email} tone={avatarToneFor(email)} size={36} />
          <div className="flex min-w-0 flex-1 flex-col gap-px whitespace-nowrap">
            <span className="truncate text-[13px] font-semibold text-admin-text">{email}</span>
            <span className="truncate text-[11px] font-medium text-admin-subtle">Administrator</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="cursor-pointer text-admin-text-2 hover:text-admin-orange"
          >
            <LogOut size={18} strokeWidth={1.85} absoluteStrokeWidth />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-[10px] rounded-[10px] p-[10px] text-[14px] font-medium transition-colors",
          isActive
            ? "border-l-3 border-admin-orange bg-admin-orange-soft text-admin-orange"
            : "text-admin-nav hover:bg-admin-field",
        )
      }
    >
      <Icon size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
      {item.label}
    </NavLink>
  );
}
