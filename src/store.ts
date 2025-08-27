import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { Tour } from "@/types/api";

interface SearchData {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
  toursData: Tour[]; // Add tour data for mapping
}

interface BookingState {
  searchData: SearchData | null;
}

const initialState: BookingState = {
  searchData: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    clearSearchData: (state) => {
      state.searchData = null;
    },
  },
});

export const { setSearchData, clearSearchData } = bookingSlice.actions;

const store = configureStore({
  reducer: {
    booking: bookingSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
