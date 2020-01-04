import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

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
                <p className="register-title">
                    login ||
                    <Link className="login-link" to="/">
                        {""} register
                    </Link>
                </p>

                {this.state.hasError && (
                    <p className="err">
                        email and/or password are incorrect. try again.
                    </p>
                )}

                <form onSubmit={this.handleSubmit}>
                    <input
                        className="login-input"
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        className="login-input"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button id="login-button"> Log In </button>
                </form>
                < p className = 'reset-password-link' >
                    < Link className = 'reset-password-link'
                        to = "/reset" >
                        {""} Forgot your password ?
                    </Link>
                </p>
            </div>
        );
    }
}
