import Children from "./Children"
import { useState } from "react"

export default function App() {
    const [count, setCount] = useState(0)
    const [state, setState] = useState(false)
    const onChange = () => {
        setState((state) => !state)
    }
    const onCount = () => {
        setCount((count) => ++count)
        console.log(count)
    }

    return (
        <div className="main-wrapper">
            <p>Main</p>
            <button onClick={onChange}>click</button>
            <button onClick={onCount}>count</button>
            {state && <Children children={state} count={count} />}
        </div>
    )
}