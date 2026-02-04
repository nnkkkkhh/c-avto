import { useState } from "react"


const Main = () => {

    const [state, setState] = useState(false)
    const onClick = () => {
        setState(!state)
    }

    return (
        <div onClick={onClick}>{state ? "ON" : "OFF"}</div>
    )
}

export default Main