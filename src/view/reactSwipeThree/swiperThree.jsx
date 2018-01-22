import React, {Component} from 'react';
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
    constructor(props) {
        super(props);
        this.state = {
            dots: props.dots, //从那一张图开始||也是当前显示的那张图
            list: null, //需要显示的列表
            speed: props.speed, //过度的速度
            delay: props.delay, //停留的时间
            deviation: true, //滑动的方向
            autoPlayFlag: null, //接收轮播图的计时器
            isFlag: false,//决定是初始化还是正常运作
        }
    }
    /*第一次渲染之前*/
    componentWillMount(){
        let { dots } = this.state;
        let { listP } = this.props;
        this.setState({
            list:this.countList(listP.length - 1,dots)
        })
    }
    /*计算需要显示的列表并且设置*/
    countList(index,dots){
        let { listP } = this.props;
        let lists = listP.slice(index,this.counts(index));
        let arr = new Array(3);
        arr[0] = listP[dots];
        arr[1] = listP[index];
        arr[2] = listP[index + 1 >= listP.length?0:index + 1];
        console.log(arr);
        return arr;
    }
    /*计算需要显示的列表的下标*/
    counts(dots,flag = 3){
        if(flag < 1) return dots;
        let { listP } = this.props;
        dots = dots + 1 >= listP.length?0:dots + 1;
        return this.counts(dots,flag - 1);
    }
    /*执行动画*/
    goOn(index,deviation){
        console.log('子级来了消息');
        console.log(index,deviation);
        let { dots } = this.state;
        this.countList(index,dots);
        this.setState({
            dots: index,
            isFlag: true,
            list: this.countList(index,dots),
            deviation
        })
    }

    render() {
        /*外层容器的样式*/
        let style = {
            width: '100%',
            paddingBottom: '61.8%',
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
        let { dots, list, speed, isFlag, deviation } = this.state;
        let { listP } = this.props;
        /*显示圆点按钮*/
        let listLi = list.map((item, index) => {
            /*下面的小圆点的样式*/
            let styleLi = {
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                margin: '0 10px',
                backgroundColor: dots === index ? '#000' : '#fff',
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
            <div
                style={style}
            >
                <SweipeItem
                    list={list} //需要显示的列表
                    speed={speed} //动画过度的速度
                    dots={dots} //需要显示的那一个列表||默认从1开始
                    deviation={deviation} //滑动的方向true向左||false向右
                    isFlag={isFlag}//决定是初始化还是正常运作
                />
                <span
                    style={Left}
                    onClick={() => this.goOn(dots + 1 >= listP.length?0:dots + 1,true)}
                >&#8249;</span>
                <span
                    style={Right}
                    onClick={() => this.goOn(dots - 1 < 0?listP.length - 1:dots - 1,false)}
                >&#8250;</span>
                <ul
                    style={styleUl}
                >
                    {listLi}
                </ul>
            </div>

        );
    }
}

/*正常实例化之后使用*/
export default class Example extends Component {
    /*触发子级函数*/
    goTo(index,deviation){
        let { SwipeTree } = this.refs;
        SwipeTree.goOn(index,deviation);
    }

    render() {
        let styleExample = {
            width: '600px',
            margin: '0 auto',
        };
        return (
            <div
                style={styleExample} //规定组件样式
            >
                <SwipeTree
                    dots={0} //从那一张图开始||也是当前显示的那张图
                    listP={listImg} //需要显示的列表
                    speed={0.5}  //过度的速度
                    delay={2} //停留的时间
                    ref='SwipeTree' //id
                />
                <button
                    onClick={() => this.goTo(1,true)}
                >下一张</button>
                <button>上一张</button>
            </div>
        );
    }
}