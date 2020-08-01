import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import HoverIntent from 'react-hoverintent'
import Modali, { useModali } from 'modali'
import Tippy from '@tippy.js/react'
import { Tooltip } from 'react-tippy'
import useWindowWidth from '../../hooks/useWindowWidth'
import moment from 'moment'
import saveAs from 'file-saver'
import FavoriteSwatch from '../Swatch/FavoriteSwatch'
import Logo from '../Logo'
import FavoriteActions from './FavoriteActions'
import { FavoritesContext } from '../FavoritesContext'
import * as Filter from 'bad-words'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
import {
    sortLightness,
    slugify,
    checkInputChars,
    setLocalStorage,
    getLocalStorage,
    makeid,
} from '../../utils/helpers'
import './Favorites.scss'

const Favorites = ({
    currentUser,
    isSidebarVisible,
    handleSidebarToggle,
    transition,
    paletteHasBeenSaved,
    paletteWasExported,
}) => {
    const [isBright, setIsBright] = useState(false)
    const [paletteSaved, setPaletteSaved] = useState(false)
    const { user } = useAuthState(firebase.auth())
    const [paletteName, setPaletteName] = useState('')
    const [paletteNameError, setPaletteNameError] = useState()
    const [paletteErrorMessage, setPaletteErrorMessage] = useState()
    const [accountLevel, setAccountLevel] = useState()
    const [actions, setActions] = useState()
    const [dragEnded, setDragEnded] = useState(false)

    const width = useWindowWidth() // Our custom Hook

    const [paletteLimitModal, togglePaletteLimitModal] = useModali()
    const [upgradeAccountModal, toggleUpgradeAccountModal] = useModali()

    const { favorites, setFavorites, getFavorites } = useContext(
        FavoritesContext
    )

    const filter = new Filter()

    const smallAccounts = ['standard', 'pro']

    const handleBright = () => {
        setLocalStorage('original_favorites', favorites)
        if (!isBright) {
            const brightFaves = sortLightness(favorites)
            setFavorites(brightFaves)
        } else {
            const cachedOriginals = getLocalStorage('original_favorites')
            setFavorites(cachedOriginals)
            getFavorites()
        }
        setIsBright(!isBright)
    }

    useEffect(() => {
        if (favorites.length === 0) {
            setIsBright(false)
        }
    }, [favorites])

    useEffect(() => {
        const cachedOriginals = getLocalStorage('original_favorites')
        if (
            favorites &&
            cachedOriginals &&
            favorites.length !== cachedOriginals.length
        ) {
            setIsBright(false)
        }
    }, [favorites])

    useEffect(() => {
        if (dragEnded) {
            setIsBright(false)
        }
    }, [dragEnded])

    const savePalette = () => {
        const id = makeid(16)
        const bad = filter.isProfane(paletteName)
        if (bad) {
            alert("Don't be a jerk.")
            setPaletteNameError(true)
            return
        }
        if (!paletteName) {
            // alert('Please name your palette')
            setPaletteNameError(true)
            setPaletteErrorMessage('Please name your palette.')
            return
        } else if (!checkInputChars(paletteName)) {
            setPaletteNameError(true)
            setPaletteErrorMessage(
                'Palette names must not contain any special characters. Please use only letters, numbers, or underscores.'
            )
            return
        }
        if (favorites && favorites.length !== 0 && user && paletteName) {
            if (
                currentUser &&
                currentUser.accountType === 'standard' &&
                currentUser.palettes &&
                currentUser.palettes.length === 5
            ) {
                togglePaletteLimitModal(true)
                // alert(
                //     'You may only save 5 palettes with a Standard account. Upgrade to Hexy Pro to save more palettes.'
                // )
                return
            }
            setPaletteNameError(false)
            const date = new Date()

            // console.log(paletteName)

            db.collection('users')
                .doc(user.uid)
                .update({
                    palettes: firebase.firestore.FieldValue.arrayUnion({
                        date: date,
                        name: paletteName,
                        palette: favorites,
                        id: id,
                    }),
                })
                .then(() => {
                    // savePaletteToFeed(date, paletteName, favorites)
                    setPaletteSaved(true)
                    setPaletteName('')
                    setLocalStorage('hexy_user', currentUser)
                })
                .then(
                    setTimeout(() => {
                        setPaletteSaved(false)
                    }, 4000)
                )
                .catch((err) => {
                    console.log('Error saving palette', err)
                })
        }
    }

    const handlePaletteName = (event) => {
        setPaletteName(event.target.value)
    }

    const exportCode = () => {
        if (!user) {
            toggleUpgradeAccountModal(true)
            return
        }
        if (
            currentUser &&
            smallAccounts.indexOf(currentUser.accountType) === 1
        ) {
            toggleUpgradeAccountModal(true)
            return
        }
        if (!paletteName) {
            // alert('Please name your palette')
            setPaletteNameError(true)
            setPaletteErrorMessage('Please name your palette.')
            return
        } else if (paletteName && paletteName.length > 32) {
            // alert('Palette names must be less than 32 characters.')
            setPaletteNameError(true)
            setPaletteErrorMessage(
                'Palette names must be less than 32 characters.'
            )
            return
        } else if (paletteName && !checkInputChars(paletteName)) {
            setPaletteNameError(true)
            setPaletteErrorMessage(
                'Palette names must not contain any special characters. Please use only letters, numbers, or underscores.'
            )
            return
        } else {
            let now = new Date()
            let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')
            let colorArray = favorites.map((fav) => {
                let name = slugify(fav.name)
                // console.log(name)
                return '$' + name + ': ' + fav.hex + ';\r'
            })
            colorArray = colorArray.join('')
            let blob = new Blob([colorArray], {
                type: 'text/plain;charset=utf-8',
            })
            let paletteTitle = slugify(paletteName)
            saveAs(blob, `${paletteTitle}_${dateStringSlug}.txt`)
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.accountType) {
            if (smallAccounts.indexOf(currentUser.accountType) !== 1) {
                setAccountLevel('high')
            }
        }
    }, [currentUser, smallAccounts])

    window.onbeforeunload = () => {
        toggleUpgradeAccountModal(false)
    }

    // useEffect(() => {
    //     let timeout
    //     document.onmousemove = function() {
    //         // console.log('mouse stopped!')
    //         clearTimeout(timeout)
    //         timeout = setTimeout(() => {
    //             setActions(false)
    //         }, 5000)
    //     }
    // })

    const onMouseOver = () => {
        setActions(true)
    }

    // required by hoverIntent but we're not using it
    const onMouseOut = () => {}

    // useEffect(() => {
    //     getFavorites()
    // }, [favorites])

    useEffect(() => {
        let didCancel = true
        const toggleFalse = () => {
            togglePaletteLimitModal(false)
            toggleUpgradeAccountModal(false)
        }
        if (!didCancel) {
            toggleFalse()
        }
        return () => {
            didCancel = false
        }
    }, [])

    const onDragStart = () => {
        setDragEnded(false)

        // disable auto-scrolling of body when dragging
        document.body.style.overflow = 'hidden'
    }

    const onDragEnd = (result) => {
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
        let foundFave = favorites.filter((el) => {
            if (el.hex === id) {
                return el
            }
            return null
        })

        // from dragged element, create object to insert back in array
        let movedObj = {
            name: foundFave[0].name,
            hex: foundFave[0].hex,
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

    // useEffect(() => {
    //     getFavorites()
    // }, [favorites])

    return (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div
                className={`favorites ${
                    isSidebarVisible ? 'active' : 'inactive'
                } ${transition ? 'transition' : ''}${
                    width < 1030 ? 'collapsed' : ''
                }`}
            >
                <div className="favorites-wrap">
                    {width < 1030 && (
                        <span className="close-x" onClick={handleSidebarToggle}>
                            &times;
                        </span>
                    )}
                    <div className="favorites-toolbar">
                        <div className="favorites-heading">Favorites</div>
                        <div className="favorites-info">
                            Drag-and-drop to reorder favorites.
                        </div>
                        <div className="favorites-toolbar-inner">
                            <span className="favorites-sort">
                                <input
                                    type="checkbox"
                                    checked={isBright}
                                    onChange={handleBright}
                                />
                                <label>Sort by brightness</label>
                            </span>

                            <Tooltip
                                // options
                                title="Favorites Actions"
                                position="top"
                                trigger="mouseenter"
                                arrow={true}
                            >
                                <HoverIntent
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                    sensitivity={5}
                                    interval={300}
                                    timeout={0}
                                >
                                    <span
                                        className="actions-trigger"
                                        aria-haspopup="true"
                                        // eslint-disable-next-line jsx-a11y/aria-proptypes
                                        aria-expanded={`${
                                            actions ? 'true' : 'false'
                                        }`}
                                        onClick={() => setActions(true)}
                                        // onMouseEnter={() => setActions(true)}
                                    >
                                        <Ellipsis />
                                    </span>
                                </HoverIntent>
                            </Tooltip>
                            {actions && (
                                <div className="actions-wrap">
                                    <FavoriteActions
                                        user={user && user}
                                        currentUser={currentUser && currentUser}
                                        paletteName={paletteName}
                                        paletteWasExported={paletteWasExported}
                                        setPaletteNameError={
                                            setPaletteNameError
                                        }
                                        savePalette={savePalette}
                                        paletteHasBeenSaved={
                                            paletteHasBeenSaved
                                        }
                                        paletteSaved={paletteSaved}
                                        exportCode={exportCode}
                                        accountLevel={accountLevel}
                                        actions={actions}
                                        setActions={setActions}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="favorite-swatches-wrap">
                        <div className="palette-name">
                            <input
                                className={`palette-name-input ${
                                    paletteNameError ? 'error' : ''
                                }`}
                                value={paletteName}
                                onChange={handlePaletteName}
                                placeholder="Name your palette"
                                pattern="[A-Za-z0-9]"
                                required
                            />
                            {paletteNameError && paletteErrorMessage ? (
                                <span className="error-message">
                                    {paletteErrorMessage}
                                </span>
                            ) : null}
                        </div>

                        <div className="favorites-bar">
                            {favorites.length === 0 && (
                                <div className="favorites-placeholder">
                                    <p>Add some favorite colors.</p>
                                </div>
                            )}
                            <Droppable
                                direction="vertical"
                                droppableId="favorites-droppable"
                            >
                                {(provided) => (
                                    <ul
                                        className="nostyle favorites-list"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {favorites &&
                                            favorites.map((color, index) => {
                                                return (
                                                    <FavoriteSwatch
                                                        key={`${color.hex}-favorite`}
                                                        color={color}
                                                        index={index}
                                                        isFavorite={true}
                                                    />
                                                )
                                            })}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </div>

                        {favorites && favorites.length > 0 && (
                            <div className="favorite-squares">
                                <Droppable
                                    direction="horizontal"
                                    droppableId="favorite-squares-droppable"
                                >
                                    {(provided) => (
                                        <ul
                                            className="nostyle favorite-squares-list"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {favorites &&
                                                favorites.map(
                                                    (color, index) => {
                                                        return (
                                                            <FavoriteSwatch
                                                                key={`${color.hex}-favorite-square`}
                                                                color={color}
                                                                index={index}
                                                                isFavorite={
                                                                    true
                                                                }
                                                                isSquare={true}
                                                            />
                                                        )
                                                    }
                                                )}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {currentUser && togglePaletteLimitModal ? (
                <Modali.Modal
                    {...paletteLimitModal}
                    animated={true}
                    centered={true}
                >
                    <div className="error-message">
                        <div className="error-header">
                            <Logo />
                            <h3>Palette limit reached.</h3>
                        </div>
                        <p>
                            You may only save 5 palettes with a Standard
                            account. Upgrade to <Link to="/pro">Hexy Pro</Link>{' '}
                            to save more palettes.
                        </p>
                        <button className="button">
                            <Link to="/pro">Go Pro</Link>
                        </button>
                    </div>
                </Modali.Modal>
            ) : null}
            {currentUser && toggleUpgradeAccountModal ? (
                <Modali.Modal
                    {...upgradeAccountModal}
                    animated={true}
                    centered={true}
                >
                    <div className="error-message">
                        <div className="error-header">
                            <Logo />
                            <h3>Please upgrade your account.</h3>
                        </div>
                        <p>
                            Exporting to SCSS code is available to Hexy Pro
                            Unlimited and Hexy Pro Lifetime accounts.{' '}
                            <Link
                                to="/pro"
                                onClick={() => toggleUpgradeAccountModal(false)}
                            >
                                Upgrade now
                            </Link>{' '}
                            to export SCSS.
                        </p>
                        <button
                            className="button"
                            onClick={() => toggleUpgradeAccountModal(false)}
                        >
                            <Link to="/pro">Upgrade</Link>
                        </button>
                    </div>
                </Modali.Modal>
            ) : null}
        </DragDropContext>
    )
}

export default Favorites
