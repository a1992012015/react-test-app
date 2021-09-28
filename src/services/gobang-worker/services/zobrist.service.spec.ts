import { Zobrist } from './zobrist.service';
import { creatPiece } from './piece.service';
import { ERole } from '../interfaces/role.interface';

describe('zobrist service', () => {
  const zobrist = new Zobrist();
  const firstMap = [
    [7, 7],
    [8, 7],
    [3, 5],
    [1, 0],
    [4, 14]
  ];
  const secondMap = [
    [4, 14],
    [3, 5],
    [7, 7],
    [1, 0],
    [8, 7]
  ];
  const thirdMap = [
    [8, 7],
    [1, 0],
    [3, 5],
    [7, 7],
    [4, 14]
  ];

  const getMapCode = (map: number[][]): number => {
    let mapCode = 0;
    map.forEach(([y, x], index) => {
      zobrist.go(creatPiece({ y, x, role: ERole.white }));
      if (index === map.length - 1) {
        mapCode = zobrist.getCode();
      }
    });

    map.reverse().forEach(([y, x]) => {
      zobrist.go(creatPiece({ y, x, role: ERole.white }));
    });

    return mapCode;
  };

  it('Should return the code', () => {
    const firstCode = getMapCode(firstMap);
    const secondCode = getMapCode(secondMap);
    const thirdCode = getMapCode(thirdMap);

    const fsEqual = firstCode === secondCode;
    const ftEqual = firstCode === thirdCode;

    expect(fsEqual && ftEqual).toBeTruthy();
  });
});
