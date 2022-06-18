import clsx from "clsx"
import { useSelector } from "react-redux"
import style from "../style.module.scss"
import { useDispatch } from "react-redux"
import { reloadData } from "../reduxToolkit/0_data"
import { toHere } from "../reduxToolkit/2-4_MoveSlice"
import { useState } from 'react'
import { BiDotsVerticalRounded } from "react-icons/bi";
import { toAlert } from "../reduxToolkit/11_Alert"
import { setShowAdd } from "../reduxToolkit/9_AddSlice"
import { setShowEdit } from "../reduxToolkit/8_EditSlice"
import { setShowClear } from "../reduxToolkit/10_ClearSlice"

function ComExaSilde ({ name="", close=()=>{} }) {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log(data)})
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
            })
        } else {
            const urlEdit = urlAddComExa+"&editId="+document.getElementById('editId').innerHTML
            fetch(urlEdit, {
                method: 'POST',
                body: content
            })
            .then(() => {
                loadUserData()
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
                        className={clsx(style.inputSubmit)} 
                        onClick={() => handleSubmit()}
                    />
                </form>
            </div>
        </div>
    )
}
///////////////////////////////

function EditAddSlide ({name="", close = () => {}}) {
    const dispatch = useDispatch()
    const handleAlert = (mess) => {
        dispatch(toAlert(mess))
        const showAlert = setTimeout(() => {
            dispatch(toAlert(mess))
            return clearTimeout(showAlert)
        }, 2000)
    }
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log(data)})
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
            fetch(urlEditWord, {
                method: 'POST',
                body: contentEdit
            })
            .then(() => {
                handleAlert("successful")
                loadUserData()
                close()
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
    } else if (name === "Add") {
        const urlAddWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=addNewWord&userId="+data.userId
        var contentAdd = new FormData()
        contentAdd.append('word', word)
        contentAdd.append('mean', mean)
        contentAdd.append('comment', comment)
        contentAdd.append('example', example)

        const handleAdd = () => {
            fetch(urlAddWord, {
                method: 'POST',
                body: contentAdd
            })
            .then(() => {
                handleAlert("successful")
                loadUserData()
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
                            defaultValue={"NEW WORD"}
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
    const handleAlert = (mess) => {
        dispatch(toAlert(mess))
        const showAlert = setTimeout(() => {
            dispatch(toAlert(mess))
            return clearTimeout(showAlert)
        }, 2000)
    }
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const urlDeleteWord = "https://webpg2-1.herokuapp.com/z2214505.php?step=clearWord&userId="+data.userId+"&wordId="+data.words[now].wordId
    const loadUserData = () => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+data.password , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(reloadData(obj)); console.log(data)})
        .catch(error => console.log(error))
    }
    const handleClear = () => {
        fetch(urlDeleteWord, {
            method: 'POST',
        })
        .then(() => {loadUserData()})
        .then(() => {
            handleAlert("successful")
            dispatch(toHere(now===0? 0: now-1))
            close()
        })
    }

    return (
        <div className={clsx(style.onTop)} style={{zIndex: "10"}}>
            <div className={clsx(style.onTop_blur)}></div>
            <div className={clsx(style.onTop_close)} onClick={() => close()} >Close Clear </div>
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
                        className={clsx(style.inputSubmit)}
                        style={{
                            position: "fixed", 
                            bottom: "8vh", 
                            left: "50vw", 
                            transform: "translateX(-50%)", 
                            zIndex: "1"
                        }}
                        onClick={() => handleClear()}
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
    const handleAlert = (mess) => {
        dispatch(toAlert(mess))
        const showAlert = setTimeout(() => {
            dispatch(toAlert(mess))
            return clearTimeout(showAlert)
        }, 2000)
    }
    const [changePass, setChangePass] = useState(false)
    const handleChangePass = () => {
        setChangePass(!changePass)
    }
    const handleLogout = () => {
        close()
        dispatch(reloadData({}))
        localStorage.setItem("userId", "")
    }
    const [oldP, setOldP] = useState("")
    const [newP, setNewP] = useState("")
    const handleTypingOld = (e) => {
        setOldP(e.target.value)
    }
    const handleTypingNew = (e) => {
        setNewP(e.target.value)
    }
    const changePassword = () => {
        if (oldP !== data.password) {
            handleAlert("passwordMissing")
            setOldP("")
        } else {
            var newPassword = new FormData()
            newPassword.append("newPassword", newP)
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=changePassword&userId="+data.userId+"&password="+data.password , { 
                method: 'POST',
                body: newPassword,
            })
            .then(() => {
                fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+data.userId+"&password="+newP , { method: 'GET' })
                .then((response) => response.json())
                .then((obj) => {dispatch(reloadData(obj)); console.log(data)})
                .catch(error => console.log(error))
                setNewP("")
                setOldP("")
                handleAlert("successful")
                handleChangePass()
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
                        style.list_ChangePassBox, 
                        changePass ? 
                        style.list_ChangePassShow : ''
                    )}
                >
                    <label>Old</label>
                    <input type="password" value={oldP} onChange={(e) => handleTypingOld(e)} /><br/>
                    <label>New</label>
                    <input type="password" value={newP} onChange={(e) => handleTypingNew(e)} />
                    <div 
                        className={clsx(
                            style.changePassButton, 
                            newP===""||oldP==="" ? style.unClick : ""
                        )} 
                        onClick={newP===""||oldP==="" ? ()=>{} : ()=>changePassword()}
                    >Change Password</div>
                    <div className={clsx(style.changePassButton)} onClick={() => handleChangePass()}>Cancle</div>
                </form>
                <div className={clsx(style.list_UserId)} >
                    <div style={{overflowX: "scroll", padding: "10px 0"}}>Your ID: {data.userId}</div>
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
            </div>
        </div>
    )
}

export {ComExaSilde, EditAddSlide, ClearSlide, DataSlide}