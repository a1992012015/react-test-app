import React, { KeyboardEvent, RefObject } from 'react';
import multiply from 'lodash-es/multiply';
import divide from 'lodash-es/divide';

import styles from './go-bang-checkerboard.module.less';
import logo from '../../../assets/logo.svg';
import { GameType } from '../../../stores/interfaces/go-bang.interface';
import { creatPiece } from '../../../services/go-bang-worker/services/piece.service';
import { ERole } from '../../../services/go-bang-worker/interfaces/role.interface';
import { IPiece } from '../../../services/go-bang-worker/interfaces/piece.interface';
import { BaseComponent } from '../../../components/should-component-update';

interface Props {
  steps: number;
  width: number;
  first: ERole;
  winning: ERole;
  winMap: IPiece[];
  board: IPiece[][];
  gameStatus: GameType;

  gameGo(p: IPiece): void;
}

export class GoBangCheckerboard extends BaseComponent<Props> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (this.props.width !== prevProps.width) {
      this.draftsman();
    }
  }

  private gameGo = (x: number, y: number): void => {
    const { gameStatus } = this.props;
    if (gameStatus === GameType.DUEL_HUM) {
      this.props.gameGo(creatPiece({ x, y, role: ERole.hum }));
    } else {
      console.log('还不能落子！！');
    }
  };

  private draftsman = (): void => {
    const { width } = this.props;
    const x = multiply(width, 14);
    const y = multiply(width, 14);
    const cxt = this.canvasRef?.current?.getContext('2d');
    if (cxt) {
      // 边框
      cxt.moveTo(0, 0);
      cxt.lineTo(x, 0);
      cxt.lineTo(x, y);
      cxt.lineTo(0, y);
      cxt.lineTo(0, 0);
      cxt.stroke();

      // 每一排&&每一列
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

  private getPieceClassName(piece: IPiece, x: number, y: number): string {
    const { steps, gameStatus, winning, winMap, first } = this.props;

    let className = '';

    if (piece.step !== null && piece.role !== ERole.empty) {
      if (piece.role !== first) {
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

  render(): React.ReactNode {
    const { width } = this.props;
    const canvas = width * 14;
    const padding = divide(width, 2);
    if (width) {
      return (
        <div className={styles.container}>
          <canvas className={styles.canvas} ref={this.canvasRef} width={canvas} height={canvas}>
            你的电脑浏览器不支持canvas，换电脑吧~
          </canvas>

          <div className={styles.pieces}>
            <div className={styles.piecesAnimation}>
              <img src={logo} className={styles.piecesLogo} alt="logo" />
            </div>

            <ul className={styles.piecesBox} style={{ padding: `${padding}px` }}>
              {this.renderRowDiv()}
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  private renderRowDiv = (): React.ReactNode => {
    const { board } = this.props;
    return board.map((v, i) => {
      return (
        <li className={styles.piecesRow} key={i}>
          {this.row(i, v)}
        </li>
      );
    });
  };

  private handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    console.log(event);
  };

  private row = (index: number, row: IPiece[]): React.ReactNode => {
    const { width } = this.props;
    return row.map((v, i) => {
      const style = { width: `${width}px`, height: `${width}px` };
      return (
        <div
          tabIndex={0}
          role="button"
          key={i}
          style={style}
          className={styles.chessman}
          onKeyDown={this.handleKeyDown}
          onClick={() => this.gameGo(index, i)}>
          <button
            type="button"
            aria-label="piece"
            className={this.getPieceClassName(v, index, i)}
          />
        </div>
      );
    });
  };
}
