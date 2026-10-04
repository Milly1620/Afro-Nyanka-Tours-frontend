import adminReducer, {
  deleteTour,
  editTour,
  saveEventDraft,
  saveTourDraft,
  setNotificationPreference,
  signIn,
  startNewTour,
  updateTourDraft,
} from "@/adminSlice";

const initialState = adminReducer(undefined, { type: "init" });

describe("adminSlice", () => {
  it("signs the admin in", () => {
    expect(adminReducer(initialState, signIn()).isSignedIn).toBe(true);
  });

  it("publishes the event draft to the top of the events list and resets the draft", () => {
    const state = adminReducer(initialState, saveEventDraft("published"));
    expect(state.events[0]).toMatchObject({
      name: "Serengeti Migration Safari",
      country: "Tanzania",
      durationDays: 8,
      price: 42000,
      status: "published",
    });
    expect(state.events).toHaveLength(initialState.events.length + 1);
  });

  it("saves a new tour as a draft with its named activities counted", () => {
    const withName = adminReducer(initialState, updateTourDraft({ name: "Volta Lake Cruise", destination: "Akosombo, Ghana" }));
    const state = adminReducer(withName, saveTourDraft("draft"));
    expect(state.tours[0]).toMatchObject({
      name: "Volta Lake Cruise",
      location: "Akosombo",
      activitiesCount: 3,
      status: "draft",
    });
  });

  it("updates the existing tour in place when saving an edit", () => {
    const editing = adminReducer(initialState, editTour("tour-2"));
    expect(editing.tourDraft.name).toBe("Tamale Cultural Trail");
    const renamed = adminReducer(editing, updateTourDraft({ name: "Tamale Heritage Trail" }));
    const state = adminReducer(renamed, saveTourDraft("published"));
    expect(state.tours).toHaveLength(initialState.tours.length);
    expect(state.tours.find((tour) => tour.id === "tour-2")?.name).toBe("Tamale Heritage Trail");
    expect(state.editingTourId).toBeNull();
  });

  it("clears edit mode when starting a new tour", () => {
    const editing = adminReducer(initialState, editTour("tour-1"));
    const state = adminReducer(editing, startNewTour());
    expect(state.editingTourId).toBeNull();
    expect(state.tourDraft).toEqual(initialState.tourDraft);
  });

  it("removes a deleted tour", () => {
    const state = adminReducer(initialState, deleteTour("tour-1"));
    expect(state.tours.some((tour) => tour.id === "tour-1")).toBe(false);
  });

  it("toggles a notification preference", () => {
    const state = adminReducer(initialState, setNotificationPreference({ key: "weeklySummary", value: true }));
    expect(state.notifications.weeklySummary).toBe(true);
  });
});
