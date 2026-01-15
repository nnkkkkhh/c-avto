import axios from 'axios'
import { useState } from 'react'

export default function Test() {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count + 1)
    }
    const fetchData = async () => {
        try {
            const response = await axios.get('https://api.example.com/data')
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)

        }
        return (
            <div>
                <button onClick={handleClick}>Click me</button>
                <p>Count: {count}</p>
                <button onClick={fetchData}>Fetch Data</button>

            </div>
        )
    }
}
