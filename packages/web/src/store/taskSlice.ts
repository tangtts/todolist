import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  sideTxt: string;
  chosenId:number
}
const initialState: CounterState = {
  sideTxt: "",
  chosenId:0
};

export const TaskSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    changeSideTxt: (state, { payload }) => {
      state.sideTxt = payload;
    },
    setChosenId:(state, { payload })=>{
      state.chosenId = payload;
    }
  },
});

export const { changeSideTxt,setChosenId } = TaskSlice.actions;

export default TaskSlice.reducer;
