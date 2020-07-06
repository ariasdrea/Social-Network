import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div className="profile-container">
            <p className="profile-title"> Profile && Biography </p>
            <div className="test">
                <p className="profile-welcome-msg">
                    Welcome {props.first}, feel free to explore!{" "}
                </p>
                <ProfilePic
                    profilePicUrl={props.profilePicUrl || "quest.png"}
                    toggleModal={props.toggleModal}
                />
            </div>
            <Bio
                bio={props.bio}
                setBio={props.setBio}
                hideUploader={props.hideUploader}
            />
        </div>
    );
}
