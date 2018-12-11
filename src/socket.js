import * as io from "socket.io-client";
import { allOnlineUsers, userWhoJoined, userWhoLeft } from "./actions";

let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", msg => {
            store.dispatch(allOnlineUsers(msg));
        });

        socket.on("userJoined", msg => {
            // console.log("msg in userjoined:", msg);
            store.dispatch(userWhoJoined(msg));
        });

        socket.on("userLeft", msg => {
            // console.log("message in userLeft:", msg);
            store.dispatch(userWhoLeft(msg));
        });
    }
    return socket;
}
