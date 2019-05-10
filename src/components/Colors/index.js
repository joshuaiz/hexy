import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import SwatchList from '../SwatchList'

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
    history
}) => {
    const handleReload = () => {
        window.location.reload(false)
    }

    return (
        <div className="colors">
            <div className="colors-header">
                <div className="colors-header-text">
                    {!searchInput && !searchSubmitted ? (
                        <p>
                            Showing 1000 random colors.{' '}
                            <a href="/" onClick={handleReload}>
                                Reload
                            </a>{' '}
                            for a new set.{' '}
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
