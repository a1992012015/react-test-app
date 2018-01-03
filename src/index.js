import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router'
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
            <div>
                <Piece />
                <Game />
                <MyComponent  children={arr}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Demo />, document.getElementById("root"));