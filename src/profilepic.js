import React from "react";

export default function ProfilePic({ showUploader, profilePicUrl }) {
    return (
        <img
            className="pp"
            onClick={showUploader}
            src={profilePicUrl}
        />
    );
}
