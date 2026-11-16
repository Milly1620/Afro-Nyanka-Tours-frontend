import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { adminAuthApi } from "@/services/adminApi";
import { setAdminEmail } from "@/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

interface AdminLayoutContext {
  openNavigation: () => void;
}

export function useAdminLayout() {
  return useOutletContext<AdminLayoutContext>();
}

export function RequireAdmin() {
  const isSignedIn = useAppSelector((state) => state.admin.isSignedIn);
  const location = useLocation();
  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function AdminLayout() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    adminAuthApi
      .me()
      .then((profile) => dispatch(setAdminEmail(profile.email)))
      .catch(() => undefined);
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-admin-app font-admin">
      <AdminSidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet context={{ openNavigation: () => setNavigationOpen(true) } satisfies AdminLayoutContext} />
      </div>
    </div>
  );
}
