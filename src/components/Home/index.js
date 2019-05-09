import React from 'react'
import { withRouter } from 'react-router-dom'
import Hero from './Hero'

const Home = ({ location, history }) => {
    return (
        <div className="page-home">
            <Hero />
        </div>
    )
}

export default withRouter(Home)
