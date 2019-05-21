import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ReactComponent as Sync } from '../../images/sync.svg'
import SwatchList from '../SwatchList'
import './Colors.scss'

const Colors = ({
    colors,
    searchInput,
    searchSubmitted,
    noMatch,
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
        const timeout = setTimeout(() => {
            setRotate(false)
        }, 500)

        return () => {
            clearTimeout(timeout)
        }
    }

    return (
        <div className="colors">
            <div className="colors-header">
                <div className="colors-header-text">
                    {!searchSubmitted ? (
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
                        <p className="search-results-text">
                            Search results for{' '}
                            <span className="search-term">{searchInput}</span>:{' '}
                            {noMatch && (
                                <span className="no-match">
                                    There were no exact matches for your search.
                                    Here is the nearest named color:
                                </span>
                            )}
                        </p>
                    ) : null}
                    {searchInput && noMatch ? (
                        <h3>Sorry, there were no matches for your search.</h3>
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
                noMatch={noMatch}
                colors={colors}
                handleFavorites={handleFavorites}
                removeFavorite={removeFavorite}
                favorites={favorites}
                favoriteSwatches={favoriteSwatches}
                setFavoriteSwatches={setFavoriteSwatches}
                searchSubmitted={searchSubmitted}
                sortBright={sortBright}
            />
        </div>
    )
}

// Colors.whyDidYouRender = true

export default withRouter(Colors)
