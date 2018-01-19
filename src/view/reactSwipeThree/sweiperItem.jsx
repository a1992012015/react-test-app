import React, { Component } from 'react';

export default class SweipeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widthUl: null
        }
    }
    /*第一次渲染之后*/
    componentDidMount(){
        this.onWindowResize();
        window.addEventListener('resize',this.onWindowResize.bind(this),false);
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
        })
    }

    render() {
        let { list,speed,dots,deviation } = this.props;
        let { widthUl } = this.state;
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