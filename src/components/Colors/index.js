import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ReactComponent as Sync } from '../../images/sync.svg'
import SwatchList from '../SwatchList'
import './Colors.scss'

const Colors = ({
    colors,
    searchInput,
    searchSubmitted,
    handleFavorites,
    removeFavorite,
    favorites,
    favoriteSwatches,
    setFavoriteSwatches,
    handleBright,
    sortBright,
    history,
    getRandoms
}) => {
    const [rotate, setRotate] = useState(false)

    const handleReload = event => {
        getRandoms(event)
        setRotate(true)
        setTimeout(() => {
            setRotate(false)
        }, 500)
    }

    return (
        <div className="colors">
            <div className="colors-header">
                <div className="colors-header-text">
                    {!searchInput && !searchSubmitted ? (
                        <p>
                            Showing 1000 random colors.{' '}
                            <span
                                className={`more-trigger ${
                                    rotate ? 'rotate' : ''
                                }`}
                                onClick={handleReload}
                            >
                                <Sync />
                            </span>{' '}
                            Reload for a new set.{' '}
                        </p>
                    ) : searchSubmitted ? (
                        <p>
                            Search results for{' '}
                            <span className="search-term">{searchInput}</span>:
                        </p>
                    ) : null}
                </div>

                <div className="sort-input">
                    <input
                        type="checkbox"
                        onChange={handleBright}
                        checked={sortBright}
                    />
                    <label>Sort by brightness (perceptual)</label>
                </div>
            </div>
            <SwatchList
                colors={colors}
                handleFavorites={handleFavorites}
                removeFavorite={removeFavorite}
                favorites={favorites}
                favoriteSwatches={favoriteSwatches}
                setFavoriteSwatches={setFavoriteSwatches}
                searchSubmitted={searchSubmitted}
            />
        </div>
    )
}

export default withRouter(Colors)
