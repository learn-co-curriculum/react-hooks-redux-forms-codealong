import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    entities: [], // array of todos
  },
  reducers: {
    todoAdded(state, action) {
      // update meeee
    },
  },
});

export const { todoAdded } = todosSlice.actions;

export default todosSlice.reducer;
