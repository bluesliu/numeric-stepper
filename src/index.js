import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import NumericStepper from "./NumericStepper";

class App extends Component {
    render() {
        return (
            <NumericStepper onUpdate={(value)=>{
                console.log(value);
            }}/>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
