import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import * as tinycolor from 'tinycolor2'
import { getTintsShades, inverseColor } from '../../utils/helpers'
import namedColors from 'color-name-list'
import Swatch from '../Swatch'
import SwatchList from '../SwatchList'
import ColorSpaces from '../ColorSpaces'
import ScrollToTop from '../ScrollToTop';
import './Color.scss'


const Color = React.memo(function Color({
    match,
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

    const hexColor = '#' + match.params.color

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

    let found

    if (favorites && currentColor) {
        found = favorites.some(el => {
            return el.hex === currentColor.hex
        })
    }

    let shades = []
    let tints = []

    shades = getTintsShades('darken', currentColor && currentColor.hex)
    tints = getTintsShades('lighten', currentColor && currentColor.hex)

    const hex = tinycolor(hexColor)

    const analogous = hex.analogous(3, 10)
    const triad = hex.triad()
    const tetrad = hex.tetrad()
    const complement = hex.complement().toHexString()
    const splitComplement = hex.splitcomplement()
    let inverse = inverseColor(hex)

    // console.log(inverse)

    // console.log('analogous', analogous)
    // console.log('triad', triad)
    // console.log('tetrad', tetrad)
    // console.log('complement', complement)
    // console.log('split complement', splitComplement)

    // const analogousHex = analogous.map(item => {
    //     return { name: '', hex: item.toHexString() }
    // })

    const colorArray = array => {
        const newArray = array.map(item => {
            return { name: '', hex: item.toHexString() }
        })
        return newArray
    }

    const spinColor = color => {
        let spins = []
        let newColor
        for (let s = 1, i = 0; i < 4; i++, s += 30) {
            newColor = color.spin(s).toString()
            if (spins.indexOf(newColor) === -1) {
                spins.push({ name: '', hex: newColor })
            }
        }
        return spins
    }

    const spins = spinColor(hex)

    // console.log(spins)

    return (
        <div
            className={`color-page color-${
                currentColor ? currentColor.hex : 'detail'
            }`}
        >
            <ScrollToTop />
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
                                handleFavorites={handleFavorites}
                                removeFavorite={removeFavorite}
                                isFavorite={found}
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
            <div className="color-spaces">
                <ColorSpaces
                    hexColor={urlHexHash ? urlHexHash : currentColor.hex}
                />
            </div>
            <div className="color-harmonies">
                <div className="analogous color-harmony">
                    <h3>Analogous</h3>
                    {analogous && (
                        <SwatchList
                            colors={colorArray(analogous)}
                            favorites={favorites}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                            favoriteSwatches={favoriteSwatches}
                            setFavoriteSwatches={setFavoriteSwatches}
                        />
                    )}
                </div>
                <div className="triad color-harmony">
                    <h3>Triad</h3>
                    {triad && (
                        <SwatchList
                            colors={colorArray(triad)}
                            favorites={favorites}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                            favoriteSwatches={favoriteSwatches}
                            setFavoriteSwatches={setFavoriteSwatches}
                        />
                    )}
                </div>
                <div className="tetrad color-harmony">
                    <h3>Tetrad</h3>
                    {tetrad && (
                        <SwatchList
                            colors={colorArray(tetrad)}
                            favorites={favorites}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                            favoriteSwatches={favoriteSwatches}
                            setFavoriteSwatches={setFavoriteSwatches}
                        />
                    )}
                </div>
                <div className="split-complement color-harmony">
                    <h3>Split Complement</h3>
                    {splitComplement && (
                        <SwatchList
                            colors={colorArray(splitComplement)}
                            favorites={favorites}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                            favoriteSwatches={favoriteSwatches}
                            setFavoriteSwatches={setFavoriteSwatches}
                        />
                    )}
                </div>
                <div className="complement-inverse">
                    <div className="complement color-harmony">
                        <h3>Complement</h3>
                        {complement && (
                            <Swatch
                                color={{ name: '', hex: complement }}
                                favorites={favorites}
                                handleFavorites={handleFavorites}
                                removeFavorite={removeFavorite}
                                favoriteSwatches={favoriteSwatches}
                                setFavoriteSwatches={setFavoriteSwatches}
                            />
                        )}
                    </div>
                    <div className="inverse color-harmony">
                        <h3>Inverse</h3>
                        {inverse && (
                            <Swatch
                                color={{ name: '', hex: inverse }}
                                favorites={favorites}
                                handleFavorites={handleFavorites}
                                removeFavorite={removeFavorite}
                                favoriteSwatches={favoriteSwatches}
                                setFavoriteSwatches={setFavoriteSwatches}
                            />
                        )}
                    </div>
                </div>
                <div className="spins color-harmony">
                    <h3>Spins</h3>
                    {spins && (
                        <SwatchList
                            colors={spins}
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
    )
})

// Color.whyDidYouRender = true

export default withRouter(Color)
