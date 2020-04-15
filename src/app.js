import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./OtherPersonProfile";
import List from './friendshooks';
import OnlineUsers from "./onlineUsers";
import FindPeople from "./findPeople";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            first: "",
            bio: ""
        };
        this.showUploader = this.showUploader.bind(this);
        this.uploadNewPic = this.uploadNewPic.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    uploadNewPic(url) {
        this.setState({
            profilepicurl: url
        });
    }
    
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
            textAreaVisible: false
        });
    }

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data);
        });
    }

    render() {
        return (
            <div className="header-div">
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profilepicurl || "quest.png"}
                    showUploader={this.showUploader}
                />

                <hr />

                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        profilePicUrl={this.state.profilepicurl}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                        showUploader={this.showUploader}
                                    />
                                );
                            }}
                        />

                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherPersonProfile
                                    {...props}
                                    key={props.match.url}
                                />
                            )}
                        />
                        <Route path="/getFriends" component={List} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/online" component={OnlineUsers} />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <div id="overlay">
                        <Uploader
                            uploadNewPic={this.uploadNewPic}
                            hideUploader={this.hideUploader}
                        />
                    </div>
                )}

                <div className="navbar">
                    <a href="/">profile</a>
                    <a href="/getFriends">list of friends</a>
                    <a href='/users'>search</a>
                    <a href="/online">online</a>
                    <a href="/chat">chat</a>
                    <a href="/logout">logout</a>
                </div>
            </div>
        );
    }
}
