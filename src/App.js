import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import SwatchList from './components/SwatchList'
import Home from './components/Home'
import Favorites from './components/Favorites'
import {
    getRandomColors,
    sortLightness,
    filterColorsBySearchText
} from './utils/helpers'
import Header from './components/Header'
import './App.scss'

if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    whyDidYouRender(React)
}

const App = () => {
    const [colors, setColors] = useState()
    const [sortBright, setSortBright] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [favorites, setFavorites] = useState([])
    const [favoriteSwatches, setFavoriteSwatches] = useState([])
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [dragEnded, setDragEnded] = useState(false)

    // Get 1000 random colors to show on home page
    const getRandoms = () => {
        const cachedRandoms = sessionStorage.getItem('hexy_randoms')
        if (!cachedRandoms) {
            const randoms = getRandomColors()
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
    const handleBright = () => {
        if (!sortBright) {
            const brightColors = sortLightness(colors)
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
    }

    // SearchBox input is a controlled component
    const handleSearchInput = event => {
        setSearchInput(event.target.value)
    }

    // handle returning search results and updating color list
    const handleSearch = event => {
        event.preventDefault()
        let text = searchInput.toLowerCase()
        const filterList = filterColorsBySearchText(text)

        if (text && text.length) {
            // if we have a search, reset brightness sort
            setSortBright(false)
            setColors(filterList)
            sessionStorage.setItem(
                'hexy_searchColors',
                JSON.stringify(filterList)
            )
        } else {
            setSortBright(false)
            getRandoms()
        }
    }

    let newFavorites = []
    let found

    const handleFavorites = color => {
        if (favorites && favorites.length) {
            // check if color is already a favorite
            found = favorites.some(el => el.hex === color.hex)
        }
        if (!found && !favorites.length) {
            newFavorites = [color, ...favorites]
            setFavorites(newFavorites)
            localStorage.setItem('hexy_favorites', JSON.stringify(newFavorites))
        } else if (!found && favorites.length < 15) {
            newFavorites = [color, ...favorites]
            setFavorites(newFavorites)
            localStorage.setItem('hexy_favorites', JSON.stringify(newFavorites))
        } else if (favorites && favorites.length === 15) {
            alert('The maximum number of favorites is 15.')
        }
    }

    const getFavorites = () => {
        const cachedFavorites = localStorage.getItem('hexy_favorites')
        if (cachedFavorites) {
            setFavorites(JSON.parse(cachedFavorites))
        } else {
            setFavorites([])
        }
    }

    const removeFavorite = color => {
        let filteredFavorites = favorites.filter(item => item.hex !== color.hex)
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
    }

    const clearFavorites = () => {
        setFavorites([])
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
        // console.log(result)
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

    const handleReload = () => {
        window.location.reload(false)
    }

    return (
        <Router>
            <div className="App">
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
                            render={() => (
                                <Home
                                    colors={colors}
                                    searchInput={searchInput}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    favoriteSwatches={favoriteSwatches}
                                    setFavoriteSwatches={setFavoriteSwatches}
                                    handleBright={handleBright}
                                    sortBright={sortBright}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/color/:color"
                            render={props => null}
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
                        />
                    </DragDropContext>
                </div>
            </div>
        </Router>
    )
}

export default App
