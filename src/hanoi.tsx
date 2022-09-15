export interface IMove {
  start: number;
  end: number;
}

export const hanoi = (n: number, start: number, end: number, via: number) => {
  const result: IMove[] = [];
  if (n < 0) return result;
  if (n === 1) {
    result.push({ start, end });
  } else {
    result.push(...hanoi(n - 1, start, via, end));
    result.push({ start, end });
    result.push(...hanoi(n - 1, via, end, start));
  }
  return result;
};
