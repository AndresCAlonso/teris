import React, { useContext } from 'react'
import { StoreContext } from '../context/store'
import { pieces } from '../utils/settings'

const PreviewGrid = ({ piece }) => {
  const coords = previewInfo[piece.type]
}
const GameInfoPanel = () => {
  const { state } = useContext(StoreContext)
  const { score, nextPiece } = state

  return (
    <div>
      <div>{score}</div>
      <div>{nextPiece.type}</div>
    </div>
  )
}

const previewInfo = {
  T: [
    [1, 2],
    [2, 1],
    [2, 2],
    [2, 3],
  ],
  Z: [
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
  ],
  LEFT_L: [
    [1, 1],
    [2, 1],
    [2, 2],
    [2, 3],
  ],
  RIGHT_L: [
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
  ],
  LINE: [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
  ],
  REV_Z: [
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
  ],
  SQUARE: [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
  ],
}

export default GameInfoPanel
