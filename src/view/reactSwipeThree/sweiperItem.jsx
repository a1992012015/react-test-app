import React, { Component } from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { list,speed,widthUl,dots,deviation } = this.props;
        let items = list.map((item,index) => {
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