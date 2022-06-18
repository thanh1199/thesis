
import clsx from "clsx"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { toPrev } from "../reduxToolkit/2-4_MoveSlice"
import { toClearAnswer } from "../reduxToolkit/3_AnswerSlice"
import style from "../style.module.scss"

function Prev () {
    const data = useSelector(state => state.data)
    const total = data.words.length

    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(toPrev(total-1))
        dispatch(toClearAnswer())
    }

    return (
        <div 
            className={clsx(style.ctrl)} 
            id={clsx(style.ctrlPrev)}
            onClick={handleClick}
        > &lt;&lt; </div>
    )
}

export default Prev