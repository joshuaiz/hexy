import React from 'react'
import { Link } from 'react-router-dom'
import './404.scss'

const NoMatch = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-inner">
                <h1>Pobrecita. 404 Not Found.</h1>
                <h3>The article you are looking for isn't here.</h3>
                <p>
                    Try <Link to="/colors">browsing for colors</Link> or check
                    out public <Link to="/palettes">palettes</Link>.
                </p>
            </div>
        </div>
    )
}

export default NoMatch
