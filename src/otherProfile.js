import React from "react";
import axios from "./axios";
import FriendBtn from "./friendbtn";
import OtherUserFriends from "./otherUserFriends";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        let { data } = await axios.get(
            `/user/${this.props.match.params.id}/info`
        );
        console.log("DATARESULT: ", data.result[0].first);
        if (
            data.result.length == 0 ||
            data.userId == `${this.props.match.params.id}`
        ) {
            this.props.history.push("/");
        } else {
            this.setState(data.result[0]);
        }

        let {
            data: { buttonText },
        } = await axios.get(`/checkFriendStatus/${this.props.match.params.id}`);

        if (buttonText === "Unfriend") {
            this.setState({
                showOtherUserFriends: true,
            });
        }

        if (this.state.showOtherUserFriends) {
            this.setState({
                className: "otherProfileGrid",
            });
        }
    }

    render() {
        return (
            <div className={this.state.className}>
                <div className="otherProfileLeft">
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

                    <FriendBtn otherUserId={this.props.match.params.id} />
                </div>

                {this.state.showOtherUserFriends && (
                    <div className="otherProfileRight">
                        <OtherUserFriends
                            id={this.props.match.params.id}
                            user={this.state.first}
                        />
                    </div>
                )}
            </div>
        );
    }
}
