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
            items: props.items
        };
    }

    componentWillMount(){
        let { items } = this.state;
        let end = items.slice(items.length - 1,items.length);
        items.pop();
        items.unshift(end[0]);
        this.setState({
            items:items
        });
    }

    componentDidUpdate(){
        console.log("调用")
    }

    goOn(){
        let { start } = this.refs;
        let { speed } = this.props;
        let { items } = this.state;
        let startLi = start.getElementsByTagName('li')[0];
        let width = start.clientWidth / items.length;
        console.log(width);
        startLi.style.width = 0;
        //let a = setTimeout(() => {
            console.log("计时器生效中。。。");
            this.returnOn();
        //},speed * 1000);
        //console.log(a)
    }

    returnOn(){
        let { items } = this.state,arr = new Array(items.length).fill(null);
        items = items.map((item,index) => {
            let num = index - 1 < 0?items.length-1:index - 1;
            arr[num] = item
        });
        let { start } = this.refs;
        let startLi = start.getElementsByTagName('li')[0];
        this.setState({
            items:arr
        },() => {
            let width = start.clientWidth / items.length;
            //startLi.style.transition = 'none';
            //startLi.style.width = `${width}px`;
        });
        console.log('暂停');
        let { speed } = this.props;
        //startLi.style.transition = `width ${speed}s ease`;
        console.log('完成');
    }

    demo(){
        console.log('从父级过来的消息');
        this.goOn();
    }

    render() {
        let { speed } = this.props;
        let { items } = this.state;
        let list = items.map((item,index) => {
            if(index === 0){
                console.log(`width ${speed}s ease`);
                return (
                    <SliderItem
                        styles={`width ${speed}s ease`}
                        item={item}
                        count={items.length}
                        key={index}
                    />
                )
            }else{
                return (
                    <SliderItem
                        item={item}
                        count={items.length}
                        key={index}
                    />
                )
            }
        });
        let style = {
            width: `${items.length * 100}%`
        };
        return (
            <ul className='sliderUl'
                style={style}
                ref='start'
            >
                {list}
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