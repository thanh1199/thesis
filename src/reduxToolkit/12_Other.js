
import { createSlice } from "@reduxjs/toolkit";

const other = createSlice({
    name: "other",
    initialState: [],
    reducers: {
        reloadOther: (state, action) => action.payload
    }
})

const {reducer, actions} = other
export const {reloadOther} = actions
export default reducer