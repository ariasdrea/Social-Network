// functional components - just for display
// class components - needs to have logic and use setState
import React from "react";
import Registration from "./registration";
import Login from "./login";
//react-router-dom made by 3rd party people library - it's an npm pkg
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome-container">
            <header>
                <img className="welcome-logo" src="./logo.png" />
            </header>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}

//url you put on the route path above should NOT match the url in the server index.js
