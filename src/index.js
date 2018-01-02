import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let calculateWinner = squares => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

let gameOver = (chess, squares) => {
    console.log(chess);
    console.log(squares);
    console.log(chess[squares - 1]);
    console.log(chess[squares + 1]);
    if(chess[squares - 1] !== undefined && chess[squares + 1] !== undefined){
        console.log('进入成功');
    }else{
        console.log('进入错误');
    }

};

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],//历史记录
            stepNumber: 0,//步数
            xIsNext: true//执棋手
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
        gameOver(squares,i);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                '前往 #' + move :
                '开始游戏';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "赢家: " + winner;
        } else {
            status = "落子玩家: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arr : this.props.children
        }
    }

    changeName(index){
        this.state.arr[index].name = this.state.arr[index].name + "san";
        this.setState({
            arr: this.state.arr
        });
    }

    render(){
        const children = this.state.arr;
        let list = null;
        if (children){
            list = children.map((v, i) => {
                return (
                    <li key={i}>
                        {v.name}&nbsp;&nbsp;&nbsp;
                        <button onClick={() => this.changeName(i)}>按钮</button>
                        <MyComponent children={v.children} />
                    </li>
                );
            });
        }

        return (
            <ul>
                {list}
            </ul>
        );
    }
}

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

//棋盘
class Checkerboard extends React.Component {

    componentDidMount(){
        let canvas = document.getElementById('myCanvas');
        let cxt = canvas.getContext('2d');
        //边框
        cxt.moveTo(0,0);
        cxt.lineTo(700,0);
        cxt.lineTo(700,700);
        cxt.lineTo(0,700);
        cxt.lineTo(0,0);
        cxt.stroke();
        //每一排&&每一列
        for (let i = 1;i <= 13;i++){
            let clo = i * 50;
            cxt.moveTo(clo,0);
            cxt.lineTo(clo,700);
            cxt.stroke();
            cxt.moveTo(0,clo);
            cxt.lineTo(700,clo);
            cxt.stroke();
        }
    }

    render(){
        return (
            <canvas id='myCanvas' height='700' width='700'></canvas>
        );
    }
}
//棋子的每一列
function Row(props) {
    let list = props.arrs.map((v, i) => {
        let name = v?`chess ${i%2?'chess-white':'chess-black'}`:'disappear';
        return (
            <li className='checker-board-col' key={i}>
                <button  className={name}></button>
            </li>
        );
    });

    return (list);
}
//棋子的每一排
class Piece extends React.Component {
    constructor() {
        super();
        this.state = {
            arr : Array(15).fill(Array(15).fill(null))
        }
    }

    render(){
        console.log(this.state.arr);
        return (
            <div style={{overflow: 'hidden',position: 'relative',float: 'left'}}>
                <Checkerboard />
                <ul className='checker-board'>
                    {
                        this.state.arr.map((v, i) => {
                            return (
                                <li className='checker-board-row' key={i}>
                                    <ul>
                                        <Row arrs={v}/>
                                    </ul>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>

        );
    }
}


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