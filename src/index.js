import React from 'react'
import ReactDOM from 'react-dom'
// import './index.css';
import App from './App'
import { Provider } from 'react-redux'
import store from './Store'
import backgroundWorker from './Services/background-worker'

backgroundWorker.run()

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'))