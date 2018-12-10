import React from "react";
import { connect } from "react-redux";
import { allOnlineUsers } from "./actions";


class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.dispatch(allOnlineUsers());

    }

    render() {
        const {onlineFriends} = this.props;

        return(
            <div>
                <p className='online-title'>Friends that are online </p>
                {onlineFriends && onlineFriends.map(onlineFriend => {
                    return (
                        <div className="online-img-container" key={onlineFriend.id}>
                            <img className='online-img' src={onlineFriend.profilepicurl || "quest.png" } />
                            <div className='online-info'>
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
