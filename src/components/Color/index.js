import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Swatch from '../Swatch'

const Color = ({ match, location }) => {
    const [currentColor, setCurrentColor] = useState()

    console.log('in Color: location.color', location.color)

    useEffect(() => {
        const getCurrentColor = () => {
            const currentCachedColor = sessionStorage.getItem('current_color')

            if (!currentCachedColor) {
                setCurrentColor(location.color)
                sessionStorage.setItem(
                    'current_color',
                    JSON.stringify(location.color)
                )
            } else if (
                location.color &&
                currentCachedColor !== location.color
            ) {
                setCurrentColor(location.color)
                sessionStorage.setItem(
                    'current_color',
                    JSON.stringify(location.color)
                )
            } else {
                setCurrentColor(JSON.parse(currentCachedColor))
            }
        }
        getCurrentColor()
    }, [location.color])

    console.log('currentColor', currentColor)

    return (
        <div
            className={`color-page color-${
                currentColor ? currentColor.hex : 'detail'
            }`}
        >
            <h2>Color page</h2>
            {currentColor ? (
                <Swatch color={currentColor} />
            ) : (
                location.color && <Swatch color={location.color} />
            )}
        </div>
    )
}

export default withRouter(Color)
