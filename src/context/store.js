import React, { createContext, useReducer } from 'react'
import { generateRandomPiece } from '../utils/movements'

const initialState = {
  score: 0,
  nextPiece: generateRandomPiece(),
}

let StoreContext = createContext()

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'RESET':
      return initialState
    case 'ADD_TO_SCORE':
      return { ...state, score: state.score + payload }
    case 'SET_NEXT_PIECE':
      return { ...state, nextPiece: generateRandomPiece() }
    default:
      return state
  }
}

const StoreProvider = props => {
  let [state, dispatch] = useReducer(reducer, initialState)
  let value = { state, dispatch }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

const StoreConsumer = StoreContext.Consumer

export { StoreContext, StoreProvider, StoreConsumer }
