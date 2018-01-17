import React, { Component } from 'react';

//item (有 src 和 alt 属性)
//count （轮播项总数目，计算每个轮播项的宽度）
export default class SliderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { count, item } = this.props;
        let width = 100 / 3 + '%';
        return (
            <li className="slider-item" style={{width: width}}>
                <img src={item.src} alt={item.alt} />
            </li>
        );
    }
}