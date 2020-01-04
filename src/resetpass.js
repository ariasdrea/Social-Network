import React from "react";
import axios from "./axios";

export default class Reset extends React.Component {
    constructor() {
        super();
        this.state = {
            hasError: '',
            requestedCode: false,
            setNewPass: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidMount() {
        console.log('state on mount: ', this.state);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.requestedCode == false) {
            console.log('inside requestedCode conditional');
            axios.post("/resetPass", this.state).then(({data}) => {
                console.log('data: ', data);
                if (data.success) {
                    this.setState({
                        requestedCode: true
                    });
                } else {
                    this.setState({
                        hasError: data.err
                    });
                }
            }).catch(err => {
                console.log("err in resetPass:", err);
            });
        }
    }

    render() {
        return ( 
            <div>
                <form onSubmit={this.handleSubmit}>
                    <p> Please enter the email address with which you registered </p>
                    <input className = "login-input" onChange = {this.handleChange}
                        name = "email"
                        type = "text"
                        placeholder = "email" />
                    <button id="login-button" > Submit </button>
                </form>
                <p className = "err" > {this.state.hasError} </p>
            </div>
        );
    }
}
