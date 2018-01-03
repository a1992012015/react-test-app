import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';//导入的方式跟之前有点变化
//import { Router, Route, Link } from 'react-router';
import './index.css';
import Piece from './view/wuziqi';
import Game from './view/blackWhiteGame';
import MyComponent from './view/toPass';

let arr = [{
    name: '一号',
    children: [{
        name: '一号下的一号',
        children: [],
    },{
        name: '一号下的二号',
        children: [],
    }]
},{
    name: '二号',
    children: [{
        name: '二号下的一号',
        children: [],
    },{
        name: '二号下的二号',
        children: [],
    }]
}];

class Demo extends React.Component {
    render(){
        return (
            <MyComponent  children={arr}/>
        );
    }
}

const Topics = ({ match }) => (
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

const Topic = ({ match }) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);


const BasicExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to="/">五子棋</Link></li>
                <li><Link to="/Game">黑白棋</Link></li>
                <li><Link to="/Demo">归递组件</Link></li>
                <li><Link to="/Topics">二级菜单</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={Piece}/>
            <Route path="/Game" component={Game}/>
            <Route path="/Demo" component={Demo}/>
            <Route path="/Topics" component={Topics}/>
        </div>
    </Router>
);

ReactDOM.render(<BasicExample/>, document.getElementById('root'));