import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.uploadNewPic = this.uploadNewPic.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    uploadNewPic(url) {
        this.setState({
            profilePicUrl: url
        });
    }
    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data, () =>
                console.log("this.state in then of axios:", this.state)
            );
        });
    }

    render() {
        return (
            <div>
                <Logo />
                <div className="pp-container">
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        userId={this.state.userId}
                        profilePicUrl={this.state.profilepicurl || "quest.png"}
                        showUploader={this.showUploader}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        uploadNewPic={this.uploadNewPic}
                        hideUploader={this.hideUploader}
                    />
                )}
            </div>
        );
    }
}
