import React from "react";

//显示执棋手
function ChessPlayer(props) {
    const styleH = {
        textAlign: 'center',
        fontSize: '20px'
    };
    const chessPlayer = `当前${props.chessPlayer.xIsNext ? '白方' : '黑方'}执棋`;

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
    console.log(props.chessPlayer.data.flag);
    if (!props.chessPlayer.data.flag) {
        dom = (
            <li>
                <button>悔棋</button>
                <button onClick={() => {
                    props.onClick()
                }}>认输
                </button>
            </li>
        )
    } else {
        dom = (
            <li>
                <button onClick={() => {
                    props.onClick()
                }}>开始
                </button>
            </li>
        )
    }
    return (
        <div style={box}>
            <ul className='operation'>
                <li>
                    <button>先手</button>
                    <button>后手</button>
                    <h3>默认电脑先手</h3>
                </li>
                <li>
                    <button onClick={() => {
                        props.successively(1)
                    }} className={props.chessPlayer.active ? 'active' : ''}>白棋
                    </button>
                    <button onClick={() => {
                        props.successively(0)
                    }} className={!props.chessPlayer.active ? 'active' : ''}>黑棋
                    </button>
                    <h3>默认白棋先手</h3>
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
            data: props.data,
            flag: null
        }
    }

    componentDidMount() {
        this.successively(1);
    }

    componentWillUpdate() {

    }

    start() {
        console.log("改变状态");
        this.setState({
            storage: this.state.data ? 0 : 1
        })
    }

    successively(index) {
        const flag = index === 1 ? true : false;
        this.setState({
            flag: flag
        })
    }

    render() {
        const styleD = {
            flexGrow: 1,
            minHeight: '220px',
            float: 'left'
        };
        let data = {
            data: this.state.data,
            active: this.state.flag
        };
        return (
            <div style={styleD}>
                <ChessPlayer chessPlayer={this.state.data}/>
                <Operation chessPlayer={data} onClick={() => {
                    this.start()
                }} successively={(i) => {
                    this.successively(i)
                }}/>
            </div>
        );
    }
}

export default Console;