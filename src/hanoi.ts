export type TZone = 0 | 1 | 2;

export interface IMove {
  start: TZone;
  end: TZone;
}

export const hanoi = (n: number, start: TZone, end: TZone, via: TZone) => {
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
