import React, { FunctionComponent } from 'react'
import { Tab } from '@material-ui/core'
import { TabProps } from '@material-ui/core/Tab'
import { Link } from 'react-router-dom'

export interface ITabLinkProps extends TabProps {
    to: string
}

const TabLink: FunctionComponent<ITabLinkProps> = props => {
    return <Tab component={Link} {...props} />
}

export default TabLink
