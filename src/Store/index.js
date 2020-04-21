import { createStore, combineReducers } from 'redux'

import User from './Reducers/User'
import Currencies from './Reducers/Currencies'
import Trades from './Reducers/Trades'
import Offers from './Reducers/Offers'
import OpenTrades from './Reducers/OpenTrades'
import Settings from './Reducers/Settings'

const rootReducer = combineReducers({ User, Currencies, Trades, Offers, OpenTrades, Settings })

export default createStore(rootReducer)