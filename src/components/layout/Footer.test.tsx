import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { resetPublicSettingsCache } from "@/hooks/usePublicSettings";
import { settingsApi, toursApi } from "@/services/api";
import type { PublicSettings, Tour } from "@/types/api";

vi.mock("@/services/api", () => ({
  settingsApi: { getPublic: vi.fn() },
  toursApi: { list: vi.fn() },
}));

function tour(id: number, name: string, isPopular: boolean): Tour {
  return { id, name, is_popular: isPopular } as Tour;
}

const settings: PublicSettings = {
  company_name: "Afro Nyanka Tours",
  logo_url: null,
  contact_email: "info@afronyankatours.com",
  phone: "+233 24 123 4567",
  location: "Accra, Ghana",
};

beforeEach(() => {
  resetPublicSettingsCache();
  vi.mocked(toursApi.list).mockResolvedValue([]);
});

describe("Footer", () => {
  it("shows the contact details returned by the backend", async () => {
    vi.mocked(settingsApi.getPublic).mockResolvedValue(settings);
    render(<Footer />);
    expect(await screen.findByText("+233 24 123 4567")).toBeInTheDocument();
    expect(screen.getByText("Accra, Ghana")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "info@afronyankatours.com" })).toHaveAttribute(
      "href",
      "mailto:info@afronyankatours.com",
    );
  });

  it("hides contact fields that are null", async () => {
    vi.mocked(settingsApi.getPublic).mockResolvedValue({ ...settings, phone: null, contact_email: null });
    render(<Footer />);
    expect(await screen.findByText("Accra, Ghana")).toBeInTheDocument();
    expect(screen.queryByText(/\+233/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /@/ })).not.toBeInTheDocument();
  });

  it("hides the contact block when the settings request fails", async () => {
    vi.mocked(settingsApi.getPublic).mockRejectedValue(new Error("offline"));
    render(<Footer />);
    expect(await screen.findByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.queryByText("Contact Info")).not.toBeInTheDocument();
  });

  it("lists popular tours from the backend first", async () => {
    vi.mocked(settingsApi.getPublic).mockResolvedValue(settings);
    vi.mocked(toursApi.list).mockResolvedValue([tour(1, "Plain Tour", false), tour(2, "Star Tour", true)]);
    render(<Footer />);
    const links = await screen.findAllByRole("link", { name: /Tour$/ });
    expect(links.map((link) => link.textContent)).toEqual(["Star Tour", "Plain Tour"]);
  });

  it("omits the popular destinations heading when there are no tours", async () => {
    vi.mocked(settingsApi.getPublic).mockResolvedValue(settings);
    render(<Footer />);
    await screen.findByText("Accra, Ghana");
    expect(screen.queryByText("Popular Destinations")).not.toBeInTheDocument();
  });
});
