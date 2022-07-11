
import { createSlice } from "@reduxjs/toolkit";

const question = createSlice({
    name: "question",
    initialState: {incre: -1, id: "", userId: "", keyword: "", content: "", liked: ""},
    reducers: {
        changeQuestion: (state, action) => {
            const newQuestion = {...action.payload}
            return newQuestion
        }
    }
})

const {reducer, actions} = question
export const {changeQuestion} = actions
export default reducer