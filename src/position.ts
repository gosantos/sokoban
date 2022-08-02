export type Position = {
  r: number
  c: number
}

export const addPositions = (c1: Position, c2: Position, n = 1): Position => {
  return {
    r: c1.r + c2.r * n,
    c: c1.c + c2.c * n,
  }
}
