import React from 'react'
import GameBoard from './GameBoard'
import GameInfoPanel from './GameInfoPanel'
import { StoreProvider } from '../context/store'

const layoutStyles = {
  width: '960px',
  margin: '0 auto',
}

const GameLayout = () => {
  return (
    <StoreProvider>
      <div className="gameLayout" style={layoutStyles}>
        <GameBoard />
        <GameInfoPanel />
      </div>
    </StoreProvider>
  )
}

export default GameLayout
