import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "@/store";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

const activeClasses = ["border-l-3", "border-admin-orange", "bg-admin-orange-soft", "text-admin-orange"];

function renderSidebarAt(path: string) {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AdminSidebar open={false} onClose={() => {}} />
      </MemoryRouter>
    </Provider>,
  );
}

describe("AdminSidebar", () => {
  it.each([
    ["/admin", "Dashboard"],
    ["/admin/events", "Events"],
    ["/admin/tours", "Tours"],
    ["/admin/extras", "Extras"],
    ["/admin/bookings", "Bookings"],
    ["/admin/settings", "Settings"],
  ])("gives %s the same active treatment on its %s link", (path, label) => {
    renderSidebarAt(path);
    const link = screen.getByRole("link", { name: label });
    expect(link).toHaveAttribute("aria-current", "page");
    activeClasses.forEach((className) => expect(link).toHaveClass(className));
  });

  it("highlights only the Tours link on the tours page", () => {
    renderSidebarAt("/admin/tours");
    const activeLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("aria-current") === "page");
    expect(activeLinks.map((link) => link.textContent)).toEqual(["Tours"]);
    expect(screen.getByRole("link", { name: "Events" })).not.toHaveClass("border-l-3");
  });

  it("keeps Events active while creating an event", () => {
    renderSidebarAt("/admin/events/new");
    expect(screen.getByRole("link", { name: "Events" })).toHaveAttribute("aria-current", "page");
  });
});
