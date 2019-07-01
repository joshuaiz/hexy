import React from 'react'
import Swatch from '../Swatch'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'

const UserPalettes = ({ swatchInfo, currentUser, handleFavorites, removeFavorite, favorites, deletePalette }) => {
    return (
        <div
            className={`nostyle palettes-list ${
                swatchInfo ? 'no-info' : 'info'
            }`}
        >
            {currentUser &&
                currentUser.palettes
                    .slice(0)
                    .reverse()
                    .map(palette => {
                        return (
                            <div
                                className="palette-wrap"
                                key={palette.date.seconds}
                            >
                                <div className="palette-title-bar">
                                    <div className="palette-name">
                                        {palette.name &&
                                            palette.name}
                                    </div>
                                    <FavoritesPDF
                                        favorites={
                                            palette.palette &&
                                            palette.palette
                                        }
                                        paletteName={
                                            palette.name &&
                                            palette.name
                                        }
                                    />
                                </div>

                                <ul className="user-palette nostyle">
                                    {palette.palette.map(
                                        (color, index) => {
                                            return (
                                                <Swatch
                                                    key={
                                                        palette.date
                                                            .seconds +
                                                        color.hex
                                                    }
                                                    color={color}
                                                    index={index}
                                                    handleFavorites={
                                                        handleFavorites
                                                    }
                                                    removeFavorite={
                                                        removeFavorite
                                                    }
                                                    favorites={
                                                        favorites
                                                    }
                                                    // isFavorite={isFavorite ? true : false}
                                                />
                                            )
                                        }
                                    )}
                                </ul>
                                <div className="palette-utilities">
                                    <div className="delete-palette">
                                        <span
                                            className="palette-delete"
                                            onClick={() =>
                                                deletePalette(
                                                    palette.name
                                                )
                                            }
                                        >
                                            <TimesCircle
                                                style={{
                                                    color: '#f35336'
                                                }}
                                            />
                                            <span className="clear-text">
                                                Delete
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
}

export default UserPalettes