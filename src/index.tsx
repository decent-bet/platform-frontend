import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import axios from 'axios'
import { AUTH_API_URL } from './config'
axios.defaults.baseURL = AUTH_API_URL

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
)
