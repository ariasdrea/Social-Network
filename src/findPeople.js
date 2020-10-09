import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [val, setVal] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/getUsers");
            setUsers(data);
        })();
    }, [val]);

    useEffect(() => {
        if (!val) {
            return;
        }

        let abort;
        (async () => {
            const { data } = await axios.get(`/searchUsers/${val}`);

            if (!data.length) {
                setError("Sorry, there are no matching results");
            } else {
                setError(false);
                if (!abort) {
                    setUsers(data);
                }
            }
        })();

        return () => {
            abort = true;
        };
    }, [val, error]);

    return (
        <div className="search-container">
            <input
                className="find-people-search"
                onChange={(e) => setVal(e.target.value)}
            />
            {error ? (
                <p className="search-error">{error}</p>
            ) : (
                <div>
                    <p>Recently joined users </p>
                    <div className="last-joined-container">
                        {users.map((each) => (
                            <div className="each-user" key={each.id}>
                                <Link
                                    className="find-people-link"
                                    to={"/user/" + each.id}
                                >
                                    <p>
                                        {each.first} {each.last}
                                    </p>
                                    <img
                                        className="each-user-img"
                                        src={each.profilepicurl || "quest.png"}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
