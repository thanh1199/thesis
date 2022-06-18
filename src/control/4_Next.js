
import clsx from "clsx"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { toNext } from "../reduxToolkit/2-4_MoveSlice"
import { toClearAnswer } from "../reduxToolkit/3_AnswerSlice"
import style from "../style.module.scss"

function Next () {
    const data = useSelector(state => state.data)
    const total = data.words.length
    
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(toNext(total-1))
        dispatch(toClearAnswer())
    }
    return (
        <div 
            className={clsx(style.ctrl)} 
            id={clsx(style.ctrlNext)}
            onClick={handleClick}
        > &gt;&gt; </div>
    )
}

export default Next