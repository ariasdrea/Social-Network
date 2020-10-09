import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function OtherUserFriends({ id }) {
    const [otherUserFriends, setotherUserFriends] = useState([]);

    useEffect(() => {
        (async () => {
            let { data } = await axios.get(`/getOtherUserFriends/${id}`);
            console.log("data", data);
            setotherUserFriends(data);
        })();
    }, []);

    return (
        <div>
            <h3> I'm the other users' friends</h3>
            {otherUserFriends &&
                otherUserFriends.map((each) => {
                    return <div key={each.id}>{each.first}</div>;
                })}
        </div>
    );
}
