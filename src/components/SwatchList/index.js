import React, { useState, useEffect, useMemo } from 'react'
import Swatch from '../Swatch/'
import './SwatchList.scss'

const SwatchList = ({
    colors,
    handleFavorites,
    removeFavorite,
    favorites,
    favoriteSwatches,
    setFavoriteSwatches
}) => {
    useMemo(() => {
        if (colors && colors.length && favorites && favorites.length) {
            const favSwatches = []
            const intersection = favorites.filter((element, index) => {
                const found = colors.includes(element)
                favSwatches.push(found)
                return favSwatches
            })
            setFavoriteSwatches(intersection)
        }
    }, [colors, favorites, setFavoriteSwatches])

    return (
        <ul className="nostyle swatch-list">
            {colors &&
                colors.map((color, index) => {
                    let isFavorite
                    if (favoriteSwatches && favoriteSwatches.length) {
                        isFavorite = favoriteSwatches.some(
                            el => el.hex === color.hex
                        )
                    } else if (favoriteSwatches.length === 0) {
                        isFavorite = false
                    }
                    return (
                        <Swatch
                            key={color.hex}
                            color={color}
                            index={index}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                            favorites={favorites}
                            isFavorite={isFavorite ? true : false}
                        />
                    )
                })}
        </ul>
    )
}

// SwatchList.whyDidYouRender = true

export default SwatchList
