import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout, RequireAdmin } from "@/components/admin/layout/AdminLayout";
import { AddTourPage } from "@/components/admin/pages/AddTourPage";
import { AdminLoginPage } from "@/components/admin/pages/AdminLoginPage";
import { BookingsPage } from "@/components/admin/pages/BookingsPage";
import { CreateEventPage } from "@/components/admin/pages/CreateEventPage";
import { DashboardPage } from "@/components/admin/pages/DashboardPage";
import { EventPreviewPage } from "@/components/admin/pages/EventPreviewPage";
import { EventsPage } from "@/components/admin/pages/EventsPage";
import { SettingsPage } from "@/components/admin/pages/SettingsPage";
import { ToursPage } from "@/components/admin/pages/ToursPage";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route path="events/preview" element={<EventPreviewPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/new" element={<CreateEventPage />} />
          <Route path="tours" element={<ToursPage />} />
          <Route path="tours/new" element={<AddTourPage />} />
          <Route path="tours/:tourId/edit" element={<AddTourPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
