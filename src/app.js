import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./OtherPersonProfile";
import List from './friendshooks';
import OnlineUsers from "./onlineUsers";
import Chat from "./chatHooks";
import FindPeople from "./findPeople";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            first: "",
            bio: ""
        };
        this.uploadNewPic = this.uploadNewPic.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    uploadNewPic(url) {
        this.setState({
            profilepicurl: url
        });
    }

    // makes modal true to false depending when you click on it. 
    // only need this function
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
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
                    toggleModal={this.toggleModal}
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
                                        toggleModal={this.toggleModal}
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
                        <Route path="/chat" component={Chat} />
                    </div>

                    <div className="navbar">
                        <Link to='/'>profile</Link>
                        <Link to='/getFriends'>list of friends</Link>
                        <Link to='/users'>search</Link>
                        <Link to='/chat'>chat</Link>
                        <Link to='/logout'>logout</Link>
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <div id="overlay">
                        <Uploader
                            uploadNewPic={this.uploadNewPic}
                            toggleModal={this.toggleModal}
                        />
                    </div>
                )}
            </div>
        );
    }
}
