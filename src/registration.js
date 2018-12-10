//stateful / class component - just like data in vue
import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            hasError: "placeholder"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //method
    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/registration", this.state)
            .then(resp => {
                console.log("resp in .then of axios POST Registration:", resp);

                if (resp.data.success) {
                    location.replace("/");
                } else {
                    console.log("resp in error", resp);
                    this.setState({
                        hasError: resp.data
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
            <div className="registration-container">
                <p className="register-title"> Register </p>
                <p className="welcome-login">
                    Already a member?
                    <Link to="/login"> Log in.</Link>
                </p>

                <form onSubmit={this.handleSubmit}>
                    <input className="register-input"
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="first name"
                    />
                    {this.state.hasError == "first" && (
                        <p className="err">Please enter your first name</p>
                    )}
                    <input className="register-input"
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="last name"
                    />
                    {this.state.hasError == "last" && (
                        <p className="err">Please enter your last name</p>
                    )}
                    <input className="register-input"
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    {this.state.hasError == "email" && (
                        <p className="err">Please enter your email</p>
                    )}
                    <input className="register-input"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    {this.state.hasError == "" && (
                        <p className="err">Please enter all required fields</p>
                    )}
                    <button id="register-button"> Register </button>
                </form>
            </div>
        );
    }
}
