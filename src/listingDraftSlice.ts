import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { emptyDraft, type ListingDraft } from "@/components/admin/listings/listingMapping";

export interface ListingDraftState {
  tourDraft: ListingDraft;
  eventDraft: ListingDraft;
}

const initialState: ListingDraftState = {
  tourDraft: emptyDraft(),
  eventDraft: emptyDraft(),
};

const listingDraftSlice = createSlice({
  name: "listingDraft",
  initialState,
  reducers: {
    updateTourDraft: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      state.tourDraft = { ...state.tourDraft, ...action.payload };
    },
    updateEventDraft: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      state.eventDraft = { ...state.eventDraft, ...action.payload };
    },
    loadTourDraft: (state, action: PayloadAction<ListingDraft>) => {
      state.tourDraft = action.payload;
    },
    loadEventDraft: (state, action: PayloadAction<ListingDraft>) => {
      state.eventDraft = action.payload;
    },
    resetTourDraft: (state) => {
      state.tourDraft = emptyDraft();
    },
    resetEventDraft: (state) => {
      state.eventDraft = emptyDraft();
    },
  },
});

export const {
  updateTourDraft,
  updateEventDraft,
  loadTourDraft,
  loadEventDraft,
  resetTourDraft,
  resetEventDraft,
} = listingDraftSlice.actions;

export default listingDraftSlice.reducer;
