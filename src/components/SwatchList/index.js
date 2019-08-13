import React from 'react'
import Swatch from '../Swatch/'
import './SwatchList.scss'

const SwatchList = React.memo(
    ({
        colors,
        handleFavorites,
        removeFavorite,
        favorites,
        searchSubmitted,
        noMatch,
        sortBright
    }) => {
        return (
            <ul
                className={`nostyle swatch-list ${
                    searchSubmitted ? 'search-results' : ''
                }${searchSubmitted && noMatch ? 'nomatch' : ''}`}
            >
                {colors &&
                    colors.map((color, index) => {
                        let isFavorite
                        if (favorites && favorites.length) {
                            isFavorite = favorites.some(
                                el => el.hex === color.hex
                            )
                        } else if (!favorites || favorites.length === 0) {
                            isFavorite = false
                        }
                        return (
                            <Swatch
                                key={color.hex + index}
                                color={color}
                                index={index}
                                handleFavorites={handleFavorites}
                                removeFavorite={removeFavorite}
                                isFavorite={isFavorite}
                            />
                        )
                    })}
            </ul>
        )
    }
)

// SwatchList.whyDidYouRender = true

export default SwatchList
