import React, { RefObject } from 'react';
import multiply from 'lodash-es/multiply';
import divide from 'lodash-es/divide';

import styles from './go-bang-checkerboard.module.less';
import logo from '../../../assets/logo.svg';
import { GameType } from '../../../stores/interfaces/go-bang.reducer';
import { BaseComponent } from '../../../components/should-component-update';
import { Piece, Role } from '../../../services/go-bang-ai/interfaces/open-pants.interface';

interface State {
  width: number;
}

interface Props {
  steps: number;
  winning: Role;
  winMap: Piece[];
  board: Piece[][];
  gameStatus: GameType;

  gameGo(p: Piece): void;
}

export class GoBangCheckerboard extends BaseComponent<Props, State> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0
    };
  }

  componentDidMount() {
    this.resizeCheckerboard();
    window.addEventListener('resize', this.resizeCheckerboard);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCheckerboard);
  }

  private resizeCheckerboard = () => {
    if (this.containerRef?.current) {
      const bounding = this.containerRef.current.getBoundingClientRect();
      const boundingWidth = bounding.width - 40;
      const boundingHeight = bounding.height - 40;
      const clientWidth = boundingWidth > boundingHeight ? boundingHeight : boundingWidth;
      const canvasWidth = clientWidth < 928 ? 928 : clientWidth;
      const width = Math.floor(divide(canvasWidth, 16));

      this.setState({ width: width }, () => {
        this.draftsman();
      });
    }
  };

  private gameGo = (x: number, y: number) => {
    const { gameStatus } = this.props;
    if (gameStatus === GameType.DUEL_HUM) {
      this.props.gameGo({ x, y, role: Role.hum });
    } else {
      console.log('还不能落子！！');
    }
  };

  private draftsman = () => {
    const { width } = this.state;
    const x = multiply(width, 14);
    const y = multiply(width, 14);
    const cxt = this.canvasRef?.current?.getContext('2d');
    if (cxt) {
      //边框
      cxt.moveTo(0, 0);
      cxt.lineTo(x, 0);
      cxt.lineTo(x, y);
      cxt.lineTo(0, y);
      cxt.lineTo(0, 0);
      cxt.stroke();

      //每一排&&每一列
      for (let i = 1; i <= 13; i++) {
        const clo = i * width;
        cxt.moveTo(clo, 0);
        cxt.lineTo(clo, y);
        cxt.stroke();
        cxt.moveTo(0, clo);
        cxt.lineTo(x, clo);
        cxt.stroke();
      }
    }
  };

  private getPieceClassName(piece: Piece, x: number, y: number) {
    const { steps, gameStatus, winning, winMap } = this.props;

    let className: string = '';

    if (piece.step !== null && piece.role !== Role.empty) {
      if (piece.role === Role.hum) {
        className = `${styles.chessmanMain} ${styles.chessmanWhite}`;
      } else {
        className = `${styles.chessmanMain} ${styles.chessmanBlack}`;
      }
    } else {
      className = styles.chessmanDisappear;
    }

    if (steps === piece.step) {
      className = `${className} ${styles.chessmanAnim}`;
    }

    if (gameStatus === GameType.DUEL_READY && winning === piece.role && steps !== piece.step) {
      winMap.forEach((item) => {
        if (item.x === x && item.y === y) {
          className = `${className} ${styles.chessmanAnim}`;
        }
      });
    }

    return className;
  }

  render() {
    const { width } = this.state;
    const canvas = width * 14;
    const padding = divide(width, 2);
    return (
      <div ref={this.containerRef} className={styles.container}>
        <canvas className={styles.canvas} ref={this.canvasRef} width={canvas} height={canvas}>
          你的电脑浏览器不支持canvas，换电脑吧~
        </canvas>

        <div className={styles.pieces}>
          <div className={styles.piecesAnimation}>
            <img src={logo} className={styles.piecesLogo} alt="logo"/>
          </div>

          <ul className={styles.piecesBox} style={{ padding: `${padding}px` }}>
            {this.renderRowDiv()}
          </ul>
        </div>
      </div>
    );
  }

  private renderRowDiv() {
    const { board } = this.props;
    return board.map((v, i) => {
      return (
        <li className={styles.piecesRow} key={i}>
          {this.row(i, v)}
        </li>
      );
    });
  }

  private row(index: number, row: Piece[]) {
    const { width } = this.state;
    return row.map((v, i) => {
      const style = { width: `${width}px`, height: `${width}px` };
      return (
        <div key={i} style={style} className={styles.chessman}
             onClick={() => this.gameGo(index, i)}>
          <button className={this.getPieceClassName(v, index, i)}/>
        </div>
      );
    });
  }
}
