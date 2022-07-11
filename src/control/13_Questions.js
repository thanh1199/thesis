import { useCallback, useEffect, useState } from "react"
import style from "../style.module.scss"
import clsx from "clsx"
import { useDispatch, useSelector } from "react-redux"
import { changeQuestion } from "../reduxToolkit/14_Question"


function Questions ({ show, close=()=>{} }) {
    const data = useSelector(state => state.data)
    const [keyWord, setKeyWord] = useState("")
    const [content, setContent] = useState("")
    const [reload, setReload] = useState(false)
    const [active, setActive] = useState("Top Slide")
    const questionInit = {incre: -1, id: "", userId: "", keyword: "", content: "", liked: ""}
    const allQuestionsInit = [{...questionInit}]
    const [allQuestions, setAllQuestions] = useState(allQuestionsInit)

    const dispatch = useDispatch()
    const keywordArray = allQuestions.map((ques) => ques.keyword)
    const reloadAllQuestion = useCallback((newKeyWord="") => {
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=allQuestions", { method: "GET" })
        .then((response) => response.json())
        .then((obj) => {
            setAllQuestions(obj)
            if (newKeyWord !== "") {
                const newQuestion = obj.filter((o) => o.keyword === newKeyWord)[0]
                dispatch(changeQuestion(newQuestion))
            }
            const toLike = setTimeout(() => {
                document.getElementById("questionLikes").classList.remove(style.likeAnimation)
                return clearTimeout(toLike)
            }, 500)
            console.log("reloaded all of questions")
        })
        .catch(error => console.log(error))
    }, [setAllQuestions, dispatch])
    useEffect(() => {
        reloadAllQuestion()
    }, [reloadAllQuestion])

    const handleReload = (newKeyWord) => {
        reloadAllQuestion(newKeyWord)
        setReload(true)
        const reloading = setTimeout(() => {
            setReload(false)
            return reloading
        }, 1100)
    }
    
    if (active !== "Top Slide") {
        const u2 = keywordArray.indexOf(active)+active.split(" ").join("_")
        const u1mid =  document.getElementById("Top_Slide") ? (document.getElementById("Top_Slide").getBoundingClientRect().right + document.getElementById("Top_Slide").getBoundingClientRect().left) / 2 : 0
        const boxmid = document.getElementById("quesTitleContainer") ? (document.getElementById("quesTitleContainer").getBoundingClientRect().right - document.getElementById("quesTitleContainer").getBoundingClientRect().left) / 2 : 0
        const u2mid = document.getElementById(u2) ? (document.getElementById(u2).getBoundingClientRect().right + document.getElementById(u2).getBoundingClientRect().left) / 2 : 0
        const move = u2mid - u1mid  - boxmid + 100
        document.getElementById("quesTitleContainer").scroll({
            top: 0,
            left: move,
            behavior: "smooth"
        })
    } else if (document.getElementById("quesTitleContainer")) {
        document.getElementById("quesTitleContainer").scroll({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    const handleActive = (newActive) => {
        setActive(newActive)
        const newIndex = keywordArray.indexOf(newActive)
        if (newIndex >= 0) {
            dispatch(changeQuestion(allQuestions[newIndex]))
        } else {
            dispatch(changeQuestion(allQuestionsInit[0]))
        }
    }
    const handleToLeft = (max=false) => {
        if (!max) {
            const now = keywordArray.indexOf(active)
            if (now > 0) {
                handleActive(keywordArray[now-1])
            } else {
                handleActive("Top Slide")
            }
        } else {
            handleActive("Top Slide")
        }
    }
    const handleToRight = (max=false) => {
        if (!max) {
            const now = keywordArray.indexOf(active)
            if (now < keywordArray.length -1) {
                handleActive(keywordArray[now+1])
            }
        } else {
            const last = keywordArray.length-1
            handleActive(keywordArray[last])
        }
    }
    const handleKeyWord = (newValue) => {
        setKeyWord(newValue)
    }
    const handleContent = (newValue) => {
        setContent(newValue)
    }
    const handleQuest = () => {
        const questionData = new FormData()
        questionData.append("keyWord", keyWord)
        questionData.append("content", content)

        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=question&userId="+data.userId, {
            method: "POST",
            body: questionData
        })
        .then(() => {
            handleReload(keyWord)
            handleActive(keyWord)
            console.log("send question")
        })
        setContent("")
        setKeyWord("")
    }
    const yourQuestion = allQuestions.filter((ques) => ques.userId === data.userId)
    var adminQuestion

    data.userId === "ADMIN" ? 
    adminQuestion = yourQuestion : 
    adminQuestion = allQuestions.filter((ques) => ques.userId === "ADMIN");



    return (<div className={clsx(style.onTop, show? "":style.onTopHidden)}>
        <div className={clsx(style.onTop_blur)}></div>
        <div className={clsx(style.onTop_close)} onClick={() => close()} >Close Questions</div>
        <div id="onTop_box" className={clsx(style.onTop_box, style.onTop_box_full)}>
            <div 
                className={clsx(style.quesReload, reload ? style.quesReloading : style.quesInit)} 
                onClick={() => handleReload()} 
            >Reload</div>
            <div className={style.quesMove}>
                <span 
                    className={style.toLeft}
                    onClick={() => handleToLeft()}
                    onDoubleClick={() => handleToLeft(true)}
                >&#10094;&#10094;</span>
                <span 
                    className={style.toRight}
                    onClick={() => handleToRight()}
                    onDoubleClick={() => handleToRight(true)}
                >&#10095;&#10095;</span>
            </div>
            <div id="quesTitleContainer" className={style.quesTitleContainer}>
                <div className={style.quesTitle}>
                    <span 
                        id="Top_Slide"
                        className={clsx(style.quesUnit, active === "Top Slide" ? style.quesUnitActive : "")}
                        onClick={() => handleActive("Top Slide")}
                    >Top Slide</span>
                    {keywordArray.map(
                        (keyword, i) => <span 
                            id={i+keyword.split(" ").join("_")}
                            key={i} 
                            className={clsx(style.quesUnit, active === keyword ? style.quesUnitActive : "")}
                            onClick={() => handleActive(keyword)}
                        >{keyword}</span>
                    )}
                </div>
            </div>
            {active === "Top Slide" ? 
            <div className={style.quesContent}>
                <textarea value={content} onChange={(e) => handleContent(e.target.value)} />
                <label>Key Word: </label>
                <input value={keyWord} onChange={(e) => handleKeyWord(e.target.value)} />
                <input 
                    type="button" 
                    value="Send" 
                    onClick={() => handleQuest()} 
                    className={clsx(style.questButton, keyWord!==""&&content!=="" ? "" : style.questButtonBlock)}
                />
                <div 
                    className={clsx(style.someQuestions, style.adminQuest)} 
                    style={{display: data.userId==="ADMIN" ? "none": "block"}}
                >{adminQuestion.map(
                    (ques, i) => <span key={i} onClick={() => handleActive(ques.keyword)} >{ques.keyword}</span>
                )}</div>
                <div className={clsx(style.someQuestions, style.yourQuest)}>{yourQuestion.map(
                    (ques, i) => <span key={i} onClick={() => handleActive(ques.keyword)} >{ques.keyword}</span>
                )}</div>
            </div>
            : 
            <QuestionUnit toLeft={handleToLeft} reloadQuestion={handleReload} />
            }
            
        </div>
    </div>)
}

function QuestionUnit ({ toLeft=()=>{}, reloadQuestion=()=>{} }) {
    const data = useSelector(state => state.data)
    const question = useSelector(state => state.question)
    const [yourAnswer, setYourAnswer] = useState("")
    const answerInit = {incre: -1, id: "", quesIncre: "", userId: "", content: ""}
    const allAnswerInit = [{...answerInit}]
    const [allAnswer, setAllAnswer] = useState(allAnswerInit)
    const [changeQuestion, setChangeQuestion] = useState(false)

    const loadAllAnswer = useCallback(() => {
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=allAnswers&quesIncre="+question.incre, { method: "GET" })
        .then((response) => response.json())
        .then((obj) => {
            setAllAnswer(obj)
            console.log("loaded all of answer, in question "+question.id)
        })
        .catch(error => console.log(error))
    }, [question])

    useEffect(() => {
        loadAllAnswer()
    }, [loadAllAnswer])

    const likerArray = question.liked.split(",").slice(0, -1)
    const countLikes = question.liked === "0" ? 0 : likerArray.length
    const handleLike = () => {
        document.getElementById("questionLikes").classList.contains(style.likeAnimation) ?
        document.getElementById("questionLikes").classList.remove(style.likeAnimation) :
        document.getElementById("questionLikes").classList.add(style.likeAnimation) ;

        const url = "https://webpg2-1.herokuapp.com/z2214505.php?step=like&incre="+question.incre+"&userId="+data.userId
        fetch ( url, { method: "GET" })
        .then(() => {
            reloadQuestion(question.keyword)
            console.log("liked/unliked")
        })
        .catch(error => console.log(error))
    }
    const handleDeleteAnswer = (incre) => {
        const answerDelete = new FormData()
        answerDelete.append("table", "answer")
        answerDelete.append("incre", incre)
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=queAnsDelete&userId="+data.userId, { 
            method: "POST",
            body: answerDelete
        })
        .then(() => loadAllAnswer())
        .catch(error => console.log(error))
    }
    const handleSendYourAnswer = () => {
        setYourAnswer("")
        const answer = new FormData()
        answer.append("quesIncre", question.incre)
        answer.append("content", yourAnswer)
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=answer&userId="+data.userId, { 
            method: "POST",
            body: answer
        })
        .then(() => loadAllAnswer())
        .catch(error => console.log(error))
    }
    const handleDeleteQuestion = (quesIncre) => {
        toLeft()
        const deleteQuestion = new FormData()
        deleteQuestion.append("table", "question")
        deleteQuestion.append("incre", question.incre)
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=queAnsDelete&userId="+data.userId, { 
            method: "POST",
            body: deleteQuestion
        })
        .then(() => reloadQuestion())
        .catch(error => console.log(error))
    }
    const handleToChangeQuestion = () => {
        setYourAnswer(question.content)
        document.getElementById("yourAnswer").focus()
        setChangeQuestion(true)
    }
    const handleCancleChangeQuestion = () => {
        setYourAnswer("")
        setChangeQuestion(false)
    }
    const handleChangeQuestion = () => {
        handleCancleChangeQuestion()
        const editQuestion = new FormData()
        editQuestion.append("incre", question.incre)
        editQuestion.append("content", yourAnswer)
        fetch ("https://webpg2-1.herokuapp.com/z2214505.php?step=questionEdit&userId="+data.userId, { 
            method: "POST",
            body: editQuestion
        })
        .then(() => reloadQuestion(question.keyword))
        .catch(error => console.log(error))
    }

    return (<div className={style.unitContainer}>
        <div className={style.unitQuestion}>
            <div className={style.unitQuestionId}>{question.id}</div>
            <div 
                style={{display: question.userId === data.userId || data.userId === "ADMIN" ? "block" : "none"}}
                className={style.unitQuestionDelete}
                onClick={() => handleDeleteQuestion(question.incre)}
            >×</div>
            <div 
                style={{display: question.userId === data.userId ? "block" : "none"}}
                className={style.unitQuestionEdit}
                onClick={() => handleToChangeQuestion()}
            >※</div>
            {question.userId}: {question.content}
        </div>
        <div className={style.likes}>
            <div 
                id="questionLikes"
                className={clsx(
                    style.like, 
                    likerArray.find((liker) => liker === data.userId) ? style.liked : ""
                )} 
                onClick={() => handleLike()}
            >&#9787;</div>
            <div>({countLikes})</div>
            <div className={style.whoLiked}>{likerArray.map((liker, i) => 
                <span key={i}>{liker}</span>
            )}</div>
        </div>
        <div className={style.unitAnswerContainer}>
            {allAnswer.map((ans, i) => <div key={i} className={style.unitAnswer}>
                <div className={style.unitAnswerId}>{ans.id}</div>
                <div 
                    className={style.unitAnswerDelete} 
                    onClick={() => handleDeleteAnswer(ans.incre)}
                    style={{display: ans.userId === data.userId || data.userId === "ADMIN" ? "block" : "none"}}
                >×</div>
                {ans.userId}: {ans.content}
            </div>)}
        </div>
        <div className={style.unitQuestionYourAnswer}>
            <textarea 
                id="yourAnswer"
                value={yourAnswer} 
                onChange={(e) => setYourAnswer(e.target.value)} 
                className={style.yourAnswer}
            />
            <div className={style.yourAnswerControl}>
                <input 
                    value="Send"
                    type="button" 
                    className={clsx(style.sendYourAnswer, yourAnswer==="" ? style.sendYourAnswerBlock : "")} 
                    onClick={changeQuestion ? () => handleChangeQuestion() : () => handleSendYourAnswer()} 
                />
                <input 
                    value="Cancel"
                    type="button" 
                    className={clsx(style.sendYourAnswer)} 
                    style={{display: changeQuestion ? "block" : "none"}}
                    onClick={() => handleCancleChangeQuestion()} 
                />
            </div>
        </div>
    </div>)
}

export default Questions