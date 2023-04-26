import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  sideTxt: string;
  chosenId:number,
  hasDeleteSide:boolean,
  sideNum:number
}
const initialState: CounterState = {
  sideTxt: "",
  chosenId:0,
  hasDeleteSide:false,
  sideNum:0
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
    },
    deleteSide(state, { payload }){
      state.hasDeleteSide = payload
    },
    setSideNum(state, { payload }){
      state.sideNum = payload
    }
  },
});

export const { changeSideTxt,setChosenId,deleteSide,setSideNum } = TaskSlice.actions;

export default TaskSlice.reducer;
