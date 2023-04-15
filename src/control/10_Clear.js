
import clsx from "clsx"
import style from "../style.module.scss"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setShowClear } from "../reduxToolkit/10_ClearSlice"
import { Fragment } from "react"
import {ClearSlide, DataSlide} from "./0_OnTopSlide"

function Clear () {
    const showClear = useSelector(state => state.clear)
    const data = useSelector(state => state.data)
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setShowClear())
    }
    const content = data.words.length === 1 ? "Default" : "Clear"

    if (showClear) {
        return (
            <Fragment>
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlClear)}
                onClick={() => handleClick()}
            >{content}</div>
            {data.words.length === 1 ? <DataSlide close={handleClick} /> : <ClearSlide close={handleClick} />}
            </Fragment>
        )
    } else {
        return (
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlDefault)}
                onClick={() => handleClick()}
            >{content}</div>
        )
    }
}

export default Clear