import React, { Component } from 'react';
import SweipeItem from './sweiperItem'
import swiper1 from './../../src/swiper1.jpg'
import swiper2 from './../../src/swiper2.jpg'
import swiper3 from './../../src/swiper3.jpg'
import swiper4 from './../../src/swiper4.jpg'
import swiper5 from './../../src/swiper5.jpg'
import swiper6 from './../../src/swiper6.jpg'
import swiper7 from './../../src/swiper7.jpg'

const IMAGE_DATA = [
    {
        src: swiper1,
        alt: 1,
    },
    {
        src: swiper2,
        alt: 2,
    },
    {
        src: swiper3,
        alt: 3,
    },
    {
        src: swiper4,
        alt: 4,
    },
    {
        src: swiper5,
        alt: 5,
    },
    {
        src: swiper6,
        alt: 6,
    },
    {
        src: swiper7,
        alt: 7,
    },
];

const listImg = [
    {
        src: swiper1,
        alt: 1,
    },
    {
        src: swiper2,
        alt: 2,
    },
    {
        src: swiper3,
        alt: 3,
    },
    {
        src: swiper4,
        alt: 4,
    }
];

class SwipeTree extends Component {
    constructor() {
        super();
        this.state = {
            dots: 0, //从那一张图开始||也是当前显示的那张图
            list: listImg, //需要显示的列表
            speed: 0.5, //过度的速度
            delay: 2, //停留的时间
            deviation: true, //滑动的方向
            autoPlayFlag: null, //接收轮播图的计时器
        }
    }

    render() {
        /*外层容器的样式*/
        let style = {
            width: '600px',
            margin: '0 auto',
            height: '370.8px',
            position: 'relative',
        };
        /*下一张按钮的样式*/
        let Left = {
            display: 'block',
            height: '100px',
            width: '50px',
            position: 'absolute',
            top: '50%',
            marginTop: '-50px',
            left: '50px',
            color: 'rgb(181, 132, 69)',
            lineHeight: '80px',
            textAlign: 'center',
            fontSize: '80px',
            cursor: 'pointer',
        };
        /*上一张按钮的样式*/
        let Right = {
            display: 'block',
            height: '100px',
            width: '50px',
            position: 'absolute',
            top: '50%',
            marginTop: '-50px',
            right: '50px',
            color: 'rgb(181, 132, 69)',
            lineHeight: '80px',
            textAlign: 'center',
            fontSize: '80px',
            cursor: 'pointer',
        };
        /*小圆点容器的样式*/
        let styleUl = {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: '0',
            marginBottom: '10px'
        };
        let { dots,list,speed,delay,deviation } = this.state;
        /*显示圆点按钮*/
        let listLi = list.map((item,index) => {
            /*下面的小圆点的样式*/
            let styleLi = {
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                margin: '0 10px',
                backgroundColor: dots === index?'#000':'#fff',
                cursor: 'pointer',
            };
            return (
                <li
                    style={styleLi}
                    key={`threeLi${index}`}
                />
            )
        });
        return (
            <div>
                <div
                    style={style}
                >
                    <SweipeItem
                        list={list} //需要显示的列表
                        speed={speed} //动画过度的速度
                        delay={delay} //画面的停顿时间
                        dots={dots} //需要显示的那一个列表||默认从1开始
                        widthUl={parseInt(style.width)} //每个列表偏移的距离
                        deviation={deviation} //滑动的方向true向左||false向右
                    />
                    <span
                        style={Left}
                    >&#8249;</span>
                    <span
                        style={Right}
                    >&#8250;</span>
                    <ul style={styleUl}>
                        {listLi}
                    </ul>
                </div>
                <button>下一张</button>
                <button>上一张</button>
            </div>

        );
    }
}

export default SwipeTree;