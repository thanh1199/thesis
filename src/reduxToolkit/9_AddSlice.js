
import { createSlice } from "@reduxjs/toolkit";

const add = createSlice({
    name: "showAdd",
    initialState: false,
    reducers: {
        setShowAdd: (state, action) => !state,
    }
})

const {reducer, actions} = add
export const {setShowAdd} = actions
export default reducer