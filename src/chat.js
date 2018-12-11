// data flow starts here
// chat will have to go to the server to let it know that there is a new chat msg
// chat will emit it to the server using sockets
// server will store the chat msg
//take that new chat msg and user info and put it in the global state
//server will take that pkg and send it back to the front using sockets

import React from "react";
import { connect } from "react-redux";
import {} from "./actions";
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor() {
        super();
    }

    sendMessage(e) {
        let socket = initSocket();
        if (e.which === 13) {
            console.log("user's message", e.target.value);
            //now we need to emit from the component to server
            socket.emit("chatMsg", e.target.value);
        }
    }

    componentDidUpdate() {
        //runs every time there's been a change to the component
        console.log("this.elem:", this.elem);
        //change the scroll top of the div to include the new msg that's now at the bottom
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {
        return (
            <div>
                <p className="chat-title">Chat component works!</p>
                <div
                    className="chat-messages-container"
                    ref={elem => (this.elem = elem)}
                >
                    <p>test test test </p>
                    <p>test test test </p>
                    <p>test test test </p>
                </div>

                <textarea onKeyDown={this.sendMessage} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Chat);
