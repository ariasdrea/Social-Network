import React from "react";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        // write axios request
    }

    render() {
        return (
            <div>
                <h1> OPP running!! </h1>
                <h1> {this.props.match.params.id} </h1>
            </div>
        );
    }
}

//take the number and give it to the server and tell it , the user wants to see this number profile. give it to the database and ask the db to give us that number's info.

//need an axios request on componentDidMount - function that runs the render function runs and we have our id.

//in opp component, you may want to have links to other users.
