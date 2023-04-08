
import clsx from 'clsx'
import { useSelector } from 'react-redux';
import style from './style.module.scss';
import { toSetAnswer } from './reduxToolkit/3_AnswerSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { DataSlide } from './control/0_OnTopSlide';
import { Fragment } from 'react';
import { reloadOther } from './reduxToolkit/12_Other';
import Login from './Login';
import AdminSlide from './control/11_Admin';
import OtherSlide from './control/12_Other';
import { getAllUser } from './reduxToolkit/13_AllUser';
import { useEffect } from 'react';
import ScoreSlide, { ScoreSlideOnlyRead } from './control/14_Score';
import Questions from './control/13_Questions';

function App() {
  const [userDataSlide, setUserDataSlide] = useState(false)
  const [adminOther_Slide, set_AdminOther_Slide] = useState(false)
  const [questionsSlide, setQuestionsSlide] = useState(false)
  
  const handleShowUserDataSlide = () => {
    setUserDataSlide(!userDataSlide)
  }
  const allUser = useSelector(state => state.allUser)
  const handleShow_AdminOther_Slide = (type="close") => {
    set_AdminOther_Slide(!adminOther_Slide)
    if (type === "loadAllWords") {
      fetch ("http://kiisenglish.php.xdomain.jp/z2214505.php?step=allWords", { method: "GET", mode: "no-cors" })
      .then((response) => response.json())
      .then((objHaveDataOfWords) => objHaveDataOfWords.filter((o) => o.userId!==data.userId))
      .then((obj_duplicate) => {
          var obj_noDuplicate = []
          obj_duplicate.forEach((wordDuplicate) => {
              if (
                  obj_noDuplicate.find(
                      (word) => word.word===wordDuplicate.word && word.mean===wordDuplicate.mean
                  ) === undefined
              ) {
                  obj_noDuplicate = [...obj_noDuplicate, wordDuplicate]
              }
          })
          return obj_noDuplicate
      })
      .then((obj) => {dispatch(reloadOther(obj)); console.log("loaded all of words and don't contain this user's words without no duplicate")})
      .catch(error => console.log(error))
    }
    if (type === "avoidAdminPassword") {
      var allUserAvoidAdmin = allUser.filter((user) => user.userId!=="ADMIN")
      dispatch(getAllUser(allUserAvoidAdmin))
      fetch ("http://kiisenglish.php.xdomain.jp/z2214505.php?step=allWords", { method: "GET", mode: "no-cors" })
      .then((response) => response.json())
      .then((obj) => {dispatch(reloadOther(obj)); console.log("loaded all of words width duplicate")})
      .catch(error => console.log(error))
    }
  }
  const handleShowQuestionsSlide = () => {
    setQuestionsSlide(!questionsSlide)
  }

  const alert = useSelector(state => state.alert)
  const data = useSelector(state => state.data)
  const now = useSelector(state => state.move)
  const answer = useSelector(state => state.answer)
  const dispatch = useDispatch()
  const handleAnswer = (userAnswer) => {
    dispatch(toSetAnswer(userAnswer))
  }

  const [hello, setHello] = useState(true)
  useEffect(() => {
    console.log("app rerender")
    const helloToFalse = setTimeout(() => {
      setHello(false);
      return clearTimeout(helloToFalse)
    }, 5000)
  },[])

  const name = data.userId ? data.userId.split("@")[0] : "No User"
  if (hello === true) {
    return (
      <div className={clsx(style.hello)} >
        <img src={require('./KEicon.png')} className={style.imgKe} alt="KiisEnglish" />
        Wellcome to KiisEnlish !
        <img src={require('./joen.png')} className={style.imgJoen} alt="Joen" />
      </div>
    )
  } else if (name === "No User") {
    return (<Login />)
  } else {
    return (<Fragment>
      <div className={clsx(style.topControl)}>
        <div>
          <div className={clsx(style.dataSlide)} onClick={() => handleShowUserDataSlide()} >{name}'s Data</div>
          <DataSlide show={userDataSlide} close={handleShowUserDataSlide} />
        </div>
        {
          name === "ADMIN" ?
          <Fragment>
            <div>
              <div 
                className={clsx(style.dataSlide)} 
                onClick={() => handleShow_AdminOther_Slide("avoidAdminPassword")}
              >Users and Words</div>
              <AdminSlide show={adminOther_Slide} close={handleShow_AdminOther_Slide} />
            </div>
            <ScoreSlide />
          </Fragment> :
          <Fragment>
            <div>
              <div 
                className={clsx(style.dataSlide)} 
                onClick={() => handleShow_AdminOther_Slide("loadAllWords")}
              >Everyone's words</div>
              <OtherSlide show={adminOther_Slide} close={handleShow_AdminOther_Slide} />
            </div>
            <ScoreSlideOnlyRead />
          </Fragment>
        }
        <div>
          <div 
            className={style.dataSlide}
            onClick={() => handleShowQuestionsSlide()}
          >Questions</div>
          <Questions show={questionsSlide} user={data.userId==="ADMIN" ? "admin" : "user"} close={handleShowQuestionsSlide} />
        </div>
      </div>
    <div className={clsx(style.alertSuccess, alert[0].show? style.alertShow: "")} >{alert[0].mess}</div>
    <div className={clsx(style.alertFail, alert[1].show? style.alertShow: "")} >{alert[1].mess}</div>
    <div className={clsx(style.alertQuest, alert[2].show? style.alertShow: "")} >{alert[2].mess}</div>
    <div id={clsx(style.app)}>
      <div className={data.words[now].important ? clsx(style.importantWord) : clsx(style.importantSpace)}/>
      <div className={clsx(style.ask)}>{data.words[now].word}</div>
      <input 
        className={clsx(style.answer)} 
        value={answer.userAnswer} 
        onChange={(e) => handleAnswer(e.target.value)}
      />
      <div className={clsx(style.finish)}>{answer.result === undefined ? ". . ." : "→　"+data.words[now].mean}</div>
      <div 
        className={
          answer.result === undefined ?
          clsx(style.result) :
          answer.result === true ?
          clsx(style.result, style.resultCorrect) :
          clsx(style.result, style.resultIncorrect)
        }
      />
    </div>
    </Fragment>);
  }
}

export default App;
