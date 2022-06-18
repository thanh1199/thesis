
import { createSlice } from "@reduxjs/toolkit";

const alert = createSlice({
    name: "alert",
    initialState: [false, false],
    reducers: {
        toAlert: (state, action) => {
            var newState = [...state]
            if (action.payload === "successful") {
                newState[0] = !state[0]
                return [...newState]
            }
            if (action.payload === "passwordMissing") {
                newState[1] = !state[1]
                return [...newState]
            }
        }
    }
})

const {reducer, actions} = alert
export const {toAlert} = actions
export default reducer