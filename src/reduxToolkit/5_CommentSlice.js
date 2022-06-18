
import { createSlice } from "@reduxjs/toolkit";

const comment = createSlice({
    name: "showComment",
    initialState: false,
    reducers: {
        setShowComment: (state, action) => !state,
    }
})

const {reducer, actions} = comment
export const {setShowComment} = actions
export default reducer