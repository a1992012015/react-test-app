import React, { Component } from 'react';
import './Slider.css'

import SliderItem from './lunbo/SliderItem';
/*import SliderDots from './lunbo/SliderDots';
import SliderArrows from './lunbo/SliderArrows';*/

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowLocal: 0,
        };
    }

    render() {
        let { items } = this.props;
        items = items.slice(0,3);
        let li = items.map((item,index) => {
            return (
                <SliderItem item={item} key={index}/>
            )
        });
        console.log(this.props);
        let style = {
            width: '300%'
        };
        return (
            <ul className='sliderUl' style={style}>
                {li}
            </ul>
        );
    }
}

Slider.defaultProps = {
    speed: 1,
    delay: 2,
    pause: true,
    autoplay: true,
    dots: true,
    arrows: true,
    items: [],
};
Slider.autoPlayFlag = null;