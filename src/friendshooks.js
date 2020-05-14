import React, { useEffect } from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    getList,
    acceptFriend,
    deleteFriend
} from './actions';

export default function List() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getList());        
    }, []);
    
    const friends = useSelector(state => state.friendsList && state.friendsList.filter(friend => friend.accepted == true));

    const wannabes = useSelector(state => state.friendsList && state.friendsList.filter(friend => friend.accepted == false));

    return (
    
        <div className='container'>
            <div className='header-div'>
                <p className='friends-list-title'>
                    Current Friends
                </p>
                <div className="friends-container">
                    {friends && friends.map(friend => {
                        return (
                            <div key={friend.id} className="each-friend-inlist">
                                <img
                                    className="list-pic"
                                    src={friend.profilepicurl}
                                />
                                <div className="name-in-list">
                                    {friend.first} {friend.last}
                                </div>

                                <button className="friend-list-btn" onClick={() => dispatch(deleteFriend(friend.id))}>Unfriend</button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='header-div'>
                <p className='friends-list-title'>
                    Pending Friend Requests
                </p>
            </div>

            <div className='wannabes-container'>
                {wannabes && wannabes.map(wannabe => {
                    return (
                        <div className="each-friend-inlist"
                            key={wannabe.id}>
                            
                            <img
                                className="list-pic"
                                src={wannabe.profilepicurl}
                            />
                            <div className="name-in-list">
                                {wannabe.first} {wannabe.last}
                            </div>
                            <button
                                className="friend-list-btn"
                                onClick={() => dispatch(acceptFriend(wannabe.id))}
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