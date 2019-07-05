import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../src/config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { Elements, StripeProvider, stripe } from 'react-stripe-elements'
import Modali, { useModali } from 'modali'
import nearestColor from 'nearest-color'
import Wrapper from './components/Wrapper'
import Home from './components/Home'
import Colors from './components/Colors'
import Favorites from './components/Favorites'
import Color from './components/Color'
import CurrentUser from './components/CurrentUser'
import Account from './components/Account'
import ResetPassword from './components/Account/ResetPassword'
import Header from './components/Header'
import Footer from './components/Footer'
import Feed from './components/Feed'
import GoPro from './components/GoPro'
import Checkout from './components/Checkout'
import FAQ from './components/FAQ'
import NoMatch from './components/NoMatch'
// import {
//     FavoritesContext,
//     FavoritesContextProvider
// } from './components/Favorites/FavoritesContext'
import {
    getRandomColors,
    sortLightness,
    filterColorsBySearchText,
    setSessionStorage,
    getSessionStorage,
    setLocalStorage,
    getLocalStorage,
    getNumberOfFavorites,
    favoritesErrorContent,
    getColorByHex,
    hexColors,
    getCurrentDateTime
} from './utils/helpers'
import { createID, getUser } from './utils/user'
import 'react-tippy/dist/tippy.css'
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
    // const [found, setFound] = useState()
    const { initialising, user } = useAuthState(firebase.auth())
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [transition, setTransition] = useState(false)
    const [dragEnded, setDragEnded] = useState(false)
    const [paletteWasSaved, setPaletteWasSaved] = useState(false)
    const [paletteExported, setPaletteExported] = useState(false)
    const [cart, setCart] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [favoritesError, setFavoritesError] = useState(false)

    const [errorModal, toggleErrorModal] = useModali()

    const numFaves = getNumberOfFavorites(user, currentUser)

    // Get 1000 random colors to show on home page
    const getRandoms = event => {
        if (event) {
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
            setColors(brightColors)
        } else if (searchInput) {
            const cachedSearchColors = getSessionStorage('hexy_searchColors')
            setColors(cachedSearchColors)
        } else if (!searchInput) {
            const cachedRandoms = getSessionStorage('hexy_randoms')
            setColors(cachedRandoms)
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
        const text = searchInput.toLowerCase()
        const filterList = filterColorsBySearchText(text)

        const validHex = /(^#?[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(text)

        // console.log('handleSearch', filterList)

        if (text && text.length && filterList && filterList.length) {
            setNoMatch(false)
            // if we have a search, reset brightness sort
            setSortBright(false)
            setColors(filterList)
            setSessionStorage('hexy_searchColors', filterList)
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
            history.push('/colors')
        }
    }

    const handleFavorites = useCallback(
        color => {
            let found

            if (!color) {
                return
            }
            if (favorites && favorites.length) {
                // check if color is already a favorite
                found = checkIfFavorite(color)
            }
            if (!found && !favorites.length) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                // localStorage.setItem(
                //     'hexy_favorites',
                //     JSON.stringify(newFavorites)
                // )
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (user && !found && favorites.length < numFaves) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                // localStorage.setItem(
                //     'hexy_favorites',
                //     JSON.stringify(newFavorites)
                // )
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (user && favorites && favorites.length === numFaves) {
                // alert('The maximum number of favorites is 15.')
                setFavoritesError(true)
                toggleErrorModal(true)
            } else if (!user && !found && favorites.length < 5) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                // localStorage.setItem(
                //     'hexy_favorites',
                //     JSON.stringify(newFavorites)
                // )
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (!user && favorites && favorites.length === 5) {
                // alert(
                //     'The maximum number of favorites is 5. Get a Pro account to save up to 15 favorites.'
                // )
                setFavoritesError(true)
                toggleErrorModal(true)
            }
        },
        [favorites, user]
    )

    const checkIfFavorite = color => {
        let found
        if (favorites && favorites.length) {
            // check if color is already a favorite
            found = favorites.some(el => el.hex === color.hex)
            // console.log(found, color.hex)
        }
        return found
    }

    const getFavorites = useCallback(() => {
        const cachedFavorites = getLocalStorage('hexy_favorites')
        if (cachedFavorites) {
            setFavorites(cachedFavorites)
        } else {
            setFavorites([])
        }
    })

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
                setLocalStorage('hexy_favorites', filteredFavorites)
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
        setTimeout(() => {
            setIsSidebarVisible(!isSidebarVisible)
        }, 200)

        setTransition(true)
        setTimeout(() => {
            setTransition(false)
        }, 2000)
    }

    window.onbeforeunload = () => {
        setTransition(false)
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
        // localStorage.setItem('hexy_favorites', JSON.stringify(faves))
        setLocalStorage('hexy_favorites', faves)

        setDragEnded(true)

        // resume normal body scroll behavior
        document.body.style.overflow = 'scroll'
    }

    const paletteHasBeenSaved = () => {
        setPaletteWasSaved(true)
        setTimeout(() => {
            setPaletteWasSaved(false)
        }, 10000)
        return () => {
            setPaletteWasSaved(false)
        }
    }

    const paletteWasExported = () => {
        setPaletteExported(true)
        setTimeout(() => {
            setPaletteExported(false)
        }, 10000)
        return () => {
            setPaletteExported(false)
        }
    }

    const addToCart = useCallback((accountType, price, dateAdded) => {
        let date = getCurrentDateTime()
        // console.log('addToCart', date)

        // const sessionID = sessionStorage.getItem('hexy_session_id')
        const sessionID = getSessionStorage('hexy_session_id')

        if (!sessionID) {
            const ID = createID()
            // sessionStorage.setItem('hexy_session_id', JSON.stringify(ID))
            setSessionStorage('hexy_session_id', ID)
        }

        const localCart = {
            accountType,
            price: price.toFixed(2),
            dateAdded: date
        }

        setCart(localCart)
        // localStorage.setItem('hexy_cart', JSON.stringify(localCart))
        setLocalStorage('hexy_cart', localCart)
    }, [])

    useEffect(() => {
        // const currentCart = JSON.parse(localStorage.getItem('hexy_cart'))
        const currentCart = getLocalStorage('hexy_cart')
        setCart(currentCart)
        // console.log(currentCart)
    }, [])

    useEffect(() => {
        // used to cancel async fetch on unmount
        // see here: https://github.com/facebook/react/issues/14326
        let didCancel = false

        // const thisUser = JSON.parse(localStorage.getItem('hexy_user'))
        const thisUser = getLocalStorage('hexy_user')

        if (user && !thisUser) {
            var userRef = db.collection('users').doc(user.uid)

            userRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        // console.log('Document data:', doc.data())

                        setCurrentUser(doc.data())
                        // localStorage.setItem(
                        //     'hexy_user',
                        //     JSON.stringify(doc.data())
                        // )
                        setLocalStorage('hexy_user', doc.data())
                    }
                })
                .catch(err => {
                    console.log('Error getting documents', err)
                })
        } else if (thisUser) {
            setCurrentUser(thisUser)
        }
        return () => {
            didCancel = true
        }
    }, [user])

    return (
        <div className="App">
            <Wrapper user={user}>
                <Header
                    handleSearch={handleSearch}
                    handleSearchInput={handleSearchInput}
                    handleSidebarToggle={handleSidebarToggle}
                    isSidebarVisible={isSidebarVisible}
                    searchInput={searchInput}
                    cart={cart}
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
                            path="/palettes"
                            render={() => (
                                <Feed
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                    paletteExported={paletteExported}
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
                            path="/pro"
                            render={() => (
                                <GoPro addToCart={addToCart} cart={cart} />
                            )}
                        />

                        <Route
                            exact
                            path="/checkout"
                            render={() => (
                                <Checkout
                                    stripe={stripe}
                                    cart={cart}
                                    setCart={setCart}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/color/:color"
                            render={() => (
                                <Color
                                    // key={location.href}
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
                                    paletteExported={paletteExported}
                                    setPaletteExported={setPaletteExported}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/reset-password"
                            component={ResetPassword}
                        />
                        <Route exact path="/faq" component={FAQ} />
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
                            handleSidebarToggle={handleSidebarToggle}
                            isSidebarVisible={isSidebarVisible}
                            transition={transition}
                            dragEnded={dragEnded}
                            paletteHasBeenSaved={paletteHasBeenSaved}
                            paletteWasExported={paletteWasExported}
                        />
                    </DragDropContext>
                </div>
                <Footer currentUser={currentUser} />
            </Wrapper>
            {favoritesError && (
                <Modali.Modal {...errorModal} animated={true} centered={true}>
                    {favoritesErrorContent(user, currentUser, numFaves)}
                </Modali.Modal>
            )}
        </div>
    )
})

// App.whyDidYouRender = true

export default withRouter(App)
