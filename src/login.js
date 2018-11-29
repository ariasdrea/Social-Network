import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then(resp => {
                console.log("resp in .then of axios POST Login:", resp);

                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        hasError: true
                    });
                }
            })
            .catch(err => {
                console.log("err in post registration:", err);
            });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="login-container">
                <p> Login </p>

                {this.state.hasError && (
                    <p className="err">Please fill in all required fields</p>
                )}

                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button id="login-button"> Log In </button>
                </form>
            </div>
        );
    }
}

//if something goes wrong, render an error MSG (user didnt put in an input field, provided invaid password or email)
