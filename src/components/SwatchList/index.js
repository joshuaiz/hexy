import React, { useContext } from 'react'
import Swatch from '../Swatch/'
import { FavoritesContext } from '../FavoritesContext'
import './SwatchList.scss'

const SwatchList = React.memo(({ colors, searchSubmitted, noMatch }) => {
    const { favorites } = useContext(FavoritesContext)
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
                        isFavorite = favorites.some(el => el.hex === color.hex)
                    } else if (!favorites || favorites.length === 0) {
                        isFavorite = false
                    }
                    return (
                        <Swatch
                            key={color.hex + index}
                            color={color}
                            index={index}
                            isFavorite={isFavorite}
                        />
                    )
                })}
        </ul>
    )
})

// SwatchList.whyDidYouRender = true

export default SwatchList
