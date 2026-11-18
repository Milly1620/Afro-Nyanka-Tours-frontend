import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminLayout } from "@/components/admin/layout/AdminLayout";
import { SearchInput } from "@/components/admin/ui/SearchInput";

export interface TopBarAction {
  label: string;
  to: string;
}

interface AdminPageProps {
  title: string;
  subtitle: string;
  action?: TopBarAction;
  search?: string;
  onSearchChange?: (value: string) => void;
  contentClassName?: string;
  children: ReactNode;
}

export function AdminPage({
  title,
  subtitle,
  action,
  search,
  onSearchChange,
  contentClassName,
  children,
}: AdminPageProps) {
  const { openNavigation } = useAdminLayout();

  return (
    <>
      <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-admin-border bg-admin-topbar py-3 pr-4 pl-4 md:pr-7 md:pl-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openNavigation}
            aria-label="Open navigation"
            className="cursor-pointer text-admin-ink-900 lg:hidden"
          >
            <Menu size={22} strokeWidth={1.85} absoluteStrokeWidth />
          </button>
          <div className="flex flex-col gap-[3px]">
            <h1 className="text-[22px] font-medium text-admin-ink-900">{title}</h1>
            <p className="text-[13.5px] text-admin-ink-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput
            wrapperClassName="hidden w-[210px] sm:flex"
            value={search}
            onChange={onSearchChange ? (event) => onSearchChange(event.target.value) : undefined}
          />
          {action && (
            <Link
              to={action.to}
              className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-admin-orange px-4 py-[10px] text-[14px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-admin-orange-deep"
            >
              <Plus size={16} strokeWidth={1.85} absoluteStrokeWidth />
              {action.label}
            </Link>
          )}
        </div>
      </header>
      <main className={cn("flex flex-1 flex-col gap-5 px-4 py-[26px] md:px-8", contentClassName)}>
        {children}
      </main>
    </>
  );
}
