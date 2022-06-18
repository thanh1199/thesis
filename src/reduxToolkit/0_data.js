
import { createSlice } from "@reduxjs/toolkit";

const data = createSlice({
    name: "data",
    initialState: {},
    reducers: {
        reloadData: (state, action) => action.payload
    }
})

const {reducer, actions} = data
export const {reloadData} = actions
export default reducer