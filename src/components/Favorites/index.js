import React, { useState, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import FavoriteSwatch from '../Swatch/FavoriteSwatch'
import FavoritesPDF from './FavoritesPDF'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { sortLightness } from '../../utils/helpers'
import './Favorites.scss'

const Favorites = ({
    favorites,
    removeFavorite,
    clearFavorites,
    setFavorites,
    getFavorites,
    isSidebarVisible,
    dragEnded
}) => {
    const [isBright, setIsBright] = useState(false)

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
                    <FavoritesPDF favorites={favorites && favorites} />
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
                            <span className="clear-text">Clear</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="favorite-swatches-wrap">
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
            </div>
        </div>
    )
}

export default Favorites
