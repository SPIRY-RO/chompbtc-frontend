import socket from './socket'
import store from '../Store'
import { notification } from 'antd'

const setCurrencies = async data => {
  store.dispatch({ type: 'CHANGE_CURRENCIES_RATE', Currencies: data })
}

const setTrades = async data => {
  let currentData = await store.getState()
  currentData = currentData.Trades

  const diff = data.daily.total - currentData.daily.total

  if (diff > 0 || currentData.yearly.total === 0) {
    if (diff > 0)
      notification.success({ message: `${diff} new completed trade${diff > 1 ? 's' : ''}` })
    store.dispatch({ type: 'CHANGE_TRADES_DATA', Trades: data })
  }
}

const setOffers = data => {
  store.dispatch({ type: 'CHANGE_OFFERS_DATA', Offers: data })
}

const setOpenTrades = data => {
  store.dispatch({ type: 'CHANGE_OPEN_TRADES_DATA', OpenTrades: data })
}

const backgroundWorker = {
  updating: false,
  update: () => {
    socket.emit('trades/completed', { period: 'all', status: 'Released' })
    socket.emit('trades', { ended: false })
    socket.emit('offers')
    socket.emit('currencies')
  },
  setHandlers: () => {
    socket.on('error', error => {
      notification.error({ message: error.text })
    })
    socket.on('currencies', setCurrencies)
    socket.on('offers', offers => {
      setOffers({ all: offers })
    })
    socket.on('trades', setOpenTrades)
    socket.on('trades/completed', _trades => {
      try {

        let x = _trades
  
        for (const period in x) {
          const total = x[period].length
          const all = x[period]
          let profit = 0
          let margin = 0
    
          if (!Array.isArray(all)) continue
  
          all.map(trade => {
            profit += Number.parseFloat(trade.profit)
            margin += Number.parseFloat(trade.margin)
          })
    
          margin = margin / total
  
          if (isNaN(margin)) margin = 0
  
          x[period] = { total, all, profit, margin }
        }

        setTrades(x)
      } catch (e) {
        return
      }

    })
  },
  run: () => {
    backgroundWorker.update()
    backgroundWorker.updating = setInterval(backgroundWorker.update, 5000)
    backgroundWorker.setHandlers()
  },
  stop: () => {
    clearInterval(backgroundWorker.updating)
  }
}

export default backgroundWorker