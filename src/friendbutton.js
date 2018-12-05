import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "",
            clickAction: ""
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        if (this.state.clickAction == "makeFriends") {
            axios.post("/makeFriends/" + this.props.otherUserId).then(data => {
                console.log("data in post makefriends:", data);
                this.setState({ buttonText: "Cancel Request" });
            });
        }
    }

    componentDidMount() {
        axios.get("/friend/" + this.props.otherUserId).then(({ data }) => {
            console.log("data in componentDidMount:", data);
            if (data.length) {
                console.log("theres data inside the array!");
                if (data[0].accepted) {
                    this.setState({
                        clickAction: "delete",
                        buttonText: "Unfriend"
                    });
                } else {
                    this.setState({
                        clickAction: "Accept",
                        buttonText: "Accept Friend Request"
                    });
                }
            } else {
                this.setState({
                    buttonText: "Send Friend Request",
                    clickAction: "makeFriends"
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
