import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { hasAdminSession } from "@/lib/adminSession";

export interface AdminState {
  isSignedIn: boolean;
  email: string | null;
}

const initialState: AdminState = {
  isSignedIn: hasAdminSession(),
  email: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signIn: (state) => {
      state.isSignedIn = true;
    },
    signOut: (state) => {
      state.isSignedIn = false;
      state.email = null;
    },
    setAdminEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { signIn, signOut, setAdminEmail } = adminSlice.actions;

export default adminSlice.reducer;
