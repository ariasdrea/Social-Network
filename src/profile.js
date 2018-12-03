import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div id="profile-container">
            <ProfilePic
                profilePicUrl={props.profilePicUrl || "quest.png"}
                showUploader={props.showUploader}
            />
            <p className="bio"> {props.bio} </p>
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}

//render profile pic 2x.
// in profile it needs to come from the props
//profile is just a middleman - we need a component we can show for this route
//set state of bio in app
