import React, { Component } from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
    }
    /*计算需要前往的列表时=>需要清除过度属性的元素*/
    getNum(dots,deviation){
        let { list } = this.props;
        dots = deviation?
            dots - 1 < 0?list.length - 1:dots - 1:
            dots + 1 >= list.length?0:dots + 1;
        return dots;
    }

    render() {
        let { list,speed,widthUl,dots,deviation } = this.props;
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
                transition: deviation?
                    index === this.getNum(dots,deviation) || index === dots?`transform ${speed}s ease`:'none':
                    index === this.getNum(dots,deviation) || index === dots?`transform ${speed}s ease`:'none',
                transform: index === numStr?
                    `translateZ(0px) translateX(-${widthUl}px)`:
                    `translateZ(0px) translateX(${widthUl * numEnd}px)`,
            };
            return (
                <li style={style} key={`sweipe${index}`}/>
            )
        });
        let styleUl = {
            width: '100%',
            height:'100%',
            overflow:'hidden',
            position: 'relative',
        };
        return (
            <ul style={styleUl}>
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