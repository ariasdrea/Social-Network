// functional components - just for display
// class components - needs to have logic and use setState
import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div className="welcome-container">
            <header>
                <img className="welcome-logo" src="./logo.png" />
            </header>

            <Registration />
        </div>
    );
}
