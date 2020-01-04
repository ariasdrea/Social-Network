//ALL CLIENT-SIDE (REACT) CODE
import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { initSocket } from "./socket";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

// store refers to whole global redux state
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;
if (location.pathname === "/welcome") {
    //user is logged out
    component = <Welcome />;
} else {
    // user is logged in
    //  render Logo for PART 1 of project
    //elem = <img src='/logo.png'> or render a logo component
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

// pass it the component
ReactDOM.render(component, document.querySelector("main"));
