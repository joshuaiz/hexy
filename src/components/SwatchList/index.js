import React, { useEffect } from 'react'
import Swatch from '../Swatch/'
import './SwatchList.scss'

const SwatchList = React.memo(
    ({
        colors,
        handleFavorites,
        removeFavorite,
        favorites,
        favoriteSwatches,
        setFavoriteSwatches,
        searchSubmitted,
        noMatch,
        sortBright
    }) => {
        /* eslint-disable */
        useEffect(() => {
            if (colors && colors.length && favorites && favorites.length) {
                const favSwatches = []
                const intersection = favorites.filter((element, index) => {
                    const found = colors.includes(element)
                    favSwatches.push(found)
                    return favSwatches
                })
                setFavoriteSwatches(intersection)
            }
        }, [favorites])
        /* eslint-enable */

        return (
            <ul
                className={`nostyle swatch-list ${
                    searchSubmitted ? 'search-results' : ''
                }${searchSubmitted && noMatch ? 'nomatch' : ''}`}
            >
                {colors &&
                    colors.map((color, index) => {
                        let isFavorite
                        if (favoriteSwatches && favoriteSwatches.length) {
                            isFavorite = favoriteSwatches.some(
                                el => el.hex === color.hex
                            )
                        } else if (
                            !favoriteSwatches ||
                            favoriteSwatches.length === 0
                        ) {
                            isFavorite = false
                        }
                        return (
                            <Swatch
                                key={color.hex + index}
                                color={color}
                                index={index}
                                handleFavorites={handleFavorites}
                                removeFavorite={removeFavorite}
                                // favorites={favorites}
                                isFavorite={isFavorite ? true : false}
                            />
                        )
                    })}
            </ul>
        )
    }
)

// SwatchList.whyDidYouRender = true

export default SwatchList
