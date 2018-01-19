import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';//导入的方式跟之前有点变化
import './index.css';
import Piece from './view/wuziqi';
import Game from './view/blackWhiteGame';
import MyComponent from './view/toPass';
import Storage from './view/storage';
import Console from './view/console';
import LunBo from './view/lunbo';
import ReactSwipeTow from "./view/react-swipe";
import SwipeTree from "./view/reactSwipeThree/swiperThree";

console.log(SwipeTree);

const Topics = ({match}) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>
                    Rendering with React
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>
                    Components
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>
                    Props v. State
                </Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route exact path={match.url} render={() => (
            <h3>Please select a topic.</h3>
        )}/>
    </div>
);

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

let stateDataArr = new Array();
for (let i = 0; i < 15; i++) {
    stateDataArr[i] = new Array();
    for (let j = 0; j < 15; j++) {
        stateDataArr[i][j] = {
            stepNumber: null,
            xIsNext: null,
        };
    }
}

//构建五子棋的全部数据
const stateData = {
    arr: [stateDataArr],
    stepNumber: 0,//步数
    xIsNext: true,//执棋手true为白棋false为黑棋
    earlyOrLate: false,//先攻||后攻
    flag: true,//true为完成对局||还未开始||暂停false为游戏进行中
    king: null,//最后的赢家是
};

class demo3 extends React.Component {
    constructor() {
        super();
        this.state = {
            data: stateData
        };
    }

    crossDomain() {
        console.log("跨与通信中转");
        this.refs.getMeet.meet();
    }

    setFather() {
        let data = this.state.data;
        this.setState({
            data: data
        });
    }

    Initialization(index) {
        let data = this.state.data;
        if (!data.stepNumber) return;
        data.arr = data.arr.slice(0, index ? 1 : data.arr.length - 1);
        data.xIsNext = (data.stepNumber % 2) === 0 ? index ? data.xIsNext : !data.xIsNext : !data.xIsNext;
        data.stepNumber = index ? 0 : data.stepNumber - 1;
        this.setState({
            data: data
        });
    }

    render() {
        const styleH = {
            overflow: 'hidden'
        };
        return (
            <div style={styleH}>
                <Piece data={this.state.data} setFather={() => this.setFather()} ref="getMeet"/>
                <Console data={this.state.data} onClick={(i) => this.setFather(i)} crossDomain={() => {
                    this.crossDomain()
                }} Initialization={(i) => this.Initialization(i)}/>
            </div>
        );
    }
}

const BasicExample = () => (
    <Router>
        <div>
            <ul className='item'>
                <li><Link to="/">五子棋</Link></li>
                <li><Link to="/Game">黑白棋</Link></li>
                <li><Link to="/MyComponent">归递组件</Link></li>
                <li><Link to="/Topics">二级菜单</Link></li>
                <li><Link to="/Storage">储存</Link></li>
                <li><Link to="/LunBo">轮播图初版</Link></li>
                <li><Link to="/ReactSwipeTow">轮播图二版</Link></li>
                <li><Link to="/SwipeTree">轮播图三版</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={demo3}/>
            <Route path="/Game" component={Game}/>
            <Route path="/MyComponent" component={MyComponent}/>
            <Route path="/Topics" component={Topics}/>
            <Route path="/Storage" component={Storage}/>
            <Route path="/LunBo" component={LunBo}/>
            <Route path="/ReactSwipeTow" component={ReactSwipeTow}/>
            <Route path="/SwipeTree" component={SwipeTree}/>
        </div>
    </Router>
);

ReactDOM.render(<BasicExample/>, document.getElementById('root'));