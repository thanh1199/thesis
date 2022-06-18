
import clsx from "clsx"
import style from "./style.module.scss"

import Important from "./control/1_Important"
import Prev from "./control/2_Prev"
import Answer from "./control/3_Answer"
import Next from "./control/4_Next"
import Comment from "./control/5_Comment"
import Example from "./control/6_Example"
import Search from "./control/7_Search"
import Edit from "./control/8_Edit"
import Add from "./control/9_Add"
import Clear from "./control/10_Clear"
import { useSelector } from "react-redux"

function Control () {
    const data = useSelector(state => state.data)
    if (data.userId === undefined) {
        return (
            <div></div>
        )
    } else {
        return (
            <div id={clsx(style.control)}>
                <Important />
                <Prev />
                <Answer />
                <Next />
                <Comment />
                <Example />
                <Search />
                <Edit />
                <Add />
                <Clear />
            </div>
        )
    }
}

export default Control