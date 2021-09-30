import { Commons } from './commons.service';
import { SCORE } from '../configs/score.config';

describe('commons service', () => {
  const commons = new Commons();

  it('Should return the number Array', () => {
    const numberArray = commons.createScores(10, 11);

    expect(numberArray.length).toEqual(10);
    expect(numberArray.every((r) => r.length === 11)).toBeTruthy();
  });

  it('Should return the great or equal than', () => {
    const result = commons.greatOrEqualThan(10000, SCORE.THREE);
    console.log('result', result);
    expect(result).toBeTruthy();
  });
});
