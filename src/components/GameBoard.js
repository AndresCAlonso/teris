import React, { useState } from "react"
import produce from "immer"

const pieces = {
  SQUARE: {
    color: "#F0F000",
    initialPlacement: [[0, 4], [0, 5], [1, 4], [1, 5]]
  },
  RIGHT_L: { color: "#EF9F00" },
  LEFT_L: { color: "#0000F0" },
  LINE: { color: "#00F0F0" },
  Z: { color: "#007800" },
  REV_Z: { color: "#780000" },
  T: { color: "#A000F0" }
}

const BLANK = { color: "transparent" }

const boardSettings = {
  cellWidth: 30,
  cellHeight: 30,
  columns: 10,
  rows: 24,
  displayedRows: 20
}

const initializeBoard = () => {
  const rows = 24
  const columns = 10

  return Array(rows).fill(Array(columns).fill(BLANK))
}

const generateRandomPiece = () => {
  const pieceType = Math.floor(Math.random() * Math.floor(7))
  // return Object.keys(pieces)[pieceType]
  return pieces.SQUARE
}

const Cell = ({ cellValue, row, column }) => {
  return (
    <div
      style={{
        border: "1px solid gray",
        backgroundColor: cellValue.color
      }}
    ></div>
  )
}

const gameLoop = (board, activePiece) => {
  // const nextState = produce(bo)
}

const GameBoard = () => {
  const [board, setBoard] = useState(initializeBoard())
  const [nextPiece, setNextPiece] = useState(generateRandomPiece())
  const [activePiece, setActivePiece] = useState(generateRandomPiece())

  console.log(activePiece)

  return (
    <div
      className="gameboard"
      style={{
        margin: "1em",
        display: "grid",
        gridTemplateColumns: `repeat(${boardSettings.columns}, 1fr)`,
        gridTemplateRows: `repeat(${boardSettings.displayedRows}, 1fr)`,
        width: `${boardSettings.columns * boardSettings.cellWidth}px`,
        height: `${boardSettings.displayedRows * boardSettings.cellHeight}px`,
        border: "1px solid gray"
      }}
    >
      {board
        .filter(
          (_, rowIndex) =>
            rowIndex >= boardSettings.rows - boardSettings.displayedRows
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
