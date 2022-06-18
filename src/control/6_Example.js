
import clsx from "clsx"
import { Fragment } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { setShowExample } from "../reduxToolkit/6_ExampleSlice"
import style from "../style.module.scss"
import {ComExaSilde} from "./0_OnTopSlide"

function Example () {
    const showExample = useSelector(state => state.example)

    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(setShowExample())
    }
    if (showExample) {
        return (
            <Fragment>
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlExample)}
                onClick={() => handleClick()}
            >Example</div>
            <ComExaSilde name="Example" close={handleClick} />
            </Fragment>
        )
    } else {
        return (
            <div 
                className={clsx(style.ctrl)} 
                id={clsx(style.ctrlExample)}
                onClick={() => handleClick()}
            >Example</div>
        )
    }
}

export default Example