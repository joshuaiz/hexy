import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import TextLoop from 'react-text-loop'
import colorsImg from '../../../images/hexy_colors.png'
import './Hero.scss'

const Hero = () => {
    const [isLooping, setIsLooping] = useState()

    useEffect(() => {
        const seen = sessionStorage.getItem('animation_viewed')
        if (!seen) {
            setIsLooping(true)
        }
        const timeout = setTimeout(() => {
            setIsLooping(false)
            sessionStorage.setItem('animation_viewed', true)
        }, 16000)

        return () => {
            clearTimeout(timeout)
        }
    }, [isLooping])

    return (
        <div className="hero">
            <div className="hero-bg">
                <div className="hero-bg-inner">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </div>
            <div className="hero-inner">
                <div className="hero-content">
                    <div className="hero-tagline">
                        <h2>
                            Find{' '}
                            {isLooping ? (
                                <TextLoop
                                    interval={2500}
                                    adjustingSpeed={120}
                                    fade={true}
                                    mask={true}
                                    springConfig={{
                                        stiffness: 129,
                                        damping: 13
                                    }}
                                >
                                    <span className="c0">the best</span>
                                    <span className="c1">amazing</span>
                                    <span className="c2">cool</span>
                                    <span className="c3">brilliant</span>
                                    <span className="c4">eccentric</span>
                                    <span className="c5">unique</span>
                                </TextLoop>
                            ) : (
                                <span className="c0">the best</span>
                            )}{' '}
                            colors for your next project.
                        </h2>
                    </div>
                    <div className="hero-cta">
                        <Link to="/colors">Start Exploring &rarr;</Link>
                    </div>
                    <div className="hero-button">
                        <Link className="button" to="/pro">
                            Go Pro
                        </Link>
                        <a href="#home-go-pro">Learn more</a>
                    </div>
                </div>
                <div className="colors-image">
                    <img src={colorsImg} alt="hexy colors" />
                </div>
            </div>
        </div>
    )
}

export default withRouter(Hero)
