import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Swatch from '../Swatch'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import Modali, { useModali } from 'modali'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import moment from 'moment'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Share } from '../../images/share.svg'

const UserPalettes = ({
    history,
    swatchInfo,
    currentUser,
    handleFavorites,
    removeFavorite,
    favorites,
    deletePalette,
    paletteExported,
    setPaletteExported
}) => {
    const [paletteModal, togglePaletteModal] = useModali()

    const sharePalette = (paletteName, palette) => {
        let now = new Date()
        let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')
        let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')

        // console.log(palette)

        let palettes = db.collection('palettes')
        palettes
            .doc(`${paletteName}_${dateStringSlug}`)
            .set({
                date: dateStringWithTime,
                likes: 0,
                name: paletteName,
                pid: `${paletteName}_${dateStringSlug}`,
                palette: palette
            })
            .then(setPaletteExported(true), togglePaletteModal(true))
            .catch(err => {
                console.log('Error saving palette', err)
            })
    }

    const handleLinkClick = () => {
        togglePaletteModal(false)
        setTimeout(() => {
            history.push('/palettes')
        }, 1000)
    }

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
                                        {palette.name && palette.name}
                                    </div>
                                    <div className="palette-utilities-top">
                                        <div className="share-palette">
                                            <Share
                                                onClick={() =>
                                                    sharePalette(
                                                        palette.name,
                                                        palette.palette
                                                    )
                                                }
                                            />
                                        </div>
                                        <FavoritesPDF
                                            favorites={
                                                palette.palette &&
                                                palette.palette
                                            }
                                            paletteName={
                                                palette.name && palette.name
                                            }
                                        />
                                    </div>
                                </div>

                                <ul className="user-palette nostyle">
                                    {palette.palette.map((color, index) => {
                                        return (
                                            <Swatch
                                                key={
                                                    palette.date.seconds +
                                                    color.hex
                                                }
                                                color={color}
                                                index={index}
                                                handleFavorites={
                                                    handleFavorites
                                                }
                                                removeFavorite={removeFavorite}
                                                favorites={favorites}
                                                // isFavorite={isFavorite ? true : false}
                                            />
                                        )
                                    })}
                                </ul>
                                <div className="palette-utilities">
                                    <div className="delete-palette">
                                        <span
                                            className="palette-delete"
                                            onClick={() =>
                                                deletePalette(palette.name)
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
            {paletteExported && (
                <Modali.Modal {...paletteModal} animated={true} centered={true}>
                    <div className="palette-message error-message">
                        <h3>Your palette has been shared!</h3>
                        <p>
                            See it on the{' '}
                            <span
                                className="like-link"
                                onClick={handleLinkClick}
                            >
                                Palettes page
                            </span>
                            .
                        </p>
                    </div>
                </Modali.Modal>
            )}
        </div>
    )
}

export default withRouter(UserPalettes)
