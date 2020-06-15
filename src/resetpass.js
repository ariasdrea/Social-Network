import React from "react";
import axios from "./axios";
import {
    Link
} from "react-router-dom";

export default class Reset extends React.Component {
    constructor() {
        super();
        this.state = {
            hasErr: '',
            step: 1
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
    
        if (this.state.step == 1) {
            axios.post('/resetPass', this.state).then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 2
                    });
                } else {
                    this.setState({
                        hasErr: data.err
                    });
                }
            });
        } else if (this.state.step == 2) {
            axios.post('/confirm-identity', this.state).then(({ data }) => {
                console.log('succesS? ', data);
                if (data.success) {
                    this.setState({
                        step: 3
                    });
                } else {
                    this.setState({
                        hasErr: data.err
                    });
                }
            });
        }
    }

    getCurrentDisplay() {
        if (this.state.step == 1) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <p className='reset-title'> Please enter the email address with which you registered </p>
                        <input className = "login-input" onChange = {this.handleChange}
                            name = "email"
                            type = "text"
                            placeholder = "email" />
                        <button id="login-button" > Submit </button>
                    </form>

                    <p className = "err" > {this.state.hasErr} </p>
                </div>
            );
        } else if (this.state.step == 2) {
            return (
                <div>
                    <form onSubmit = {this.handleSubmit } >
                        <p className='reset-title bold'> Reset Password </p>
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
                                    
                        <p className="err"> {this.state.hasErr} </p>
                    </form>
                </div>
                
            );
        } else if (this.state.step == 3) {
            return (
                <div>
                    <p className='reset-title'>Reset Password</p>
                    <p className='reset-title'>Success!</p>
                    <p className='reset-title'> You can now <Link to = '/login'><span className='login'>log in</span></Link> with your new password</p>
                </div>
            );
        }
    }

    render() {
        return (
            <div>{this.getCurrentDisplay()}</div>
        );
    }
}