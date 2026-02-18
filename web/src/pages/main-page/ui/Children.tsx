import { useState, useEffect } from "react"



export default function Children() {
    const [state, setState] = useState(false)

    const handleClick = () => {
        setState((state) => !state)
        return state
    }
    useEffect(() => {
        return () => {
            fetch("https://jsonplaceholder.typicode.com/todos/1").then((response) => {
                return response.json()
            }).then((json) => {
                console.log(json)
            })
        }
    }, [])

    return (
        <div>
            <p>Mian</p>
            <button onClick={handleClick}>Click</button>
        </div>

    )
}
