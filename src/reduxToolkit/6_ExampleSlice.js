
import { createSlice } from "@reduxjs/toolkit";

const example = createSlice({
    name: "showExample",
    initialState: false,
    reducers: {
        setShowExample: (state, action) => !state,
    }
})

const {reducer, actions} = example
export const {setShowExample} = actions
export default reducer