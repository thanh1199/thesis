
import { createSlice } from "@reduxjs/toolkit";

const ctrlMove = createSlice({
    name: "move",
    initialState: 0,
    reducers: {
        toPrev: (state, action) => {
            if (state === 0) {
                return action.payload
            } else {
                return state - 1
            }
        },
        toNext: (state, action) => {
            if (state === action.payload) {
                return 0
            } else {
                return state + 1
            }
        },
        toHere: (state, action) => action.payload
    }
})

const {reducer, actions} = ctrlMove
export const { toPrev, toNext, toHere } = actions
export default reducer