import * as React from "react"
import { useEffect, useState } from "react";
import startButton from '../imgs/play-button.png'
import pauseButton from '../imgs/stop-button.png'
import resetButton from '../imgs/arrow-circle.png'

export const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    // const running = React.useRef(false)

    // const setRunning = (val: boolean) => {
    //     running.current = val
    // }
    const checkTime = (): boolean => {
        const hours = ("0" + Math.floor((time / 600000) % 60)).slice(-2)
        const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
        const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
        const decisec = ("0" + ((time / 10) % 100)).slice(-2)

        const summ = parseInt(minutes[0]) + parseInt(minutes[1])
            + parseInt(seconds[0]) + parseInt(seconds[1])
            + parseInt(decisec[0]) + parseInt(decisec[1])
        console.log('summ', summ)
        return summ === 18
    }

    const msTo18 = () => {
        const hours = ("0" + Math.floor((time / 600000) % 60)).slice(-2)
        const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
        const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
        const decisec = ("0" + ((time / 10) % 100)).slice(-2)

        const summ =
            parseInt(minutes[0]) + parseInt(minutes[1])
            + parseInt(seconds[0]) + parseInt(seconds[1])
        // + parseInt(decisec[0]) + parseInt(decisec[1]) 

        console.log(`${minutes} : ${seconds} : ${decisec}`)
        console.log('summ', summ)
        console.log('18 - summ', 18 - summ)

        const diff = 18 - summ
        console.log('diff', diff)
        // console.log('Out msto18',
        // [ 
        //     Math.floor(Math.abs(diff)*0.5) * Math.sign(diff), 
        //     Math.ceil(Math.abs(diff)*0.5) * Math.sign(diff)
        // ])

        let divider = Math.random()

        let output = [
            Math.floor(Math.abs(diff) * divider) * Math.sign(diff),
            Math.ceil(Math.abs(diff) * (1 - divider)) * Math.sign(diff)
        ]

        console.log('output', output)
        let count = 0
        while ((output[0] >= 10 || output[1] >= 10) && count < 1000) {
            count++

            divider = Math.random()

            output = [
                Math.floor(Math.abs(diff) * divider) * Math.sign(diff),
                Math.ceil(Math.abs(diff) * (1 - divider)) * Math.sign(diff)
            ]

            console.log('while output', output, count)
        }



        return output
    }

    useEffect(() => {
        let interval: NodeJS.Timer | null = null;
        if (running) {

            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);

        } else {
            if (interval !== null) {

                if (checkTime()) {
                    clearInterval(interval);
                }
            }

        }

        return () => { if (interval) { clearInterval(interval) } };
    }, [running]);



    const hours = ("0" + Math.floor((time / 600000) % 60)).slice(-2)
    const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const decisec = ("0" + ((time / 10) % 100)).slice(-2)


    let outCalc = msTo18()
    // const msDec = parseInt(decisec[0]) + outCalc[0] 
    // const msUnit = parseInt(decisec[1]) + outCalc[1] 


    return (
        <div className="stopwatch">
            <div className="numbers">
                {/* <span>{hours}:</span> */}
                <span>{minutes}:</span>
                <span>{seconds}:</span>
                <span>{running || time === 0 ? decisec : `${outCalc[0]}${outCalc[1]}`}</span>
            </div>
            <div className="buttons">
                {!running ? (
                        <button className="start" onClick={() => setRunning(true)}>
                            <img src={startButton} />
                        </button>) :
                    (
                        <button className="stop" onClick={() => setRunning(false)}>
                            <img src={pauseButton} />
                        </button>
                    )}
                <button className="reset" onClick={() => setTime(0)}>
                    <img src={resetButton} />
                </button>
            </div>
        </div>
    );
};