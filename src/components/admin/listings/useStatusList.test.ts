import { PAGE_SIZE, paramsFor } from "@/components/admin/listings/useStatusList";

describe("paramsFor", () => {
  it("omits the status for the all tab", () => {
    expect(paramsFor("all", 0)).toEqual({ skip: 0, limit: PAGE_SIZE });
  });

  it("filters by status and pages by offset", () => {
    expect(paramsFor("scheduled", 2)).toEqual({ status: "scheduled", skip: PAGE_SIZE * 2, limit: PAGE_SIZE });
  });
});
