# numeric-stepper

使用 `React` 实现的数值计步器组件，支持拖拽和键盘输入。


## Install

```bash
$ npm i numeric-stepper
```


## Demo

```jsx
import React,{Component} from 'react';
import {NumericStepper} from "numeric-stepper";

class App extends Component {
    render() {
        return (
            <div>
                <NumericStepper
                    min={0}
                    stepSize={0.01}
                    width="60px"
                    onUpdate={(value) => {
                        console.log(value);
                    }}/>
            </div>
        )
    }
}
```

![](https://ws4.sinaimg.cn/large/006tKfTcgy1g0fapahvx3g304101pmxb.gif)