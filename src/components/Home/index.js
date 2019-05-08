import React from 'react'
import { withRouter } from 'react-router-dom'
import SwatchList from '../SwatchList'

const Home = ({
    colors,
    searchInput,
    handleFavorites,
    removeFavorite,
    favorites,
    favoriteSwatches,
    setFavoriteSwatches,
    handleBright,
    sortBright
}) => {
    const handleReload = () => {
        window.location.reload(false)
    }

    return (
        <div className="colors">
            <div className="colors-header">
                {!searchInput && (
                    <div className="colors-header-text">
                        <p>
                            Showing 1000 random colors.{' '}
                            <a href="/" onClick={handleReload}>
                                Reload
                            </a>{' '}
                            for a new set.{' '}
                        </p>
                    </div>
                )}
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
            />
        </div>
    )
}

export default withRouter(Home)
