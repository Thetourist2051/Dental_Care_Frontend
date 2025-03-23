import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../enum-dictionary/UserInterface/UserInteface";

const initialState: UserInterface | null = null;

const userslice = createSlice({
  name: "user",
  initialState: initialState as UserInterface | null,
  reducers: {
    adduser: (_state, action: PayloadAction<UserInterface | null>) => {
      return action.payload;
    },
    removeuser: (_state, _action: PayloadAction<void>) => {
      return null;
    },
  },
});

export const { adduser, removeuser } = userslice.actions;
export default userslice.reducer;