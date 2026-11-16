import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { HighlightsEditor } from "@/components/admin/forms/HighlightsEditor";
import { ExtrasEditor } from "@/components/admin/listings/ExtrasEditor";
import { StopsEditor } from "@/components/admin/listings/StopsEditor";
import { MAX_HIGHLIGHTS, type DraftExtra } from "@/components/admin/listings/listingMapping";
import type { AdminExtra, Location } from "@/types/api";

const location = (id: number, name: string): Location => ({
  id,
  name,
  description: null,
  country: "Ghana",
  region: "",
  created_at: "",
});

const locations = [location(1, "Elmina"), location(2, "Kakum"), location(3, "Cape Coast")];

const catalog: AdminExtra[] = [
  { id: 1, name: "Airport pickup", description: null, default_price_ghs: 150, is_active: true },
  { id: 2, name: "Photo pack", description: null, default_price_ghs: 90, is_active: false },
  { id: 3, name: "Lunch box", description: null, default_price_ghs: 40, is_active: false },
];

function StopsHarness({ initial }: { initial: number[] }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <StopsEditor
        locations={locations}
        value={value}
        defaultCountry="Ghana"
        onChange={setValue}
        onCreateLocation={vi.fn()}
      />
      <output data-testid="ids">{value.join(",")}</output>
    </>
  );
}

function ExtrasHarness({ initial }: { initial: DraftExtra[] }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <ExtrasEditor catalog={catalog} value={value} onChange={setValue} />
      <output data-testid="extras">{JSON.stringify(value)}</output>
    </>
  );
}

function HighlightsHarness({ initial }: { initial: string[] }) {
  const [value, setValue] = useState(initial);
  return <HighlightsEditor highlights={value} onChange={setValue} />;
}

describe("StopsEditor", () => {
  it("adds a chosen location to the end of the stops", () => {
    render(<StopsHarness initial={[1]} />);
    fireEvent.change(screen.getByLabelText("Choose a stop"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Add stop" }));
    expect(screen.getByTestId("ids")).toHaveTextContent("1,2");
  });

  it("moves a stop down and removes a stop", () => {
    render(<StopsHarness initial={[1, 2, 3]} />);
    fireEvent.click(screen.getByRole("button", { name: "Move stop 1 down" }));
    expect(screen.getByTestId("ids")).toHaveTextContent("2,1,3");
    fireEvent.click(screen.getByRole("button", { name: "Remove stop 3" }));
    expect(screen.getByTestId("ids")).toHaveTextContent("2,1");
  });

  it("offers only locations that are not already stops", () => {
    render(<StopsHarness initial={[1, 2]} />);
    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual(["Choose a location…", "Cape Coast · Ghana"]);
  });
});

describe("ExtrasEditor", () => {
  it("attaches an extra with its catalogue price prefilled", () => {
    render(<ExtrasHarness initial={[]} />);
    fireEvent.click(screen.getByRole("checkbox", { name: /Airport pickup/ }));
    expect(screen.getByTestId("extras")).toHaveTextContent('[{"extraId":1,"price":"150"}]');
  });

  it("detaches an extra when unchecked", () => {
    render(<ExtrasHarness initial={[{ extraId: 1, price: "150" }]} />);
    fireEvent.click(screen.getByRole("checkbox", { name: /Airport pickup/ }));
    expect(screen.getByTestId("extras")).toHaveTextContent("[]");
  });

  it("hides inactive extras unless they are already attached", () => {
    render(<ExtrasHarness initial={[{ extraId: 2, price: "90" }]} />);
    expect(screen.getByRole("checkbox", { name: /Photo pack/ })).toBeChecked();
    expect(screen.queryByRole("checkbox", { name: /Lunch box/ })).not.toBeInTheDocument();
  });

  it("lets the price be overridden per listing", () => {
    render(<ExtrasHarness initial={[{ extraId: 1, price: "150" }]} />);
    fireEvent.change(screen.getByLabelText("Airport pickup price for this listing"), { target: { value: "200" } });
    expect(screen.getByTestId("extras")).toHaveTextContent('[{"extraId":1,"price":"200"}]');
  });
});

describe("HighlightsEditor", () => {
  it("stops offering more highlights at the maximum", () => {
    const full = Array.from({ length: MAX_HIGHLIGHTS }, (_, index) => `Highlight ${index}`);
    render(<HighlightsHarness initial={full} />);
    expect(screen.queryByRole("button", { name: "Add highlight" })).not.toBeInTheDocument();
  });

  it("adds and removes highlights", () => {
    render(<HighlightsHarness initial={["Guide"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Add highlight" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Remove highlight 1" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });
});
