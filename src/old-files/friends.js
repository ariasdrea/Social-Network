import React from "react";
import { connect } from "react-redux";
import { getList, acceptFriend, deleteFriend } from "../actions";

class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    //every function (action creater) we pass through dispatch must be imported.
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
                    <p className="friends-list-title"> Current Friends </p>
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

                                <div className="name-in-list">
                                    {friends.first} {friends.last}
                                </div>

                                <button
                                    className="friend-list-btn"
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
                    <p className="friends-list-title">
                        Pending Friend Requests
                    </p>
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
                                <div className="name-in-list">
                                    {wannabes.first} {wannabes.last}
                                </div>
                                <button
                                    className="friend-list-btn"
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
