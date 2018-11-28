//ALL CLIENT-SIDE (REACT) CODE

import React from "react";
import ReactDOM from "react-dom";
import Hello from './hello';

//you pass it a react component & html element
//JSX has components  (start with capital letters) or html tags (start with lower case letters)
//finds html tag (main) and puts a component in it
//jsx (javascript and xml) - jsx element is an expression
ReactDOM.render(<Hello name="Kitty" />, document.querySelector("main"));


// Hello, <Greetee name={props.name} /> ! Hello,{" "}
// COMPONENT
function Hello(props) {
    return (
        <div>
            <h1>
                <AquaBox>
                    <Greetee name={props.name} />
                </AquaBox>
        !
            </h1>
        </div>
    );
}

//prorps - things passed to the component

//virtual dom
// css transition group
//jquery and react do not go together

// COMPONENT
function Greetee(props) {
    return <span style={{ color: "tomato" }}>{props.name}</span>;
}

function AquaBox(props) {
    return <span style={{ backgroundColor: "aqua" }}>{props.children}</span>;
}
