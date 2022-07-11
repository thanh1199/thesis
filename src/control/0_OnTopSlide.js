import clsx from "clsx"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import { useDispatch } from "react-redux"
import { reloadData } from "../reduxToolkit/0_data"
import { toHere } from "../reduxToolkit/2-4_MoveSlice"
import { Fragment, useState } from 'react'
import { BiDotsVerticalRounded } from "react-icons/bi";
import { toAlert } from "../reduxToolkit/11_Alert"
import { setShowAdd } from "../reduxToolkit/9_AddSlice"
import { setShowEdit } from "../reduxToolkit/8_EditSlice"
import { setShowClear } from "../reduxToolkit/10_ClearSlice"


const handleAlert = ([type,mess], dispatch=()=>{}) => {
    dispatch(toAlert([type,mess]))
    const showAlert = setTimeout(() => {
        dispatch(toAlert([type,mess]))
        return clearTimeout(showAlert)
    }, 3000)
}

function ComExaSilde ({ name="", close=()=>{} }) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all data for "+obj.userId)})
        .catch(error => console.log(error))
    }
    
    const [text, setText] = useState("")
    const handleTyping = (e) => {
        setText(e.target.value)
    }
    let optionArray = data.words[now].comments.map(() => false)
    const [optionShow, setOptionShow] = useState([...optionArray])
    const handleOption = (i) => {
        optionShow[i]? optionArray[i] = false : optionArray[i] = true
        setOptionShow([...optionArray])
    }
    const [edit, setEdit] = useState([...optionArray])
    const handleEdit = (i,comExaId,content,comExaName) => {
        if (i === false) {
            setEdit([...optionArray])
            setText("")
            document.getElementById('editOption').innerHTML = ""
            document.getElementById('editId').innerHTML = ""
        } else {
            if (edit[i]) {
                setEdit([...optionArray])
                setText("")
                document.getElementById('editOption').innerHTML = ""
                document.getElementById('editId').innerHTML = ""
            } else {
                optionArray[i] = true
                setEdit([...optionArray])
                setText(content)
                document.getElementById('editOption').innerHTML = "Edit "+comExaName+" ×"
                document.getElementById('editId').innerHTML = comExaId
                document.getElementById('text').focus()
            }
        }
    }

    let data_ = []
    let urlDeleteComExa = ""
    let urlAddComExa = ""
    if (name === "Comment") {
        data_ = data.words[now].comments
        urlDeleteComExa = "https://webpg2-1.herokuapp.com/z2214505.php?step=controlCommentDelete&userId="+data.userId+"&wordId="+data.words[now].wordId+"&commentId="
        urlAddComExa = "https://webpg2-1.herokuapp.com/z2214505.php?step=controlCommentAdd_Edit&userId="+data.userId+"&wordId="+data.words[now].wordId
    } else {
        data_ = data.words[now].examples
        urlDeleteComExa = "https://webpg2-1.herokuapp.com/z2214505.php?step=controlExampleDelete&userId="+data.userId+"&wordId="+data.words[now].wordId+"&exampleId="
        urlAddComExa = "https://webpg2-1.herokuapp.com/z2214505.php?step=controlExampleAdd_Edit&userId="+data.userId+"&wordId="+data.words[now].wordId
    }
    const deleteComExa = (u) => {
        fetch(u, {method: 'GET'})
        .then (() => {
            loadUserData()
            console.log("deleted Com/Exa and loaded "+data.userId+"'s all of Com/Exa")
        })
    }
    const comExaIdToTime = (comExaId, name) => {
        const [y1,y2,m1,m2,d1,d2,h1,h2,i1,i2,s1,s2] = name==="Comment"?
        comExaId.split("") : comExaId.split("")
        return '20'+y1+y2+'.'+m1+m2+'.'+d1+d2+' '+h1+h2+'h'+i1+i2+'m'+s1+s2+'s'
    }
    
    const handleSubmit = () => {
        setText("")
        var content = new FormData()
        content.append("content", text)
        // console.log(content.get("content"))

        if (document.getElementById('editId').innerHTML === "") {
            fetch(urlAddComExa, {
                method: 'POST',
                body: content
            })
            .then(() => {
                loadUserData()
                console.log("added Com/Exa and loaded "+data.userId+"'s all of new Com/Exa")
            })
        } else {
            const urlEdit = urlAddComExa+"&editId="+document.getElementById('editId').innerHTML
            fetch(urlEdit, {
                method: 'POST',
                body: content
            })
            .then(() => {
                loadUserData()
                console.log("editted Com/Exa and loaded "+data.userId+"'s all of new Com/Exa")
            })
        }
        document.getElementById('editOption').innerHTML = ""
        document.getElementById('editId').innerHTML = ""
    } 

    return (
        <div className={clsx(style.onTop)}>
            <div className={clsx(style.onTop_blur)}></div>
            <div className={clsx(style.onTop_close)} onClick={() => close()} >Close {name} </div>
            <div className={clsx(style.onTop_box)}>
                {data_.map((_data_, i) => {
                    return (<div key={i}>
                        <div className={clsx(style.options)} onClickCapture={() => handleOption(i)} >
                            <p>{name==="Comment"?comExaIdToTime(_data_.commentId, "Comment"):comExaIdToTime(_data_.exampleId, "Example")}</p>
                            <BiDotsVerticalRounded fontSize={24} />
                            <div 
                                className={clsx(style.edit, optionShow[i]? style.editShow: "")} 
                                onClickCapture={
                                    name === "Comment" ? 
                                    () => handleEdit(i,_data_.commentId, _data_.content, comExaIdToTime(_data_.commentId, "Comment")) : 
                                    () => handleEdit(i,_data_.exampleId, _data_.content, comExaIdToTime(_data_.exampleId, "Example"))
                                }
                            >Edit</div>
                            <div 
                                className={clsx(style.delete, optionShow[i]? style.deleteShow: "")} 
                                onClickCapture={
                                    name === "Comment" ? 
                                    () => deleteComExa(urlDeleteComExa+_data_.commentId) : 
                                    () => deleteComExa(urlDeleteComExa+_data_.exampleId) 
                                }
                            >Delete</div>
                        </div>
                        {_data_.content}
                    </div>)
                })}
                <div style={{width: '100%', height: '50px'}} />
            </div>
            <div className={clsx(style.onTop_func)}>
                <div 
                    id="editOption" 
                    className={clsx(style.onTop_isEdit)}
                    onClick={() => handleEdit(false)}
                ></div>
                <div id="editId" style={{display: 'none'}}></div>
                <form className={clsx(style.formComExa)} >
                    <textarea 
                        id="text"
                        rows="3" 
                        className={clsx(style.inputShow, style.inputComExa)} 
                        value={text}
                        onChange={(e) => handleTyping(e)}
                    />
                    <input 
                        type="button" 
                        value="Push" 
                        className={clsx(style.inputSubmit, text==="" ? style.block : "")} 
                        onClick={text==="" ? () => {} : () => handleSubmit()}
                        style={{
                            position: "fixed", 
                            bottom: "6vh", 
                            left: "50vw", 
                            transform: "translateX(-50%)", 
                            zIndex: "1"
                        }}
                    />
                </form>
            </div>
        </div>
    )
}
///////////////////////////////

function EditAddSlide ({name="", close = () => {}}) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
        .catch(error => console.log(error))
    }

    const initialName = name === "Edit" ? data.words[now].word : ""
    const initialMean = name === "Edit" ? data.words[now].mean : ""
    const [word, setWord] = useState(initialName)
    const [mean, setMean] = useState(initialMean)
    //only for edit
    let comExaArray = []
    data.words[now].comments.forEach((com, i) => {
        comExaArray = [...comExaArray, com.content]
    })
    data.words[now].examples.forEach((exa, i) => {
        comExaArray = [...comExaArray, exa.content]
    })
    const [comExa, setComExa] = useState([...comExaArray])

    // only for add
    const [comment, setComment] = useState("")
    const [example, setExample] = useState("")
    const handleTyping = (e, type, i=0) => {
        if (type === "word") setWord(e.target.value)
        if (type === "mean") setMean(e.target.value)
        //only for edit
        if (type === "comExa") {
            comExaArray = [...comExa]
            comExaArray[i] = e.target.value
            setComExa([...comExaArray])
        }
        // only for add
        if (type === "comment") setComment(e.target.value)
        if (type === "example") setExample(e.target.value)
    }

    if (name === "Edit") {
        const urlEditWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=editWord&userId="+data.userId+"&wordId="+data.words[now].wordId
        var contentEdit = new FormData()
        contentEdit.append('word', word)
        contentEdit.append('mean', mean)
        comExa.forEach((c_e, i) => {
            var keyName = "comExa"+i
            contentEdit.append(keyName, c_e)
        })
        
        const handleEdit = () => {
            close()
            fetch(urlEditWord, {
                method: 'POST',
                body: contentEdit
            })
            .then(() => {
                handleAlert(["success","Editted successfully"], dispatch)
                console.log("editted word")
                loadUserData()
            })
        }

        return (
            <div className={clsx(style.onTop)} style={{zIndex: "10"}}>
                <div className={clsx(style.onTop_blur)}></div>
                <div className={clsx(style.onTop_close)} onClick={() => close()} >Close {name} </div>
                <div className={clsx(style.onTop_box)} style={{height: "80vh", borderRadius: "20px 0 20px 20px"}}>
                    <form action="" className={clsx(style.form)}>
                        <input 
                            name="wordID"  
                            defaultValue={"Word id: "+data.words[now].wordId}
                            style={{pointerEvents: "none", backgroundColor: "#eee", textAlign: "center"}}
                        />
                        <label>Word</label>
                        <input 
                            value={word}
                            onChange={(e) => handleTyping(e, "word")}
                        />
                        <label>Mean</label>
                        <input 
                            value={mean}
                            onChange={(e) => handleTyping(e, "mean")}
                        />
                        <label>Comment</label>
                        {data.words[now].comments.map((data_, i) => {
                            return(<input
                                key={i}
                                value={comExa[i]}
                                onChange={(e) => handleTyping(e, "comExa", i)}
                            />)
                        })}
                        <label>Example</label>
                        {data.words[now].examples.map((data_, i) => {
                            return(<input
                                key={i}
                                value={comExa[i+data.words[now].comments.length]}
                                onChange={(e) => handleTyping(e, "comExa", data.words[now].comments.length + i)}
                            />)
                        })}
                        <div style={{width: '100%', height: '50px'}} />
                        <input 
                            type="button" 
                            value="Confirm changes"
                            className={clsx(style.inputSubmit)}
                            style={{
                                position: "fixed", 
                                bottom: "8vh", 
                                left: "50vw", 
                                transform: "translateX(-50%)", 
                                zIndex: "1"
                            }}
                            onClick={() => handleEdit()}
                        />
                    </form>
                </div>
            </div>
        )
    } else if (name === "Add" || name === "Add Word To Everyone") {
        const urlAddWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=addNewWord&userId="+data.userId
        const urlAddWordToEveryOne = "https://webpg2-1.herokuapp.com/z2214505.php?step=addNewWordToEveryOne&userId="+data.userId
        var contentAdd = new FormData()
        contentAdd.append('word', word)
        contentAdd.append('mean', mean)
        contentAdd.append('comment', comment)
        contentAdd.append('example', example)

        const handleAdd = () => {
            fetch(name === "Add" ? urlAddWord : urlAddWordToEveryOne, {
                method: 'POST',
                body: contentAdd
            })
            .then(() => {
                handleAlert(["success","Added new word successfully"], dispatch)
                loadUserData()
                console.log("added new word and loaded "+data.userId+" all of new data")
            })
            setWord("")
            setMean("")
            setComment("")
            setExample("")
        }
        return (
            <div className={clsx(style.onTop)} style={{zIndex: "10"}}>
                <div className={clsx(style.onTop_blur)}></div>
                <div className={clsx(style.onTop_close)} onClick={() => close()} >Close {name} </div>
                <div className={clsx(style.onTop_box)} style={{height: "80vh", borderRadius: "20px 0 20px 20px"}}>
                    <form action="" className={clsx(style.form)}>
                        <input 
                            defaultValue={name === "Add" ? "NEW WORD" : "NEW WORD TO EVERYONE"}
                            style={{pointerEvents: "none", backgroundColor: "#eee", textAlign: "center"}}
                        />
                        <label>Word</label>
                        <input 
                            value={word}
                            onChange={(e) => handleTyping(e, "word")}
                        />
                        <label>Mean</label>
                        <input
                            value={mean}
                            onChange={(e) => handleTyping(e, "mean")}
                        />
                        <label>Comment</label>
                        <input
                            value={comment}
                            onChange={(e) => handleTyping(e, "comment")}
                        />
                        <label>Example</label>
                        <input
                            value={example}
                            onChange={(e) => handleTyping(e, "example")}
                        />
                        <div style={{width: '100%', height: '50px'}} />
                        <input 
                            type="button" 
                            value="Add new word" 
                            className={
                                clsx(
                                    style.inputSubmit,
                                    word===""||mean==="" ?
                                    style.block :
                                    ""
                                )
                            } 
                            style={{
                                position: "fixed", 
                                bottom: "8vh", 
                                left: "50vw", 
                                transform: "translateX(-50%)", 
                                zIndex: "1"
                            }}
                            onClick={word===""||mean==="" ? () => {} : () => handleAdd()}
                        />
                    </form>
                </div>
            </div>
        )
    }
}
///////////////////////////////

function ClearSlide ({ close=() => {} }) {
    const dispatch = useDispatch()
    const [canClear, setCanClear] = useState(true)
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const urlDeleteWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=clearWord&userId="+data.userId+"&wordId="+data.words[now].wordId
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
        .catch(error => console.log(error))
    }
    const handleClear = () => {
        setCanClear(false)
        fetch(urlDeleteWord, {
            method: 'POST',
        })
        .then(() => {loadUserData(); console.log("deleted word and loaded all of new words")})
        .then(() => {
            handleAlert(["success","Deleted successfully"], dispatch)
            dispatch(toHere(now===0? 0: now-1))
            close()
        })
    }

    return (
        <div className={clsx(style.onTop)} style={{zIndex: "10"}}>
            <div className={clsx(style.onTop_blur)}></div>
            <div className={clsx(style.onTop_close)} onClick={canClear ? () => close() : () => {}} >Close Clear </div>
            <div className={clsx(style.onTop_box)} style={{height: "80vh", borderRadius: "20px 0 20px 20px"}}>
                <form action="" className={clsx(style.form)}>
                    <input 
                        name="wordID"  
                        defaultValue={"Word id: "+data.words[now].wordId}
                        style={{pointerEvents: "none", backgroundColor: "#eee", textAlign: "center"}}
                    />
                    <label>Word</label>
                    <input 
                        defaultValue={data.words[now].word}
                        style={{pointerEvents: "none"}}
                    />
                    <label>Mean</label>
                    <input 
                        defaultValue={data.words[now].mean}
                        style={{pointerEvents: "none"}}
                    />
                    <label>Comment</label>
                    {data.words[now].comments.map((data_, i) => {
                        return(<input
                            key={i}
                            defaultValue={data_.content}
                            style={{pointerEvents: "none"}}
                        />)
                    })}
                    <label>Example</label>
                    {data.words[now].examples.map((data_, i) => {
                        return(<input
                            key={i}
                            defaultValue={data_.content}
                            style={{pointerEvents: "none"}}
                        />)
                    })}
                    <div style={{width: '100%', height: '50px'}} />
                    <input 
                        type="button" 
                        value="Clear this word"
                        className={clsx(style.inputSubmit, canClear? "" : style.block)}
                        style={{
                            position: "fixed", 
                            bottom: "8vh", 
                            left: "50vw", 
                            transform: "translateX(-50%)", 
                            zIndex: "1"
                        }}
                        onClick={canClear ? () => handleClear() : () => {}}
                    />
                </form>
            </div>
        </div>
    )
}
///////////////////////////////

function DataSlide ({show, close=()=>{}}) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const allUser = useSelector(state => state.allUser)
    const [changePass, setChangePass] = useState(false)
    const [changeId, setChangeId] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)
    const handleChangePass = () => {
        setChangePass(!changePass)
    }
    const handleChangeId = () => {
        setChangeId(!changeId)
    }
    const handleLogout = (reLogin="") => {
        if (reLogin==="") {
            close()
            dispatch(reloadData({}))
        }
        localStorage.setItem("userId", reLogin)
    }
    const [oldP, setOldP] = useState("")
    const [newP, setNewP] = useState("")
    const [newI, setNewI] = useState("")
    const [isSameId, setIsSameId] = useState(false)
    const handleTypingOldPassword = (e) => {
        setOldP(e.target.value)
    }
    const handleTypingNewPassword = (e) => {
        setNewP(e.target.value)
    }
    const handleTypingNewId = (e) => {
        if (e.target.value.includes(",")) {
            handleAlert(["fail","ID can't include comma /,/"], dispatch)
        } else {
            setNewI(e.target.value)
        }
        if (allUser.find((user) => user.userId===e.target.value) !== undefined || 
            e.target.value==="ADMIN" ||
            e.target.value==="admin") {
            setIsSameId(true)
            handleAlert(["fail","The same ID is existing"], dispatch)
        } else {
            setIsSameId(false)
        }
    }
    const changePasswordOrId = (what) => {
        if (what === "password") {
            if (oldP !== data.password) {
                handleAlert(["fail","Old Password is wrong"], dispatch)
                setOldP("")
            } else {
                handleChangePass()
                setOldP(newP)
                var newPassword = new FormData()
                newPassword.append("newPassword", newP)
                fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=changePassword&userId="+data.userId+"&password="+data.password , { 
                    method: 'POST',
                    body: newPassword,
                })
                .then(() => {
                    fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+newP , { method: 'GET' })
                    .then((response) => response.json())
                    .then((obj) => {
                        dispatch(reloadData(obj))
                        console.log("changed new paddword and loaded all of data for "+obj.userId)
                    })
                    .catch(error => console.log(error))
                    setNewP("")
                    setOldP("")
                    handleAlert(["success","Changed Password successfully"], dispatch)
                })
            }
        } else if (what === "id") {
            handleChangeId()
            setIsSameId(true)
            var newId = new FormData()
            newId.append("newId", newI)
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=changeId&userId="+data.userId+"&password="+data.password , { 
                method: 'POST',
                body: newId,
            })
            .then(() => {
                fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+newI+"&password="+data.password , { method: 'GET' })
                .then((response) => response.json())
                .then((obj) => {
                    dispatch(reloadData(obj))
                    console.log("changed new id and loaded all of data for "+obj.userId)
                })
                .catch(error => console.log(error))
                setNewI("")
                handleAlert(["success","Changed ID successfully"], dispatch)
                handleLogout(newI)
            })
        }
    }
    const handleAddWord = () => {
        dispatch(setShowAdd())
    }
    const handleOptionEdit = (here) => {
        dispatch(toHere(here))
        dispatch(setShowEdit())
    }
    const handelOptionClear = (here) => {
        dispatch(toHere(here))
        dispatch(setShowClear())
    }

    return (
        <div className={clsx(style.onTop, show? "":style.onTopHidden)} >
            <div className={clsx(style.onTop_blur)}></div>
            <div className={clsx(style.onTop_close)} onClick={() => close()} >Close Your Data </div>
            <div className={clsx(style.onTop_box)} style={{height: "80vh", borderRadius: "20px 0 20px 20px"}}>
                <form 
                    className={clsx(
                        style.list_ChangeBox, 
                        changeId ? 
                        style.list_ChangeShow : ''
                    )}
                >
                    <label>Old</label>
                    <input type="text" value={data.userId} onChange={() => {}} style={{pointerEvents: "none"}} /><br/>
                    <label>New</label>
                    <input type="text" value={newI} onChange={(e) => handleTypingNewId(e)} />
                    <div 
                        className={clsx(
                            style.changeButton, 
                            newI==="" || isSameId ? style.unClick : ""
                        )} 
                        onClick={newI==="" || isSameId || data.userId === "ADMIN" ? ()=>{} : () => changePasswordOrId("id")}
                    >Change Id</div>
                    <div className={clsx(style.changeButton)} onClick={() => handleChangeId()}>Cancle</div>
                </form>
                <form 
                    className={clsx(
                        style.list_ChangeBox, 
                        changePass ? 
                        style.list_ChangeShow : ''
                    )}
                >
                    <label>Old</label>
                    <input type="password" value={oldP} onChange={(e) => handleTypingOldPassword(e)} /><br/>
                    <label>New</label>
                    <input type="password" value={newP} onChange={(e) => handleTypingNewPassword(e)} />
                    <div 
                        className={clsx(
                            style.changeButton, 
                            newP===""||oldP==="" || newP===oldP ? style.unClick : ""
                        )} 
                        onClick={newP===""||oldP==="" || newP===oldP ? ()=>{} : ()=>changePasswordOrId("password")}
                    >Change Password</div>
                    <div className={clsx(style.changeButton)} onClick={() => handleChangePass()}>Cancle</div>
                </form>
                <div className={clsx(style.list_UserId)} >
                    <div style={{overflowX: "scroll", padding: "10px 0"}}>{data.userId}</div>
                    <input 
                        type="button" 
                        value="Change Id"
                        onClick={() => handleChangeId()}
                        className={clsx(style.list_headerButton)}
                        style={data.userId === "ADMIN" ? {display: "none"} : {}}
                    />
                    <input 
                        type="button" 
                        value="Change Password"
                        onClick={() => handleChangePass()}
                        className={clsx(style.list_headerButton)}
                    />
                    <input 
                        type="button" 
                        value="Logout"
                        onClick={() => handleLogout()}
                        className={clsx(style.list_headerButton)}
                    />
                </div>
                {data.words.map((word, i) => <div 
                    key={i} 
                    className={clsx(style.list_word)}
                >
                    {i+1}_ {word.word}: {word.mean}
                    <span style={{right: "120px"}}>{word.wordId}</span>
                    <div 
                        className={clsx(style.list_option, style.list_edit)}
                        onClick={() => handleOptionEdit(i)}
                    >※</div>
                    {
                        data.words.length === 1 ?
                        <div 
                            className={clsx(style.list_option_block, style.list_clear)}
                        >×</div> :
                        <div 
                            className={clsx(style.list_option, style.list_clear)}
                            onClick={() => handelOptionClear(i)}
                        >×</div>
                    }
                    <div 
                        className={clsx(style.list_option, style.list_go)}
                        onClick={() => {dispatch(toHere(i)); close()}}
                    >→</div>
                </div>)}
                <div className={clsx(style.list_addWord)} onClick={() => handleAddWord()}>+</div>
                {
                    data.userId==="ADMIN" ?
                    "":
                    <Fragment>
                    <div 
                        className={clsx(style.deteleAccount)} 
                        onClick={() => setDeleteAccount(!deleteAccount)}
                    >Delete this account</div>
                    <DeleteAccountSlide 
                        userId={data.userId} 
                        show={deleteAccount} 
                        close={setDeleteAccount}
                        logout={handleLogout}
                    />
                    </Fragment>
                }
            </div>
        </div>
    )
}
/////////////////////////////
function DeleteAccountSlide ({ userId, show, close=()=>{}, logout=()=>{} }) {
    const dispatch = useDispatch()
    const DeleAccount = () => {
        logout()
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=kickUser&userId="+userId, {method: "GET"})
        .then(() => {
            dispatch(reloadData({}))
            handleAlert(["success","Deleted user "+userId], dispatch)
        })
    }
    return (
        <form className={clsx(style.list_ChangeBox, show? style.list_ChangeShow : '')}>
            <div className={clsx(style.DeleteAccountSlideUserId)} >{userId}</div>
            <div className={clsx(style.DeleteAccountSlideSure)} >Detele this Account! Are you sure?</div>
            <input 
                className={clsx(style.DeleteAccountSlideSubmit)} 
                value="Yes, I sure" 
                type="button" 
                onClick={() => DeleAccount()} 
            />
            <div className={clsx(style.DeleteAccountSlideCancle)} onClick={() => close(false)}>Cancle</div>
        </form>
    )
}

export {ComExaSilde, EditAddSlide, ClearSlide, DataSlide}