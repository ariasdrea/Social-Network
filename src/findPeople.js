import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [val, setVal] = useState();

    useEffect(() => {
        axios.get("/getUsers").then(({data}) => {
            setUsers(data);
        });
    }, []);

    useEffect(() => {
        if (!val) {
            return;
        }

        axios.get(`/searchUsers/${val}`).then(({data}) => {
            setUsers(data);
        });
    }, [val]);

    return (
        <div className='search-container'>
            <input className='find-people-search' onChange={e => setVal(e.target.value)} />
            <p></p>
            <p>Recently joined users </p>
            <div className="last-joined-container">
                {users.map(each => (
                    <div className="each-user" key={each.id}>
                        <p>{each.first}</p>
                        <img
                            className="each-user-img"
                            src={each.profilepicurl || "quest.png"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}



// this goes and gets a new list of users
// write a query to get these users
// this triggers the state change where you're changing the value of text
// useEffect runs again when value in input field changes makes another request to get the latest  - use return funciton here to manage out of order
// set the new list of users
//different routes is good - 2 distinct queries. one happens when the component moutns, another one happens when the state changes
