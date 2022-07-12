import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { reloadData } from "./reduxToolkit/0_data";
import clsx from "clsx";
import style from "./style.module.scss"
import { useState } from "react";
import { useEffect } from "react";
import { getAllUser } from "./reduxToolkit/13_AllUser";
import { toAlert } from "./reduxToolkit/11_Alert";


function Login () {
    const [isLogined, setIsLogined] = useState(false)
    
    const dispatch = useDispatch()
    const alert = useSelector(state => state.alert)
    const handleAlert = ([type, mess]) => {
        dispatch(toAlert([type, mess]))
        const showAlert = setTimeout(() => {
            dispatch(toAlert([type, mess]))
            return clearTimeout(showAlert)
        }, 3000)
    }
    const allUser = useSelector(state => state.allUser)
    useEffect(() => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(getAllUser(obj)); console.log("loaded all of users, ready for login")})
        .catch(error => console.log(error))
    }, [dispatch])
    const [isLogin, setIsLogin] = useState(false)
    const [isSignup, setIsSignup] = useState(false)

    const [loginId, setLoginId] = useState(localStorage.getItem("userId") ? localStorage.getItem("userId") : "")
    const [loginPassword, setLoginPassword] = useState("")
    useEffect(() => {
        if (loginId==="" || loginPassword==="") {
            setIsLogin(false)
            setIsSignup(false)
        } else {
            if (allUser.find((user) => user.userId===loginId) === undefined) {
                setIsLogin(false)
                setIsSignup(true)
            } else {
                setIsLogin(true)
                setIsSignup(false)
            }
        }
    }, [allUser, loginId, loginPassword])
    const typingLoginId = (newValue) => {
        if (newValue.includes(",")) {
            handleAlert(["fail","Not use comma /,/ in ID"])
        } else {
            setLoginId(newValue)
            localStorage.setItem("userId", newValue)
        }
    }
    const typingLoginPassword = (newValue) => {
        setLoginPassword(newValue)
    }
    const handleLogin = () => {
        const yes = allUser.find((user) => user.userId === loginId && user.password === loginPassword)
        if (yes !== undefined) {
            setIsLogined(true)
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+loginId+"&password="+loginPassword, { method: 'GET' })
            .then((response) => response.json())
            .then((obj) => {
                // obj.words.sort(() => 0.5 - Math.random())
                dispatch(reloadData(obj))
                console.log("loaded all of data for "+loginId)
            })
            .catch(error => console.log(error))
            setIsLogined(true)
            handleAlert(["success","Logined successfully"])
        } else {
            handleAlert(["fail","Password is wrong"])
        }
        setLoginPassword("")
        setIsLogin(false)
        setIsSignup(false)
    }
    const handleSignup = () => {
        if (loginId === "admin" || loginId === "ADMIN") {
            setLoginId("")
            handleAlert(["fail","「admin」can not be used for new user"])
        } else {
            const dataSignup = new FormData()
            dataSignup.append("userId", loginId)
            dataSignup.append("password", loginPassword)
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=newUser", {
                method: "POST",
                body: dataSignup
            })
            .then(() => {
                setIsLogined(true)
                fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET' })
                .then((response) => response.json())
                .then((obj) => {
                    dispatch(getAllUser(obj))
                    console.log("loaded all of new users")})
                .then(() => {
                    handleAlert(["success","Signed up successfully\nPlease login again"])
                    setIsLogined(false)
                    console.log("confirm sign up")
                })
                .catch(error => console.log(error))
            })
            setLoginPassword("")
            setIsLogin(false)
            setIsSignup(false)
        }
    }
    if (isLogined) {
        return (<div className={clsx(style.login)} style={{textAlign: "center"}}>
            WAITING FOR LOADING DATA...
            <div className={clsx(style.alertSuccess, alert[0].show? style.alertShow: "")} >{alert[0].mess}</div>
        </div>)
    } else {
        return (<div className={clsx(style.login)}>
            <div className={clsx(style.alertSuccess, alert[0].show? style.alertShow: "")} >{alert[0].mess}</div>
            <div className={clsx(style.alertFail, alert[1].show? style.alertShow: "")} >{alert[1].mess}</div>
            <label>Your ID:</label>
            <input type="text" value={loginId} onChange={(e) => typingLoginId(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={loginPassword} onChange={(e) => typingLoginPassword(e.target.value)} />
            <input 
                type="button" 
                value={allUser.length === 0? "loading" : "Login"}
                className={clsx(isLogin && allUser.length !== 0 ? style.button: style.buttonBlock)} 
                onClick={isLogin && allUser.length !== 0 ? () => handleLogin() : () => {}} 
            />
            <input 
                type="button" 
                value={allUser.length === 0? "loading" : "Sign up"} 
                className={clsx(isSignup && allUser.length !== 0 ? style.button: style.buttonBlock)} 
                onClick={isSignup && allUser.length !== 0 ? () => handleSignup() : () => {}} 
            />
            <div className={clsx(style.forgotPassword)}>If forgot your password, just quest ADMIN !</div>
        </div>)
    }
}

export default Login