

//棋盘
import React from "react";

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
                                        <Row row={v}/>
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