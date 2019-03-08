import React, {Component} from "react";
import PropTypes from "prop-types";
import {mouseHandler} from "react-mouse-handler";

class DragAbleLabel extends Component{
    render() {
        return (
            <span>{this.props.value}</span>
        );
    }
}
DragAbleLabel = mouseHandler()(DragAbleLabel);

export default class NumericStepper extends Component {

    static propTypes = {
        onUpdate: PropTypes.func,
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
        underlineColor_over: PropTypes.string,
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
        underlineColor: "#b5b5b5",
        underlineColor_over: "#e8e8e8",
    };

    state = {
        isOver: false,
        isActive: false,
        inputValue: "",

        value: 0
    };

    constructor(props) {
        super(props);

        this.onDragHandler = this.onDragHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);

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

        this.state.value = value;

        this.max = max;
        this.min = min;
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
            <DragAbleLabel
                cursor="ew-resize"
                canDrag={true}
                value={this.formatValue(value)}
                onDrag={this.onDragHandler}
                onClick={this.onClickHandler}
                onMouseOver={this.onMouseOverHandler}
                onMouseOut={this.onMouseOutHandler}
                style={this.getLabelStyle()}
            />
        )
    }

    onDragHandler(e, position){
        const {dx, globalX} = position;
        if (Math.abs(this.lastX-globalX) < 3) return;
        this.lastX = globalX;
        if (dx > 0) {
            this.addStep();
        } else {
            this.subStep();
        }
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
    onClickHandler() {
        this.selectAll = true;
        this.setState({
            ...this.state,
            isActive: true,
            inputValue: this.formatValue(this.state.value),
        });
    }

    onMouseOverHandler() {
        this.setState({
            ...this.state,
            isOver: true
        })
    }

    onMouseOutHandler(){
        this.setState({
            ...this.state,
            isOver: false
        })
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
        const {min, max} = this;
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
        if(this.props.onUpdate){
            this.props.onUpdate.call(this, newValue);
        }
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
        const {fontSize, color, underlineColor, underlineColor_over} = this.props;
        const {isOver} = this.state;
        const style = {};
        style.userSelect = "none";
        style.WebkitUserSelect = "none";
        style.MozUserSelectozUserSelect = "none";
        style.MsUserSelect = "none";

        style.fontSize = fontSize;
        style.color = color;

        // style.width = "100%";
        // style.height = "100%";
        style.width = "fit-content";
        style.margin = 0;
        style.padding = 0;

        style.borderWidth = "1px";
        style.borderStyle = "none none dotted none";
        style.borderColor = isOver?underlineColor_over:underlineColor;
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