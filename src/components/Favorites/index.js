import React, { useState, useEffect, useContext } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import useWindowWidth from '../../hooks/useWindowWidth'
import moment from 'moment'
import saveAs from 'file-saver'
import FavoriteSwatch from '../Swatch/FavoriteSwatch'
import FavoritesPDF from './FavoritesPDF'
// import { FavoritesContext } from './FavoritesContext'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Palette } from '../../images/palette.svg'
import { ReactComponent as Code } from '../../images/code.svg'
import {
    sortLightness,
    slugify,
    checkInputChars,
    setLocalStorage,
    getLocalStorage
} from '../../utils/helpers'
import './Favorites.scss'

const Favorites = ({
    favorites,
    removeFavorite,
    clearFavorites,
    setFavorites,
    getFavorites,
    isSidebarVisible,
    handleSidebarToggle,
    transition,
    dragEnded,
    paletteHasBeenSaved,
    paletteWasExported
}) => {
    const [isBright, setIsBright] = useState(false)
    const [paletteSaved, setPaletteSaved] = useState(false)
    const { initialising, user } = useAuthState(firebase.auth())
    const [paletteName, setPaletteName] = useState('')
    const [paletteNameError, setPaletteNameError] = useState()
    const [paletteErrorMessage, setPaletteErrorMessage] = useState()

    const width = useWindowWidth() // Our custom Hook

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
            setPaletteNameError(false)
            const date = new Date()

            // console.log(paletteName)

            db.collection('users')
                .doc(user.uid)
                .update({
                    palettes: firebase.firestore.FieldValue.arrayUnion({
                        date: date,
                        name: paletteName,
                        palette: favorites
                    })
                })
                .then(() => {
                    // savePaletteToFeed(date, paletteName, favorites)
                    setPaletteSaved(true)
                    setPaletteName('')
                })
                .then(
                    setTimeout(() => {
                        setPaletteSaved(false)
                    }, 4000)
                )
                .catch(err => {
                    console.log('Error saving palette', err)
                })
        }
    }

    // const savePaletteToFeed = (date, paletteName, favorites) => {
    //     let palettes = db.collection('palettes')
    //     palettes
    //         // .doc(`palette/${id}`)
    //         .add({
    //             date: date,
    //             name: paletteName,
    //             palette: favorites
    //         })
    //         .catch(err => {
    //             console.log('Error saving palette', err)
    //         })
    // }

    const handlePaletteName = event => {
        setPaletteName(event.target.value)
    }

    const exportCode = () => {
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
            let colorArray = favorites.map(fav => {
                let name = slugify(fav.name)
                // console.log(name)
                return '$' + name + ': ' + fav.hex + ';\r'
            })
            colorArray = colorArray.join('')
            let blob = new Blob([colorArray], {
                type: 'text/plain;charset=utf-8'
            })
            let paletteTitle = slugify(paletteName)
            saveAs(blob, `${paletteTitle}_${dateStringSlug}.txt`)
        }
    }

    return (
        <div
            className={`favorites ${isSidebarVisible ? 'active' : 'inactive'} ${
                transition ? 'transition' : ''
            }${width < 1030 ? 'collapsed' : ''}`}
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
                        <div className="favorites-sort">
                            <input
                                type="checkbox"
                                checked={isBright}
                                onChange={handleBright}
                            />
                            <label>Sort by brightness</label>
                        </div>
                        <FavoritesPDF
                            favorites={favorites && favorites}
                            paletteName={paletteName && paletteName}
                            paletteWasExported={paletteWasExported}
                            setPaletteNameError={setPaletteNameError}
                        />
                        <div className="save-palette">
                            {user && user ? (
                                <span
                                    className="save-icon"
                                    onClick={() => {
                                        savePalette()
                                        paletteHasBeenSaved()
                                    }}
                                >
                                    <Palette style={{ color: '#555555' }} />
                                    <span className="save-text">
                                        {paletteSaved
                                            ? 'Palette saved!'
                                            : 'Save Palette'}
                                    </span>
                                </span>
                            ) : null}
                        </div>
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
                            {provided => (
                                <ul
                                    className="nostyle favorites-list"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {favorites &&
                                        favorites.map((color, index) => {
                                            return (
                                                <FavoriteSwatch
                                                    key={`${
                                                        color.hex
                                                    }-favorite`}
                                                    color={color}
                                                    index={index}
                                                    isFavorite={true}
                                                    removeFavorite={
                                                        removeFavorite
                                                    }
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
                                {provided => (
                                    <ul
                                        className="nostyle favorite-squares-list"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {favorites &&
                                            favorites.map((color, index) => {
                                                return (
                                                    <FavoriteSwatch
                                                        key={`${
                                                            color.hex
                                                        }-favorite-square`}
                                                        color={color}
                                                        index={index}
                                                        isFavorite={true}
                                                        removeFavorite={
                                                            removeFavorite
                                                        }
                                                        isSquare={true}
                                                    />
                                                )
                                            })}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </div>
                    )}
                    <div className="bottom-utilities">
                        {user && user ? (
                            <div className="export-code">
                                <span
                                    className="export-css"
                                    onClick={exportCode}
                                >
                                    <Code />
                                    <span className="export-text">
                                        Export SCSS
                                    </span>
                                </span>
                            </div>
                        ) : null}
                        <div className="clear-fav">
                            <span
                                className="clear-favorites"
                                onClick={clearFavorites}
                            >
                                <TimesCircle
                                    style={{
                                        color: '#f35336'
                                    }}
                                />
                                <span className="clear-text">
                                    Clear Favorites
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Favorites
