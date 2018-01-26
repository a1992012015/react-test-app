import React, {Component} from 'react';
import SweipeItem from './sweiperItem'
import swiper1 from './../../src/swiper1.jpg'
import swiper2 from './../../src/swiper2.jpg'
import swiper3 from './../../src/swiper3.jpg'
import swiper4 from './../../src/swiper4.jpg'
import swiper5 from './../../src/swiper5.jpg'
import swiper6 from './../../src/swiper6.jpg'
import swiper7 from './../../src/swiper7.jpg'

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

class SwipeTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: props.dots, //当前显示的的总页数之中的下标
            listDots: 0, //视图列表需要显示的下标
            list: null, //需要显示的列表
            speed: props.speed, //过度的速度
            delay: props.delay, //停留的时间
            deviation: true, //滑动的方向
            autoPlayFlag: null, //接收轮播图的计时器
            isFlag: 0, //决定是初始化还是正常运作
            widthUl: null, //保存浏览器宽度数据
            auto: false, //是否自动开始播放
            clientStar: null, //鼠标按下时的坐标
            contrast: 0, //保存拖动距离

        }
    }

    /*第一次渲染之前*/
    componentWillMount() {
        let {dots} = this.state;
        let {listP} = this.props;
        this.setState({
            list: this.countList(dots + 1 >= listP.length ? 0 : dots + 1, dots, true)
        })
    }

    /*第一次渲染之后*/
    componentDidMount() {
        let {autoPlayFlag, delay, auto} = this.state;
        this.onWindowResize();
        this.onWindowResize = this.onWindowResize.bind(this);
        this.setOnMouseMove = this.setOnMouseMove.bind(this);
        this.setOnMouseUp = this.setOnMouseUp.bind(this);
        window.addEventListener('resize', this.onWindowResize, false);
        if (auto) {
            autoPlayFlag = this.setUpInterval(delay);
            this.setState({
                autoPlayFlag: autoPlayFlag,
            })
        }
    }

    /*组件被销毁*/
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.setOnMouseMove, false);
        window.removeEventListener('resize', this.onWindowResize, false);
        window.removeEventListener('mouseup', this.setOnMouseUp, false);
    }

    /*监听浏览器宽度变化*/
    onWindowResize() {
        let {threeUl} = this.refs;
        this.setState({
            widthUl: threeUl.clientWidth
        });
    }

    /*创建一个计时器并且返回*/
    setUpInterval(delay) {
        let {listP} = this.props;
        return setInterval(() => {
            let {dots} = this.state;
            this.goOn(dots + 1 >= listP.length ? 0 : dots + 1, true);
        }, delay * 1000);
    }

    /*计算需要显示的列表并且设置*/
    countList(index, dots, deviation) {
        let {listP} = this.props;
        let {listDots, isFlag} = this.state;
        let arr = new Array(3);
        arr[listDots] = listP[dots];
        if (isFlag === 0) {
            arr[listDots + 1 > 2 ? 0 : listDots + 1] = listP[index];
            arr[listDots - 1 < 0 ? 2 : listDots - 1] = listP[dots - 1 < 0 ? listP.length - 1 : dots - 1];
        } else {
            if (deviation) {
                arr[listDots + 1 > 2 ? 0 : listDots + 1] = listP[index];
                arr[listDots - 1 < 0 ? 2 : listDots - 1] = listP[index + 1 >= listP.length ? 0 : index + 1];
            } else {
                let num = listDots - 1 < 0 ? 2 : listDots - 1;
                arr[num] = listP[index];
                arr[num - 1 < 0 ? 2 : num - 1] = listP[index - 1 < 0 ? listP.length - 1 : index - 1];
            }
        }
        return arr;
    }

    /*执行动画*/

    /*
    * index: Number 需要前往的页数
    * deviation：Boole 决定前进的方向*/
    goOn(index, deviation) {
        let {dots, listDots} = this.state;//当前的页数
        let list = this.countList(index, dots, deviation);
        listDots = deviation ?
            listDots + 1 > 2 ? 0 : listDots + 1 :
            listDots - 1 < 0 ? 2 : listDots - 1;
        this.setState({
            dots: index,
            listDots: listDots,
            isFlag: 1,
            list: list,
            deviation
        })
    }

    /*跳转需要的下标的视图*/
    jump(index) {
        let {dots} = this.state;//当前的页数
        let num = index - dots;
        if (num > 0) {
            this.goOn(index, true)
        } else if (num < 0) {
            this.goOn(index, false)
        }
    }

    /*鼠标移入视图*/
    setMouseEnter() {
        let {autoPlayFlag} = this.state;
        clearInterval(autoPlayFlag);
    }

    /*鼠标移出视图*/
    setMouseLeave() {
        let {delay, auto} = this.state;
        if (auto) {
            let autoPlayFlag = this.setUpInterval(delay);
            this.setState({
                autoPlayFlag: autoPlayFlag
            })
        }
    }

    /*视图的鼠标按下事件*/
    setOnMouseDown(event) {
        let e = event || window.event;
        let clientStar = {'x': e.clientX, 'y': e.clientY};
        this.setState({
            clientStar: clientStar,
        });
        window.addEventListener('mousemove', this.setOnMouseMove, false);
        window.addEventListener('mouseup', this.setOnMouseUp, false);
    }

    /*视图鼠标松开事件*/
    setOnMouseUp() {
        let {contrast, widthUl, dots} = this.state;
        let {listP} = this.props;
        window.removeEventListener('mousemove', this.setOnMouseMove, false);
        window.removeEventListener('mouseup', this.setOnMouseUp, false);
        let cacheContrast = contrast > 0 ? contrast : -contrast;
        if (cacheContrast > widthUl / 5 * 2) {
            this.setState({
                contrast: 0,
                isFlag: 2,
            });
            contrast > 0 ?
                this.goOn(dots - 1 < 0 ? listP.length - 1 : dots - 1, false) :
                this.goOn(dots + 1 >= listP.length ? 0 : dots + 1, true);
        } else if (cacheContrast < widthUl / 5 * 2) {
            this.setState({
                isFlag: 3,
                contrast: 0,
            });
        }
    }

    /*鼠标按下拖动事件*/
    setOnMouseMove(event) {
        let {clientStar} = this.state;
        let e = event || window.event;
        let clientEnd = {'x': e.clientX, 'y': e.clientY};
        let length = clientStar.x - clientEnd.x;
        this.setState({
            contrast: -length,
            isFlag: 2,
        })
    }

    render() {
        /*外层容器的样式*/
        let style = {
            width: '100%',
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
        let {dots, list, speed, isFlag, deviation, listDots, contrast, widthUl} = this.state;
        let {listP} = this.props;
        /*显示圆点按钮*/
        let listLi = listP.map((item, index) => {
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
                    onClick={() => this.jump(index)}
                />
            )
        });
        return (
            <div
                style={style}
                ref='threeUl'
                onMouseEnter={() => this.setMouseEnter()}
                onMouseLeave={() => this.setMouseLeave()}
                onMouseDown={(i) => this.setOnMouseDown(i)}
            >
                <SweipeItem
                    list={list} //需要显示的列表
                    speed={speed} //动画过度的速度
                    listDots={listDots} //需要显示的那一个列表||默认从1开始
                    deviation={deviation} //滑动的方向true向左||false向右
                    isFlag={isFlag} //决定是初始化还是正常运作
                    contrast={contrast} //保存鼠标拖动的距离
                    widthUl={widthUl} //保存容器宽度数据
                />
                <span
                    style={Left}
                    onClick={() => this.goOn(dots + 1 >= listP.length ? 0 : dots + 1, true)}
                >&#8249;</span>
                <span
                    style={Right}
                    onClick={() => this.goOn(dots - 1 < 0 ? listP.length - 1 : dots - 1, false)}
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
    render() {
        let styleExample = {
            width: '600px',
            margin: '0 auto',
            overflow: 'hidden',
        };
        return (
            <div
                style={styleExample} //规定组件样式
            >
                <SwipeTree
                    dots={0} //从那一张图开始||也是当前显示的那张图
                    listP={listImg} //需要显示的列表//IMAGE_DATA//listImg
                    speed={0.5}  //过度的速度
                    delay={2} //停留的时间
                />
            </div>
        );
    }
}