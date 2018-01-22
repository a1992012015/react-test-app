import React, { Component } from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widthUl: null,
        }
    }
    /*第一次渲染之后*/
    componentDidMount(){
        this.onWindowResize();
        window.addEventListener('resize',this.onWindowResize.bind(this),false);
        console.log('这里是的时间');
    }
    /*组件完成更新之后*/
    componentDidUpdate(){

    }
    /*组件被销毁*/
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this))
    }
    /*监听浏览器宽度变化*/
    onWindowResize(){
        console.log('宽度');
        let { threeUl } = this.refs;
        this.setState({
            widthUl: threeUl.clientWidth
        });
    }
    /*计算需要前往的列表时=>需要清除过度属性的元素*/
    getNum(dots,deviation){
        let { list } = this.props;
        dots = deviation?
            dots - 1 < 0?list.length - 1:dots - 1:
            dots + 1 >= list.length?0:dots + 1;
        return dots;
    }
    /*计算列表的transtion属性*/
    countTransition(index){
        let { speed,dots,deviation,isFlag } = this.props;
        if(isFlag){
            return deviation?
                index === this.getNum(dots,deviation) || index === dots?`transform ${speed}s ease`:'none':
                index === this.getNum(dots,deviation) || index === dots?`transform ${speed}s ease`:'none';
        }else{
            return index === dots?`transform ${speed}s ease`:'none';
        }
    }

    render() {
        let { list,speed,dots,deviation } = this.props;
        let { widthUl } = this.state;
        let items = list.map((item,index) => {
            /*获取需要显示的视图前一个编号*/
            let numStr = dots - 1 < 0?list.length -1:dots -1;
            /*获取视图后面的选项需要的排列序号*/
            let numEnd = index - dots >= 0?index - dots:list.length + index - dots;
            let style = {
                backgroundImage: `url(${item.src})`,
                backgroundPosition: '50% 50%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100%',
                float: 'left',
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                transition: this.countTransition(index),
                transform: index === numStr?
                    `translateZ(0px) translateX(-${widthUl}px)`:
                    `translateZ(0px) translateX(${widthUl * numEnd}px)`,
            };
            return (
                <li style={style} key={`threeLi${index}`}/>
            )
        });
        let styleUl = {
            width: '100%',
            overflow:'hidden',
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
        };
        return (
            <ul
                style={styleUl}
                ref='threeUl'
            >
                {items}
            </ul>
        );
    }
}

SweipeItem.defaultProps = {
    list: [], //需要显示的列表
    speed: 1, //动画过度的速度
    delay: 2, //画面的停顿时间
    dots: 0, //需要显示的那一个列表||默认从1开始
    widthUl: null, //每个列表偏移的距离
};