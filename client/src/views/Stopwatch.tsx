import * as React from "react"
import { useEffect, useState } from "react";
import startButton from '../imgs/play-button.png'
import stopButton from '../imgs/stop-button.png'
import pauseButton from '../imgs/pause.png'
import resetButton from '../imgs/arrow-circle.png'
import { useStopWatchMagic } from "../hooks/useStopwatchMagic";

export const Stopwatch = () => {




    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);


    const {
        checkTime,
        msToCardIndex,
        fromTop,
        selectedCardIndex,
        twoDigitSum
    } = useStopWatchMagic({ time, running })





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


    let outCalc = msToCardIndex()
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
                            <img src={twoDigitSum.current ? pauseButton : stopButton} />
                        </button>
                    )}
                <button className="reset" onClick={() => setTime(0)}>
                    <img src={resetButton} />
                </button>
            </div>
        </div>
    );
};