import { Direction, UP, RIGHT, DOWN, LEFT, IN_PLACE } from './move'

export const mapKeyToDirection = (key: string): Direction => {
  switch (key) {
    case '\x1B[A':
      return UP
    case '\x1B[C':
      return RIGHT
    case '\x1B[B':
      return DOWN
    case '\x1B[D':
      return LEFT
    default:
      return IN_PLACE
  }
}
