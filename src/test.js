import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {NumericStepper} from ".";

class App extends Component {
    render() {
        return (
            <div>
                <NumericStepper
                    min={0}
                    stepSize={0.01}
                    width="60px"
                    value={666}
                    onUpdate={(value) => {
                        console.log(value);
                    }}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
