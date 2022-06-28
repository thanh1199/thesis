
import { createSlice } from "@reduxjs/toolkit";

const alert = createSlice({
    name: "alert",
    initialState: [{show: false, mess: ""}, {show: false, mess: ""}, {show: false, mess: ""}],
    reducers: {
        toAlert: (state, action) => {
            var newState = [...state]
            if (action.payload[0] === "success") {
                newState[0] = {...newState[0], show: !state[0].show, mess: action.payload[1]}
            }
            if (action.payload[0] === "fail") {
                newState[1] = {...newState[1], show: !state[1].show, mess: action.payload[1]}
            }
            if (action.payload[0] === "quest") {
                newState[2] = {...newState[2], show: !state[2].show, mess: action.payload[1]}
            }
            return newState
        }
    }
})

const {reducer, actions} = alert
export const {toAlert} = actions
export default reducer