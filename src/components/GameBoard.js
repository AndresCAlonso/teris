import React, { useState, useEffect, useRef } from 'react'
import produce from 'immer'
import {
  clearLines,
  dropPiece,
  invalidMove,
  generateRandomPiece,
  movePiece,
  useKeyPress,
  rotatePiece,
} from '../utils/movements'
import { boardSettings, BLANK } from '../utils/settings'

const initializeBoard = () => {
  const rows = 24
  const columns = 10

  return Array(rows).fill(Array(columns).fill(BLANK))
}

const Cell = ({ cellValue, row, column }) => {
  return (
    <div
      style={{
        border: '1px solid gray',
        backgroundColor: cellValue.color,
      }}
    ></div>
  )
}

const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const stepState = ({
  board,
  setBoard,
  activePiece,
  setActivePiece,
  nextPiece,
  setNextPiece,
  setIsDropping,
}) => {
  setIsDropping(true)
  let currentPiece = activePiece

  const movePieceDown = pieceCoordinates => {
    return Object.fromEntries(
      Object.entries(pieceCoordinates).map(([key, value]) => {
        const [row, column] = value
        return [key, [row + 1, column]]
      }),
    )
  }

  const pieceCoordinates =
    currentPiece.currentPosition || currentPiece.initialPlacement

  let nextPosition = movePieceDown(pieceCoordinates)

  const needNewPiece = Object.values(nextPosition).some(moveCoordinates =>
    invalidMove({
      board,
      moveCoordinates,
      allPieceCoordinates: Object.values(pieceCoordinates),
    }),
  )

  if (needNewPiece) {
    currentPiece = nextPiece
    setNextPiece(generateRandomPiece())
    nextPosition = movePieceDown(currentPiece.initialPlacement)
  }

  const nextBoard = produce(board, newBoard => {
    if (!needNewPiece) {
      Object.values(pieceCoordinates).forEach(([row, column]) => {
        if (row >= 0) newBoard[row][column] = BLANK
      })
    }

    Object.values(nextPosition).forEach(([row, column]) => {
      newBoard[row][column] = currentPiece
    })
  })

  const nextActive = produce(currentPiece, afterMoving => {
    afterMoving.currentPosition = nextPosition
  })

  if (needNewPiece) {
    const [newBoard, linesDeleted] = clearLines(nextBoard)
    setBoard(newBoard)
  } else {
    setBoard(nextBoard)
  }

  setActivePiece(nextActive)
  setIsDropping(false)
}

const GameBoard = () => {
  const [board, setBoard] = useState(initializeBoard())
  const [nextPiece, setNextPiece] = useState(generateRandomPiece())
  const [activePiece, setActivePiece] = useState(generateRandomPiece())
  const [lastKeypress, setLastKeypress] = useState(0)
  const [isDropping, setIsDropping] = useState(false)

  useInterval(() => {
    stepState({
      board,
      setBoard,
      activePiece,
      setActivePiece,
      setIsDropping,
      nextPiece,
      setNextPiece,
    })
  }, 450)

  if (useKeyPress('ArrowRight')) {
    movePiece({
      board,
      setBoard,
      activePiece,
      setActivePiece,
      lastKeypress,
      setLastKeypress,
      isDropping,
      direction: 'right',
    })
  }

  if (useKeyPress('Space')) {
    dropPiece({
      board,
      setBoard,
      activePiece,
      setActivePiece,
      lastKeypress,
      setLastKeypress,
      nextPiece,
      setNextPiece,
    })
  }

  if (useKeyPress('ArrowUp')) {
    rotatePiece({
      board,
      setBoard,
      activePiece,
      setActivePiece,
      lastKeypress,
      setLastKeypress,
      isDropping,
    })
  }

  if (useKeyPress('ArrowLeft')) {
    movePiece({
      board,
      setBoard,
      activePiece,
      setActivePiece,
      lastKeypress,
      setLastKeypress,
      isDropping,
      direction: 'left',
    })
  }

  return (
    <div
      className="gameboard"
      style={{
        margin: '1em',
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSettings.columns}, 1fr)`,
        gridTemplateRows: `repeat(${boardSettings.displayedRows}, 1fr)`,
        width: `${boardSettings.columns * boardSettings.cellWidth}px`,
        height: `${boardSettings.displayedRows * boardSettings.cellHeight}px`,
        border: '1px solid gray',
      }}
    >
      {board
        .filter(
          (_, rowIndex) =>
            rowIndex >= boardSettings.rows - boardSettings.displayedRows,
        )
        .map((row, rowIndex) => {
          return row.map((cellVal, cellIndex) => (
            <Cell
              key={`board_${rowIndex}_${cellIndex}`}
              cellValue={cellVal}
              row={rowIndex}
              column={cellIndex}
            />
          ))
        })}
    </div>
  )
}

export default GameBoard
