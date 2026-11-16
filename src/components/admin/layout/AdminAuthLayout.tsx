import type { ReactNode } from "react";
import { Check } from "lucide-react";
import logo from "@/assets/footer_logo.svg";

const features = [
  "Add tours, events and activities",
  "Manage bookings and customers",
  "Publish to your public landing page",
];

export const authInputShell =
  "flex h-[50px] items-center gap-[11px] rounded-[11px] border border-admin-border bg-admin-field-login px-[14px] text-admin-faint focus-within:border-admin-orange-line-strong focus-within:ring-2 focus-within:ring-admin-orange-soft";

export const authSubmitClass =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-admin-orange py-[15px] text-[15.5px] font-bold text-white shadow-[0px_8px_18px_0px_rgba(233,123,46,0.32)] transition-colors hover:bg-admin-orange-deep disabled:cursor-not-allowed disabled:opacity-60";

export function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white font-admin">
      <aside className="admin-login-stripes relative hidden w-[600px] shrink-0 flex-col justify-between px-14 pt-14 pb-[52px] lg:flex">
        <div />
        <div className="flex max-w-[488px] flex-col gap-[22px]">
          <h2 className="text-[34px] leading-[42px] font-bold text-white">Everything you need to run your tours.</h2>
          <p className="text-[16px] leading-[26px] text-white/90">
            Add tours, events and activities, manage bookings, and publish straight to your landing page, all
            from one dashboard.
          </p>
          <ul className="flex flex-col gap-[14px] pt-[6px]">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-[14.5px] font-medium text-white/95">
                <span className="flex size-[26px] items-center justify-center rounded-full bg-white/18">
                  <Check size={14} strokeWidth={1.85} absoluteStrokeWidth />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[12.5px] font-medium text-white/70">© 2026 Afro Nyanka Tours · Authorised access only</p>
      </aside>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-10 flex items-center gap-[13px] self-center lg:absolute lg:top-20 lg:right-[79px] lg:mb-0">
          <img src={logo} alt="" className="h-[95px] w-[81px]" />
          <div className="flex flex-col gap-px whitespace-nowrap">
            <span className="text-[18px] font-bold text-admin-text">Afro Nyanka</span>
            <span className="text-[10.5px] font-semibold tracking-[1.5px] text-admin-brand-caption">
              TOUR OPERATIONS
            </span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
