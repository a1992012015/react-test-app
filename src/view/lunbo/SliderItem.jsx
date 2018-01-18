import React, { Component } from 'react';

//item (有 src 和 alt 属性)
//count （轮播项总数目，计算每个轮播项的宽度）
export default class SliderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { count,item,speed,nowLocal,direction } = this.props;
        let width = 100 / count + '%';
        let style = {
            width: width,
            backgroundImage: `url(${item.src})`,
            animation: nowLocal?direction?`sliderAnimationLeft ${speed}s linear`:`sliderAnimationRight ${speed}s linear`:null,
        };
        return (
            <li className='slider-item' style={style}>
            </li>
        );
    }
}