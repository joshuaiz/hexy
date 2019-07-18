import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { ReactComponent as Sync } from '../../images/sync.svg'
import SwatchList from '../SwatchList'
import { getNumberOfNamedColors } from '../../utils/helpers'
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
    getRandoms,
    handleAllColors,
    loadMoreColors,
    currentUser
}) => {
    const [rotate, setRotate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pro, setPro] = useState(false)
    const { user } = useAuthState(firebase.auth())

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

    const handleLoading = () => {
        setIsLoading(true)
    }

    useEffect(() => {
        if (colors && colors.length > 1000) {
            setIsLoading(false)
        }
        return () => {
            setIsLoading(false)
        }
    }, [colors])

    useEffect(() => {
        if (currentUser && currentUser) {
            if (currentUser.accountType !== 'standard') {
                setPro(true)
            }
        }
        // return () => {

        // }
    }, [currentUser])

    const handleScroll = () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="colors">
            <div className="colors-header">
                <div className="colors-header-text">
                    {!searchSubmitted ? (
                        <p>
                            Showing{' '}
                            {colors && colors.length === 1000
                                ? '1000 random'
                                : colors && colors.length}{' '}
                            colors.{' '}
                            <span
                                className={`more-trigger ${
                                    rotate ? 'rotate' : ''
                                }`}
                                onClick={handleReload}
                            >
                                <Sync />
                            </span>{' '}
                            Reload for a new set.{' '}
                            {currentUser && pro && (
                                <span
                                    className="all-colors like-link"
                                    onClick={() => {
                                        handleAllColors()
                                        handleLoading()
                                    }}
                                >
                                    See all {getNumberOfNamedColors()} colors
                                    (really slow).
                                </span>
                            )}
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
            {!isLoading ? (
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
            ) : (
                <div className="loading">
                    <h3>
                        Loading all {getNumberOfNamedColors()} colors...please
                        be patient.
                    </h3>
                </div>
            )}
            {colors && colors.length > 1000 && (
                <div className="load-more">
                    <button
                        className="button"
                        onClick={() => loadMoreColors(colors.length)}
                    >
                        Load More Colors
                    </button>

                    <div className="colors-links">
                        <span className="like-link" onClick={handleReload}>
                            Reload 1000 random colors
                        </span>
                        &nbsp;|&nbsp;
                        <span className="like-link" onClick={handleScroll}>
                            Scroll to top
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

// Colors.whyDidYouRender = true

export default withRouter(Colors)
