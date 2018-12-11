// data flow starts here
// chat will have to go to the server to let it know that there is a new chat msg
// chat will emit it to the server using sockets
// server will store the chat msg
//take that new chat msg and user info and put it in the global state
//server will take that pkg and send it back to the front using sockets

import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        let socket = initSocket();
        if (e.which === 13) {
            socket.emit("chatMsg", e.target.value);
        }
    }

    componentDidUpdate() {
        if(!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {
        console.log("this.props:", this.props);

        if (!this.props.messages) {
            return null;
        }

        let arrOfMessages = this.props.messages.map(item => {
            return(
                <div className='chat-div' key={item.messageId}>
                    <img className="chat-img" src={item.profilepicurl} />
                    <p className='chat-msg'>{item.first} says - {item.messages}</p>
                </div>
            );
        });
        
        return (
            <div>
                <p className="chat-title">Welcome to Chat</p>
                <div
                    className="chat-messages-container"
                    ref={elem => (this.elem = elem)}
                > {arrOfMessages}
                    <textarea
                        className="chat-input-field"
                        onKeyDown={this.sendMessage}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        messages: state.latestMessages
    };
};

export default connect(mapStateToProps)(Chat);
