
import clsx from "clsx"
import { Fragment } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { setShowComment } from "../reduxToolkit/5_CommentSlice"
import style from "../style.module.scss"
import {ComExaSilde} from "./0_OnTopSlide"

function Comment () {

    const showComment = useSelector(state => state.comment)
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setShowComment())
    }

    if (showComment) {
        return (
            <Fragment>
                <div 
                    className={clsx(style.ctrl)} 
                    id={clsx(style.ctrlComment)}
                    onClick={() => handleClick()}
                >Comment</div>
                <ComExaSilde name="Comment" close={handleClick} /> 
            </Fragment>)
    } else {
        return (
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlComment)}
                onClick={() => handleClick()}
            >Comment</div>
        )
    }
}

export default Comment