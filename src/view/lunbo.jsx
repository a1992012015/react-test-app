import React from "react";
import Slider from "./slider"
import SliderArrows from "./lunbo/SliderArrows"
import SliderDots from "./lunbo/SliderDots";

//轮播图


const IMAGE_DATA = [
    {
        src: require('./../src/swiper1.jpg'),
        alt: 1,
    },
    {
        src: require('./../src/swiper2.jpg'),
        alt: 2,
    },
    {
        src: require('./../src/swiper3.jpg'),
        alt: 3,
    },
    {
        src: require('./../src/swiper4.jpg'),
        alt: 4,
    },
    {
        src: require('./../src/swiper5.jpg'),
        alt: 5,
    },
    {
        src: require('./../src/swiper6.jpg'),
        alt: 6,
    },
    {
        src: require('./../src/swiper7.jpg'),
        alt: 7,
    },
];

//speed 是图片切换的时候的速度时间，需要配置一个 number 类型的数据，决定时间是几秒；
//autoplay 是配置是否需要自动轮播，是一个布尔值；
//delay 是在需要自动轮播的时候，每张图片停留的时间，一个 number 值；
//pause 是在需要自动轮播的时候，鼠标停留在图片上，是否暂停轮播，是一个布尔值；
//dots 是配置是否需要轮播下面的小点；
//arrows 是配置是否需要轮播的前后箭头；
let dots = 1;
class LunBo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storage: null,
            dots: 1,
            frequency:null
        }
    }

    componentDidUpdate(){
        /*console.log('确认位置');
        console.log(this.state.dots);*/
    }

    goSon(index,frequency){
        let { slider } = this.refs;
        slider.demo(index,frequency);
    }
    //点击小圆点跳转函数
    GoTo(index){
        this.setState({
            frequency: index
        })
    }
    //接受从子级传过来的小圆点更换消息
    GoToZ(index){
        this.setState({
            dots: index
        })
    }

    render() {
        return (
            <div>
                <div className='slider'>
                    <Slider
                        items={IMAGE_DATA}
                        speed={1.2}
                        delay={2.1}
                        pause={true}
                        autoplay={true}
                        dots={this.state.dots}
                        arrows={true}
                        frequency={this.state.frequency}
                        ref='slider'
                        GoToZ={(i) => this.GoToZ(i)}
                    />
                    <SliderArrows
                        goSon={() => this.goSon(2)}
                        flag={true}
                    />
                    <SliderArrows
                        goSon={() => this.goSon(3,'right')}
                        flag={false}
                    />
                    <SliderDots
                        items={IMAGE_DATA}
                        nowLocal={this.state.dots}
                        GoTo={(i) => this.GoTo(i)}
                    />
                </div>
                <button
                    onClick={() => this.goSon(0)}
                >开启轮播计时器</button>
                <button
                    onClick={() => this.goSon(1)}
                >关闭轮播计时器</button>
                <button
                    onClick={() => this.goSon(2,2)}
                >下一张</button>
                <button
                    onClick={() => this.goSon(3,'right')}
                >上一张</button>
            </div>

        );
    }
}

export default LunBo;