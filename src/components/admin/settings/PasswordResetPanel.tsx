import { useState } from "react";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Panel, PanelHeading } from "@/components/admin/ui/Panel";
import { adminAuthApi } from "@/services/adminApi";
import { getErrorMessage, getErrorStatus } from "@/services/api";
import { useAppSelector } from "@/store";

export function resetRequestError(error: unknown): string {
  if (getErrorStatus(error) === 429) return "Too many requests, try again later.";
  return getErrorMessage(error, "We couldn't send the link. Please try again.");
}

export function PasswordResetPanel() {
  const email = useAppSelector((state) => state.admin.email);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email) return;
    setSending(true);
    setError("");
    setSent(false);
    try {
      await adminAuthApi.forgotPassword(email);
      setSent(true);
    } catch (reason) {
      setError(resetRequestError(reason));
    } finally {
      setSending(false);
    }
  };

  return (
    <Panel className="flex w-full flex-col gap-[14px] p-[22px]">
      <PanelHeading
        title="Password"
        subtitle={email ? `We will email a reset link to ${email}` : "Loading your account…"}
      />
      <p className="text-[12px] text-admin-subtle">
        The link is valid for 24 hours and can be used once. Setting a new password signs you out everywhere.
      </p>
      <div className="flex items-center gap-3">
        <AdminButton variant="secondary" size="lg" onClick={() => void handleSend()} disabled={!email || sending}>
          {sending ? "Sending..." : "Email me a reset link"}
        </AdminButton>
        {sent && (
          <span role="status" className="text-[12.5px] font-medium text-admin-published-ink">
            Check your inbox for the link.
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
          {error}
        </p>
      )}
    </Panel>
  );
}
