import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";
import EasyTransition from "react-easy-transition";

export default function Profile(props) {
    return (
        <div className="profile-container">
            <p className="profile-title"> Profile && Biography </p>
            <div className="test">
                <EasyTransition
                    initialStyle={{ opacity: 0 }}
                    transition="opacity 2s ease-in"
                    finalStyle={{ opacity: 1 }}
                >
                    <p className="profile-welcome-msg">
                        Welcome {props.first}, feel free to explore!{" "}
                    </p>
                </EasyTransition>
                <ProfilePic
                    profilePicUrl={props.profilePicUrl || "quest.png"}
                    showUploader={props.showUploader}
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
