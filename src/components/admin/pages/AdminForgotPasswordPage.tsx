import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  AdminAuthLayout,
  authInputShell,
  authSubmitClass,
} from "@/components/admin/layout/AdminAuthLayout";
import { toast } from "@/lib/toast";
import { adminAuthApi } from "@/services/adminApi";
import { getErrorMessage, getErrorStatus } from "@/services/api";

export function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await adminAuthApi.forgotPassword(email.trim());
      setSent(true);
      toast.success("If that account exists, a link has been sent.");
    } catch (reason) {
      const message =
        getErrorStatus(reason) === 429
          ? "Too many requests, try again later."
          : getErrorMessage(reason, "We couldn't send the link. Please try again.");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[392px] flex-col gap-[18px]">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold tracking-[1.4px] text-admin-orange">ADMIN PORTAL</p>
          <h1 className="text-[30px] font-bold text-admin-text">Forgot password</h1>
          <p className="text-[15px] text-admin-subtle">
            Enter your email address and we will send you a link to set a new password.
          </p>
        </div>

        {sent ? (
          <p role="status" className="rounded-[11px] bg-admin-orange-soft px-4 py-3 text-[14px] font-medium text-admin-text-2">
            If that account exists, a link has been sent.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="forgot-email" className="text-[13px] font-semibold text-admin-text-2">
                Email address
              </label>
              <div className={authInputShell}>
                <Mail size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[14.5px] text-admin-text outline-none"
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
                {error}
              </p>
            )}
            <button type="submit" disabled={submitting} className={authSubmitClass}>
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}

        <Link to="/admin/login" className="text-center text-[13.5px] font-semibold text-admin-orange hover:underline">
          Back to sign in
        </Link>
      </form>
    </AdminAuthLayout>
  );
}
