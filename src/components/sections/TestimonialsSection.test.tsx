import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { testimonialsApi } from "@/services/api";

vi.mock("@/services/api", () => ({
  testimonialsApi: { list: vi.fn() },
  getErrorMessage: () => "failed",
}));

describe("TestimonialsSection", () => {
  it("shows the design testimonials when the API has none", async () => {
    vi.mocked(testimonialsApi.list).mockResolvedValue([]);
    render(<TestimonialsSection />);
    expect(await screen.findByText("Maritza S")).toBeInTheDocument();
    expect(screen.getByText("What travellers say")).toBeInTheDocument();
  });

  it("shows the design testimonials when the request fails", async () => {
    vi.mocked(testimonialsApi.list).mockRejectedValue(new Error("404"));
    render(<TestimonialsSection />);
    expect(await screen.findByText("Hodan F")).toBeInTheDocument();
  });

  it("prefers testimonials from the API", async () => {
    vi.mocked(testimonialsApi.list).mockResolvedValue([
      { id: 1, author_name: "Yaa Boateng", tour_name: null, rating: 4, quote: "Lovely trip." },
    ]);
    render(<TestimonialsSection />);
    expect(await screen.findByText("Yaa Boateng")).toBeInTheDocument();
    expect(screen.queryByText("Maritza S")).not.toBeInTheDocument();
  });
});
