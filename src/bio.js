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
        this.hideTextArea = this.hideTextArea.bind(this);
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/add-bio", this.state)
            .then(({data}) => {
                this.props.setBio(data);
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

    hideTextArea() {
        this.setState({
            showTextArea: false
        });
    }

    render() {
        return (
            <div>
                {this.state.showTextArea ? (
                    <div className="div">
                        <form className="bio-form" onSubmit={this.handleSubmit}>
                            <textarea
                                className="bio-input-field"
                                onChange={this.handleChange}
                                defaultValue={this.props.bio}
                            />
                            <div className="bio-form-div">
                                <button className="submit-btn">Add Info</button>
                            </div>
                        </form>
                        <button
                            className="cancel-bio-btn"
                            onClick={this.hideTextArea}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div>
                        {this.props.bio ? (
                            <div className="bio-container">
                                {this.props.bio}
                                <br />
                                <br />
                                <Link
                                    className="bio-button"
                                    onClick={this.showTextArea}
                                    to="/"
                                >
                                    Edit bio
                                </Link>
                            </div>
                        ) : (
                            <div className="bio-container">
                                <Link
                                    className="bio-button"
                                    onClick={this.showTextArea}
                                    to="/"
                                >
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
