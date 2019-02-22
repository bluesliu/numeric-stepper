import React, {Component} from "react";
import PropTypes from "prop-types";

export default class NumericStepper extends Component {

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        value: PropTypes.number,
        stepSize: PropTypes.number,
        //style
        width: PropTypes.string,
        height: PropTypes.string,
        fontSize: PropTypes.string,
        color: PropTypes.string,
        underlineColor: PropTypes.string,
    };

    static defaultProps = {
        min: -Infinity,
        max: Infinity,
        value: 0,
        stepSize: 1,
        width: "100%",
        height: "100%",
        fontSize: "14px",
        color: "#fcfcfc",
        underlineColor: "#c6c6c6",
    };

    constructor(props) {
        super(props);

        let {min, max, value} = this.props;
        if (min > max) {
            let temp = max;
            max = min;
            min = temp;
        }

        if (value < min || value > max) {
            value = 0;
            if (value < min || value > max) {
                value = min;
            }
        }

        this.state = {
            isDown: false,
            isActive: false,
            inputValue: "",

            max: max,
            min: min,
            value: value
        };

        this.lastX = 0;

        //input
        this.inputRef = React.createRef();
        this.selectAll = false;
    }

    render() {
        return (
            <p style={this.getStyle()}>
                {this.renderLabel()}
                {this.renderInput()}
            </p>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.selectAll) {
            this.inputRef.current.select();
            this.selectAll = false;
        }
    }

    renderInput() {
        const {isActive, inputValue} = this.state;
        if (!isActive) return null;
        return (
            <input
                ref={this.inputRef}
                type="text"
                style={this.getInputStyle()}
                onBlur={(e) => {
                    this.onInputBlurHandler(e);
                }}
                onKeyDown={(e) => {
                    this.onKeyDownHandler(e);
                }}
                onChange={(e) => {
                    this.onInputChangeHandler(e);
                }}
                value={inputValue}
            />
        )
    }

    renderLabel() {
        const {isActive, value} = this.state;
        if (isActive) return null;
        return (
            <label
                style={this.getLabelStyle()}
                onPointerDown={(e) => {
                    this.onMouseDownHandler(e);
                }}
                onPointerMove={(e) => {
                    this.onMouseMoveHandler(e);
                }}
                onPointerUp={(e) => {
                    this.onMouseUpHandler(e);
                }}
                onClick={(e) => {
                    this.onClickHandler(e);
                }}
            >
                {this.formatValue(value)}
            </label>
        );
    }

    //开始输入
    onInputChangeHandler(e) {
        this.setState({
            ...this.state,
            inputValue: e.target.value
        })
    }

    //输入完成
    onInputBlurHandler(e) {
        this.setValue(this.state.inputValue);
    }

    onKeyDownHandler(e) {
        if (e.keyCode === 13) {
            this.setValue(this.state.inputValue);
        }
    }

    //激活输入
    onClickHandler(e) {
        this.selectAll = true;
        this.setState({
            ...this.state,
            isActive: true,
            inputValue: this.formatValue(this.state.value)
        })
    }

    onMouseDownHandler(e) {
        /* api see : https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setPointerCapture
                     http://www.webfront-js.com/articaldetail/37.html
        */
        e.target.setPointerCapture(e.pointerId);

        //改变全局鼠标样式
        document.body.style.cursor = "ew-resize";

        this.lastX = e.pageX;
        this.setState({
            ...this.state,
            isDown: true
        });
    }

    onMouseUpHandler(e) {
        e.target.releasePointerCapture(e.pointerId);

        //恢复全局鼠标样式
        document.body.style.cursor = "auto";

        this.setState({
            ...this.state,
            isDown: false
        });
    }

    onMouseMoveHandler(e) {
        if (!this.state.isDown) {
            return;
        }
        const dx = e.pageX - this.lastX;
        if (Math.abs(dx) < 3) return;
        this.lastX = e.pageX;
        if (dx > 0) {
            this.addStep();
        } else {
            this.subStep();
        }
    }

    addStep() {
        this.setValue(this.state.value + this.props.stepSize);
    }

    subStep() {
        this.setValue(this.state.value - this.props.stepSize);
    }

    setValue(newValue) {
        newValue = Number(newValue);
        if (isNaN(newValue)) {
            newValue = 0;
        }
        const {min, max} = this.state;
        if (newValue > max) {
            newValue = max;
        } else if (newValue < min) {
            newValue = min;
        }
        this.setState({
            ...this.state,
            value: newValue,
            isActive: false,
            inputValue: "",
        });
        this.props.onUpdate.call(this, newValue);
    }

    /**
     *
     * @param {number} value
     * @returns {string}
     */
    formatValue(value) {
        if (Number.isInteger(value) && Number.isInteger(this.props.stepSize)) {
            return value.toString();
        } else {
            return value.toFixed(2);
        }
    }

    getInputStyle() {
        const {fontSize} = this.props;
        const style = {};
        style.width = "100%";
        // style.height = "100%";
        style.fontSize = fontSize;
        style.color = "#000000";
        style.outline = "none";
        style.borderWidth = "1px";
        style.borderRadius = "3px";
        style.borderStyle = "solid";
        style.borderColor = "#6aa0e8";
        return style;
    }

    getLabelStyle() {
        const {fontSize, color, underlineColor} = this.props;
        const style = {};
        style.userSelect = "none";
        style.WebkitUserSelect = "none";
        style.MozUserSelectozUserSelect = "none";
        style.MsUserSelect = "none";

        style.fontSize = fontSize;
        style.color = color;

        style.width = "100%";
        style.height = "100%";

        style.borderWidth = "1px";
        style.borderStyle = "none none dotted none";
        style.borderColor = underlineColor;
        style.cursor = "ew-resize";
        return style;
    }

    getStyle() {
        const {width, height} = this.props;
        return {
            margin: 0,
            padding: 0,
            width: width,
            height: height,

            //使内部的label和input垂直居中
            lineHeight: height,
            verticalAlign: "middle",

            display: "inline-block"
        }
    }
}