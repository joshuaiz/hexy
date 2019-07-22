import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Tooltip } from 'react-tippy'
import Swatch from '../Swatch'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import Modali, { useModali } from 'modali'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import saveAs from 'file-saver'
import moment from 'moment'
import { slugify } from '../../utils/helpers'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Share } from '../../images/share.svg'
import { ReactComponent as Code } from '../../images/code.svg'
import Logo from '../Logo'

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
    const { user } = useAuthState(firebase.auth())
    const [existing, setExisting] = useState(true)
    const [paletteModal, togglePaletteModal] = useModali()

    const sharePalette = (paletteName, palette) => {
        let now = new Date()
        let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')
        let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')

        // console.log(palette)

        let palettes = db.collection('palettes')

        checkExistingPalette(palettes, palette, paletteName)
    }

    const share = (palettes, palette, paletteName) => {
        let now = new Date()
        let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')
        let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')
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

    const checkExistingPalette = (palettes, palette, paletteName) => {
        let query = palettes
            .where('name', '==', paletteName)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    // console.log('No matching documents.')
                    setExisting(false)
                    share(palettes, palette, paletteName)
                    return
                }

                snapshot.forEach(doc => {
                    // console.log(doc.id, '=>', doc.data())
                    setExisting(true)
                    alert('Palette has already been shared!')
                })
            })
            .then()
            .catch(err => {
                console.log('Error getting documents', err)
            })

        // return query
    }

    const exportCode = (palette, paletteName) => {
        let now = new Date()
        let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')
        let colorArray = palette.map(fav => {
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

    const handleLinkClick = () => {
        togglePaletteModal(false)
        setTimeout(() => {
            history.push('/palettes')
        }, 1000)
    }

    // console.log('existing', existing)

    return (
        <div
            className={`nostyle palettes-list ${
                swatchInfo ? 'no-info' : 'info'
            }`}
        >
            {currentUser &&
                currentUser.palettes &&
                currentUser.palettes.length > 0 &&
                currentUser.palettes
                    .slice(0)
                    .reverse()
                    .map(palette => {
                        // console.log(palette)
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
                                        {palette.palette.length <= 5 && (
                                            <div className="share-palette">
                                                <Tooltip
                                                    // options
                                                    title="Share to public palettes"
                                                    position="top"
                                                    trigger="mouseenter"
                                                    arrow={true}
                                                >
                                                    <Share
                                                        onClick={() =>
                                                            sharePalette(
                                                                palette.name,
                                                                palette.palette
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}

                                        <Tooltip
                                            // options
                                            title="Export to PDF"
                                            position="top"
                                            trigger="mouseenter"
                                            arrow={true}
                                        >
                                            <FavoritesPDF
                                                favorites={
                                                    palette.palette &&
                                                    palette.palette
                                                }
                                                paletteName={
                                                    palette.name && palette.name
                                                }
                                            />
                                        </Tooltip>
                                        {currentUser &&
                                            currentUser.accountType !==
                                                'standard' && (
                                                <div className="export-code">
                                                    <Tooltip
                                                        // options
                                                        title="Export SCSS code"
                                                        position="top"
                                                        trigger="mouseenter"
                                                        arrow={true}
                                                    >
                                                        <span
                                                            className="export-css"
                                                            onClick={() =>
                                                                exportCode(
                                                                    palette.palette,
                                                                    palette.name
                                                                )
                                                            }
                                                        >
                                                            <Code />
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            )}
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
                        <div className="error-header">
                            <Logo />
                            <h3>Your palette has been shared!</h3>
                        </div>
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
