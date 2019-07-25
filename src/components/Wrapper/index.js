import React from 'react'
import { withRouter } from 'react-router-dom'

const Wrapper = ({ children, location, match, user }) => {
    // console.log(location)
    let key = location.key
    let currentPath = window.location.pathname

    if (currentPath === '/') {
        currentPath = 'home'
    } else {
        currentPath = currentPath.substring(1)
    }

    return (
        <div
            className={`${currentPath}-page ${user ? 'user' : 'no-user'} ${
                key && key.length ? 'match' : 'no-match'
            }`}
        >
            {children}
        </div>
    )
}

export default withRouter(Wrapper)
