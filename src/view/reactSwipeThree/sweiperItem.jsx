import React, {Component} from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
    }

    /*计算需要前往的列表时=>需要清除过度属性的元素*/
    getNum(listDots) {
        let {list, deviation} = this.props;
        listDots = deviation ?
            listDots - 1 < 0 ? list.length - 1 : listDots - 1 :
            listDots + 1 >= list.length ? 0 : listDots + 1;
        return listDots;
    }

    /*计算列表的transtion属性*/
    countTransition(index) {
        let {speed, isFlag, listDots} = this.props;
        if (isFlag === 0) {
            return index === listDots ? `transform ${speed}s ease` : 'none';
        } else if (isFlag === 1) {
            return index === this.getNum(listDots) || index === listDots ? `transform ${speed}s ease` : 'none';
        } else if (isFlag === 2) {
            return 'none';
        } else if (isFlag === 3) {
            return `transform ${speed}s ease`;
        }
    }

    render() {
        let {list, listDots, contrast, widthUl} = this.props;
        let items = list.map((item, index) => {
            /*获取需要显示的视图前一个编号*/
            let numStr = listDots - 1 < 0 ? list.length - 1 : listDots - 1;
            /*获取视图后面的选项需要的排列序号*/
            let numEnd = index - listDots >= 0 ? index - listDots : list.length + index - listDots;
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
                transform: index === numStr ?
                    `translateZ(0px) translateX(${-widthUl + contrast}px)` :
                    `translateZ(0px) translateX(${widthUl * numEnd + contrast}px)`,
            };
            return (
                <li style={style} key={`threeLi${index}`}/>
            )
        });
        let styleUl = {
            width: '100%',
            overflow: 'hidden',
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
        };
        return (
            <ul
                style={styleUl}
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
    listDots: 0, //需要显示的那一个列表||默认从1开始
    widthUl: null, //每个列表偏移的距离
};