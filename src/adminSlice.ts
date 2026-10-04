import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialCompanyProfile,
  initialEventDraft,
  initialEvents,
  initialNotificationPreferences,
  initialTourDraft,
  initialTours,
} from "@/data/adminMockData";
import { parseAmount } from "@/lib/adminFormat";
import type {
  AdminEvent,
  AdminTour,
  CompanyProfile,
  ListingDraft,
  NotificationPreferences,
  PublishStatus,
} from "@/types/admin";

export interface AdminState {
  isSignedIn: boolean;
  events: AdminEvent[];
  tours: AdminTour[];
  eventDraft: ListingDraft;
  tourDraft: ListingDraft;
  editingTourId: string | null;
  company: CompanyProfile;
  notifications: NotificationPreferences;
}

const initialState: AdminState = {
  isSignedIn: false,
  events: initialEvents,
  tours: initialTours,
  eventDraft: initialEventDraft,
  tourDraft: initialTourDraft,
  editingTourId: null,
  company: initialCompanyProfile,
  notifications: initialNotificationPreferences,
};

function countryOf(destination: string): string {
  const parts = destination.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? destination;
}

function cityOf(destination: string): string {
  return destination.split(",")[0]?.trim() ?? destination;
}

function eventFromDraft(draft: ListingDraft, status: PublishStatus): AdminEvent {
  return {
    id: `evt-${Date.now()}`,
    name: draft.name.trim(),
    country: countryOf(draft.destination),
    durationDays: Number(draft.durationDays) || 1,
    price: parseAmount(draft.price),
    coverImage: draft.coverImage,
    status,
  };
}

function tourFromDraft(draft: ListingDraft, status: PublishStatus): AdminTour {
  return {
    id: `tour-${Date.now()}`,
    name: draft.name.trim(),
    location: cityOf(draft.destination),
    durationDays: Number(draft.durationDays) || 1,
    price: parseAmount(draft.price),
    activitiesCount: draft.activities.filter((activity) => activity.name.trim()).length,
    coverImage: draft.coverImage,
    status,
  };
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signIn: (state) => {
      state.isSignedIn = true;
    },
    signOut: (state) => {
      state.isSignedIn = false;
    },
    updateEventDraft: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      state.eventDraft = { ...state.eventDraft, ...action.payload };
    },
    updateTourDraft: (state, action: PayloadAction<Partial<ListingDraft>>) => {
      state.tourDraft = { ...state.tourDraft, ...action.payload };
    },
    saveEventDraft: (state, action: PayloadAction<PublishStatus>) => {
      state.events.unshift(eventFromDraft(state.eventDraft, action.payload));
      state.eventDraft = initialEventDraft;
    },
    startNewTour: (state) => {
      state.editingTourId = null;
      state.tourDraft = initialTourDraft;
    },
    editTour: (state, action: PayloadAction<string>) => {
      const tour = state.tours.find((item) => item.id === action.payload);
      if (!tour) return;
      state.editingTourId = tour.id;
      state.tourDraft = {
        ...initialTourDraft,
        name: tour.name,
        destination: tour.location,
        durationDays: String(tour.durationDays),
        price: tour.price.toLocaleString("en-US"),
        coverImage: tour.coverImage,
      };
    },
    saveTourDraft: (state, action: PayloadAction<PublishStatus>) => {
      const saved = tourFromDraft(state.tourDraft, action.payload);
      const editingIndex = state.tours.findIndex((tour) => tour.id === state.editingTourId);
      if (editingIndex >= 0) {
        state.tours[editingIndex] = { ...saved, id: state.tours[editingIndex].id };
      } else {
        state.tours.unshift(saved);
      }
      state.editingTourId = null;
      state.tourDraft = initialTourDraft;
    },
    deleteTour: (state, action: PayloadAction<string>) => {
      state.tours = state.tours.filter((tour) => tour.id !== action.payload);
    },
    updateCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
      state.company = action.payload;
    },
    setNotificationPreference: (
      state,
      action: PayloadAction<{ key: keyof NotificationPreferences; value: boolean }>,
    ) => {
      state.notifications[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  signIn,
  signOut,
  updateEventDraft,
  updateTourDraft,
  saveEventDraft,
  saveTourDraft,
  startNewTour,
  editTour,
  deleteTour,
  updateCompanyProfile,
  setNotificationPreference,
} = adminSlice.actions;

export default adminSlice.reducer;
