import React from "react";
import AquaBox from './aquabox';
import Greetee from './greetee';


//class
//one component for file is default
export default class Hello extends React.Component {
    // prop is a property of the component
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        });
    }
    render() {
        // you return stuff
        return (
            <div>
                <h1>
                    <AquaBox>
                        <Greetee name={this.state.name} />
                    </AquaBox>!</h1>
                <AquaBox>sneakers</AquaBox>
                <input onChange={this.handleChange}/>
            </div>
        );
    }
}
