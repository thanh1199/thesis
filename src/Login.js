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
    const dispatch = useDispatch()
    const alert = useSelector(state => state.alert)
    const handleAlert = (mess) => {
        dispatch(toAlert(mess))
        const showAlert = setTimeout(() => {
            dispatch(toAlert(mess))
            return clearTimeout(showAlert)
        }, 2000)
    }
    const allUser = useSelector(state => state.allUser)
    useEffect(() => {
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET' })
        .then((response) => response.json())
        .then((obj) => {dispatch(getAllUser(obj))})
        .catch(error => console.log(error))
    }, [dispatch])
    const [isLogin, setIsLogin] = useState(false)
    const [isSignup, setIsSignup] = useState(false)

    const [loginId, setLoginId] = useState(localStorage.getItem("userId") ? localStorage.getItem("userId") : "")
    const [loginPassword, setLoginPassword] = useState("")
    const typingLoginId = (e, from="id") => {
        if (from==="id") {
            setLoginId(e.target.value)
            localStorage.setItem("userId", e.target.value)
            if (e.target.value==="" || loginPassword==="") {
                setIsLogin(false)
                setIsSignup(false)
            } else {
                if (allUser.find((user) => user.userId===e.target.value) === undefined) {
                    setIsLogin(false)
                    setIsSignup(true)
                } else {
                    setIsLogin(true)
                    setIsSignup(false)
                }
            }
        }
        if (from==="password") {
            if (loginId==="" || e.target.value==="") {
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
        }
    }
    const typingLoginPassword = (e) => {
        setLoginPassword(e.target.value)
        typingLoginId(e, "password")
    }
    const handleLogin = () => {
        const yes = allUser.find((user) => user.userId === loginId && user.password === loginPassword)
        if (yes !== undefined) {
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=1&userId="+loginId+"&password="+loginPassword, { method: 'GET' })
            .then((response) => response.json())
            .then((obj) => {dispatch(reloadData(obj)); console.log("loaded for "+loginId)})
            .catch(error => console.log(error))
            
            handleAlert("successful")
        } else {
            handleAlert("passwordMissing")
        }
        setLoginPassword("")
        setIsLogin(false)
        setIsSignup(false)
    }
    const handleSignup = () => {
        const dataSignup = new FormData()
        dataSignup.append("userId", loginId)
        dataSignup.append("password", loginPassword)
        fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=newUser", {
            method: "POST",
            body: dataSignup
        })
        .then(() => {
            fetch("https://webpg2-1.herokuapp.com/z2214505.php?step=getAllUser" , { method: 'GET' })
            .then((response) => response.json())
            .then((obj) => {dispatch(getAllUser(obj))})
            .catch(error => console.log(error))
        })
        setLoginPassword("")
        setIsLogin(false)
        setIsSignup(false)
        handleAlert("successful")
    }

    return (<div className={clsx(style.login)}>
        <div className={clsx(style.alertSuccessful, alert[0]? style.alertShow: "")} >Sign up successful !</div>
        <div className={clsx(style.alertPasswordMissing, alert[1]? style.alertShow: "")} >Password is wrong !</div>
        <label>Your ID:</label>
        <input value={loginId} onChange={(e) => typingLoginId(e)} />
        <label>Password:</label>
        <input type="password" value={loginPassword} onChange={(e) => typingLoginPassword(e)} />
        <input 
            type="button" 
            value="Login" 
            className={clsx(isLogin? style.button: style.buttonBlock)} 
            onClick={isLogin? () => handleLogin() : () => {}} 
        />
        <input 
            type="button" 
            value="Sign up" 
            className={clsx(isSignup? style.button: style.buttonBlock)} 
            onClick={isSignup? () => handleSignup() : () => {}} 
        />
        <div className={clsx(style.forgotPassword)}>Forgot Password ?</div>
    </div>)
}

export default Login