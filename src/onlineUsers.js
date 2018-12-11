import React from "react";
import { connect } from "react-redux";
import { allOnlineUsers } from "./actions";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(allOnlineUsers());
    }

    render() {
        const { onlineFriends } = this.props;
        // console.log("this.props:", this.props);
        //deals with the undefined you may get when the function initally renders
        if (!onlineFriends) {
            return null;
        }
        //need map (a loop) to render each item that you want to show. doesn't modify the array its looping through and return a new arr.
        return (
            <div>
                <p className="online-title">Friends that are online </p>
                {onlineFriends &&
                    onlineFriends.map(onlineFriend => {
                        return (
                            <div
                                className="online-img-container"
                                key={onlineFriend.id}
                            >
                                <img
                                    className="online-img"
                                    src={
                                        onlineFriend.profilepicurl ||
                                        "quest.png"
                                    }
                                />
                                <div className="online-info">
                                    {onlineFriend.first} {onlineFriend.last}
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

//state below the props in the global state that you want to use
const mapStateToProps = state => {
    return {
        onlineFriends: state.onlineFriends
    };
};

export default connect(mapStateToProps)(OnlineUsers);
