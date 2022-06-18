
import clsx from "clsx"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import { setShowAdd } from "../reduxToolkit/9_AddSlice"
import { Fragment } from "react"
import {EditAddSlide} from "./0_OnTopSlide"

function Add () {
    const showAdd = useSelector(state => state.add)
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setShowAdd())
    }

    if (showAdd) {
        return (
            <Fragment>
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlAdd)}
                onClick={() => handleClick()}
            >Add</div>
            <EditAddSlide name="Add" close={handleClick} />
            </Fragment>
        )
    } else {
        return (
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlAdd)}
                onClick={() => handleClick()}
            >Add</div>
        )
    }
}

export default Add