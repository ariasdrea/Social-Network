import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendBtn({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Default Btn Text");

    useEffect(() => {
        axios.get(`/checkFriendStatus/${otherUserId}`).then(({ data }) => {
            console.log("data in checkFriendStatus: ", data);
            setButtonText(data.buttonText);
        });
    }, []);

    function submit(e) {
        e.preventDefault();
        axios
            .post(`/updateFriendStatus/${otherUserId}`, {
                buttonText: buttonText,
            })
            .then(({ data }) => {
                setButtonText(data.buttonText);
            });
    }

    return (
        <div>
            <div className="friend-btn-div">
                <button className="friend-btn" onClick={submit}>
                    {" "}
                    {buttonText}{" "}
                </button>
            </div>
        </div>
    );
}
