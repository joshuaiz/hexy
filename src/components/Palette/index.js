import React, { useState, useEffect, useCallback } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Tippy from '@tippy.js/react'
import { Tooltip } from 'react-tippy'
import { db } from '../../config/firebaseconfig'
import * as firebase from 'firebase/app'
import Swatch from '../Swatch'
import PalettePDF from './PalettePDF'
import { getPalettes } from '../../utils/user'
import { getLocalStorage, setLocalStorage } from '../../utils/helpers'
import { ReactComponent as Copy } from '../../images/copy.svg'
import { ReactComponent as AddFavorites } from '../../images/add_favorites.svg'
import { ReactComponent as RemoveFavorites } from '../../images/remove_favorites.svg'
import './Palette.scss'

const Palette = React.memo(
    ({
        location,
        favorites,
        handleFavorites,
        removeFavorite,
        handleAddPaletteToFavorites,
        getFavorites
    }) => {
        const [currentPalette, setCurrentPalette] = useState()
        const [copySuccess, setCopySuccess] = useState(false)
        const [added, setAdded] = useState(false)

        const localAddedPalettes = getLocalStorage('hexy_added_palettes')
        const localFavorites = getLocalStorage('hexy_favorites')

        const url = location.pathname
        const paletteID = url.split('/').pop()
        const sharedPalette = db.collection('shared_palettes').doc(paletteID)

        const paletteLink =
            window.location.origin.toString() + location.pathname

        const getPalette = useCallback(() => {
            let didCancel = false
            let getDoc = sharedPalette
                .get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('No such document!')
                    } else {
                        // console.log('Document data:', doc.data())
                        if (!didCancel) {
                            setCurrentPalette(doc.data())
                        }
                    }
                })
                .catch(err => {
                    console.log('Error getting document', err)
                })

            return () => {
                didCancel = true
            }
        }, [])

        const copyPaletteLink = () => {
            navigator.clipboard.writeText(paletteLink)
            setCopySuccess(true)
            setTimeout(() => {
                setCopySuccess(false)
            }, 1000)
        }

        const handleAddPaletteState = item => {
            const localAddedPalettes = getLocalStorage('hexy_added_palettes')

            let addedPalette = {
                name: item.name,
                pid: item.pid
            }

            if (localFavorites && localFavorites.length === 15) {
                return
            }

            if (localAddedPalettes && localAddedPalettes.length) {
                const found = localAddedPalettes.some(
                    el => el.name === item.name
                )
                if (!found) {
                    const newPalettes = [
                        ...localAddedPalettes,
                        { ...addedPalette }
                    ]
                    setLocalStorage('hexy_added_palettes', newPalettes)
                    setAdded(true)
                } else {
                    let filteredPalettes = localAddedPalettes.filter(
                        el => el.name !== item.name
                    )
                    setLocalStorage('hexy_added_palettes', filteredPalettes)
                    setAdded(false)
                }
            } else if (!localAddedPalettes || localAddedPalettes.length === 0) {
                setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
                setAdded(true)
            }
        }

        useEffect(() => {
            if (
                localAddedPalettes &&
                localAddedPalettes.length &&
                currentPalette
            ) {
                let foundPalette = localAddedPalettes.some(
                    el => el.name === currentPalette.name
                )
                if (foundPalette) {
                    setAdded(true)
                }
            } else {
                setAdded(false)
            }
        }, [localAddedPalettes, setAdded, added])

        // const getPalette = () => {
        //     let getDoc = sharedPalette
        //         .get()
        //         .then(doc => {
        //             if (!doc.exists) {
        //                 console.log('No such document!')
        //             } else {
        //                 // console.log('Document data:', doc.data())

        //                 setCurrentPalette(doc.data())
        //             }
        //         })
        //         .catch(err => {
        //             console.log('Error getting document', err)
        //         })
        // }

        useEffect(() => {
            getPalette()
        }, [])

        useEffect(() => {
            getFavorites()
        }, [favorites, getFavorites])

        return (
            <div className="palette-page">
                <Link to="/account">&larr; Back to Account Page</Link>
                <h1>
                    Hexy Palette:{' '}
                    <span className="palette-name">
                        {currentPalette && currentPalette.name}
                    </span>{' '}
                    <span className="palette-date">
                        {currentPalette && currentPalette.date}
                    </span>{' '}
                </h1>
                <div className="palette-meta">
                    <div className="palette-link">
                        <strong>Link:</strong>{' '}
                        <a href={paletteLink}>{paletteLink}</a>
                        <Tippy
                            // options
                            content={
                                copySuccess
                                    ? `Link copied!`
                                    : 'Copy palette link'
                            }
                            placement="top"
                            trigger="mouseenter"
                            size="small"
                            delay={[0, 1000]}
                            distance={5}
                            arrow={true}
                            offset="0, 10"
                            hideOnClick="toggle"
                        >
                            <span
                                className="copy-hex"
                                onClick={copyPaletteLink}
                            >
                                <Copy />
                            </span>
                        </Tippy>
                    </div>
                    <span className="slash">&#47;</span>
                    <Tooltip
                        // options
                        title="Export to PDF"
                        // position="top"
                        // offset={-15}
                        distance={-10}
                        trigger="mouseenter"
                        arrow={true}
                    >
                        <PalettePDF
                            palette={
                                currentPalette && currentPalette.palette.palette
                            }
                            paletteName={currentPalette && currentPalette.name}
                        />
                    </Tooltip>
                    <span className="slash">&#47;</span>
                    <div className="add-favorites">
                        <Tippy
                            // options
                            content={`${
                                added
                                    ? 'Remove palette colors from Favorites'
                                    : 'Add palette colors to Favorites'
                            }`}
                            placement="top"
                            trigger="mouseenter"
                            size="small"
                            distance={20}
                            arrow={true}
                        >
                            <span
                                className={`add-favorites-wrap ${
                                    added ? 'added' : 'not-added'
                                }`}
                                onClick={() => {
                                    handleAddPaletteToFavorites(
                                        currentPalette &&
                                            currentPalette.palette.palette
                                    )
                                    handleAddPaletteState(currentPalette)
                                }}
                            >
                                {added ? <RemoveFavorites /> : <AddFavorites />}
                            </span>
                        </Tippy>
                    </div>
                </div>

                <ul className="user-palette nostyle">
                    {currentPalette &&
                        currentPalette.palette.palette.map((color, index) => {
                            return (
                                <Swatch
                                    key={color.hex}
                                    color={color}
                                    index={index}
                                    handleFavorites={handleFavorites}
                                    removeFavorite={removeFavorite}
                                    favorites={favorites}
                                />
                            )
                        })}
                </ul>
            </div>
        )
    }
)

// Palette.whyDidYouRender = true

export default withRouter(Palette)
