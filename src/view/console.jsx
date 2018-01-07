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
    if (!props.chessPlayer.data.flag) {
        dom = (
            <li>
                <button>悔棋</button>
                <button onClick={() => {
                    props.onClick(0)
                }}>认输
                </button>
            </li>
        )
    } else {
        dom = (
            <li>
                <button onClick={() => {
                    props.onClick(1)
                }}>开始
                </button>
            </li>
        )
    }
    let prop = props.chessPlayer;
    return (
        <div style={box}>
            <ul className='operation'>
                <li>
                    <button disabled={!prop.data.flag}>先手</button>
                    <button disabled={!prop.data.flag}>后手</button>
                    <h3>默认电脑先手</h3>
                </li>
                <li>
                    <button disabled={!prop.data.flag} onClick={() => {
                        props.successively(0)
                    }} className={prop.active ? 'active' : ''}>白棋
                    </button>
                    <button disabled={!prop.data.flag} onClick={() => {
                        props.successively(1)
                    }} className={prop.active ? '' : 'active'}>黑棋
                    </button>
                    <h3>{`玩家执棋为${prop.active ? '白棋' : '黑棋'}`}</h3>
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
            flag: !props.data.xIsNext
        }
    }

    componentDidMount() {
        //this.successively(1);
    }

    componentWillUpdate() {

    }

    start(flag) {//开始游戏||投降认输
        console.log("改变状态");
        console.log(flag);
        flag ?
            this.state.data.flag = false :(() => {
                this.state.data.flag = true;
                this.props.onClick(1);
            })();
        this.setState({
            data: this.state.data
        })
    }

    successively(index) {//修改执棋的颜色
        console.log("触发");
        const flag = index === 1 ? true : false;
        this.state.data.xIsNext = flag;
        this.setState({
            data: this.state.data,
            flag: !flag
        });
        this.props.onClick();
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
        console.log('=========子级组件==========');
        console.log(this.state.data);
        return (
            <div style={styleD}>
                <ChessPlayer chessPlayer={this.state.data}/>
                <Operation chessPlayer={data} onClick={(i) => {
                    this.start(i)
                }} successively={(i) => {
                    this.successively(i)
                }}/>
            </div>
        );
    }
}

export default Console;