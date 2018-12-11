import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showTextArea = this.showTextArea.bind(this);
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
                this.props.setBio(resp.data.bio);
                this.setState({
                    showTextArea: false
                });
            })
            .catch(err => {
                console.log("ERR in handlesubmit:", err);
            });
    }

    showTextArea(e) {
        e.preventDefault();
        this.setState({
            bio: this.props.bio,
            showTextArea: true
        });
    }

    render() {
        return (
            <div>
                {this.state.showTextArea ? (
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            onChange={this.handleChange}
                            defaultValue={this.props.bio}
                        />
                        <button className="submit-btn">Add Info</button>
                    </form>
                ) : (
                    <div>
                        {this.props.bio ? (
                            <div className="bio-container">
                                {this.props.bio}
                                <br />
                                <br />
                                <Link onClick={this.showTextArea} to="/">
                                    Edit bio
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Link onClick={this.showTextArea} to="/">
                                    Add bio
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
