import React from "react";

//显示执棋手
function ChessPlayer(props) {
    const styleH = {
        textAlign: 'center',
        fontSize: '20px'
    };
    const chessPlayer = `当前${props.xIsNext?'白方':'黑方'}执棋`;

    return (
        <h1 style={styleH}>{chessPlayer}</h1>
    );
}


function Operation(props) {
    const box = {
        textAlign: 'center',
        fontSize: '20px'
    };
    let dom = null;
    if(props.chessPlayer){
        dom = (
            <li>
                <button>悔棋</button>
                <button onClick={() => {props.onClick()}}>认输</button>
            </li>
        )
    }else{
        dom = (
            <li>
                <button onClick={() => {props.onClick()}}>开始</button>
            </li>
        )
    }
    return (
        <div style={box}>
            <ul className='operation'>
                <li>
                    <button>先手</button>
                    <button>后手</button>
                    <h3>默认黑棋先手</h3>
                </li>
                <li>
                    <button>白棋</button>
                    <button>黑棋</button>
                    <h3>默认玩家先手</h3>
                </li>
                {dom}
            </ul>
        </div>
    );
}

//五子棋控制台
class Console extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : props.data
        }
    }

    start(){
        console.log("改变状态");

        this.setState({
            storage: this.state.data?0:1
        })
    }

    render(){
        const styleD = {
            flexGrow: 1,
            minHeight: '220px',
            float:'left'
        };
        console.log(this.state.data);
        return (
            <div style={styleD}>
                <ChessPlayer chessPlayer={this.state.data} />
                <Operation chessPlayer={this.state.data} onClick={() => {this.start()}} />
            </div>
        );
    }
}

export default Console;