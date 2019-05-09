import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import TextLoop from 'react-text-loop'
import './Hero.scss'

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-inner">
                <div className="hero-content">
                    <div className="hero-tagline">
                        <h2>
                            Find{' '}
                            <TextLoop
                                interval={2500}
                                adjustingSpeed={120}
                                fade={true}
                                mask={true}
                                springConfig={{ stiffness: 129, damping: 13 }}
                            >
                                <span className="c1">amazing</span>
                                <span className="c2">cool</span>
                                <span className="c3">brilliant</span>
                                <span className="c4">eccentric</span>
                                <span className="c5">unique</span>
                            </TextLoop>{' '}
                            colors for your next project.
                        </h2>
                    </div>
                    <div className="hero-cta">
                        <Link to="/colors">Start Exploring &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Hero)
