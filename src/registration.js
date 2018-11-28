//stateful / class component - just like data in vue
import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //method
    handleSubmit(e) {
        e.preventDefault();
        //make post request to server and sends this.state to the server
        axios
            .post("/registration", this.state)
            .then(resp => {
                console.log("resp in .then of axios POST Registration:", resp);

                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("err in post registration:", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // () => console.log("this.state in handle change:", this.state)
        );
    }

    render() {
        return (
            //write all of JSX
            <div className="registration-container">
                <p> Register </p>

                {this.state.error && (
                    <p className="err">Please fill all fields</p>
                )}

                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="first name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="last name"
                    />
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
                    <button id="register-button"> Register </button>
                </form>

                <p className="welcome-login">
                    Already a member?
                    <a href="#">Log in</a>.
                </p>
            </div>
        );
    }
}
