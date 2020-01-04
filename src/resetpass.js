import React from "react";
import axios from "./axios";
import {
    Link
} from "react-router-dom";

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

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.requestedCode == false) {
            axios.post("/resetPass", this.state).then(({data}) => {
                // console.log('data: ', data);
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

        if (this.state.requestedCode == true && this.state.setNewPass == false) {
            axios.post('/confirm-identity', this.state).then(({ data }) => {
                console.log('data in /confirm-identity: ', data);
                if (data.success) {
                    this.setState({
                        setNewPass: true
                    });
                }
            }).catch(err => {
                console.log('err in /confirm-identity: ', err);
            });
        }
    }

    render() {
        return ( 
            <div>
                {!this.state.requestedCode ? (
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <p className='reset-title'> Please enter the email address with which you registered </p>
                            <input className = "login-input" onChange = {this.handleChange}
                                name = "email"
                                type = "text"
                                placeholder = "email" />
                            <button id="login-button" > Submit </button>
                        </form>
                        <p className = "err" > {this.state.hasError} </p>
                    </div>
                ) : (
                    <div>
                        {!this.state.setNewPass ? (
                            <div>
                                <form onSubmit = {this.handleSubmit } >
                                    <p className='reset-title'> Reset Password </p>
                                    <p className='reset-title'> Please enter code you received </p>
                                    <input className = "login-input"
                                        onChange = {this.handleChange}
                                        name = "code"
                                        type = "text"
                                        placeholder="code" />
                                        
                                    <p className='reset-title'>Please enter a new password</p>
                                    <input className = "login-input"
                                        onChange = {this.handleChange}
                                        name = "password"
                                        type = "password"
                                        placeholder = "password" />
                                    <button id="login-button"> Submit </button> 
                                </form>
                            </div>
                
                        ) : (
                            <div>
                                <p className='reset-title'>Reset Password</p>
                                <p className='reset-title'>Success!</p>
                                <p className='reset-title'> You can now <Link to = '/login'> log in</Link> with your new password</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
