
import { createSlice } from "@reduxjs/toolkit";

const ctrlAnswer = createSlice({
    name: "answer",
    initialState: {userAnswer: "", result: undefined},
    reducers: {
        toClearAnswer: (state, action) => {
            return {userAnswer: "", result: undefined}
        },
        toSetAnswer: (state, action) => {
            return {...state, userAnswer: action.payload}
        },
        toCheckAnswer: (state, action) => {
            if (state.userAnswer === action.payload) {
                return {...state, result: true}
            } else {
                return {...state, result: false}
            }
        }
    }
})

const {reducer, actions} = ctrlAnswer
export const { toClearAnswer, toSetAnswer, toCheckAnswer } = actions
export default reducer