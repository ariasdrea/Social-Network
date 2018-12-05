import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios
            .get(`/user/${this.props.match.params.id}/info`)
            .then(({ data }) => {
                // console.log("data.result:", data);
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
                <h1> OPP running!! </h1>
                <h1> {this.props.match.params.id} </h1>
                <img src={this.state.profilepicurl || "quest.png"} />
                <h3>
                    {this.state.first} {this.state.last}
                </h3>
                {this.state.email}
                {this.state.bio}
                <FriendButton otherUserId={this.props.match.params.id} />
            </div>
        );
    }
}

//import {Link} from "react-router-dom";
