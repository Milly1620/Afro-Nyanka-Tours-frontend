import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import {
  AdminAuthLayout,
  authInputShell,
  authSubmitClass,
} from "@/components/admin/layout/AdminAuthLayout";
import { adminAuthApi } from "@/services/adminApi";
import { getErrorMessage, getErrorStatus } from "@/services/api";

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 72;

export function passwordProblem(password: string, confirmation: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters.`;
  }
  if (password !== confirmation) return "Passwords do not match.";
  return null;
}

export function AdminSetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const problem = passwordProblem(password, confirmation);
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await adminAuthApi.setPassword(token, password);
      navigate("/admin/login", { replace: true });
    } catch (reason) {
      setError(
        getErrorStatus(reason) === 400
          ? "This link is invalid, already used or has expired. Request a new one."
          : getErrorMessage(reason, "We couldn't set your password. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout>
      <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[392px] flex-col gap-[18px]">
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold tracking-[1.4px] text-admin-orange">ADMIN PORTAL</p>
          <h1 className="text-[30px] font-bold text-admin-text">Set your password</h1>
          <p className="text-[15px] text-admin-subtle">Choose a password to sign in to your dashboard.</p>
        </div>

        {!token ? (
          <p role="alert" className="text-[13.5px] font-medium text-admin-danger">
            This link is missing its token. Open the link from your email again, or request a new one.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="new-password" className="text-[13px] font-semibold text-admin-text-2">
                New password
              </label>
              <div className={authInputShell}>
                <Lock size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[14.5px] text-admin-text outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="confirm-password" className="text-[13px] font-semibold text-admin-text-2">
                Confirm password
              </label>
              <div className={authInputShell}>
                <Lock size={18} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
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
              {submitting ? "Saving..." : "Set password"}
            </button>
          </>
        )}

        <Link to="/admin/forgot-password" className="text-center text-[13.5px] font-semibold text-admin-orange hover:underline">
          Request a new link
        </Link>
      </form>
    </AdminAuthLayout>
  );
}
