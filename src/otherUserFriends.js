import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function OtherUserFriends({ id, user }) {
    const [otherUserFriends, setotherUserFriends] = useState([]);

    useEffect(() => {
        (async () => {
            let { data } = await axios.get(`/getOtherUserFriends/${id}`);
            setotherUserFriends(data);
        })();
    }, []);

    return (
        <div className="otherUserFriendsContainer">
            <h3> {user}'s friends</h3>
            <div className="otherUserFriendEachContainer">
                {otherUserFriends &&
                    otherUserFriends.map((each) => {
                        return (
                            <div key={each.id} className="otherFriendEach">
                                <Link
                                    className="find-people-link"
                                    to={"/user/" + each.id}
                                >
                                    <img src={each.profilepicurl} />
                                    <p>{each.first}</p>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
