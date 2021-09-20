import { call, put, select, take } from 'redux-saga/effects';
import { CallEffect, PutEffect, SelectEffect, TakeEffect } from '@redux-saga/core/effects';
import { SagaIterator } from 'redux-saga';

import { changeWorkerPost } from '../actions/worker.action';
import { IWorkerRequest } from '../../services/gobang-worker/interfaces/gobang-worker.interface';
import {
  gameChangeState,
  gamePut,
  gameSagaChangeBackward,
  gameSagaChangeBoard,
  gameSagaChangeConfig,
  gameSagaChangeForward,
  gameSagaPut,
  gameSagaStart
} from '../actions/gobang.action';
import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import {
  GameType,
  IGameChange,
  IGamePut,
  IGameStart,
  IGameStatus,
  SagaAction
} from '../interfaces/gobang.interface';
import { IWRBackward, IWRForward, WorkerType } from '../interfaces/worker.interface';
import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { SCORE } from '../../services/gobang-worker/configs/score.config';
import { evaluatePoint } from '../../services/gobang-worker/services/evaluate-point.service';
import { IScorePoint } from '../../services/gobang-worker/interfaces/evaluate-point.interface';
import { commons } from '../../services/gobang-worker/services/commons.service';
import { app } from '../../configs/commons.config';

/**
 * 落子的预检测
 * @constructor
 */
function* gobangGoOnWatch(): Generator<
  TakeEffect | PutEffect | SelectEffect | CallEffect,
  void,
  SagaAction<IGamePut> | IGameStatus | IPiece[]
> {
  while (true) {
    const action = yield take([gameSagaPut]);

    const { payload } = action as SagaAction<IGamePut>;

    const gobang = yield select((store) => store.gobang);

    const { board, playChess } = gobang as IGameStatus;

    const { piece, gameType } = payload;

    if (!gobangCheckPieceRepeat(board, piece)) {
      yield put(gamePut(payload));

      const winMap = yield call(gobangWinCheckWork, piece);

      if ((winMap as IPiece[]).length) {
        const statePayload = {
          gameType: GameType.DUEL_FINISH,
          winning: piece.role,
          winMap: winMap as IPiece[]
        };

        yield put(gameChangeState(statePayload));
      } else if (
        (gameType === GameType.DUEL_BLOCK && playChess === ERole.white) ||
        (gameType === GameType.DUEL_WHITE && playChess === ERole.block)
      ) {
        const post: IWorkerRequest = {
          type: WorkerType.GO,
          payload: { piece }
        };

        yield put(changeWorkerPost(post));
      } else {
        console.log('电脑完成走棋。。。');
      }
    } else {
      // TODO 落子重复了无法执行任务，请重新选择落子点
      console.log('落子重复了。。。');
    }
  }
}

/**
 * 输赢的检测
 * @constructor
 */
function* gobangWinCheckWork(piece: IPiece): SagaIterator<IPiece[]> {
  const gobang: IGameStatus = yield select((store) => store.gobang);
  const scoreCache: number[][][][] = [
    [], // placeholder
    [
      // for role 1
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ],
    [
      // for role 2
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ]
  ];
  const scorePoint: IScorePoint = {
    x: piece.x,
    y: piece.y,
    role: piece.role,
    pieces: gobang.board,
    scoreCache
  };

  for (let i = 0; i < 4; i++) {
    const result = evaluatePoint.scorePoint({ ...scorePoint, dir: i });
    if (result >= SCORE.FIVE) {
      return gobangGetWinMapWork(piece, gobang.board, i);
    }
  }

  return [];
}

function gobangGetWinMapWork(piece: IPiece, board: IPiece[][], dir: number): IPiece[] {
  let winMap: IPiece[] = [];

  if (dir === 0) {
    // 从上往下
    for (let i = -4; i <= 4; i++) {
      const p = board[piece.y + i]?.[piece.x];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else if (dir === 1) {
    // 从左到右
    for (let i = -4; i <= 4; i++) {
      const p = board[piece.y][piece.x + i];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else if (dir === 2) {
    // 从左上到右下
    for (let i = -4; i <= 4; i++) {
      const p = board[piece.y + i]?.[piece.x + i];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  } else {
    // 从左下到右上
    for (let i = -4; i <= 4; i++) {
      const p = board[piece.y - i]?.[piece.x + i];
      winMap = gobangAddWinMapWork(winMap, piece, p);
    }
  }

  return winMap;
}

function gobangAddWinMapWork(winMap: IPiece[], piece: IPiece, p: IPiece): IPiece[] {
  if (p && p.role === piece.role) {
    return [...winMap, p];
  } else if (winMap.length >= 5) {
    return winMap;
  } else {
    return [];
  }
}

/**
 * 检查是否是重复落子
 * @param board
 * @param piece
 */
function gobangCheckPieceRepeat(board: IPiece[][], piece: IPiece): boolean {
  return board.some((r) => {
    return r.some((p) => p.x === piece.x && p.y === piece.y && p.role !== ERole.empty);
  });
}

/**
 * 初始化游戏所有的状态，重新开始游戏
 * @constructor
 */
function* gobangStartWatch(): Generator<TakeEffect | PutEffect, void, SagaAction<IGameStart>> {
  while (true) {
    const { payload } = yield take([gameSagaStart]);

    let gameType = GameType.DUEL_BLOCK;

    if (!payload.first && !payload.open) {
      gameType = GameType.DUEL_WHITE;
    } else if (!payload.first && payload.open) {
      gameType = GameType.DUEL_WHITE;
    } else if (payload.first && !payload.open) {
      gameType = GameType.DUEL_BLOCK;
    } else if (payload.first && payload.open) {
      gameType = GameType.DUEL_WHITE;
    }

    const startPayload: IGameChange = {
      gameType,
      playChess: payload.first ? ERole.block : ERole.white,
      board: payload.pieces,
      name: payload.name
    };

    console.log('startPayload', startPayload);

    yield put(gameChangeState(startPayload));

    if (payload.piece) {
      yield put(gameSagaPut({ gameType, piece: payload.piece }));
    }
  }
}

/**
 * 修改现在游戏的状态到准备状态，并且通知AI修改状态
 * @constructor
 */
function* gobangChangeBoardWatch(): Generator<
  TakeEffect | PutEffect,
  void,
  SagaAction<IWorkerRequest>
> {
  while (true) {
    const { payload } = yield take([gameSagaChangeBoard]);
    // 将棋盘切换到准备状态
    yield put(gameChangeState({ gameType: GameType.DUEL_READY }));
    // 通知worker
    yield put(changeWorkerPost(payload));
  }
}

/**
 * 修改现在游戏的状态到落子状态，根据AI返回的状态给出通知
 * @constructor
 */
function* gobangChangeGameWatch(): Generator<
  TakeEffect | PutEffect | SelectEffect,
  void,
  SagaAction<IWRBackward | IWRForward> | IGameStatus
> {
  while (true) {
    const action = yield take([
      gameSagaChangeConfig,
      gameSagaChangeForward,
      gameSagaChangeBackward
    ]);

    const { type, payload } = action as SagaAction<IWRBackward | IWRForward>;

    const gobang = yield select((store) => store.gobang);

    const { playChess } = gobang as IGameStatus;

    const statePayload: IGameChange = {
      gameType: playChess === ERole.block ? GameType.DUEL_BLOCK : GameType.DUEL_WHITE
    };

    if (type === gameSagaChangeForward.type) {
      const payloadForward = payload as IWRForward;
      app.log && console.log('payload', payload);
      if (payloadForward.forward) {
        statePayload.board = payloadForward.pieces;
      } else {
        // TODO 创建一个message通知回退失败
      }
    } else if (type === gameSagaChangeBackward.type) {
      const payloadBackward = payload as IWRBackward;
      app.log && console.log('payload', payload);
      if (payloadBackward.backward) {
        statePayload.board = payloadBackward.pieces;
      } else {
        // TODO 创建一个message通知悔棋失败
      }
    } else {
      app.log && console.log('payload', payload);
      // TODO 创建一个message通知设置config的成功还是失败
    }

    yield put(gameChangeState(statePayload));
  }
}

export const gobangSaga = [
  gobangGoOnWatch(),
  gobangStartWatch(),
  gobangChangeBoardWatch(),
  gobangChangeGameWatch()
];
