import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "",
            click: ""
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        //if there is no data/relationship b/w 2 users, after someone send a request, change button from 'send friend req' to CANCEL REQUEST
        if (this.state.click == "makeFriends") {
            axios.post("/makeFriends/" + this.props.otherUserId).then(() => {
                this.setState({
                    click: "cancelFriend",
                    buttonText: "Cancel Friend Request"
                });
            });
        }

        if (this.state.click == "cancelFriend") {
            axios.post("/cancel/" + this.props.otherUserId).then(() => {
                this.setState({
                    click: "makeFriends",
                    buttonText: "Send Friend Request"
                });
            });
        }

        //if there are rows for 2 users: when person accepts request, turn button to say UNFRIEND
        if (this.state.click == "accept") {
            axios.post("/accept/" + this.props.otherUserId).then(() => {
                this.setState({
                    click: "delete",
                    buttonText: "Unfriend"
                });
            });
        }

        //if you click unfriend, delete the rows of data and give users the opportunity to become friends again
        if (this.state.click == "delete") {
            axios.post("/delete/" + this.props.otherUserId).then(() => {
                this.setState({
                    click: "makeFriends",
                    buttonText: "Send Friend Request"
                });
            });
        }
    }

    componentDidMount() {
        axios.get("/friend/" + this.props.otherUserId).then(({ data }) => {
            console.log("data in componentDidMount:", data);
            //if there is data:
            if (data.length) {
                //if friend req was accepted:
                if (data[0].accepted == true) {
                    this.setState({
                        click: "delete",
                        buttonText: "Unfriend"
                    });
                    //if a request was sent but not yet accepted:
                } else {
                    //if otherUserId is equal to the user you sent request to:
                    if (this.props.otherUserId == data[0].receiver_id) {
                        this.setState({
                            click: "cancelFriend",
                            buttonText: "Cancel Friend Request"
                        });
                    } else {
                        this.setState({
                            click: "accept",
                            buttonText: "Accept Friend Request"
                        });
                    }
                }
                //if there are no rows/no data:
            } else {
                this.setState({
                    click: "makeFriends",
                    buttonText: "Send Friend Request"
                });
            }
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
