import React, { useState, useEffect, useCallback } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../src/config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { stripe } from 'react-stripe-elements'
import nearestColor from 'nearest-color'
import { FavoritesContextWrapper } from './components/FavoritesContext'
import {
    Account,
    AccountHandler,
    Checkout,
    Color,
    Colors,
    Contact,
    FAQ,
    Favorites,
    Feed,
    Footer,
    GoPro,
    Header,
    Home,
    NoMatch,
    Palette,
    Privacy,
    ResetPassword,
    Success,
    Terms,
    Unsubscribe,
    Wrapper
} from './components/Components'

import {
    filterColorsBySearchText,
    setSessionStorage,
    getSessionStorage,
    setLocalStorage,
    getLocalStorage,
    getColorByHex,
    hexColors,
    getCurrentDateTime
} from './utils/helpers'
import { createID } from './utils/user'
import 'react-tippy/dist/tippy.css'
import './App.scss'

if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    whyDidYouRender(React)
}

const App = React.memo(({ history, location, match }) => {
    const [searchColors, setSearchColors] = useState()
    const [searchInput, setSearchInput] = useState('')
    const [searchSubmitted, setSearchSubmitted] = useState(false)

    const [noMatch, setNoMatch] = useState(false)
    const { user } = useAuthState(firebase.auth())
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [transition, setTransition] = useState(false)
    const [paletteWasSaved, setPaletteWasSaved] = useState(false)
    const [paletteExported, setPaletteExported] = useState(false)
    const [profileUpdated, setProfileUpdated] = useState(false)
    const [cart, setCart] = useState()
    const [currentUser, setCurrentUser] = useState()

    // SearchBox input is a controlled component
    const handleSearchInput = event => {
        setSearchSubmitted(false)
        setSearchInput(event.target.value)
    }

    const handleSearch = useCallback(
        event => {
            event.preventDefault()
            const text = searchInput.toLowerCase()
            const filterList = filterColorsBySearchText(text)

            const validHex = /(^#?[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(text)

            if (text && text.length && filterList && filterList.length) {
                setNoMatch(false)
                // if we have a search, reset brightness sort
                setSearchColors(filterList)
                setSessionStorage('hexy_searchColors', filterList)
                setSearchSubmitted(true)
                // if not on colors page, go there to see search results
                history.push('/colors')
            } else if (validHex) {
                const nearest = nearestColor.from(hexColors)
                const nearestString = nearest(text)
                const nc = getColorByHex(nearestString)
                setNoMatch(true)
                setSearchColors(nc)
                setSearchSubmitted(true)
                history.push('/colors')
            } else {
                setSearchColors(null)
                setSearchSubmitted(false)
                setNoMatch(true)
                history.push('/colors')
            }
        },
        [history, searchInput]
    )

    const handleSidebarToggle = () => {
        setTimeout(() => {
            setIsSidebarVisible(!isSidebarVisible)
        }, 300)
        setTransition(true)

        // needed to reenable drag-and-drop
        setTimeout(() => {
            setTransition(false)
        }, 2000)
    }

    window.onbeforeunload = () => {
        setTransition(false)
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
        const sessionID = getSessionStorage('hexy_session_id')

        if (!sessionID) {
            const ID = createID()
            setSessionStorage('hexy_session_id', ID)
        }

        const localCart = {
            accountType,
            price: price.toFixed(2),
            dateAdded: date,
            total: price.toFixed(2)
        }

        setCart(localCart)
        setLocalStorage('hexy_cart', localCart)
    }, [])

    useEffect(() => {
        setCart(getLocalStorage('hexy_cart'))
    }, [])

    useEffect(() => {
        // used to cancel async fetch on unmount
        // see here: https://github.com/facebook/react/issues/14326
        let didCancel = false

        const thisUser = getLocalStorage('hexy_user')

        if (user && !didCancel) {
            var userRef = db.collection('users').doc(user.uid)

            userRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        // console.log('Document data:', doc.data())
                        setCurrentUser(doc.data())
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

    return (
        <div className="App">
            <FavoritesContextWrapper currentUser={currentUser}>
                <Wrapper>
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
                            <Route exact path="/" component={Home} />

                            <Route
                                exact
                                path="/palettes"
                                render={() => (
                                    <Feed paletteExported={paletteExported} />
                                )}
                            />

                            <Route
                                exact
                                path="/colors"
                                render={() => (
                                    <Colors
                                        searchColors={searchColors}
                                        searchInput={searchInput}
                                        searchSubmitted={searchSubmitted}
                                        noMatch={noMatch}
                                        currentUser={currentUser}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/pro"
                                render={() => (
                                    <GoPro
                                        addToCart={addToCart}
                                        cart={cart}
                                        currentUser={currentUser}
                                    />
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
                                component={Color}
                            />
                            <Route
                                exact
                                path="/account"
                                render={() => (
                                    <Account
                                        currentUser={currentUser}
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
                                component={Palette}
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
                            <Route
                                path="/unsubscribe"
                                component={Unsubscribe}
                            />
                            <Route component={NoMatch} />
                        </Switch>
                        <Favorites
                            currentUser={currentUser}
                            handleSidebarToggle={handleSidebarToggle}
                            isSidebarVisible={isSidebarVisible}
                            transition={transition}
                            paletteHasBeenSaved={paletteHasBeenSaved}
                            paletteWasExported={paletteWasExported}
                        />
                    </div>
                    <Footer />
                </Wrapper>
            </FavoritesContextWrapper>
        </div>
    )
})

// App.whyDidYouRender = true

export default withRouter(App)
