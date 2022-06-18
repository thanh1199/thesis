
import clsx from "clsx";
import style from "../style.module.scss";
import { useDispatch } from "react-redux";
import { toCheckAnswer } from "../reduxToolkit/3_AnswerSlice";
import { useSelector } from "react-redux";

function Answer () {
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    
    const mean = data.words[now].mean
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(toCheckAnswer(mean))
    }
    return (
        <div 
            className={clsx(style.ctrl)} 
            id={clsx(style.ctrlAnswer)}
            onClick= {handleClick}
        >Answer</div>
    )
}

export default Answer