/* eslint-disable indent */

const INITIAL_STATE = {
  all: [],
  
}

const Offers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_OFFERS_DATA':
      return action.Offers
    default:
      return state
  }
}

export default Offers
