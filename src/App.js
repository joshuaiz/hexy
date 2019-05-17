import React, { useState, useEffect, useCallback } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import nearestColor from 'nearest-color'
import Wrapper from './components/Wrapper'
import Home from './components/Home'
import Colors from './components/Colors'
import Favorites from './components/Favorites'
import Color from './components/Color'
import CurrentUser from './components/CurrentUser'
import Account from './components/Account'
import {
    getRandomColors,
    sortLightness,
    filterColorsBySearchText,
    getColorByHex,
    hexColors
} from './utils/helpers'
import Header from './components/Header'
import './App.scss'

if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    whyDidYouRender(React)
}

const App = React.memo(({ history, location, match }) => {
    const [colors, setColors] = useState()
    const [sortBright, setSortBright] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [searchSubmitted, setSearchSubmitted] = useState(false)
    const [noMatch, setNoMatch] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [favoriteSwatches, setFavoriteSwatches] = useState([])
    const [found, setFound] = useState()
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [dragEnded, setDragEnded] = useState(false)
    const [paletteWasSaved, setPaletteWasSaved] = useState(false)

    // Get 1000 random colors to show on home page
    const getRandoms = event => {
        if (event) {
            event.preventDefault()
            const randoms = getRandomColors(1000)
            setColors(randoms)
            sessionStorage.setItem('hexy_randoms', JSON.stringify(randoms))
            return
        }
        const cachedRandoms = sessionStorage.getItem('hexy_randoms')
        if (!cachedRandoms) {
            const randoms = getRandomColors(1000)
            setColors(randoms)
            sessionStorage.setItem('hexy_randoms', JSON.stringify(randoms))
        } else {
            setColors(JSON.parse(cachedRandoms))
        }
    }

    // clear saved random colors on refresh
    window.onbeforeunload = e => {
        sessionStorage.removeItem('hexy_randoms')
    }

    useEffect(() => {
        getRandoms()
    }, [])

    // Sort colors by brightness
    const handleBright = useCallback(() => {
        if (!sortBright) {
            const brightColors = sortLightness(colors)
            // console.log(brightColors)
            setColors(brightColors)
            setSortBright(true)
        } else if (searchInput) {
            const cachedSearchColors = sessionStorage.getItem(
                'hexy_searchColors'
            )
            setColors(JSON.parse(cachedSearchColors))
        } else if (!searchInput) {
            const cachedRandoms = sessionStorage.getItem('hexy_randoms')
            setColors(JSON.parse(cachedRandoms))
        }
        setSortBright(!sortBright)
    }, [sortBright, colors, searchInput])

    // SearchBox input is a controlled component
    const handleSearchInput = event => {
        setSearchSubmitted(false)
        setSearchInput(event.target.value)
    }

    // handle returning search results and updating color list
    const handleSearch = event => {
        event.preventDefault()
        let text = searchInput.toLowerCase()
        const filterList = filterColorsBySearchText(text)

        let validHex = /(^#?[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(text)

        // console.log('handleSearch', filterList)

        if (text && text.length && filterList && filterList.length) {
            setNoMatch(false)
            // if we have a search, reset brightness sort
            setSortBright(false)
            setColors(filterList)
            sessionStorage.setItem(
                'hexy_searchColors',
                JSON.stringify(filterList)
            )
            setSearchSubmitted(true)
            // if not on colors page, go there to see search results
            history.push('/colors')
        } else if (validHex) {
            const nearest = nearestColor.from(hexColors)
            const nearestString = nearest(text)
            const nc = getColorByHex(nearestString)
            setNoMatch(true)
            setSortBright(false)
            setColors(nc)
            setSearchSubmitted(true)
            history.push('/colors')
        } else {
            setSortBright(false)
            setSearchSubmitted(false)
            setNoMatch(true)
            getRandoms()
        }
    }

    const handleFavorites = useCallback(
        color => {
            if (!color) {
                return
            }
            if (favorites && favorites.length) {
                // check if color is already a favorite
                setFound(favorites.some(el => el.hex === color.hex))
            }
            if (!found && !favorites.length) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                localStorage.setItem(
                    'hexy_favorites',
                    JSON.stringify(newFavorites)
                )
            } else if (!found && favorites.length < 15) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                localStorage.setItem(
                    'hexy_favorites',
                    JSON.stringify(newFavorites)
                )
            } else if (favorites && favorites.length === 15) {
                alert('The maximum number of favorites is 15.')
            }
        },
        [favorites, found]
    )

    const getFavorites = () => {
        const cachedFavorites = localStorage.getItem('hexy_favorites')
        if (cachedFavorites) {
            setFavorites(JSON.parse(cachedFavorites))
        } else {
            setFavorites([])
        }
    }

    const removeFavorite = useCallback(
        color => {
            if (!color || !favorites) {
                return
            }
            let filteredFavorites = favorites.filter(
                item => item.hex !== color.hex
            )
            if (!filteredFavorites.length) {
                clearFavorites()
                setFavoriteSwatches([])
            } else {
                setFavorites(filteredFavorites)
                localStorage.setItem(
                    'hexy_favorites',
                    JSON.stringify(filteredFavorites)
                )
            }
        },
        [favorites]
    )

    const clearFavorites = () => {
        setFavorites([])
        setFavoriteSwatches([])
        localStorage.removeItem('hexy_favorites')
    }

    useEffect(() => {
        getFavorites()
    }, [])

    const handleSidebarToggle = () => {
        setIsSidebarVisible(!isSidebarVisible)
    }

    const onDragStart = () => {
        setDragEnded(false)

        // disable auto-scrolling of body when dragging
        document.body.style.overflow = 'hidden'
    }

    const onDragEnd = result => {
        const { destination, source, draggableId } = result
        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        // copy our current favorites array
        const faves = [...favorites]

        let id = ''
        // split off extra chars from favorite squares draggableId if necessary
        if (draggableId.length === 7) {
            id = draggableId
        } else {
            id = draggableId.substring(0, draggableId.indexOf('-'))
        }

        // match dragged favorite with favorite in array
        let foundFave = favorites.filter(el => {
            if (el.hex === id) {
                return el
            }
            return null
        })

        // from dragged element, create object to insert back in array
        let movedObj = {
            name: foundFave[0].name,
            hex: foundFave[0].hex
        }

        // splice from source/destination to create new array on drag
        faves.splice(source.index, 1)
        faves.splice(destination.index, 0, movedObj)

        // set new favorites in state + localStorage
        setFavorites(faves)
        localStorage.setItem('hexy_favorites', JSON.stringify(faves))

        setDragEnded(true)

        // resume normal body scroll behavior
        document.body.style.overflow = 'scroll'
    }

    const paletteHasBeenSaved = () => {
        setPaletteWasSaved(true)
        // console.log('in paletteHasBeenSaved')
        setTimeout(() => {
            setPaletteWasSaved(false)
        }, 10000)
    }

    return (
        <div className="App">
            <Wrapper>
                <Header
                    handleSearch={handleSearch}
                    handleSearchInput={handleSearchInput}
                    handleSidebarToggle={handleSidebarToggle}
                    isSidebarVisible={isSidebarVisible}
                    searchInput={searchInput}
                />

                <div
                    className={`content ${
                        isSidebarVisible ? 'sidebar' : 'no-sidebar'
                    }`}
                >
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <Home
                                    key={props.location.href}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/colors"
                            render={() => (
                                <Colors
                                    key={location.href}
                                    colors={colors}
                                    searchInput={searchInput}
                                    searchSubmitted={searchSubmitted}
                                    noMatch={noMatch}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                    handleBright={handleBright}
                                    sortBright={sortBright}
                                    getRandoms={getRandoms}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/color/:color"
                            render={() => (
                                <Color
                                    key={location.href}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                    location={location}
                                    match={match}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/account"
                            render={props => (
                                <Account
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    paletteWasSaved={paletteWasSaved}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user"
                            render={props => <CurrentUser {...props} />}
                        />
                    </Switch>
                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <Favorites
                            favorites={favorites}
                            removeFavorite={removeFavorite}
                            clearFavorites={clearFavorites}
                            setFavorites={setFavorites}
                            getFavorites={getFavorites}
                            isSidebarVisible={isSidebarVisible}
                            dragEnded={dragEnded}
                            paletteHasBeenSaved={paletteHasBeenSaved}
                        />
                    </DragDropContext>
                </div>
            </Wrapper>
        </div>
    )
})

// export default withRouter(App)

App.whyDidYouRender = true

export default withRouter(App)
