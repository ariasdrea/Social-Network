import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendBtn({ otherUserId }) {
    const [buttonText, setButtonText] = useState("Default Btn Text");

    return (
        <div>
            <h1> I'm the other users' friends</h1>
        </div>
    );
}
