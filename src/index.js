import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';//导入的方式跟之前有点变化
import './index.css';
import Piece from './view/wuziqi';
import Game from './view/blackWhiteGame';
import MyComponent from './view/toPass';
import Storage from './view/storage';
import Console from './view/console';

let arr = [{
    name: '一号',
    children: [{
        name: '一号下的一号',
        children: [],
    }, {
        name: '一号下的二号',
        children: [],
    }]
}, {
    name: '二号',
    children: [{
        name: '二号下的一号',
        children: [],
    }, {
        name: '二号下的二号',
        children: [],
    }]
}];

let data = {
    history: [
        {
            squares: Array(9).fill(null)
        }
    ],//历史记录
    stepNumber: 0,//步数
    xIsNext: true,//执棋手
};

let storage = [
    '吴梦婷',
    '赵春梅',
    '贾悦',
];

class Demo extends React.Component {
    render() {
        return (
            <MyComponent children={arr}/>
        );
    }
}

class demo2 extends React.Component {
    render() {
        return (
            <Game data={data}/>
        );
    }
}

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
    arr: stateDataArr,
    stepNumber: 1,//步数
    xIsNext: true,//执棋手true为白棋false为黑棋
    flag: false,//赢了还是输了
};

const copyObj = JSON.parse(JSON.stringify(stateData));

class demo3 extends React.Component {
    constructor() {
        super();
        this.state = {
            data: stateData,
            copyObj: copyObj
        };
    }

    componentWillUpdate() {
        console.log('改变了');
    }

    setFather() {
        this.setState({
            data: this.state.data
        });
    }

    render() {
        const styleH = {
            overflow: 'hidden'
        };
        return (
            <div style={styleH}>
                <Piece data={this.state.data} setFather={() => this.setFather()}/>
                <Console data={this.state.data} onClick={() => this.setFather()}/>
            </div>
        );
    }
}

class demo4 extends React.Component {
    render() {
        return (
            <Storage storage={storage}/>
        );
    }
}

const BasicExample = () => (
    <Router>
        <div>
            <ul className='item'>
                <li><Link to="/">五子棋</Link></li>
                <li><Link to="/Game">黑白棋</Link></li>
                <li><Link to="/Demo">归递组件</Link></li>
                <li><Link to="/Topics">二级菜单</Link></li>
                <li><Link to="/Storage">储存</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={demo3}/>
            <Route path="/Game" component={demo2}/>
            <Route path="/Demo" component={Demo}/>
            <Route path="/Topics" component={Topics}/>
            <Route path="/Storage" component={demo4}/>
        </div>
    </Router>
);

ReactDOM.render(<BasicExample/>, document.getElementById('root'));