import React, { useState, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import FavoriteSwatch from '../Swatch/FavoriteSwatch'
import FavoritesPDF from './FavoritesPDF'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Palette } from '../../images/palette.svg'
import { sortLightness } from '../../utils/helpers'
import './Favorites.scss'

const Favorites = ({
    favorites,
    removeFavorite,
    clearFavorites,
    setFavorites,
    getFavorites,
    isSidebarVisible,
    dragEnded,
    paletteHasBeenSaved,
    paletteWasExported
}) => {
    const [isBright, setIsBright] = useState(false)
    const [paletteSaved, setPaletteSaved] = useState(false)
    const { initialising, user } = useAuthState(firebase.auth())
    const [paletteName, setPaletteName] = useState('')
    const [paletteNameError, setPaletteNameError] = useState()

    // console.log(user)

    const handleBright = () => {
        localStorage.setItem('original_favorites', JSON.stringify(favorites))
        if (!isBright) {
            const brightFaves = sortLightness(favorites)
            setFavorites(brightFaves)
        } else {
            const cachedOriginals = localStorage.getItem('original_favorites')
            const parsedOriginals = JSON.parse(cachedOriginals)
            setFavorites(parsedOriginals)
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
        const cachedOriginals = localStorage.getItem('original_favorites')
        const parsedOriginals = JSON.parse(cachedOriginals)
        if (
            favorites &&
            parsedOriginals &&
            favorites.length !== parsedOriginals.length
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
            alert('Please name your palette')
            setPaletteNameError(true)
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

    return (
        <div
            className={`favorites ${isSidebarVisible ? 'active' : 'inactive'}`}
        >
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
                                                key={`${color.hex}-favorite`}
                                                color={color}
                                                index={index}
                                                isFavorite={true}
                                                removeFavorite={removeFavorite}
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
                <div className="clear-fav">
                    <span className="clear-favorites" onClick={clearFavorites}>
                        <TimesCircle
                            style={{
                                color: '#f35336'
                            }}
                        />
                        <span className="clear-text">Clear Favorites</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Favorites
