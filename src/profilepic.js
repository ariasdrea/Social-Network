import React from "react";

export default function ProfilePic(props) {
    return (
        <img
            className="pp"
            onClick={props.showUploader}
            src={props.profilePicUrl}
        />
    );
}

//
// <p className="pp-info">
//     Welcome to profile pic {props.first} {props.last}
// </p>
