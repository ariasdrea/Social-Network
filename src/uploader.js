import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    //AND MAKE NEW IMAGE SHOW UP INSTANTLY by: go to app and tell it to change something. var x = 'profilePicUrl, uploaderisVisible'

    handleSubmit(e) {
        //won't work without self (get error of props not defined even after binding function)
        var self = this;
        e.preventDefault();

        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(function(resp) {
                self.props.uploadNewPic(resp.data.profilepicurl);
                self.props.hideUploader();
            })
            .catch(err => {
                console.log("ERR in handlesubmit:", err);
            });
    }

    render() {
        return (
            <div className="uploader-container">
                <p className='x' onClick={this.props.hideUploader}>x</p>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="file"
                        type="file"
                        accept="image/*"
                    />
                    <button className="uploader-btn">upload image</button>
                </form>
            </div>
        );
    }
}
