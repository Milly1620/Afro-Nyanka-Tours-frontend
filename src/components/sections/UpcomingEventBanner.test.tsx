import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UpcomingEventBanner } from "@/components/sections/UpcomingEventBanner";
import { eventsApi } from "@/services/api";
import type { Event } from "@/types/api";

vi.mock("@/services/api", () => ({
  eventsApi: { list: vi.fn() },
  getErrorMessage: () => "failed",
}));

function eventNamed(id: number): Event {
  return {
    id,
    name: `Event ${id}`,
    description: null,
    country: "Ghana",
    region: null,
    destination: null,
    start_date: "2999-12-26",
    end_date: "2999-12-28",
    duration_days: 3,
    price_ghs: 500,
    capacity: null,
    seats_left: null,
    highlights: [],
    main_image_url: null,
    gallery_images: [],
    locations: [],
    extras: [],
  };
}

function activeSlide() {
  return document.querySelector('[role="group"]:not([aria-hidden="true"])') as HTMLElement;
}

function renderBanner() {
  render(
    <MemoryRouter>
      <UpcomingEventBanner />
    </MemoryRouter>,
  );
}

describe("UpcomingEventBanner", () => {
  it("renders nothing when there are no upcoming events", async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([]);
    renderBanner();
    await Promise.resolve();
    expect(screen.queryByLabelText("Upcoming events")).not.toBeInTheDocument();
  });

  it("goes back to the first event after the last one", async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([eventNamed(1), eventNamed(2)]);
    renderBanner();
    await screen.findByLabelText("Upcoming events");
    expect(activeSlide()).toHaveTextContent("Event 1");
    fireEvent.click(screen.getByRole("button", { name: /view next tour/i }));
    expect(activeSlide()).toHaveTextContent("Event 2");
    fireEvent.click(screen.getByRole("button", { name: /view next tour/i }));
    expect(activeSlide()).toHaveTextContent("Event 1");
  });

  it("jumps to an event from its dot", async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([eventNamed(1), eventNamed(2), eventNamed(3)]);
    renderBanner();
    fireEvent.click(await screen.findByRole("button", { name: "Go to event 3" }));
    expect(activeSlide()).toHaveTextContent("Event 3");
  });

  it("hides the dots when there is a single event", async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([eventNamed(1)]);
    renderBanner();
    await screen.findByLabelText("Upcoming events");
    expect(screen.queryByRole("button", { name: /go to event/i })).not.toBeInTheDocument();
  });
});
