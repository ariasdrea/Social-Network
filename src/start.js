//ALL CLIENT-SIDE (REACT) CODE
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
// import { createStore, applyMiddleware } from "redux";
// import reduxPromise from "redux-promise";
// import { composeWithDevTools } from "redux-devtools-extension";
// import reducer from "./reducers";
//
// const store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(reduxPromise))
// );

//location.pathname is what gives us the url
let component;

// render welcome
if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <App />;
}

// render logo
// if (location.pathname === "/") {
//     component = <Logo />;
// }

//ReactDOM.render should only be called once in your whole project
ReactDOM.render(component, document.querySelector("main"));
