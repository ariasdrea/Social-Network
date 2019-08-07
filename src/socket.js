import * as io from "socket.io-client";
import {
    allOnlineUsers,
    userWhoJoined,
    userWhoLeft,
    showMessages,
    showMsgInstantly
} from "./actions";

let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", msg => {
            store.dispatch(allOnlineUsers(msg));
        });

        socket.on("userJoined", msg => {
            store.dispatch(userWhoJoined(msg));
        });

        socket.on("userLeft", msg => {
            store.dispatch(userWhoLeft(msg));
        });

        socket.on("showMsgs", msg => {
            store.dispatch(showMessages(msg));
        });

        socket.on("eachMsg", msg => {
            store.dispatch(showMsgInstantly(msg));
        });
    }
    return socket;
}
