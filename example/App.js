import React, {Component} from "react";
import NumericStepper from "../src/index";

class OtherComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOver: false
        }
    }

    render() {
        const {isOver} = this.state;
        return (
            //<div>
                <p
                    style={{cursor: isOver ? "move" : '', color:"red"}}
                    onPointerOver={(e) => {
                        this.setState({isOver: true})
                    }}
                    onPointerOut={(e) => {
                        this.setState({isOver: false})
                    }}
                >
                    Other Component
                </p>
            // </div>
        );
    }
}

export default class App extends Component {
    render() {
        return (
            <div>
                <NumericStepper
                    onUpdate={(value)=>{}}
                    min={0}
                    max={50}
                    value={20}
                    underlineColor="#00ff00"
                    underlineColor_over="#ff0000"
                    color="#ff0000" width="60px"/>
                <br/>
                <br/>
                <br/>
                <NumericStepper onUpdate={(value)=>{}} color="#000000" width="60px"/>
                <OtherComponent/>
            </div>
        )
    }
}

