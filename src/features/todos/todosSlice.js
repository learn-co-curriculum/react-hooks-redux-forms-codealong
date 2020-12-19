import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    entities: [], // array of todos
  },
  reducers: {
    todoAdded(state, action) {
      // using createSlice lets us mutate state!
      state.entities.push(action.payload);
    },
  },
});

export const { todoAdded } = todosSlice.actions;

export default todosSlice.reducer;
