import reducer, {
  loadEventDraft,
  loadTourDraft,
  resetEventDraft,
  resetTourDraft,
  updateEventDraft,
  updateTourDraft,
} from "@/listingDraftSlice";
import { emptyDraft } from "@/components/admin/listings/listingMapping";

const initialState = reducer(undefined, { type: "init" });

describe("listingDraftSlice", () => {
  it("starts with empty drafts and no sample content", () => {
    expect(initialState.tourDraft).toEqual(emptyDraft());
    expect(initialState.eventDraft).toEqual(emptyDraft());
  });

  it("merges tour changes without touching the event draft", () => {
    const state = reducer(initialState, updateTourDraft({ name: "Volta Lake Cruise" }));
    expect(state.tourDraft.name).toBe("Volta Lake Cruise");
    expect(state.eventDraft.name).toBe("");
  });

  it("merges event changes without touching the tour draft", () => {
    const state = reducer(initialState, updateEventDraft({ destination: "Accra" }));
    expect(state.eventDraft.destination).toBe("Accra");
    expect(state.tourDraft.destination).toBe("");
  });

  it("replaces a draft when loading an existing listing", () => {
    const loaded = { ...emptyDraft(), name: "Loaded tour" };
    expect(reducer(initialState, loadTourDraft(loaded)).tourDraft.name).toBe("Loaded tour");
    expect(reducer(initialState, loadEventDraft(loaded)).eventDraft.name).toBe("Loaded tour");
  });

  it("resets a draft back to empty", () => {
    const edited = reducer(initialState, updateTourDraft({ name: "Draft" }));
    expect(reducer(edited, resetTourDraft()).tourDraft).toEqual(emptyDraft());
    const editedEvent = reducer(initialState, updateEventDraft({ name: "Draft" }));
    expect(reducer(editedEvent, resetEventDraft()).eventDraft).toEqual(emptyDraft());
  });
});
