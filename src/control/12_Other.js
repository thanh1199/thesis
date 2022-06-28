import { useDispatch, useSelector } from "react-redux"
import { toAlert } from "../reduxToolkit/11_Alert"
import { reloadData } from "../reduxToolkit/0_data"
import clsx from "clsx"
import style from "../style.module.scss"

function OtherSlide ({show, close=()=>{}}) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const other = useSelector(state => state.other)
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
        .catch(error => console.log(error))
    }
    const handleAlert = ([type, mess]) => {
        dispatch(toAlert([type, mess]))
        const showAlert = setTimeout(() => {
            dispatch(toAlert([type, mess]))
            return clearTimeout(showAlert)
        }, 3000)
    }

    const urlAddWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=addNewWord&userId="+data.userId
    const handleAdd = (i) => {
        var contentAdd = new FormData()
        contentAdd.append('word', other[i].word)
        contentAdd.append('mean', other[i].mean)
        contentAdd.append('comment', "")
        contentAdd.append('example', "")
        fetch(urlAddWord, {
            method: 'POST',
            body: contentAdd
        })
        .then(() => {
            handleAlert("success", "Added successfully")
            loadUserData()
            console.log("added new word")
        })
    }

    return (
        <div className={clsx(style.onTop, show? "":style.onTopHidden)} >
            <div className={clsx(style.onTop_blur)}></div>
            <div className={clsx(style.onTop_close)} onClick={() => close()} >Close Vocabulary </div>
            <div className={clsx(style.onTop_box)} style={{height: "80vh", borderRadius: "20px 0 20px 20px"}}>{
                other.map((word, i) => {
                    var haveYet = data.words.find((wordInData) => wordInData.word===word.word)
                    return (<div key={i} className={clsx(style.list_word)} >
                        {i+1}_ {word.word}: {word.mean}
                        <span>{word.userId}</span>
                        <div 
                            className={clsx(style.list_option, haveYet === undefined ?style.list_go : style.list_haven)}
                            onClick={haveYet===undefined? () => handleAdd(i) : () => {}}
                        >{haveYet === undefined ? "+" : "✔️"}</div>
                    </div>)
                })
            }</div>
        </div>
    )
}

export default OtherSlide