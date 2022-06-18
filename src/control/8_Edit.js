
import clsx from "clsx"
import { Fragment } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import {EditAddSlide} from "./0_OnTopSlide"
import { setShowEdit } from "../reduxToolkit/8_EditSlice"

function Edit () {
    const showEdit = useSelector(state => state.edit)
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(setShowEdit())
    }

    if (showEdit) {
        return (
            <Fragment>
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlEdit)}
                onClick={() => handleClick()}
            >Edit</div>
            <EditAddSlide name="Edit" close={handleClick} />
            </Fragment>
        )
    } else {
        return (
        <div 
            className={clsx(style.ctrl)} 
            id={clsx(style.ctrlEdit)}
            onClick={() => handleClick()}
        >Edit</div>
        )
    }
}

export default Edit