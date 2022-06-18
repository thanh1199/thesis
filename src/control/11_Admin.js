import clsx from "clsx"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import { useState } from "react"
import { reloadOther } from "../reduxToolkit/12_Other"
import { useDispatch } from "react-redux"
import { getAllUser } from "../reduxToolkit/13_AllUser"
import { toAlert } from "../reduxToolkit/11_Alert"
import { reloadData } from "../reduxToolkit/0_data"


function AdminSlide ({show, close=()=>{}}) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const allWords = useSelector(state => state.other)
    const allUser_ = useSelector(state => state.allUser)
    const allUser = allUser_.length===0? [{userId: "No User", password: "・・・"}]: [...allUser_]
    const [showAllWords, setShowAllWords] = useState(false)
    const [showUserWords, setShowUserWords] = useState([false,0])
    const handleShowAllWords = (type="open") => {
        setShowAllWords(!showAllWords)
        if (type === "open") {
            fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=allWords", { method: "GET" })
            .then((response) => response.json())
            .then((obj) => {dispatch(reloadOther(obj)); console.log("loaded all of words width duplicate")})
            .catch(error => console.log(error))
        }
    }
    const handleShowUserWords = (type="open", userId=0) => {
        setShowUserWords([!showUserWords[0], userId])
        if (type === "open") {
            fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=allWords", { method: "GET" })
            .then((response) => response.json())
            .then((obj) => {dispatch(reloadOther(obj)); console.log("loaded all of words width duplicate")})
            .catch(error => console.log(error))
        }
    }
    const handleKickUser = () => {
        handleShowUserWords("close")
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=kickUser&userId="+allUser[showUserWords[1]].userId, {method: "GET"})
        .then (() => {
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET' })
            .then((response) => response.json())
            .then((obj) => obj.filter((user) => user.userId!=="ADMIN"))
            .then((allUserAvoidAdmin) => {dispatch(getAllUser(allUserAvoidAdmin)); console.log("Deleted user and loaded new all of users")})
            .catch(error => console.log(error))
        })
    }
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
        .catch(error => console.log(error))
    }
    const handleAlert = (mess) => {
        dispatch(toAlert(mess))
        const showAlert = setTimeout(() => {
            dispatch(toAlert(mess))
            return clearTimeout(showAlert)
        }, 2000)
    }
    const handleAdd = (i, from) => {
        var contentAdd = new FormData()
        if (from === "allWords") {
            contentAdd.append('word', allWords[i].word)
            contentAdd.append('mean', allWords[i].mean)
            contentAdd.append('comment', "")
            contentAdd.append('example', "")
        }
        if (from === "userWords") {
            const userWords = allWords.filter(
                (word) => word.userId===allUser[showUserWords[1]].userId
            )
            contentAdd.append('word', userWords[i].word)
            contentAdd.append('mean', userWords[i].mean)
            contentAdd.append('comment', "")
            contentAdd.append('example', "")
        }
        if (from !== undefined) {
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=addNewWord&userId="+data.userId, {
                method: 'POST',
                body: contentAdd
            })
            .then(() => {
                handleAlert("successful")
                loadUserData()
                console.log("added new word")
            })
        }
    }
    return (<div className={clsx(style.adminSlide, show? "":style.adminSlideHidden)} >
        <div className={style.adminSlideBlur} />
        <div className={clsx(style.adminBox)}>
            <div className={clsx(style.control, style.close)} onClick={() => close()}>close</div>
            <div className={clsx(style.control, style.showAllWords)} onClick={() => handleShowAllWords()}>Everyone's words</div>
            <div className={clsx(style.adminSubBox, showAllWords? "": style.adminSubBoxHidden)}>
                <div 
                    className={clsx(style.control, style.closeBox)} 
                    onClick={() => handleShowAllWords("close")}
                >Close All of Words</div>
                {
                    allWords.map((word, i) => <div key={i} className={clsx(style.adminLog)}>
                        {i+1}_ {word.word}: {word.mean} 
                        <span>{word.wordId}, {word.userId}</span>
                        <div 
                            className={clsx(
                                style.log_option, 
                                data.words.find((wordInData) => wordInData.word===word.word) === undefined ?
                                style.log_go : style.log_haven
                            )}
                            onClick={() => handleAdd(i, "userWords")}
                        >{data.words.find((wordInData) => wordInData.word===word.word) === undefined ? "+" : "✔️"}</div>
                    </div>)
                }
            </div>
            <div className={clsx(style.allUser)}>{
                allUser.map((user, i) => <div 
                    key={i} 
                    className={clsx(style.adminLog, style.adminLogHover)}
                    onClick={() => handleShowUserWords("open", i)}
                    > {i+1}_ {user.userId} 
                    <span>{allWords.filter((word) => word.userId===user.userId).length} word(s)</span>
                </div>)
            }</div>
            <div className={clsx(style.adminSubBox, showUserWords[0]? "":style.adminSubBoxHidden)}>
                <div 
                    className={clsx(style.control, style.closeBox)} 
                    onClick={() => handleShowUserWords("close")}
                >Close</div>
                <div 
                    className={clsx(style.control, style.kickOut)} 
                    onClick={() => handleKickUser(showUserWords[1])}
                >Kick out this User</div>
                <div style={{textAlign: "center", marginBottom: "10px"}}>
                    {allUser[showUserWords[1]].userId}_({allUser[showUserWords[1]].password})
                </div>
                {
                    allWords.filter(
                        (word) => word.userId===allUser[showUserWords[1]].userId
                    ).map((word, i) => <div key={i} className={clsx(style.adminLog)}>
                        {i+1}_ {word.word}: {word.mean}
                        <span>{word.wordId}</span>
                        <div 
                            className={clsx(
                                style.log_option, 
                                data.words.find((wordInData) => wordInData.word===word.word) === undefined ?
                                style.log_go : style.log_haven
                            )}
                            onClick={() => handleAdd(i, "userWords")}
                        >{data.words.find((wordInData) => wordInData.word===word.word) === undefined ? "+" : "✔️"}</div>
                    </div>)
                }
            </div>
        </div>
    </div>)
}

export default AdminSlide