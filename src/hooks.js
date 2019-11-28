import React, { useState, useEffect } from "react";
// import axios from "./axios";

export default function Hello() {
    const [greetee, setGreetee] = useState('World');
    console.log(`the current value is accessible here: ${greetee}`);


    const onChange = e => {
        setGreetee(e.target.value);
        // greetee doesn't have the new value in here - it's not until the next time the function is called that it has the new value
        // you can't do async / await
        // you can rely on the fact that the function will be called again
        console.log(`after calling greetee, the value is ${greetee}`);
    };

    return (
        <div>
            <p> Hello, {greetee} </p>
            <input onChange={onChange} />
        </div>
    );
}
