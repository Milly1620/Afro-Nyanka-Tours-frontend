import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "@/adminSlice";
import {
  AdminAuthLayout,
  authInputShell,
  authSubmitClass,
} from "@/components/admin/layout/AdminAuthLayout";
import { saveAdminSession } from "@/lib/adminSession";
import { cn } from "@/lib/utils";
import { adminAuthApi } from "@/services/adminApi";
import { getErrorMessage, getErrorStatus } from "@/services/api";
import { useAppDispatch } from "@/store";

export function loginErrorMessage(error: unknown): string {
  const status = getErrorStatus(error);
  if (status === 429) return "Too many attempts, try again later.";
  if (status === 401) return "Incorrect email or password.";
  return getErrorMessage(error, "We couldn't sign you in. Please try again.");
}

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const session = await adminAuthApi.login({
        email: email.trim(),
        password,
        remember_me: remember,
      });
      saveAdminSession(session.access_token, session.expires_in);
      dispatch(signIn());
      navigate(redirectTo, { replace: true });
    } catch (reason) {
      setError(loginErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout>
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
          <div className={authInputShell}>
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
          <div className={authInputShell}>
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
          <Link to="/admin/forgot-password" className="text-[13.5px] font-semibold text-admin-orange hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={authSubmitClass}>
          {submitting ? "Signing in..." : "Sign in"}
          <ArrowRight size={18} strokeWidth={1.85} absoluteStrokeWidth />
        </button>
      </form>
    </AdminAuthLayout>
  );
}
