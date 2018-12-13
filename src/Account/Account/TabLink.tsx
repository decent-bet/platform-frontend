import React from 'react'
import { Tab } from '@material-ui/core'
import { Link } from 'react-router-dom'

export default function TabLink(props) {
    return <Tab component={Link} {...props} />
}
