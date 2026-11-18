import adminReducer, { setAdminEmail, signIn, signOut } from "@/adminSlice";

const initialState = adminReducer(undefined, { type: "init" });

describe("adminSlice", () => {
  it("starts signed out when no session is stored", () => {
    expect(initialState).toEqual({ isSignedIn: false, email: null });
  });

  it("signs the admin in", () => {
    expect(adminReducer(initialState, signIn()).isSignedIn).toBe(true);
  });

  it("remembers the admin email", () => {
    expect(adminReducer(initialState, setAdminEmail("owner@example.com")).email).toBe("owner@example.com");
  });

  it("clears the email on sign out", () => {
    const signedIn = adminReducer(adminReducer(initialState, signIn()), setAdminEmail("owner@example.com"));
    expect(adminReducer(signedIn, signOut())).toEqual({ isSignedIn: false, email: null });
  });
});
