import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"

export const Control = () => {
    const values = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '1', 'j', 'q', 'k']
    const suites = ['c', 'f', 'q', 'p']

    const [value, setValue] = useState<string>()
    const [suite, setSuite] = useState<string>()

    const { socket } = useSocket()

    useEffect(() => {
        if(socket && value && suite){
            console.log('selected card event!', `${suite}${value}`)
            console.log('has listener', socket.hasListeners('selectedCard'))
            socket.emit('selectedCard', `${suite}${value}`)
        }
    }, [value, suite])

    return (
    <div className="control">
        <div className="buttons">
            <li className="values">
                {values.map(item => (
                    <ul key={`v_${item}`} onClick={() => setValue(item)}>{item}</ul>
                ))} 
            </li>
            <li className="suite">
                    {suites.map(itm => (
                        <ul key={`s_${itm}`} onClick={()=> setSuite(itm)}>{itm}</ul>
                    ))}
            </li>
        </div>
        <div>Suite: {suite} | Value: {value}</div>

    </div>
    )
}
