import React, { Component } from 'react';
import './Slider.css'

import SliderItem from './lunbo/SliderItem';

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowLocal: false,//控制动画的执行参数
            direction: true,//接收动画方向的参数
            items: props.items,//接收需要显示的每个元素
            dots: props.dots,//接收下面的远点显示那一个
            frequency: null,//控制动画需要执行几次的参数
            speed: props.speed,//动画过度的速度
            delay: props.delay,//画面的停顿时间
            flag: true,//控制事件速度的执行次数
        };
    }

    componentWillReceiveProps(newProps){
        let { frequency } = newProps;
        let { speed,delay,flag } = this.state;
        console.log(frequency > 0?frequency:-frequency);
        let num = frequency > 0?frequency:-frequency;
        console.log(num);
        console.log('这里是几次');
        console.log(speed/num);
        console.log(delay/num);
        let speeds = null;
        let delays = null;
        if(flag){
            speeds = speed;
            delays = delay;
        }else{
            speeds = speed;
            delays = delay;
        }
        if(frequency > 0){
            this.setState({
                nowLocal: true,
                frequency:frequency,
                speed:speeds,
                delay:delays,
            });
        }else{
            this.setState({
                nowLocal: true,
                frequency:frequency,
                direction:false,
                speed:speeds,
                delay:delays,
            });
        }
    }

    componentWillMount(){
        let { items } = this.state;

        let sliceItems = items.slice(items.length - 2,items.length);
        items = sliceItems.concat(items);
        items.pop();
        items.pop();
        this.setState({
            items:items
        });

        let self = this;
        document.addEventListener("webkitAnimationEnd", () => self.overAni(), false);
        document.addEventListener("mozAnimationEnd", () => self.overAni(), false);
        document.addEventListener("MSAnimationEnd", () => self.overAni(), false);
        document.addEventListener("oanimationend", () => self.overAni(), false);
        document.addEventListener("animationend", () => self.overAni(), false);
    }

    componentDidUpdate(){
        console.log("刷新了页面");
    }
    /*销毁*/
    componentWillUnmount(){
        clearInterval(this.autoPlayFlag);
        let self = this;
        document.removeEventListener("webkitAnimationEnd", () => self.overAni(), false);
        document.removeEventListener("mozAnimationEnd", () => self.overAni(), false);
        document.removeEventListener("MSAnimationEnd", () => self.overAni(), false);
        document.removeEventListener("oanimationend", () => self.overAni(), false);
        document.removeEventListener("animationend", () => self.overAni(), false);
    }
    /*设置鼠标移入事件*/
    setMouseover(){
        console.log(this);
        clearInterval(this.autoPlayFlag);
    }
    /*设置鼠标移出事件*/
    setMouseout(){
        let { delay } = this.state;
        this.autoPlayFlag = setInterval(() => {
            this.goOn();
        },delay * 1000)
    }
    /*开始执行动画*/
    goOn(){
        //添加动画执行的属性
        this.setState({
            nowLocal: true
        });
    }
    /*动画结束*/
    overAni(){
        /*结束之后调用界面刷新*/
        this.returnOn();
    }
    /*结束后刷新页面*/
    returnOn(){
        let { items,direction,frequency } = this.state,
            arr = new Array(items.length).fill(null),
            { GoToZ } = this.props;
        items = items.map((item,index) => {
            let num = direction?index - 1 < 0?items.length-1:index - 1:index + 1 >= items.length?0:index + 1;
            arr[num] = item
        });
        GoToZ(arr[2].alt);
        if(frequency > 1 || frequency < -1){
            this.setState({
                items:arr,
                nowLocal: false,
            });
        }else{
            this.setState({
                items:arr,
                nowLocal: false,
                direction: true,
                flag: true,
            });
        }

        console.log('再执行');
        //let { frequency } = this.props;
        console.log(frequency);
        if(frequency > 1){
            setTimeout(() =>{
                this.goOn();
            },0);
            this.setState({
                frequency: frequency - 1
            })
        }else if(frequency < -1){
            setTimeout(() =>{
                this.goOn();
            },0);
            this.setState({
                frequency: frequency + 1
            })
        }
    }

    demo(index,frequency = 1){
        let { delay } = this.state;
        if(index === 0){//开启计时器
            this.autoPlayFlag = setInterval(() => {
                this.goOn();
            },delay * 1000)
        }else if(index === 1){//关闭计时器
            clearInterval(this.autoPlayFlag);
        }else if(index === 2){//下一张
            if(this.autoPlayFlag){
                clearInterval(this.autoPlayFlag);
            }
            this.goOn();
            /*this.autoPlayFlag = setInterval(() => {
                this.goOn();
            },delay * 1000)*/
        }else if(index === 3){//上一张
            if(this.autoPlayFlag){
                clearInterval(this.autoPlayFlag);
            }
            this.goOn();
            /*this.autoPlayFlag = setInterval(() => {
                this.goOn();
            },delay * 1000);*/
            this.setState({
                direction: false
            });
        }
        this.setState({
            frequency
        });
    }

    render() {
        let { items,nowLocal,direction,speed } = this.state;
        let list = items.map((item,index) => {
            if(index === 0){
                return (
                    <SliderItem
                        speed={speed}
                        direction={direction}
                        nowLocal={nowLocal}
                        item={item}
                        count={items.length}
                        key={`sliderLi${index}`}
                    />
                )
            }else{
                return (
                    <SliderItem
                        item={item}
                        count={items.length}
                        key={`sliderLi${index}`}
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
                onMouseOver={() => this.setMouseover()}
                onMouseOut={() => this.setMouseout()}
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
    dots: 1,
    arrows: true,
    items: [],
};
Slider.autoPlayFlag = null;