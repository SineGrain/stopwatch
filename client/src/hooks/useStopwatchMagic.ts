import { useEffect, useRef, useState } from "react"
import React from "react"
import { useSocket } from "./useSocket"
import { DECK } from "../constants/deck"

enum CalculusTypes {
    SINGLE_DIGITS = 'single_digits',
    DOUBLE_DIGITS = 'double_digits',
    ONLY_MS = 'only_ms'
}

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
    const [clacType, setCalcType] = useState<CalculusTypes>(CalculusTypes.SINGLE_DIGITS)
    const [fromTop, setFromTop] = useState(true)
    const { selectedCard } = useSocket()
    const [selectedCardIndex, setSelectedCardIndex] = useState(18) //React.useRef(18)
    const twoDigitSum = useRef(false)

    const [outMs, setOutMs] = useState()
    useEffect(() => {
        const cardIndex = DECK.findIndex(itm => itm === selectedCard)
        setSelectedCardIndex(cardIndex)

        if (cardIndex > 15 && cardIndex < 19) {
            setCalcType(CalculusTypes.SINGLE_DIGITS)
            setFromTop(true)
        }

        // if(cardIndex > 15 && cardIndex < 19)
    }, [selectedCard])

    useEffect(() => {
        const {
            minutes,
            seconds,
            decisec
        } = destructTime(time)

        const singleDigitSumMinSec = parseInt(minutes[0]) + parseInt(minutes[1])
            + parseInt(seconds[0]) + parseInt(seconds[1])



        const singleDigitDiff = selectedCardIndex - singleDigitSumMinSec

        if (Math.abs(singleDigitDiff) < 52) {
            setCalcType(CalculusTypes.SINGLE_DIGITS)
            setFromTop(singleDigitDiff < 26)
            return
        }

        const {
            minutesInt,
            secondsInt
        } = destructTimeInt(time)

        const twoDigitSumMinSec = minutesInt + secondsInt
        const twoDigitDiff = selectedCardIndex - twoDigitSumMinSec

        if (Math.abs(twoDigitDiff) < 52) {
            setCalcType(CalculusTypes.DOUBLE_DIGITS)
            setFromTop(twoDigitDiff < 26)

            return
        }

        setCalcType(CalculusTypes.ONLY_MS)
        setFromTop(selectedCardIndex < 26)


    }, [time, selectedCardIndex])


    /**
     * When this func return true the stopwatch stop itself
     * @returns 
     */
    const checkTime = (): boolean => {
        const {
            minutes,
            seconds,
            decisec
        } = destructTime(time)


        const summ = parseInt(minutes[0]) + parseInt(minutes[1])
            + parseInt(seconds[0]) + parseInt(seconds[1])
            + parseInt(decisec[0]) + parseInt(decisec[1])

        const twoDigitSum = parseInt(minutes) + parseInt(seconds) + parseInt(decisec)



        console.log('--------------')
        console.log('summ', summ)
        console.log('twoDigitSum', twoDigitSum)
        console.log('fromTop', fromTop)
        console.log('--------------')
        console.log('')

        return summ === selectedCardIndex //fromTop ? twoDigitSum === selectedCardIndex.current : summ === selectedCardIndex.current
    }

    /**
     * this func returns the millisecods to show
     * @returns 
     */
    const msToCardIndex = () => {

        const {
            minutes,
            seconds,
            decisec
        } = destructTime(time)

        const summ =
            parseInt(minutes[0]) + parseInt(minutes[1])
            + parseInt(seconds[0]) + parseInt(seconds[1])
        // + parseInt(decisec[0]) + parseInt(decisec[1]) 

        // console.log(`${minutes} : ${seconds} : ${decisec}`)
        // console.log('summ', summ)
        // console.log('18 - summ', 18 - summ)
        // console.log(selectedCardIndex.current, 'selectedCardIndex.current')

        const diff = (selectedCardIndex + 1) - summ

        console.log('selectedCardIndex.current - summ', diff)
        // console.log('diff', diff)
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

        }

        /**
         * nel caso in cui non si riesce a distribuire il dif su 2 digit
         * ritorno come numero da forzare il diff numerico delle cifre prese a coppie index - (mm + ss)
         **/

        if (output[0] >= 10 || output[1] >= 10) {
            const summ = parseInt(minutes) + parseInt(seconds)
            const diff = (selectedCardIndex + 1) - summ
            twoDigitSum.current = true
            // twoDigitOnly
            return [diff.toString()[0], diff.toString()[1]]
        } else {
            twoDigitSum.current = false
            return output
        }
    }

    return {
        checkTime,
        msToCardIndex,
        fromTop,
        selectedCardIndex,
        twoDigitSum
    }
}