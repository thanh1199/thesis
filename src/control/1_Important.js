
import clsx from "clsx"
import { useDispatch } from "react-redux"
import style from "../style.module.scss"
import { useSelector } from "react-redux";
import { reloadData } from "../reduxToolkit/0_data";

function Important () {
    const data = useSelector(state => state.data)
    const now = useSelector(state => state.move)
    const important = data.words[now].important === "0" ? false : true
    const dispatch = useDispatch();
    const handleSubmit = () => {
            fetch(`http://kiisenglish.php.xdomain.jp/z2214505.php?step=controlImportant&userId=${data.userId}&wordId=${data.words[now].wordId}&newImportant=${!important?1:0}`, { method: 'GET',  })
            .then(() => {
                fetch("http://kiisenglish.php.xdomain.jp/z2214505.php?step=1&userId="+data.userId+"&password="+data.password, { method: 'GET',  })
                .then((response) => response.json())
                .then((obj) => {dispatch(reloadData(obj)); console.log("loaded all of data for "+obj.userId)})
                .catch(error_ => console.log(error_))
            })
            .catch(error => console.log(error))
    }

    return (
        <div 
            className={important ? clsx(style.ctrl, style.importantActive) : clsx(style.ctrl)} 
            id={clsx(style.ctrlImportant)}
            onClick = {handleSubmit}
        >
            Important
        </div>
    )
}

export default Important