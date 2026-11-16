import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { CreateEventPage } from "@/components/admin/pages/CreateEventPage";
import { EventPreviewPage } from "@/components/admin/pages/EventPreviewPage";
import { releaseHeldDraft } from "@/lib/draftHold";
import store from "@/store";
import { resetEventDraft } from "@/listingDraftSlice";

vi.mock("@/components/admin/layout/AdminLayout", () => ({
  useAdminLayout: () => ({ openNavigation: () => undefined }),
}));

vi.mock("@/services/adminApi", () => ({
  adminEventsApi: { get: vi.fn() },
  adminExtrasApi: { list: vi.fn().mockResolvedValue({ items: [], counts: { all: 0 } }) },
  adminLocationsApi: { list: vi.fn().mockResolvedValue([]) },
}));

function Leave() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/admin/events")}>Leave</button>;
}

function renderFlow() {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/admin/events/new"]}>
        <Leave />
        <Routes>
          <Route path="/admin/events/new" element={<CreateEventPage />} />
          <Route path="/admin/events/preview" element={<EventPreviewPage />} />
          <Route path="/admin/events" element={<p>Events list</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("CreateEventPage preview round trip", () => {
  beforeEach(() => {
    releaseHeldDraft("event");
    store.dispatch(resetEventDraft());
  });

  it("keeps typed details after opening the preview and coming back", async () => {
    renderFlow();
    const name = await screen.findByLabelText(/event name/i);
    fireEvent.change(name, { target: { value: "Homowo Festival" } });
    fireEvent.click(screen.getByRole("button", { name: /open preview/i }));
    fireEvent.click(await screen.findByRole("button", { name: /back to editor/i }));
    expect(await screen.findByLabelText(/event name/i)).toHaveValue("Homowo Festival");
  });
});
