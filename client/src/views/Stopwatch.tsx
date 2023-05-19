import * as React from "react"
import { useEffect, useState } from "react";
import startButtonSingleDigits from '../imgs/play-button.png'
import startButtonDoubleDigits from '../imgs/play-button_double_digits.png'
import startOnlyMs from '../imgs/play-button_only_ms.png'
// import stopButton from '../imgs/stop-button.png'
import resetButton from '../imgs/arrow-circle.png'
import { CalculusTypes, useStopWatchMagic } from "../hooks/useStopwatchMagic";

export const Stopwatch = () => {

    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    let startButton = startButtonSingleDigits

    const {
        fromTop,
        selectedCardIndex,
        calcType,
        outMs
    } = useStopWatchMagic({ time, running })
    
    switch(calcType){
        case CalculusTypes.SINGLE_DIGITS: {
            startButton = startButtonSingleDigits
            break;
        }
        case CalculusTypes.DOUBLE_DIGITS: {
            startButton = startButtonDoubleDigits
            break
        }
        case CalculusTypes.ONLY_MS: {
            startButton = startOnlyMs
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timer | null = null;
        if (running) {

            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);

        } else {
            if (interval !== null) {
                clearInterval(interval);
            }
        }

        return () => { if (interval) { clearInterval(interval) } };
    }, [running]);


    const hours = ("0" + Math.floor((time / 600000) % 60)).slice(-2)
    const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const decisec = ("0" + ((time / 10) % 100)).slice(-2)


    return (
        <div className={`stopwatch calc_${calcType} from_${fromTop ? 'top': 'bottom'}`}>
            <div className="numbers__container">
                <div className={`numbers`}>
                    {/* <span>{hours}:</span> */}
                    <span>{minutes}</span>
                    <span>:</span>
                    <span>{seconds}</span>
                    <span>:</span>
                    <span>{running || time === 0 ? decisec : `${outMs[0]}${outMs[1]}`}</span>
                    {/* <span>{decisec}</span> */}
                </div>
            </div>
            <div className="buttons">
                {!running ? (
                    <button className="start" onClick={() => setRunning(true)}>
                        <img src={startButton} />
                    </button>) :
                    (
                        <button className="stop" onClick={() => setRunning(false)}>
                            {/* <img src={stopButton} /> */}
                            <div className="stopButton"></div>
                        </button>
                    )}
                <button className="reset" onClick={() => setTime(0)}>
                    <img src={resetButton} />
                </button>
            </div>
            {/* <div>
                <div>Calc type: {calcType}</div>
                <div>selectedCardIndex from top: {selectedCardIndex}</div>
                <div>fromTop: {fromTop.toString()}</div>
            </div> */}
        </div>
    );
};
