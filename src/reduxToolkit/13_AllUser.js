
import { createSlice } from "@reduxjs/toolkit";

const allUser = createSlice({
    name: "allUser",
    initialState: [],
    reducers: {
        getAllUser: (state, action) => action.payload
    }
})

const {reducer, actions} = allUser
export const {getAllUser} = actions
export default reducer