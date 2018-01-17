import React from "react";
import Slider from "./slider"

//轮播图


const IMAGE_DATA = [
    {
        src: require('./../src/swiper1.jpg'),
        alt: 'images-1',
    },
    {
        src: require('./../src/swiper2.jpg'),
        alt: 'images-2',
    },
    {
        src: require('./../src/swiper3.jpg'),
        alt: 'images-3',
    },
    {
        src: require('./../src/swiper4.jpg'),
        alt: 'images-3',
    },
    {
        src: require('./../src/swiper5.jpg'),
        alt: 'images-3',
    },
    {
        src: require('./../src/swiper6.jpg'),
        alt: 'images-3',
    },
    {
        src: require('./../src/swiper7.jpg'),
        alt: 'images-3',
    },
];

//speed 是图片切换的时候的速度时间，需要配置一个 number 类型的数据，决定时间是几秒；
//autoplay 是配置是否需要自动轮播，是一个布尔值；
//delay 是在需要自动轮播的时候，每张图片停留的时间，一个 number 值；
//pause 是在需要自动轮播的时候，鼠标停留在图片上，是否暂停轮播，是一个布尔值；
//dots 是配置是否需要轮播下面的小点；
//arrows 是配置是否需要轮播的前后箭头；
class LunBo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storage: null
        }
    }

    render() {

        return (
            <div className='slider'>
                <Slider
                    items={IMAGE_DATA}
                    speed={1.2}
                    delay={2.1}
                    pause={true}
                    autoplay={true}
                    dots={true}
                    arrows={true}
                />
            </div>
        );
    }
}

export default LunBo;