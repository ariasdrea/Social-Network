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
        //clicking enter
        if (e.which === 13) {
            e.preventDefault();
            socket.emit("chatMsg", e.target.value);
            e.target.value = "";
        }
    }

    componentDidUpdate() {
        console.log('scrolltop: ', this.elem.scrollTop);
        console.log('scrollheight: ', this.elem.scrollHeight);
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {
        if (!this.props.messages) {
            return null;
        }

        let arrOfMessages = this.props.messages.map(item => {
            // console.log("item in arrOfMessages:", item);
            return (
                <div className="chat-div" key={item.messageId}>
                    <img className="chat-img" src={item.profilepicurl} />
                    <p className="chat-msg">
                        {item.first} says - {item.messages}
                    </p>
                </div>
            );
        });

        return (
            <div>
                <p className="chat-title">Welcome to Chat</p>
                <div
                    className="chat-messages-container"
                    ref={elem => (this.elem = elem)}
                >
                    {" "}
                    {arrOfMessages}
                </div>
                <div className="chat-input-div">
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
