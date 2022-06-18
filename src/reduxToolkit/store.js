
import { configureStore } from "@reduxjs/toolkit";
import newData from "./0_data";
import moveReducer from "./2-4_MoveSlice";
import answerReducer from "./3_AnswerSlice";
import commentReducer from "./5_CommentSlice";
import exampleReducer from "./6_ExampleSlice";
import editReducer from "./8_EditSlice";
import addReducer from "./9_AddSlice";
import clearReducer from "./10_ClearSlice"
import alertReducer from "./11_Alert";
import otherReducer from "./12_Other";
import allUserReducer from "./13_AllUser"

const rootReducer = {
    data: newData,
    move: moveReducer,
    answer: answerReducer,
    comment: commentReducer,
    example: exampleReducer,
    edit: editReducer,
    add: addReducer,
    clear: clearReducer,
    alert: alertReducer,
    other: otherReducer,
    allUser: allUserReducer
}

const store = configureStore({
    reducer: rootReducer
})

export default store