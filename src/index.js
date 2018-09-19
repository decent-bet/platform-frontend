import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './Components/Dapp'

import './index.css'
import './css/bootstrap.min.css'
import './css/main.css'

// Load Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faEthereum)

// Inject tap event plugin
injectTapEventPlugin()

ReactDOM.render(<App />, document.getElementById('root'))
