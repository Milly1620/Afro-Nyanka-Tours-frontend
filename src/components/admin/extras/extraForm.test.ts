import {
  emptyExtraForm,
  formFromExtra,
  parseWholeCedi,
  toExtraInput,
  validateExtraForm,
} from "@/components/admin/extras/extraForm";

describe("parseWholeCedi", () => {
  it("accepts whole numbers with thousands separators", () => {
    expect(parseWholeCedi("2,650")).toBe(2650);
  });

  it("accepts zero", () => {
    expect(parseWholeCedi("0")).toBe(0);
  });

  it.each(["", "12.5", "-3", "abc", "1e3"])("rejects %j", (value) => {
    expect(parseWholeCedi(value)).toBeNull();
  });
});

describe("validateExtraForm", () => {
  it("requires a name", () => {
    expect(validateExtraForm({ ...emptyExtraForm, price: "100" })).toBe("Enter a name for the extra.");
  });

  it("requires a whole-cedi price", () => {
    expect(validateExtraForm({ name: "Pickup", description: "", price: "10.5" })).toBe(
      "Price must be a whole number of cedis.",
    );
  });

  it("passes a complete form", () => {
    expect(validateExtraForm({ name: "Pickup", description: "", price: "150" })).toBeNull();
  });

  it("accepts an empty price and sends zero", () => {
    const values = { name: "Pickup", description: "", price: "" };
    expect(validateExtraForm(values)).toBeNull();
    expect(toExtraInput(values).default_price_ghs).toBe(0);
  });
});

describe("extra form mapping", () => {
  it("builds the request body from the form", () => {
    expect(toExtraInput({ name: "  Airport pickup ", description: " Meet and greet ", price: "1,200" })).toEqual({
      name: "Airport pickup",
      description: "Meet and greet",
      default_price_ghs: 1200,
    });
  });

  it("fills the form from an existing extra", () => {
    expect(
      formFromExtra({ id: 1, name: "Pickup", description: null, default_price_ghs: 150, is_active: true }),
    ).toEqual({ name: "Pickup", description: "", price: "150" });
  });
});
