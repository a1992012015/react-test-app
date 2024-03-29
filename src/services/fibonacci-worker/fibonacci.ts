/**
 * @return {number}
 */
export const fibonacci = (n: number): number => {
  if (n <= 1) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
};
