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

// question - why does all routers require to be inside a div??
