import React, { Component } from 'react';

//count（轮播项总数目）
//nowLocal（当前的轮播项）
//turn（点击 dot 回调函数）
export default class SliderDots extends Component {
    constructor(props) {
        super(props);
    }

    handleDotClick(option) {
        let { nowLocal,GoTo } = this.props;
        option = option + 1 - nowLocal;
        GoTo(option);
    }

    render() {
        let { items, nowLocal } = this.props;
        let dotNodes = items.map((item,index) => {
            return (
                <span
                    className={"sliderDot" + (index === nowLocal - 1?" sliderDotSelected":"")}
                    key={'dot' + index}
                    onClick={() => this.handleDotClick(index)}
                />
            )
        });
        return (
            <div className="sliderDotsWrap">
                {dotNodes}
            </div>
        );
    }
}