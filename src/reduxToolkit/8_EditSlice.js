
import { createSlice } from "@reduxjs/toolkit";

const edit = createSlice({
    name: "showEdit",
    initialState: false,
    reducers: {
        setShowEdit: (state, action) => !state,
    }
})

const {reducer, actions} = edit
export const {setShowEdit} = actions
export default reducer