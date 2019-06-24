import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../src/config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { Elements, StripeProvider, stripe } from 'react-stripe-elements'
import nearestColor from 'nearest-color'
import Wrapper from './components/Wrapper'
import Home from './components/Home'
import Colors from './components/Colors'
import Favorites from './components/Favorites'
import Color from './components/Color'
import CurrentUser from './components/CurrentUser'
import Account from './components/Account'
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
    const [found, setFound] = useState()
    const { initialising, user } = useAuthState(firebase.auth())
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [transition, setTransition] = useState(false)
    const [dragEnded, setDragEnded] = useState(false)
    const [paletteWasSaved, setPaletteWasSaved] = useState(false)
    const [paletteExported, setPaletteExported] = useState(false)
    const [cart, setCart] = useState()
    const [currentUser, setCurrentUser] = useState()

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
            setColors(brightColors)
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
            history.push('/colors')
        }
    }

    const handleFavorites = useCallback(
        color => {
            let numFaves = 5
            // const currentUser = getUser(user.uid)
            // console.log('handleFavorites', currentUser)
            if (user && currentUser) {
                const accountType = currentUser.accountType

                if (accountType) {
                    if (accountType === 'pro') {
                        numFaves = 10
                    } else if (
                        accountType === 'pro_unlimited' ||
                        accountType === 'pro_lifetime'
                    ) {
                        numFaves = 15
                    }
                }
            }

            // console.log('handleFavorites', numFaves)

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
            } else if (user && !found && favorites.length < numFaves) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                localStorage.setItem(
                    'hexy_favorites',
                    JSON.stringify(newFavorites)
                )
            } else if (user && favorites && favorites.length === numFaves) {
                alert('The maximum number of favorites is 15.')
            } else if (!user && !found && favorites.length < 5) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                localStorage.setItem(
                    'hexy_favorites',
                    JSON.stringify(newFavorites)
                )
            } else if (!user && favorites && favorites.length === 5) {
                alert(
                    'The maximum number of favorites is 5. Get a Pro account to save up to 15 favorites.'
                )
            }
        },
        [favorites, found, user]
    )

    const getFavorites = useCallback(() => {
        const cachedFavorites = localStorage.getItem('hexy_favorites')
        if (cachedFavorites) {
            setFavorites(JSON.parse(cachedFavorites))
        } else {
            setFavorites([])
        }
    })

    // const getFavorites = () => {
    //     const cachedFavorites = localStorage.getItem('hexy_favorites')
    //     if (cachedFavorites) {
    //         setFavorites(JSON.parse(cachedFavorites))
    //     } else {
    //         setFavorites([])
    //     }
    // }

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
        localStorage.setItem('hexy_favorites', JSON.stringify(faves))

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

    // const addToCart = (accountType, price, dateAdded) => {
    //     let date = getCurrentDateTime()
    //     // console.log('addToCart', date)

    //     const sessionID = sessionStorage.getItem('hexy_session_id')

    //     if (!sessionID) {
    //         const ID = createID()
    //         sessionStorage.setItem('hexy_session_id', JSON.stringify(ID))
    //     }

    //     const localCart = {
    //         accountType,
    //         price: price.toFixed(2),
    //         dateAdded: date
    //     }

    //     setCart(localCart)
    //     localStorage.setItem('hexy_cart', JSON.stringify(localCart))
    // }

    const addToCart = useCallback((accountType, price, dateAdded) => {
        let date = getCurrentDateTime()
        // console.log('addToCart', date)

        const sessionID = sessionStorage.getItem('hexy_session_id')

        if (!sessionID) {
            const ID = createID()
            sessionStorage.setItem('hexy_session_id', JSON.stringify(ID))
        }

        const localCart = {
            accountType,
            price: price.toFixed(2),
            dateAdded: date
        }

        setCart(localCart)
        localStorage.setItem('hexy_cart', JSON.stringify(localCart))
    }, [])

    useEffect(() => {
        const currentCart = JSON.parse(localStorage.getItem('hexy_cart'))
        setCart(currentCart)
        // console.log(currentCart)
    }, [])

    useEffect(() => {
        // used to cancel async fetch on unmount
        // see here: https://github.com/facebook/react/issues/14326
        let didCancel = false

        const thisUser = JSON.parse(localStorage.getItem('hexy_user'))

        if (user && !thisUser) {
            var userRef = db.collection('users').doc(user.uid)

            userRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        // console.log('Document data:', doc.data())

                        setCurrentUser(doc.data())
                        localStorage.setItem(
                            'hexy_user',
                            JSON.stringify(doc.data())
                        )
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

    // console.log(currentUser && currentUser)

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
                                />
                            )}
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
        </div>
    )
})

// App.whyDidYouRender = true

export default withRouter(App)
