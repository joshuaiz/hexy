import React, { useState, useEffect, useCallback } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../src/config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { stripe } from 'react-stripe-elements'
import Modali, { useModali } from 'modali'
import nearestColor from 'nearest-color'
import Wrapper from './components/Wrapper'
import Home from './components/Home'
import Colors from './components/Colors'
import Favorites from './components/Favorites'
import Color from './components/Color'
// import CurrentUser from './components/CurrentUser'
import Account from './components/Account'
import ResetPassword from './components/Account/ResetPassword'
import Header from './components/Header'
import Footer from './components/Footer'
import Feed from './components/Feed'
import GoPro from './components/GoPro'
import Checkout from './components/Checkout'
import Palette from './components/Palette'
import FAQ from './components/FAQ'
import AccountHandler from './components/AccountHandler'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import Contact from './components/Contact'
import Success from './components/Contact/Success'
import Unsubscribe from './components/Unsubscribe'
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
    getCurrentDateTime,
    getAllColors,
    arrayDiffByKey
} from './utils/helpers'
import { createID, getUser } from './utils/user'
import 'react-tippy/dist/tippy.css'
import './App.scss'

// if (process.env.NODE_ENV !== 'production') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render')
//     whyDidYouRender(React)
// }

export const FavoritesContext = React.createContext()

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
    const [profileUpdated, setProfileUpdated] = useState(false)
    const [cart, setCart] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [favoritesError, setFavoritesError] = useState(false)
    const [favErrorContent, setFavErrorContent] = useState()

    const [errorModal, toggleErrorModal] = useModali()

    // it returns two components Provider and Consumer

    const numFaves = getNumberOfFavorites(currentUser && currentUser)

    // console.log('App', favoritesError)

    // console.log(numFaves)

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

    window.onbeforeunload = e => {
        toggleErrorModal(false)
    }

    useEffect(() => {
        getRandoms()
    }, [])

    // Sort colors by brightness
    const handleBright = useCallback(() => {
        const hexyAll = getSessionStorage('hexy_all')
        if (!sortBright) {
            const brightColors = sortLightness(colors)
            setColors(brightColors)
        } else if (searchInput) {
            const cachedSearchColors = getSessionStorage('hexy_searchColors')
            setColors(cachedSearchColors)
        } else if (!searchInput && !hexyAll) {
            const cachedRandoms = getSessionStorage('hexy_randoms')
            setColors(cachedRandoms)
        } else if (!searchInput && hexyAll) {
            handleAllColors(hexyAll)
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

            // console.log('in handleFavorites: numFaves', numFaves)

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
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (user && !found && favorites.length < numFaves) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (user && favorites && favorites.length === numFaves) {
                setFavoritesError(true)
                toggleErrorModal(true)
            } else if (!user && !found && favorites.length < 5) {
                let newFavorites = [color, ...favorites]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
            } else if (!user && favorites && favorites.length === 5) {
                setFavoritesError(true)
                toggleErrorModal(true)
            }
        },
        [favorites, user]
    )

    const handleAddPaletteToFavorites = useCallback(
        palette => {
            const localAddedPalettes = getLocalStorage('hexy_added_palettes')
            const localFavorites = getLocalStorage('hexy_favorites')

            let addedPalette = {
                name: palette.name,
                pid: palette.pid
            }

            let p = palette.palette

            if (!palette) {
                return
            }

            // console.log('favorites.length', favorites.length)
            // console.log('p.length', p.length)
            // console.log('localFavorites.length', localFavorites && localFavorites.length)

            let newPalette = arrayDiffByKey('hex', p, favorites)
            let intersection = p.filter(x => favorites.includes(x))
            let difference = p.filter(x => !favorites.includes(x))
            let division = p.filter(x => !newPalette.includes(x))

            // check if color from palette already exists in favorites (returns boolean)
            const exists = favorites.some(i => p.some(j => j.name === i.name))

            // console.log('handleAddPaletteToFavorites', exists)
            // console.log('handleAddPaletteToFavorites: favorites', favorites)
            // console.log('handleAddPaletteToFavorites: newPalette', newPalette)
            // console.log('handleAddPaletteToFavorites: difference', difference)
            // console.log('handleAddPaletteToFavorites: division', division)
            // console.log('handleAddPaletteToFavorites: intersection', intersection)

            if (
                favorites.length > 15 ||
                (newPalette && newPalette.length > 15)
            ) {
                alert('The maximum number of Favorites is 15.')
                return
            }

            // if a color exists, add rest of colors from palette to favorites
            if (
                (exists && !localAddedPalettes) ||
                (exists && localAddedPalettes.length === 0)
            ) {
                console.log('exists, no local')
                let newFavorites = [...newPalette, ...division]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
                setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
                return
            }

            if (localAddedPalettes && localAddedPalettes.length) {
                const found = localAddedPalettes.some(
                    el => el.name === palette.name
                )
                if (!found) {
                    const newPalettes = [
                        ...localAddedPalettes,
                        { ...addedPalette }
                    ]
                    // console.log('!found')
                    let newFavorites = [...favorites, ...p]
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', newPalettes)
                } else if (exists) {
                    let filteredPalettes = localAddedPalettes.filter(
                        el => el.name !== palette.name
                    )
                    // console.log('exists')
                    let toRemove = [...division]
                    // console.log('exists toRemove', toRemove)
                    let newFavorites = favorites.filter(
                        el => !toRemove.includes(el)
                    )
                    // let newFavorites = [...newPalette]
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', filteredPalettes)
                } else {
                    let filteredPalettes = localAddedPalettes.filter(
                        el => el.name !== palette.name
                    )
                    let toRemove = [...intersection, ...difference]
                    let newFavorites = favorites.filter(
                        el => !toRemove.includes(el)
                    )
                    // console.log('else')
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', filteredPalettes)
                }
            } else if (!localAddedPalettes || localAddedPalettes.length === 0) {
                // console.log('nothing')
                let newFavorites = [...favorites, ...p]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
                setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
            }
        },
        [favorites]
    )

    // const handleAddPaletteToFavorites = useCallback(
    //     palette => {
    //         const localAddedPalettes = getLocalStorage('hexy_added_palettes')
    //         const localFavorites = getLocalStorage('hexy_favorites')

    //         let addedPalette = {
    //             name: palette.name,
    //             pid: palette.pid
    //         }

    //         let p = palette.palette

    //         if (!palette) {
    //             return
    //         }

    //         let newPalette = arrayDiffByKey('hex', p, favorites)
    //         let intersection = p.filter(x => favorites.includes(x))
    //         let difference = p.filter(x => !favorites.includes(x))

    //         // check if color from palette already exists in favorites (returns boolean)
    //         const exists = favorites.some(i => p.some(j => j.name === i.name))

    //         // console.log('favorites', favorites)
    //         // console.log('palette', p)
    //         console.log('newPalette', newPalette)
    //         console.log('intersection', intersection)
    //         console.log('difference', difference)

    //         console.log('exists', exists)

    //         if (localAddedPalettes && localAddedPalettes.length) {
    //             const found = localAddedPalettes.some(
    //                 el => el.name === palette.name
    //             )
    //             if (!found) {
    //                 const newPalettes = [
    //                     ...localAddedPalettes,
    //                     { ...addedPalette }
    //                 ]

    //                 let newFavorites = [...favorites, ...newPalette]
    //                 setFavorites(newFavorites)
    //                 setLocalStorage('hexy_favorites', newFavorites)
    //                 setLocalStorage('hexy_added_palettes', newPalettes)
    //             } else {
    //                 let filteredPalettes = localAddedPalettes.filter(
    //                     el => el.name !== palette.name
    //                 )
    //                 let toRemove = [...intersection, ...difference]
    //                 let newFavorites = favorites.filter(
    //                     el => !toRemove.includes(el)
    //                 )
    //                 setFavorites(newFavorites)
    //                 setLocalStorage('hexy_favorites', newFavorites)
    //                 setLocalStorage('hexy_added_palettes', filteredPalettes)
    //             }
    //         } else if (!localAddedPalettes || localAddedPalettes.length === 0) {
    //             if (exists) {
    //                 let newFavorites = [...favorites, ...newPalette]
    //                 setFavorites(newFavorites)
    //                 setLocalStorage('hexy_favorites', newFavorites)
    //                 setLocalStorage('hexy_added_palettes', [
    //                     { ...addedPalette }
    //                 ])
    //             } else {
    //                 let newFavorites = [...favorites, ...p]
    //                 setFavorites(newFavorites)
    //                 setLocalStorage('hexy_favorites', newFavorites)
    //                 setLocalStorage('hexy_added_palettes', [
    //                     { ...addedPalette }
    //                 ])
    //             }
    //         }
    //     },
    //     [favorites]
    // )

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
    }, [])

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
        localStorage.removeItem('hexy_added_palettes')
    }

    useEffect(() => {
        getFavorites()
    }, [])

    // const memoizedFavorites = useCallback(() => {
    //     getFavorites()
    // }, [favorites])

    const handleSidebarToggle = () => {
        setTimeout(() => {
            setIsSidebarVisible(!isSidebarVisible)
        }, 200)
        setTransition(true)

        // needed to reenable drag-and-drop
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
            dateAdded: date,
            total: price.toFixed(2)
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

        if (user) {
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
        }
        // else if (thisUser) {
        //     setCurrentUser(thisUser)
        // }
        return () => {
            didCancel = true
        }
    }, [user])

    // useEffect(() => {
    //     let didCancel = false
    //     const toggleFalse = () => {
    //         toggleErrorModal(false)
    //     }
    //     if (didCancel) {
    //         toggleFalse()
    //     }
    //     return () => {
    //         didCancel = true
    //     }
    // }, [])

    useEffect(() => {
        let errorContent
        let timeout
        if (favoritesError) {
            errorContent = favoritesErrorContent(
                user,
                currentUser,
                numFaves,
                toggleErrorModal
            )
            setFavErrorContent(errorContent)
            timeout = setTimeout(() => {
                setFavoritesError(false)
            }, 4000)
        }
        return () => {
            clearTimeout(timeout)
            setFavoritesError(false)
        }
    }, [favoritesError, currentUser, user, numFaves, toggleErrorModal])

    // console.log('favoriteSwatches', favoriteSwatches)
    // console.log('favorites', favorites)

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
                            render={() => (
                                <Home
                                    // key={props.location.href}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    getFavorites={getFavorites}
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
                                    handleAddPaletteToFavorites={
                                        handleAddPaletteToFavorites
                                    }
                                    removeFavorite={removeFavorite}
                                    // favorites={favorites}
                                    // setFavorites={setFavorites}
                                    // getFavorites={getFavorites}
                                    paletteExported={paletteExported}
                                    // favoriteSwatches={favoriteSwatches}
                                    // setFavoriteSwatches={
                                    //     setFavoriteSwatches
                                    // }
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
                                    getFavorites={getFavorites}
                                    handleBright={handleBright}
                                    sortBright={sortBright}
                                    setSortBright={setSortBright}
                                    getRandoms={getRandoms}
                                    handleAllColors={handleAllColors}
                                    loadMoreColors={loadMoreColors}
                                    currentUser={currentUser}
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
                                    setProfileUpdated={setProfileUpdated}
                                    currentUser={currentUser}
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
                                    // favorites={favorites}
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
                                    // favorites={favorites}
                                    getFavorites={getFavorites}
                                    paletteWasSaved={paletteWasSaved}
                                    paletteExported={paletteExported}
                                    setPaletteExported={setPaletteExported}
                                    profileUpdated={profileUpdated}
                                    setProfileUpdated={setProfileUpdated}
                                />
                            )}
                        />
                        <Route
                            path="/account-handler"
                            component={AccountHandler}
                        />
                        <Route
                            path="/palette/:palette"
                            render={() => (
                                <Palette
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    // favorites={favorites}
                                    handleAddPaletteToFavorites={
                                        handleAddPaletteToFavorites
                                    }
                                    getFavorites={getFavorites}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/reset-password"
                            component={ResetPassword}
                        />
                        <Route exact path="/faq" component={FAQ} />
                        <Route exact path="/terms" component={Terms} />
                        <Route
                            exact
                            path="/privacy-policy"
                            component={Privacy}
                        />
                        <Route exact path="/privacy" component={Privacy} />
                        <Route exact path="/contact" component={Contact} />
                        <Route
                            exact
                            path="/contact/success"
                            component={Success}
                        />
                        <Route path="/unsubscribe" component={Unsubscribe} />
                        {/*<Route
                            exact
                            path="/user"
                            render={props => <CurrentUser {...props} />}
                        />*/}

                        <Route component={NoMatch} />
                    </Switch>
                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <FavoritesContext.Provider value={favorites}>
                            <Favorites
                                favorites={favorites}
                                currentUser={currentUser}
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
                        </FavoritesContext.Provider>
                    </DragDropContext>
                </div>
                <Footer currentUser={currentUser} />
            </Wrapper>
            {toggleErrorModal && (
                <Modali.Modal {...errorModal} animated={true} centered={true}>
                    {favErrorContent}
                </Modali.Modal>
            )}
        </div>
    )
})

// App.whyDidYouRender = true

export default withRouter(App)
