import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

const SiteID = () => {
    return (
        <div className="site-id">
            <Logo />
            <div className="site-title">
                <Link to="/">
                    <h1>hexy</h1>
                </Link>
            </div>
        </div>
    )
}

export default SiteID
