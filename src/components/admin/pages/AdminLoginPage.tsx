import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import logo from "@/assets/footer_logo.svg";
import { signIn } from "@/adminSlice";
import { adminUser } from "@/data/adminMockData";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store";

const features = [
  "Add tours, events and activities",
  "Manage bookings and customers",
  "Publish to your public landing page",
];

const inputShell =
  "flex h-[50px] items-center gap-[11px] rounded-[11px] border border-admin-border bg-admin-field-login px-[14px] text-admin-faint focus-within:border-admin-orange-line-strong focus-within:ring-2 focus-within:ring-admin-orange-soft";

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(adminUser.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }
    dispatch(signIn());
    navigate(redirectTo, { replace: true });
  };

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

        <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[392px] flex-col gap-[18px]">
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-bold tracking-[1.4px] text-admin-orange">ADMIN PORTAL</p>
            <h1 className="text-[30px] font-bold text-admin-text">Welcome back</h1>
            <p className="text-[15px] text-admin-subtle">Sign in to your Afro Nyanka dashboard.</p>
          </div>
          <div className="h-1" />

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="admin-email" className="text-[13px] font-semibold text-admin-text-2">
              Email address
            </label>
            <div className={inputShell}>
              <Mail size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14.5px] text-admin-text outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="admin-password" className="text-[13px] font-semibold text-admin-text-2">
              Password
            </label>
            <div className={inputShell}>
              <Lock size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14.5px] text-admin-text outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 cursor-pointer hover:text-admin-text-2"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.85} absoluteStrokeWidth />
                ) : (
                  <Eye size={18} strokeWidth={1.85} absoluteStrokeWidth />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-[9px] text-[13.5px] font-medium text-admin-text-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-[6px] text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-admin-orange",
                  remember ? "bg-admin-orange" : "border-[1.5px] border-admin-radio-idle bg-white",
                )}
              >
                {remember && <Check size={13} strokeWidth={1.85} absoluteStrokeWidth />}
              </span>
              Remember me
            </label>
            <button type="button" className="cursor-pointer text-[13.5px] font-semibold text-admin-orange hover:underline">
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-admin-orange py-[15px] text-[15.5px] font-bold text-white shadow-[0px_8px_18px_0px_rgba(233,123,46,0.32)] transition-colors hover:bg-admin-orange-deep"
          >
            Sign in
            <ArrowRight size={18} strokeWidth={1.85} absoluteStrokeWidth />
          </button>

        </form>
      </main>
    </div>
  );
}
