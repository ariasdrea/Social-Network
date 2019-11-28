import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [val, setVal] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get('/getUsers');
            setUsers(data);
        })();
    }, [val]);

    useEffect(() => {
        if (!val) {
            return;
        }

        (async () => {
            const { data } = await axios.get(`/searchUsers/${val}`);

            if (!data.length) {
                setError('Sorry, there are no matching results');
            } else {
                setError(false);
                setUsers(data);
            }

        })();
    }, [val, error]);

    return (
        <div className='search-container'>
            <input className='find-people-search' onChange={e => setVal(e.target.value)} />
            {error ? (
                <p className='search-error'>{error}</p>
            ) : (
                <div>
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
            )}
        </div>
    );
}
