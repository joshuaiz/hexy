import React from 'react'
import { withRouter } from 'react-router-dom'

const Wrapper = ({ children, location }) => {
    let currentPath = window.location.pathname

    if (currentPath === '/') {
        currentPath = 'home'
    } else {
        currentPath = currentPath.substring(1)
    }

    return <div className={`${currentPath}-page`}>{children}</div>
}

export default withRouter(Wrapper)
