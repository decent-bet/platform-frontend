import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './Components/Dapp'
import './css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faEthereum)

ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
);
