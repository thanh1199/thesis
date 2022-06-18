
import { createSlice } from "@reduxjs/toolkit";

const clear = createSlice({
    name: "showClear",
    initialState: false,
    reducers: {
        setShowClear: (state, action) => !state,
    }
})

const {reducer, actions} = clear
export const {setShowClear} = actions
export default reducer