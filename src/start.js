//ALL CLIENT-SIDE (REACT) CODE
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo from "./logo";

//location.pathname is what gives us the url
let component;

// render welcome
if (location.pathname === "/welcome") {
    component = <Welcome />;
}

// render logo
if (location.pathname === "/") {
    component = <Logo />;
}

//ReactDOM.render should only be called once in your whole project
ReactDOM.render(component, document.querySelector("main"));
