import React from "react";
import axios from "./axios";
//old friend button
// import FriendButton from "./friendbutton";

//friend button with class
import FriendButton from './friendbutton';

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios
            .get(`/user/${this.props.match.params.id}/info`)
            .then(({ data }) => {
                if (
                    data.result.length == 0 ||
                    data.userId == `${this.props.match.params.id}`
                ) {
                    this.props.history.push("/");
                } else {
                    this.setState(data.result[0]);
                }
            })
            .catch(err => {
                console.log("err in componentDidMount:", err);
                this.props.history.push("/");
            });
    }

    render() {
        return (
            <div>
                <p className="oop-title">
                        Welcome to {""} {this.state.first} {this.state.last}
                    {"'s"} profile page
                </p>
                <div className="profile-container">
                    <img
                        className="pp"
                        src={this.state.profilepicurl || "quest.png"}
                    />
                </div>
                <p className="oop-info">
                    {this.state.first}
                    {"'s"} bio : {""} {this.state.bio}
                </p>
                <p className="oop-info">
                    email : {""}
                    {this.state.email}
                </p>
                <br />

                <FriendButton otherUserId = {this.props.match.params.id}/>
            </div>
        );
    }
}
