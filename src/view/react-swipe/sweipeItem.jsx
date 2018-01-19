import React, { Component } from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
    }
    /*调用下一个选项的方法*/
    goOn(){
        //console.log('父级的消息')
    }

    num(){

    }

    render() {
        let { list,speed,widthUl,dots,deviation } = this.props;
        console.log(dots);
        let items = list.map((item,index) => {
            /*获取需要显示的视图前一个编号*/
            let numStr = dots - 1 < 0?list.length -1:dots -1;
            /*获取视图后面的选项需要的排列序号*/
            let numEnd = index - dots >= 0?index - dots:list.length - dots;
            /*计算需要前往的列表前两个的序号*/
            let num = dots - 1 >= list.length?0:dots + 1;
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
                    index === (dots - 2 >= list.length?0:dots + 1)?'none':`transform ${speed}s ease`:
                    index === (dots + 2 < 0?list.length - 1:dots - 1)?'none':`transform ${speed}s ease`,
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