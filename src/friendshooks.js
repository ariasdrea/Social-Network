import React, {
    useState,
    useEffect
} from 'react';
import { Link } from 'react-router-dom';
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

    // const friends = useSelector( state )
    
    return (
    
        <div className='container'>
            <div className='header-div'>
                <p className='friends-list-title'>
                    Current Friends
                </p>
            </div>

            <div className='friends-container'>

            </div>

            <div className='header-div'>
                <p className='friends-list-title'>
                    Pending Friend Requests
                </p>
            </div>

        </div>
    );



}