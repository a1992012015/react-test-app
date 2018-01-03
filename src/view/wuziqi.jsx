import React from "react";
/*
* 五子棋*/
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
    let list = props.row.map((v, i) => {
        const name = v?`chess ${v%2 === 0?'chess-white':'chess-black'}`:'disappear';
        return (
            <li className='checker-board-col' key={i} onClick={() => props.onClick(props.index, i)}>
                <button  className={name}></button>
            </li>
        );
    });

    return (list);
}

//棋子的每一排
class Piece extends React.Component {
    constructor(props) {
        super(props);
        let arr = Array();
        for(var i = 0; i < 15; i++) {
            arr[i] = new Array();
            for(var j = 0; j < 15; j++) {
                arr[i][j] = null;
            }
        }
        console.log(arr)
        this.state = {
            arr : arr,
            stepNumber: 1,//步数
            xIsNext: true,//执棋手
        }
    }

    laizi(index, item){
        console.log('==================');
        if(this.state.arr[index][item]){
            return;
        }
        console.log(this.state.arr[index][item]);
        console.log(this.state.stepNumber);
        this.state.arr[index][item] = this.state.stepNumber;
        console.log(this.state.arr);
        this.setState({
            arr: this.state.arr,
            xIsNext: this.state.stepNumber++,
        });
        console.log('==================');
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
                                        <Row
                                            index={i}
                                            onClick={(i,a) => this.laizi(i,a)}
                                            row={v}
                                        />
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

export default Piece;