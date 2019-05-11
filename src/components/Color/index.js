import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { getTintsShades } from '../../utils/helpers'
import namedColors from 'color-name-list'
import Swatch from '../Swatch'
import SwatchList from '../SwatchList'
import './Color.scss'

const Color = React.memo(function Color({
    location,
    handleFavorites,
    favorites,
    removeFavorite,
    favoriteSwatches,
    setFavoriteSwatches
}) {
    const [currentColor, setCurrentColor] = useState()

    const url = location.pathname
    const urlHex = url.split('/').pop()
    const urlHexHash = '#' + urlHex

    const getColorByHex = hex => {
        let namedColor = namedColors.filter((item, index) => {
            if (hex !== '' && item.hex.toLowerCase().includes(hex)) {
                setCurrentColor(item)
                sessionStorage.setItem('current_color', JSON.stringify(item))
                return item
            }

            return null
        })
        return namedColor
    }

    useEffect(() => {
        const currentCachedColor = sessionStorage.getItem('current_color')
        const parsedCachedColor = JSON.parse(currentCachedColor)

        const getCurrentColor = () => {
            if (!currentCachedColor && location.color) {
                setCurrentColor(location.color)
                sessionStorage.setItem(
                    'current_color',
                    JSON.stringify(location.color)
                )
            } else if (location.color && parsedCachedColor !== location.color) {
                setCurrentColor(location.color)
                sessionStorage.setItem(
                    'current_color',
                    JSON.stringify(location.color)
                )
            } else if (
                !parsedCachedColor ||
                parsedCachedColor.hex !== urlHexHash
            ) {
                let currentHex = { name: '', hex: urlHexHash }
                setCurrentColor(currentHex)
                sessionStorage.setItem(
                    'current_color',
                    JSON.stringify(currentHex)
                )
            } else if (currentCachedColor && !location.color) {
                setCurrentColor(JSON.parse(currentCachedColor))
            }
        }
        getCurrentColor()
    }, [location.color, urlHexHash])

    useEffect(() => {
        getColorByHex(urlHexHash)
    }, [urlHexHash])

    // let found

    // if (favorites && currentColor) {
    //     found = favorites.some(el => {
    //         return el.hex === currentColor.hex
    //     })
    // }

    let shades = []
    let tints = []

    shades = getTintsShades('darken', currentColor && currentColor.hex)
    tints = getTintsShades('lighten', currentColor && currentColor.hex)

    return (
        <div
            className={`color-page color-${
                currentColor ? currentColor.hex : 'detail'
            }`}
        >
            <div className="color-main">
                <div className="color-id">
                    <h2>
                        <span className="color-hex">
                            {currentColor && currentColor.hex}
                        </span>{' '}
                        <br />
                        <span className="color-name">
                            {currentColor && currentColor.name}
                        </span>
                    </h2>
                </div>

                <div className="main-swatches">
                    <div className="main-swatch">
                        {currentColor ? (
                            <Swatch
                                color={currentColor}
                                // handleFavorites={handleFavorites}
                                // removeFavorite={removeFavorite}
                                // isFavorite={found}
                            />
                        ) : (
                            location.color && <Swatch color={location.color} />
                        )}
                    </div>

                    <div className="shades-tints">
                        <div className="shades">
                            <h3>Shades</h3>
                            {currentColor && (
                                <SwatchList
                                    colors={shades}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                />
                            )}
                        </div>
                        <div className="tints">
                            <h3>Tints</h3>
                            {currentColor && (
                                <SwatchList
                                    colors={tints}
                                    favorites={favorites}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

// Color.whyDidYouRender = true

export default Color
