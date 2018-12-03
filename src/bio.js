import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        axios
            .post("/bio", this.state)
            .then(resp => {
                return resp.data.bio;
            })
            .catch(err => {
                console.log("ERR in handlesubmit:", err);
            });
    }

    render() {
        return (
            <div className="bio-container">
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        onChange={this.handleChange}
                        rows="15"
                        cols="50"
                        defaultValue={this.state.bio}
                    />
                    <button className="submit-btn">Submit Bio</button>
                </form>
            </div>
        );
    }
}

// bio component is similar to uploader component - needs to check to see if there is a bio . if no bio, it should show a button, a msg to add your bio. bio component will have to be a class b/c it has state.
//
// <textarea defaultValue={this.state.bio} />
// <textarea onChange={this.handleChange} mdefaultValue={this.state.bio} />

// when you login the first thing you want to see is your profile
