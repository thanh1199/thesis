import clsx from "clsx"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { reloadData } from "../reduxToolkit/0_data"
import { toAlert } from "../reduxToolkit/11_Alert"
import { getAllUser } from "../reduxToolkit/13_AllUser"
import style from "../style.module.scss"


function ScoreSlide () {
    const dispatch = useDispatch()
    const allUser = useSelector(state => state.allUser)
    const handleAlert = ([type, mess]) => {
        dispatch(toAlert([type, mess]))
        const showAlert = setTimeout(() => {
            dispatch(toAlert([type, mess]))
            return clearTimeout(showAlert)
        }, 3000)
    }
    const [search, setSearch] = useState("")
    const [show, setShow] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [history, setHistory] = useState([])
    const allUserWithSeMiPls = allUser.map((user) => {
        var userWithSeMiPls = {...user, select: false, minus: 0, plus: 0}
        return userWithSeMiPls
    })
    const [allRows, setAllRows] = useState(allUserWithSeMiPls)

    let x, y
    const move = (event) => {
        // event.target.style.left = `${event.pageX - 50}px`
        // event.target.style.top = `${event.pageY - 50}px`
        event.target.style.left = `${event.pageX - x}px`
        event.target.style.top = `${event.pageY - y}px`
    }
    const handlePick = (event) => {
        // event.target.addEventListener("contextmenu", e => e.preventDefault())

        x = (event.target.getBoundingClientRect().right - event.target.getBoundingClientRect().left)/2
        y = (event.target.getBoundingClientRect().bottom - event.target.getBoundingClientRect().top)/2

        //window.innerWidth...
        // x = event.clientX - event.target.getBoundingClientRect().left
        // y = event.clientY - event.target.getBoundingClientRect().top
        event.target.addEventListener("mousemove", move)
    }
    const handlePut = (event) => {
        // if (event.button === 2) {}
        event.target.removeEventListener("mousemove", move)
    }

    const handleSelectAll = () => {
        var newAllRows
        if (search === "") {
            if (allRows.every((row) => row.select===true)) {
                newAllRows = allRows.map((row) => {
                    var newRow = {...row, select: false}
                    return newRow
                })
            } else {
                newAllRows = allRows.map((row) => {
                    var newRow = {...row, select: true}
                    return newRow
                })
            }
        } else {
            var searchRows = allRows.filter((row) => row.userId.includes(search))
            var newSearchRows
            if (searchRows.every((row) => row.select===true)) {
                newSearchRows = searchRows.map((row) => {
                    var newRow = {...row, select: false}
                    return newRow
                })
            } else {
                newSearchRows = searchRows.map((row) => {
                    var newRow = {...row, select: true}
                    return newRow
                })
            }
            newAllRows = allRows.map((row_allRows) => {
                var newRow = {...row_allRows}
                newSearchRows.forEach((row_newSearchRows) => {
                    if (row_newSearchRows.userId === newRow.userId) {newRow = {...row_newSearchRows}}
                })
                return newRow
            })
        }
        setAllRows(newAllRows)
    }
    const handleSeeLog = () => {
        setShowHistory(!showHistory)
        if (!showHistory) {
            fetch("http://kiisenglish.php.xdomain.jp/z2214505.php?step=seeLog" , { method: 'GET',  })
            .then((response) => response.json())
            .then((obj) => {
                const historyLog_ = obj.filter((log) => log.fromtable === "userkiis_score")
                const historyLog = historyLog_.sort((a, b) => b.incre - a.incre)
                setHistory(historyLog)
            })
        }
    }
    const handleReset = (i) => {
        var newAllRows = [...allRows]
        if (i<0) {
            allRows.forEach((row) => {
                if (row.select) {
                    row.minus = 0
                    row.plus = 0
                }
            })
        } else {
            newAllRows[i].minus = 0
            newAllRows[i].plus = 0
        }
        setAllRows(newAllRows)
    }
    const handleMinus = (i) => {
        var newAllRows
        if (i<0) {
            var newAllRows_
            if (allRows.every((row) => row.select === false)) {
                newAllRows_ = allRows.map((row) => {var newRow = {...row, select: true}; return newRow})
            } else {
                newAllRows_ = [...allRows]
            }

            const notMinusMore = newAllRows_.some((row) => row.select && row.minus>=row.score)
            if (notMinusMore) {
                handleAlert(["fail","Can not minus more"])
                newAllRows = [...newAllRows_]
            } else {
                newAllRows = newAllRows_.map((row) => {
                    var newRow = {...row}
                    if (row.select) {newRow.minus = row.minus+1}
                    return newRow
                })
            }
        } else {
            newAllRows = [...allRows]
            if (allRows[i].minus >= allRows[i].score) {
                handleAlert(["fail","Can not minus more"])
            } else {
                newAllRows[i].minus = allRows[i].minus + 1
            }
        }
        setAllRows(newAllRows)
    }
    const handlePlus = (i) => {
        var newAllRows
        if (i<0) {
            var newAllRows_
            if (allRows.every((row) => row.select === false)) {
                newAllRows_ = allRows.map((row) => {var newRow = {...row, select: true}; return newRow})
            } else {
                newAllRows_ = [...allRows]
            }
            newAllRows = newAllRows_.map((row) => {
                var newRow = {...row}
                if (row.select) {newRow.plus = row.plus+1}
                return newRow
            })
        } else {
            newAllRows = [...allRows]
            newAllRows[i].plus = allRows[i].plus + 1
        }
        setAllRows(newAllRows)
    }
    const handleSelect = (i) => {
        var newAllRows = [...allRows]
        newAllRows[i].select = !allRows[i].select
        setAllRows(newAllRows)
    }

    const reloadAllUser = () => {
        const allRowsNow = [...allRows]
        fetch("http://kiisenglish.php.xdomain.jp/z2214505.php?step=getAllUser" , { method: 'GET',  })
        .then((response) => response.json())
        .then((obj) => {
            var allUserAvoidAdmin = obj.filter((user) => user.userId !== "ADMIN")
            dispatch(getAllUser(allUserAvoidAdmin)); 
            console.log("reloaded all of users")
            return obj
        })
        .then((obj) => {
            var newAllRows = allRowsNow.map((row, i) => {
                var newRow
                if (row.score !== obj[i].score) {
                    newRow = {...row, score: obj[i].score, select: false}
                } else {
                    newRow = {...row, score: obj[i].score}
                }
                return newRow
            })
            setAllRows(newAllRows)
        })
        .catch(error => console.log(error))
    }
    const handleScore = (i, data) => {
        var scoreData = new FormData()
        if (i<0) {
            if (allRows.every((row) => row.minus===0 && row.plus===0)) {
                handleAlert(["quest", "Nothing to change"])
            } else if (allRows.every((row) => row.select===false)) {
                handleAlert(["quest", "Did you mean that change this selected row ?"])
                var newAllRows = allRows.map((row => {
                    var newRow = {...row}
                    if (row.minus!==0 || row.plus!==0) {
                        newRow.select=true
                    }
                    return newRow
                }))
                setAllRows(newAllRows)
            } else {
                var userIdArray = ""
                var minusArray = ""
                var plusArray = ""
                data.forEach((row) => {
                    if (row.select) {
                        userIdArray = userIdArray + row.userId + ","
                        minusArray = minusArray + row.minus + ","
                        plusArray = plusArray + row.plus + ","
                    }
                })
                scoreData.append('userIdArray', userIdArray)
                scoreData.append('minusArray', minusArray)
                scoreData.append('plusArray', plusArray)
                fetch("http://kiisenglish.php.xdomain.jp/z2214505.php?step=scores", {
                    method: 'POST',
                    body: scoreData, 
                })
                . then(() => reloadAllUser())

                handleReset(-1)
                handleAlert(["success", "Changed multi-user's score"])
            }
        } else {
            if (data.minus!==0 || data.plus!==0) {
                scoreData.append('minus', data.minus)
                scoreData.append('plus', data.plus)
                fetch("http://kiisenglish.php.xdomain.jp/z2214505.php?step=score&userId="+data.userId, {
                    method: 'POST',
                    body: scoreData, 
                })
                .then(() => reloadAllUser())
                handleReset(i)
                handleAlert(["success", "Changed "+data.userId+"'s score"])
            }
        }
    }
    return (
        <div className={clsx(style.scoreSlide, show? "" : style.scoreHidden)}>
            <div className={clsx(style.scoreSlideBlur)} />
            <div
                className={clsx(style.scoreButton)}
                onMouseDown = {handlePick}
                onMouseUp = {handlePut}
                onDoubleClick={() => setShow(!show)}
                onTouchStart={() => setShow(!show)}
            >SCORE</div>
            <div 
                className={style.history}
                style={{display: showHistory ? "block": "none"}}
            >{history.map((h, i) => <div key={i} className={style.log} >
                <p>{h.id}</p>
                {h.content.split("*").map((l, ii) => <span key={ii}>{l}*</span>)}
            </div>)}</div>
            <div className={clsx(style.scoreBox)}>
                <div className={style.scoreTopFunc}>
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className={style.scoreSearch}
                        placeholder="Search User ID"
                    />
                    <div className={style.clearSearch} onClick={() => setSearch("")}>×</div>
                    <div className={style.seeLog_selectAll}>
                        <div className={style.seeLog} onClick={() => handleSeeLog()}>History</div>
                        <div className={style.selectAll} onClick={() => handleSelectAll()}>Select all under rows</div>
                    </div>
                    <div className={style.multiSelect}>
                        <span className={style.changeScoreGoAll} onClick={() => handleReset(-1)}>Reset</span>
                        <span className={style.changeScoreAll} onClick={() => handleMinus(-1)}>ー</span>
                        <span className={style.changeScoreAll} onClick={() => handlePlus(-1)}>+</span>
                        <span className={style.changeScoreGoAll} onClick={() => handleScore(-1, [...allRows])}>GO</span>
                    </div>
                </div>

                {allRows.map((row, i) => {
                    if (row.userId.includes(search)) {
                        return(<div className={style.scoreLog} key={i}>
                            <span>{row.userId} → score: {row.score} </span>
                            <span className={style.scoreFunc}>
                                <input type="checkbox" checked={row.select} onChange={() => handleSelect(i)} />
                                <span className={style.changeScoreGo} onClick={() => handleReset(i)}>Reset</span>
                                <span className={style.changeScore} onClick={() => handleMinus(i)}>ー{row.minus}</span>
                                <span className={style.changeScore} onClick={() => handlePlus(i)}>+{row.plus}</span>
                                <span className={style.changeScoreGo} onClick={() => handleScore(i, {...row})}>GO</span>
                            </span>
                        </div>)
                    } else {
                        return (<div key={i} style={{display: "none"}}></div>)
                    }
                })}
            </div>
        </div>
    )
}

function ScoreSlideOnlyRead () {
    const dispatch = useDispatch()
    const data = useSelector(state => state.data)
    const handleReloadScore = () => {
        document.getElementById("score").classList.contains(style.loadingScoreAnimation) ?
        document.getElementById("score").classList.remove(style.loadingScoreAnimation) :
        document.getElementById("score").classList.add(style.loadingScoreAnimation) ;

        const url = "http://kiisenglish.php.xdomain.jp/z2214505.php?step=1&password="+data.password+"&userId="+data.userId
        fetch ( url, { method: "GET" })
        .then((response) => response.json())
        .then((obj) => {
            console.log("Loaded new data, new score")
            const reload = setTimeout(() => {
                dispatch(reloadData(obj))
                if (document.getElementById("score")) {
                    document.getElementById("score").classList.remove(style.loadingScoreAnimation)
                }
                return clearTimeout(reload)
            }, 1000)
        })
        .catch(error => console.log(error))
    }
    let x, y
    const move = (event) => {
        event.target.style.left = `${event.pageX - x}px`
        event.target.style.top = `${event.pageY - y}px`
    }
    const handlePick = (event) => {
        x = (event.target.getBoundingClientRect().right - event.target.getBoundingClientRect().left)/2
        y = (event.target.getBoundingClientRect().bottom - event.target.getBoundingClientRect().top)/2

        event.target.addEventListener("mousemove", move)
    }
    const handlePut = (event) => {
        event.target.removeEventListener("mousemove", move)
    }

    return (
        <div className={style.scoreSlide} style={{right: "-100%"}}>
            <div
                id="score"
                className={style.scoreButton}
                onMouseDown = {handlePick}
                onMouseUp = {handlePut}
                onDoubleClick={() => handleReloadScore()}
                onTouchStart={() => handleReloadScore()}
            >{data.userId} ({data.score})</div>
        </div>
    )
}

export { ScoreSlideOnlyRead }
export default ScoreSlide