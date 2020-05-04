import React from "react";

export default function ProfilePic({ toggleModal, profilePicUrl }) {
    return (
        <img
            className="pp"
            onClick={toggleModal}
            src={profilePicUrl}
        />
    );
}
