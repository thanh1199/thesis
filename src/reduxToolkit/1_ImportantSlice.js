
import { createSlice } from "@reduxjs/toolkit";

const ctrlImportant = createSlice({
    name: "important",
    initialState: false,
    reducers: {
        setImportant: (state, action) => action.payload,
        toBeImportant: (state, action) => !state
    }
})

const {reducer, actions} = ctrlImportant
export const {toBeImportant, setImportant} = actions
export default reducer