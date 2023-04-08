
import clsx from "clsx"
import { useSelector } from "react-redux"
import style from "../style.module.scss"

function Search () {
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)

    const word = data.words[now].word
    return (
        <div className={clsx(style.ctrl)} id={clsx(style.ctrlSearch)}>
            <a rel="noreferrer" target='_blank' href={`http://www.google.com/search?q=${word}+translate`}>Search</a>
        </div>
    )
}

export default Search