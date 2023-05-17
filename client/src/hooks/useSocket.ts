import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { DeckType } from "../constants/deck";



export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [selectedCard, setSelectedCard] = useState<DeckType>();

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onCardEvent(value: DeckType) {
            console.log('Received card', value)
            setSelectedCard(value);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('selectedCard', onCardEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('selectedCard', onCardEvent);
        };
    }, []);


    return {
        isConnected,
        selectedCard,
        socket
    }
}