import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { ReactComponent as Sync } from '../../images/sync.svg'
import { ReactComponent as Palette } from '../../images/palette.svg'
import ColorsWrapper from './ColorsWrapper'
import {
    getNumberOfNamedColors,
    getSessionStorage,
    setSessionStorage,
    getRandomColors,
    getAllColors,
    sortLightness
} from '../../utils/helpers'
import './Colors.scss'

const Colors = React.memo(
    ({ searchColors, searchInput, searchSubmitted, noMatch, currentUser }) => {
        const [colors, setColors] = useState()
        const [sortBright, setSortBright] = useState(false)
        const [rotate, setRotate] = useState(false)
        const [isLoading, setIsLoading] = useState(false)
        const [pro, setPro] = useState(false)

        const hexyAll = getSessionStorage('hexy_all')
        const numColors = getNumberOfNamedColors()

        // Get 1000 random colors to show on home page
        const getRandoms = event => {
            const hexyAll = getSessionStorage('hexy_all')
            // console.log(hexyAll)
            if (hexyAll && !event) {
                // console.log('getRandoms in hexyAll')
                handleAllColors(hexyAll)
                return
            }
            if (event) {
                sessionStorage.removeItem('hexy_all')
                event.preventDefault()
                const randoms = getRandomColors(1000)
                setColors(randoms)
                setSessionStorage('hexy_randoms', randoms)
                return
            }
            const cachedRandoms = getSessionStorage('hexy_randoms')

            if (!cachedRandoms) {
                const randoms = getRandomColors(1000)
                setColors(randoms)
                setSessionStorage('hexy_randoms', randoms)
            } else {
                setColors(cachedRandoms)
            }
        }

        const handleAllColors = length => {
            const allColors = getAllColors()
            const size = length || 1001
            const items = allColors.slice(0, size).map(item => {
                return item
            })
            setColors(items)
            setSessionStorage('hexy_all', items.length)
        }

        const loadMoreColors = start => {
            // console.log('loadMoreColors: start', start)
            const allColors = getAllColors()
            const size = 1001 + start
            const items = allColors.slice(start, size).map(item => {
                return item
            })
            // console.log('loadMoreColors: items', items)

            // console.log('loadMoreColors', colors)
            let newColors = [...colors, ...items]
            // console.log('loadMoreColors: newColors', newColors)

            setColors(newColors)
            setSessionStorage('hexy_all', size)
        }

        // clear saved random colors on refresh
        window.onbeforeunload = e => {
            sessionStorage.removeItem('hexy_randoms')
        }

        // Sort colors by brightness
        const handleBright = useCallback(() => {
            const hexyAll = getSessionStorage('hexy_all')
            if (!sortBright) {
                const brightColors = sortLightness(colors)
                setColors(brightColors)
            } else if (searchInput) {
                const cachedSearchColors = getSessionStorage(
                    'hexy_searchColors'
                )
                setColors(cachedSearchColors)
            } else if (!searchInput && !hexyAll) {
                const cachedRandoms = getSessionStorage('hexy_randoms')
                setColors(cachedRandoms)
            } else if (!searchInput && hexyAll) {
                handleAllColors(hexyAll)
            }
            setSortBright(!sortBright)
        }, [sortBright, colors, searchInput])

        const handleReload = event => {
            getRandoms(event)
            setRotate(true)
            setSortBright(false)
            sessionStorage.removeItem('hexy_all')
            const timeout = setTimeout(() => {
                setRotate(false)
            }, 500)

            return () => {
                clearTimeout(timeout)
            }
        }

        const handleLoading = () => {
            setIsLoading(true)
            handleAllColors()
        }

        useEffect(() => {
            if (searchSubmitted) {
                setColors(searchColors)
            }
        }, [searchColors, searchSubmitted])

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

        const handleLoadMoreColors = () => {
            loadMoreColors(colors.length)
        }

        // useEffect(() => {
        //     getFavorites()
        // }, [favorites, getFavorites])

        // console.log('Colors', colors && colors.length)

        useEffect(() => {
            getRandoms()
        }, [])

        return (
            <div
                className={`colors ${
                    colors && colors.length > 1000
                        ? 'all-colors'
                        : 'random-colors'
                }`}
            >
                <div className="colors-header">
                    <div className="colors-header-text">
                        {!searchSubmitted ? (
                            <div className="colors-header-wrap">
                                <p>
                                    Showing{' '}
                                    {colors && colors.length === 1000
                                        ? '1000 random'
                                        : colors &&
                                          colors.length +
                                              ' out of ' +
                                              numColors}{' '}
                                    colors.{' '}
                                </p>
                                <button
                                    className={`button ${
                                        rotate ? 'rotate' : ''
                                    }`}
                                    disabled={rotate ? true : false}
                                    onClick={handleReload}
                                >
                                    <Sync className="more-trigger" />
                                    Load a new random set
                                </button>{' '}
                                {!hexyAll && currentUser && pro && (
                                    <button
                                        className="all-colors button"
                                        onClick={handleLoading}
                                    >
                                        <Palette />
                                        Load all {numColors} colors (slow)
                                    </button>
                                )}
                                {hexyAll && currentUser && pro && (
                                    <div className="load-more">
                                        <button
                                            className="button"
                                            onClick={handleLoadMoreColors}
                                        >
                                            Load More Colors
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : searchSubmitted ? (
                            <p className="search-results-text">
                                Search results for{' '}
                                <span className="search-term">
                                    {searchInput}
                                </span>
                                :{' '}
                                {noMatch && (
                                    <span className="no-match">
                                        There were no exact matches for your
                                        search. Here is the nearest named color:
                                    </span>
                                )}
                            </p>
                        ) : null}
                        {searchInput && noMatch ? (
                            <h3>
                                Sorry, there were no matches for your search.
                            </h3>
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
                    <ColorsWrapper
                        noMatch={noMatch}
                        colors={colors}
                        searchSubmitted={searchSubmitted}
                        sortBright={sortBright}
                    />
                ) : (
                    <div className="loading">
                        <h3>
                            Loading all {getNumberOfNamedColors()}{' '}
                            colors...please be patient.
                        </h3>
                    </div>
                )}

                {colors && colors.length > 1000 && (
                    <div className="colors-actions">
                        <div className="colors-links">
                            <button className="button" onClick={handleReload}>
                                Reload 1000 random colors
                            </button>
                        </div>
                        <div className="load-more">
                            <button
                                className="button"
                                onClick={handleLoadMoreColors}
                            >
                                Load More Colors
                            </button>
                        </div>
                    </div>
                )}
                {colors && colors.length && (
                    <div className="scroll-to-top">
                        <button className="button" onClick={handleScroll}>
                            Scroll to top
                        </button>
                    </div>
                )}
            </div>
        )
    }
)

// Colors.whyDidYouRender = true

export default withRouter(Colors)
