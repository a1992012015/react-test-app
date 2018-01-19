import React from 'react'
import SweipeItem from './react-swipe/sweipeItem'
import swiper1 from './../src/swiper1.jpg'
import swiper2 from './../src/swiper2.jpg'
import swiper3 from './../src/swiper3.jpg'
import swiper4 from './../src/swiper4.jpg'
import swiper5 from './../src/swiper5.jpg'
import swiper6 from './../src/swiper6.jpg'
import swiper7 from './../src/swiper7.jpg'

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

class ReactSwipeTow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: 0, //从那一张图开始||也是当前显示的那张图
            list: IMAGE_DATA, //需要显示的列表
            speed: 0.5, //过度的速度
            delay: 2, //停留的时间
            deviation: true, //滑动的方向
            autoPlayFlag: null, //接收轮播图的计时器
        }
    }
    /*第一次渲染之后*/
    componentDidMount(){
        let { autoPlayFlag,delay } = this.state;
        autoPlayFlag = this.setUpInterval(delay);
        this.setState({
            autoPlayFlag: autoPlayFlag
        })
    }
    /*组件完成更新*/
    componentDidUpdate(){
        console.log('组件完成更新');
    }
    /*组件被销毁*/
    componentWillUnmount() {
        let { autoPlayFlag } = this.state;
        clearInterval(autoPlayFlag);
    }
    /*创建一个计时器并且返回*/
    setUpInterval(delay){
        return setInterval(() =>{
            this.goToLeft(1);
        },delay * 1000);
    }
    /*下一张*/
    goToLeft(index){
        let { dots,list } = this.state;
        dots = dots + index >= list.length?0:dots + index;
        this.setState({
            dots: dots,
            deviation: true
        });
    }
    /*上一张*/
    goToRight(index){
        let { dots,list } = this.state;
        dots = dots - index < 0?list.length - 1:dots - index;
        this.setState({
            dots: dots,
            deviation: false
        });
    }
    /*小圆点事件，前往第N个元素*/
    setIndex(index){
        console.log('触发跳转');
        console.log(index);
        let { dots } = this.state;
        let num = dots - index > 0?dots - index:index - dots;
        console.log(num);
        if(index > dots){
            console.log('向右');
            this.goToLeft(num);
        }else{
            console.log('向左');
            this.goToRight(num);
        }
    }
    /*鼠标移入事件*/
    setMouseOver(){
        console.log('移入');
        let { autoPlayFlag } = this.state;
        clearInterval(autoPlayFlag);
    }
    /*鼠标移出事件*/
    setMouseOut(){
        console.log('移出');
        let { delay } = this.state;
        let autoPlayFlag = this.setUpInterval(delay);
        this.setState({
            autoPlayFlag:autoPlayFlag
        })
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
                    key={`listLi${index}`}
                    onClick={() => this.setIndex(index)}
                />
            )
        });
        return (
            <div>
                <div
                    style={style}
                    onClick={this.demo}
                    onMouseEnter={() => this.setMouseOver()}
                    onMouseLeave={() => this.setMouseOut()}
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
                        onClick={() => this.goToLeft(1)}
                    >&#8249;</span>
                    <span
                        style={Right}
                        onClick={() => this.goToRight(1)}
                    >&#8250;</span>
                    <ul style={styleUl}>
                        {listLi}
                    </ul>
                </div>
                <button onClick={() => this.goToLeft(1)}>下一张</button>
                <button onClick={() => this.goToRight(1)}>上一张</button>
            </div>

        );
    }
}

export default ReactSwipeTow;