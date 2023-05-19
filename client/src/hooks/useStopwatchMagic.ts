import { useEffect, useRef, useState } from "react"
import React from "react"
import { useSocket } from "./useSocket"
import { DECK } from "../constants/deck"

export enum CalculusTypes {
    SINGLE_DIGITS = 'single_digits',
    DOUBLE_DIGITS = 'double_digits',
    ONLY_MS = 'only_ms'
}

/**
     * this func returns the millisecods to show
     * @returns 
     */
const msForSingleDigits = (diff: number) => {

    let divider = Math.random()

    let output = [
        Math.floor(Math.abs(diff) * divider) * Math.sign(diff),
        Math.ceil(Math.abs(diff) * (1 - divider)) * Math.sign(diff)
    ]

    let count = 0

    while ((output[0] >= 10 || output[1] >= 10) && count < 1000) {
        count++

        divider = Math.random()

        output = [
            Math.floor(Math.abs(diff) * divider) * Math.sign(diff),
            Math.ceil(Math.abs(diff) * (1 - divider)) * Math.sign(diff)
        ]
    }

    return `${output[0]}${output[1]}`
}

const numPad2 = (num: number) => ("0" + num).slice(-2)

const destructTime = (time: number) => {
    const hours = ("0" + Math.floor((time / 600000) % 60)).slice(-2)
    const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const decisec = ("0" + ((time / 10) % 100)).slice(-2)

    return {
        hours,
        minutes,
        seconds,
        decisec
    }
}

const destructTimeInt = (time: number) => {
    const hoursInt = Math.floor((time / 600000) % 60)
    const minutesInt = Math.floor((time / 60000) % 60)
    const secondsInt = Math.floor((time / 1000) % 60)
    const decisecInt = (time / 10) % 100

    return {
        hoursInt,
        minutesInt,
        secondsInt,
        decisecInt
    }
}
interface StopwatchMagicProps {
    time: number,
    running: boolean
}
export const useStopWatchMagic = ({ time, running }: StopwatchMagicProps) => {
    const [calcType, setCalcType] = useState<CalculusTypes>(CalculusTypes.SINGLE_DIGITS)
    const [fromTop, setFromTop] = useState(true)
    const { selectedCard } = useSocket()
    const [selectedCardIndex, setSelectedCardIndex] = useState(18) //React.useRef(18)

    const [outMs, setOutMs] = useState<string>('00')

    /**
     * calcola e setta l'index della carta da quella scelta che arriva dal socket
     */
    useEffect(() => {
        const cardIndex = DECK.findIndex(itm => itm === selectedCard)
        setSelectedCardIndex(cardIndex)
    }, [selectedCard])


    /**
     * setta tipo di calcolo e se da sopra o da sotto il mazzo
     */
    useEffect(() => {
        if (!running) {
            console.log('executing checks')
            const {
                minutes,
                seconds,
            } = destructTime(time)

            const singleDigitSumMinSec = parseInt(minutes[0]) + parseInt(minutes[1])
                + parseInt(seconds[0]) + parseInt(seconds[1])
            console.log('singleDigitSumMinSec', singleDigitSumMinSec)

            const cardIndexFromBottom = 52 - selectedCardIndex

            /**
             * single digits from top
             */
            if (
                (selectedCardIndex < (singleDigitSumMinSec + 18) &&
                    selectedCardIndex > singleDigitSumMinSec)
            ) {
                const singleDigitDiff = selectedCardIndex - singleDigitSumMinSec
                console.log('----- SINGLES FROM TOP ------')
                console.log('position from top', selectedCardIndex)
                console.log('singleDigitDiff from top!', singleDigitDiff)
                console.log('------------------------')
                setCalcType(CalculusTypes.SINGLE_DIGITS)
                setFromTop(true)
                setOutMs(msForSingleDigits(singleDigitDiff))
                return

            }
            /**
             * Single digits from bottom
             */
            if (
                (cardIndexFromBottom < (singleDigitSumMinSec + 18) &&
                cardIndexFromBottom > singleDigitSumMinSec)
            ) {
                // const fromBottom = ((52 - selectedCardIndex) < (singleDigitSumMinSec + 18) && (52 - selectedCardIndex)  > singleDigitSumMinSec)
                const singleDigitDiff = cardIndexFromBottom - singleDigitSumMinSec
                console.log('----- SINGLES FROM BOTTOM ------')
                console.log('Position from bottom', cardIndexFromBottom)
                console.log('singleDigitDiff from bottom!', singleDigitDiff)
                console.log('------------------------')
                setCalcType(CalculusTypes.SINGLE_DIGITS)
                setFromTop(false)
                setOutMs(msForSingleDigits(singleDigitDiff))
                return
            }



            /**
             * double digits sum from top
             */

            const {
                minutesInt,
                secondsInt
            } = destructTimeInt(time)


            const twoDigitSumMinSec = minutesInt + secondsInt



            /**
             * double digits sum from top
             */


            if (selectedCardIndex < twoDigitSumMinSec + 99 &&
                selectedCardIndex > twoDigitSumMinSec) {
                const twoDigitDiff = selectedCardIndex - twoDigitSumMinSec
                setCalcType(CalculusTypes.DOUBLE_DIGITS)
                setFromTop(true)
                setOutMs(numPad2(twoDigitDiff))

                console.log('----- DOUBLES FROM TOP ------')
                console.log('Position from bottom', selectedCardIndex)
                console.log('twoDigitDiff from bottom!', twoDigitDiff)
                console.log('------------------------')

                return
            }


            if (cardIndexFromBottom < twoDigitSumMinSec + 99 &&
                cardIndexFromBottom > twoDigitSumMinSec) {
                const twoDigitDiff = cardIndexFromBottom - twoDigitSumMinSec
                setCalcType(CalculusTypes.DOUBLE_DIGITS)
                setFromTop(false)
                setOutMs(numPad2(twoDigitDiff))
                console.log('----- DOUBLES FROM BOTTOM ------')
                console.log('Position from bottom', selectedCardIndex)
                console.log('twoDigitDiff from bottom!', twoDigitDiff)
                console.log('------------------------')

                return
            }

            // const twoDigitDiff = selectedCardIndex - twoDigitSumMinSec
            // console.log('twoDigitDiff', twoDigitDiff)
            // if (Math.abs(twoDigitDiff) < 52) {
            //     setCalcType(CalculusTypes.DOUBLE_DIGITS)
            //     const isFromTop = twoDigitDiff < 26 && twoDigitDiff >= 0
            //     setFromTop(isFromTop)
            //     setOutMs(numPad2(isFromTop ? twoDigitDiff : 52 - twoDigitDiff))
            //     return
            // }

            console.log('Only selectedCardIndex', selectedCardIndex)
            setCalcType(CalculusTypes.ONLY_MS)
            const isFromTop = selectedCardIndex < 26 && selectedCardIndex >= 0
            setFromTop(isFromTop)
            setOutMs(numPad2(isFromTop ? selectedCardIndex : 52 - selectedCardIndex))
        }

    }, [time, selectedCardIndex, running])

    return {
        fromTop,
        selectedCardIndex,
        outMs,
        calcType
    }
}
