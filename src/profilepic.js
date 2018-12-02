import React from "react";

export default function ProfilePic(props) {
    console.log("props in profile pic:", props);
    return (
        <div className="pp-container">
            <p>
                Welcome to profile pic {props.first} {props.last}
            </p>
            <img
                className="pp"
                onClick={props.showUploader}
                src={props.profilePicUrl}
            />
        </div>
    );
}
