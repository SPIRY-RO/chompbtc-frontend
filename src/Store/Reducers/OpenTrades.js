/* eslint-disable indent */

const INITIAL_STATE = []

const OpenTrades = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_OPEN_TRADES_DATA':
      return action.OpenTrades
    default:
      return state
  }
}

export default OpenTrades
