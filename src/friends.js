import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getList, acceptFriend, deleteFriend } from "./actions";

class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch(getList());
    }

    render() {
        const { friends, wannabes } = this.props;

        if (!friends) {
            return null;
        }
        if (!wannabes) {
            return null;
        }

        return (
            <div className="container">
                <div className="header-div">
                    <p className="list-header"> Current Friends </p>
                </div>
                <div className="friends-container">
                    {friends.map(friends => {
                        return (
                            <div
                                className="each-friend-inlist"
                                key={friends.id}
                            >
                                <img
                                    className="list-pic"
                                    src={friends.profilepicurl}
                                />
                                {friends.first} {friends.last}
                                <button
                                    onClick={() =>
                                        this.props.dispatch(
                                            deleteFriend(friends.id)
                                        )
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="header-div">
                    <p className="list-header"> Pending Friend Requests </p>
                </div>
                <div className="wannabes-container">
                    {wannabes.map(wannabes => {
                        return (
                            <div
                                className="each-friend-inlist"
                                key={wannabes.id}
                            >
                                <img
                                    className="list-pic"
                                    src={wannabes.profilepicurl}
                                />
                                {wannabes.first} {wannabes.last}
                                <button
                                    onClick={() =>
                                        this.props.dispatch(
                                            acceptFriend(wannabes.id)
                                        )
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    //below filters the main list into 2: friends from wannabes
    return {
        friends:
            state.friendslist &&
            state.friendslist.filter(user => user.accepted == true),
        wannabes:
            state.friendslist &&
            state.friendslist.filter(user => !user.accepted)
    };
};

export default connect(mapStateToProps)(Friends);

// The component you use for the /friends route should be created using the connect function from react-redux. The component you pass to the function that connect returns will have to cause the fetching of the friends and requesters to happen when it mounts, which means that it will have to be created with class so you can use the componentDidMount method.
