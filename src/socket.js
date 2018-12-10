// all of the client side socket code will go
import * as io from "socket.io-client";
import { allOnlineUsers, userWhoLeft } from "./actions";

let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        //on is an event listener waiting for a msg. accepts 2 arguments: 1. name of msg or even we're listening for.
        //2. callback function that will run when the client hears the  event
        //the variable we're passing to the callback function is the data that socket.emit sent

        socket.on("onlineUsers", msg => {
            store.dispatch(allOnlineUsers(msg));
        });

        // socket.on('userJoined', userWhoJoined => {
        //     console.log('message in userJoined:', userWhoJoined);
        //     store.dispatch();
        // });
        //
        socket.on("userLeft", msg => {
            console.log("message in userLeft:", msg);
            store.dispatch(userWhoLeft(msg));
        });

        // will need a  new route in browser route, mapstateto props, new onlineusers component

        // when you go to onlineusers component you'll see everyone who's currently online but you;ll have to refresh to see the updated list
    }
    return socket;
}
