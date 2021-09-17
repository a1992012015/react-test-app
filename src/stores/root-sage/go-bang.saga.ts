import { call, put, select, take } from 'redux-saga/effects';
import { CallEffect, PutEffect, SelectEffect, TakeEffect } from '@redux-saga/core/effects';

import { SagaIterator } from 'redux-saga';
import { changeWorkerPost } from '../actions/worker.action';
import { IWorkerRequest } from '../interfaces/worker.interface';
import {
  gameBackward,
  gameChangeState,
  gameInit,
  gamePut,
  gameSagaChangeBoard,
  gameSagaChangeGame,
  gameSagaInit,
  gameSagaPut
} from '../actions/go-bang.action';
import { ERole } from '../../services/go-bang-worker/interfaces/role.interface';
import { GameType, IGamePut, IGameStatus, SagaAction } from '../interfaces/go-bang.interface';
import { WorkerType } from '../../services/go-bang-worker/interfaces/go-bang-worker.interface';
import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';
import { SCORE } from '../../services/go-bang-worker/configs/score.config';

/**
 * 落子的预检测
 * @constructor
 */
function* goBangGoOnWatch(): Generator<
  TakeEffect | PutEffect | SelectEffect | CallEffect,
  void,
  SagaAction<Omit<IGamePut, 'winMap'>> | IGameStatus
> {
  while (true) {
    const action = yield take([gameSagaPut]);

    const { payload } = action as SagaAction<IGamePut>;

    const goBang = yield select((store) => store.goBang);

    const { board, gameType } = goBang as IGameStatus;

    const { piece } = payload;

    if (!checkPieceRepeat(board, piece)) {
      yield put(gamePut({ ...payload, winMap: [] }));

      yield call(goBangWinCheckWork, piece);

      if (gameType === GameType.DUEL_HUM) {
        const post: IWorkerRequest = {
          type: WorkerType.GO,
          payload: { piece }
        };

        yield put(changeWorkerPost(post));
      }
    }
  }
}

/**
 * 输赢的检测
 * @constructor
 */
function* goBangWinCheckWork(piece: IPiece): SagaIterator<void> {
  if (piece.score >= SCORE.FIVE) {
    const goBang = yield select((store) => store.goBang);
    console.log('goBang', goBang.board);
  }
}

/**
 * 检查是否是重复落子
 * @param board
 * @param piece
 */
function checkPieceRepeat(board: IPiece[][], piece: IPiece): boolean {
  return board.some((r) => {
    return r.some((p) => p.x === piece.x && p.y === piece.y && p.role !== ERole.empty);
  });
}

/**
 * 初始化游戏所有的状态，重新开始游戏
 * @constructor
 */
function* GoBangInitWatch(): Generator<TakeEffect | PutEffect> {
  while (true) {
    yield take([gameSagaInit]);

    yield put(gameInit());
  }
}

/**
 * 修改现在游戏的状态到准备状态，并且通知AI修改状态
 * @constructor
 */
function* GoBangChangeBoardWatch(): Generator<
  TakeEffect | PutEffect,
  void,
  SagaAction<IWorkerRequest>
> {
  while (true) {
    const { payload } = yield take([gameSagaChangeBoard]);

    yield put(changeWorkerPost(payload));

    yield put(gameBackward());
  }
}

/**
 * 修改现在游戏的状态到落子状态，根据AI返回的状态给出通知
 * @constructor
 */
function* GoBangChangeGameWatch(): Generator<TakeEffect | PutEffect> {
  while (true) {
    yield take([gameSagaChangeGame]);

    yield put(gameChangeState({ gameType: GameType.DUEL_HUM }));
  }
}

export const goBangSaga = [
  goBangGoOnWatch(),
  GoBangInitWatch(),
  GoBangChangeBoardWatch(),
  GoBangChangeGameWatch()
];
