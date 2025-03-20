import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    adduser: (_state, action) => {
      return action.payload;
    },
    removeuser: (_state, _action) => {
      return null;
    },
  },
});

export const { adduser, removeuser } = userslice.actions;
export default userslice.reducer;
