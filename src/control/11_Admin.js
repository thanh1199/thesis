import clsx from "clsx"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import { useState } from "react"
import { reloadOther } from "../reduxToolkit/12_Other"
import { useDispatch } from "react-redux"
import { getAllUser } from "../reduxToolkit/13_AllUser"
import { toAlert } from "../reduxToolkit/11_Alert"
import { reloadData } from "../reduxToolkit/0_data"
import { EditAddSlide } from "./0_OnTopSlide"


function AdminSlide ({show, close=()=>{}}) {
    const dispatch = useDispatch()

    const handleAlert = ([type, mess]) => {
        dispatch(toAlert([type, mess]))
        const showAlert = setTimeout(() => {
            dispatch(toAlert([type, mess]))
            return clearTimeout(showAlert)
        }, 3000)
    }
    const data = useSelector(state => state.data)
    const allWords = useSelector(state => state.other)
    const allUser_ = useSelector(state => state.allUser)
    const allUser = allUser_.length===0? [{userId: "No User", password: "・・・"}]: [...allUser_]
    const [showAllWords, setShowAllWords] = useState(false)
    const [showGiveWord, setShowGiveWord] = useState(false)
    const [showUserWords, setShowUserWords] = useState([false, 0])

    const handleShowAllWords = (type="open") => {
        setShowAllWords(!showAllWords)
        if (type === "open") {
            fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=allWords", { method: "GET", mode: "no-cors" })
            .then((response) => response.json())
            .then((obj) => {dispatch(reloadOther(obj)); console.log("loaded all of words width duplicate")})
            .catch(error => console.log(error))
        }
    }
    const handleShowGiveWord = () => {
        setShowGiveWord(!showGiveWord)
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
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=kickUser&userId="+allUser[showUserWords[1]].userId, {method: "GET", mode: "no-cors"})
        .then (() => {
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET', mode: "no-cors" })
            .then((response) => response.json())
            .then((obj) => obj.filter((user) => user.userId!=="ADMIN"))
            .then((allUserAvoidAdmin) => {
                dispatch(getAllUser(allUserAvoidAdmin)) 
                console.log("Deleted user and loaded new all of users")
                handleAlert(["success", "Deleted user "+allUser[showUserWords[1]].userId])
            })
            .catch((error) => console.log(error))
        })
    }
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET', mode: "no-cors" })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
        .catch(error => console.log(error))
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
                body: contentAdd, mode: "no-cors"
            })
            .then(() => {
                handleAlert(["success", "Added successfully"])
                loadUserData()
                console.log("added new word")
            })
        }
    }
    const handleMask = (e, type) => {
        if (type === "showPassword") {
            e.target.className = clsx(style.mask, style.unMask)
        } else if (type === "hiddenPassword") {
            e.target.className = clsx(style.mask)
        }
    }
    return (<div className={clsx(style.onTop, show? "":style.onTopHidden)} >
        <div className={clsx(style.onTop_blur)} />
        <div className={clsx(style.onTop_close)} onClick={() => close()}>Close Users and Words</div>
        <div className={clsx(style.onTop_box, style.onTop_box_full)}>
            <div className={clsx(style.controlContainer)}>
                <div className={clsx(style.control)} onClick={() => handleShowAllWords()}>Everyone's words</div>
                <div className={clsx(style.control)} onClick={() => handleShowGiveWord()}>Give word</div>
            </div>
            {allUser.map((user, i) => <div 
                key={i} 
                className={clsx(style.adminLog, style.adminLogHover)}
                onClick={() => handleShowUserWords("open", i)}
                > {i+1}_ {user.userId} 
                <span>word: {allWords.filter((word) => word.userId===user.userId).length}</span>
                <span>score: {user.score}</span>
            </div>)}

            <div className={clsx(style.onTop, showAllWords? "": style.onTopHidden)}>
                <div className={clsx(style.onTop_blur)} />
                <div 
                    className={clsx(style.onTop_close)} 
                    onClick={() => handleShowAllWords("close")}
                >Close Everyone's words</div>
                <div className={clsx(style.onTop_box, style.onTop_box_full)}>{
                    allWords.map((word, i) => {
                        var haveYet = data.words.find((wordInData) => wordInData.word===word.word)
                        return (<div key={i} className={clsx(style.adminLog)}>
                            {i+1}_ {word.word}: {word.mean} 
                            <span>{word.wordId}, {word.userId}</span>
                            <div 
                                className={clsx(style.log_option, haveYet === undefined ? style.log_go : style.log_haven)}
                                onClick={haveYet === undefined ? () => handleAdd(i, "allWords") : () => {}}
                            >{haveYet === undefined ? "+" : "✔️"}</div>
                        </div>)
                        
                    })
                }</div>
            </div>

            <div style={{display: showGiveWord? "block" : "none"}}>
                <EditAddSlide name="Add Word To Everyone" close={() => handleShowGiveWord()} />
            </div>

            <div className={clsx(style.onTop, showUserWords[0]? "":style.onTopHidden)}>
                <div className={clsx(style.onTop_blur)} />
                <div 
                    className={clsx(style.onTop_close)} 
                    onClick={() => handleShowUserWords("close")}
                >Close {allUser[showUserWords[1]].userId}</div>
                <div className={clsx(style.onTop_box, style.onTop_box_full)}>
                <div 
                    className={clsx(style.kickOut)} 
                    onClick={() => handleKickUser(showUserWords[1])}
                >Kick out this User</div>
                <div className={style.showPassword}>
                    {allUser[showUserWords[1]].userId} → 
                    (<span>
                        {allUser[showUserWords[1]].password}
                        <div 
                            className={style.mask} 
                            onMouseDown={(e) => handleMask(e, "showPassword")}
                            onMouseUp={(e) => handleMask(e, "hiddenPassword")}
                        >{allUser[showUserWords[1]].password.split("").map(() => ".")}</div>
                    </span>)
                    ・score: {allUser[showUserWords[1]].score}
                </div>
                {
                    allWords.filter(
                        (word) => word.userId===allUser[showUserWords[1]].userId
                    ).map((word, i) => {
                        var haveYet = data.words.find((wordInData) => wordInData.word===word.word)
                        return (<div key={i} className={clsx(style.adminLog)}>
                            {i+1}_ {word.word}: {word.mean}
                            <span>{word.wordId}</span>
                            <div 
                                className={clsx(style.log_option, haveYet === undefined ? style.log_go : style.log_haven)}
                                onClick={haveYet===undefined ? () => handleAdd(i, "userWords") : () => {}}
                            >{haveYet === undefined ? "+" : "✔️"}</div>
                        </div>)
                    })
                }
                </div>
                
            </div>
        </div>
    </div>)
}

export default AdminSlide