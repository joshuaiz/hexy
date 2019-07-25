import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Tooltip } from 'react-tippy'
import Swatch from '../Swatch'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import Modali, { useModali } from 'modali'
import * as emailjs from 'emailjs-com'
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
import { ReactComponent as Links } from '../../images/link.svg'
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
    // const { user } = useAuthState(firebase.auth())
    const [existing, setExisting] = useState(true)
    const [paletteModal, togglePaletteModal] = useModali()
    const [upgradeAccountModal, toggleUpgradeAccountModal] = useModali()
    const [accountLevel, setAccountLevel] = useState()
    const [paletteLink, setPaletteLink] = useState('')
    const [sharedPalette, setSharedPalette] = useState()
    const [paletteLinkModal, togglePaletteLinkModal] = useModali()

    const smallAccounts = ['standard', 'pro']

    const sharePalette = (paletteName, palette) => {
        let palettes = db.collection('palettes')

        checkExistingPalette(palettes, palette, paletteName)
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
            .then(
                setPaletteExported(true),
                togglePaletteModal(true),
                sendPaletteEmail(paletteName, dateStringWithTime)
            )
            .catch(err => {
                console.log('Error saving palette', err)
            })
    }

    const sendPaletteEmail = (paletteName, date) => {
        console.log('in sendPaletteEmail')
        let template_params = {
            reply_to: 'reply_to_value',
            from_name: 'Hexy Palettes',
            message_html: `The palette <strong>${paletteName}</strong> was shared at ${date} on the
            hexy.io palette feed.`
        }

        const service_id = 'amazon_ses'
        const template_id = 'template_gUmNRWxO'
        // emailjs.send(service_id, template_id, template_params)
        emailjs.send(
            service_id,
            template_id,
            template_params,
            'user_mYvJGRsrKMRCCnsNFWefR'
        )
    }

    const exportCode = (palette, paletteName) => {
        if (
            currentUser &&
            smallAccounts.indexOf(currentUser.accountType) === 1
        ) {
            toggleUpgradeAccountModal(true)
            return
        }
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

    useEffect(() => {
        if (currentUser && currentUser.accountType) {
            if (smallAccounts.indexOf(currentUser.accountType) !== 1) {
                setAccountLevel('high')
            }
        }
    }, [currentUser, smallAccounts])

    const shareLink = palette => {
        const id = palette.id
        // // console.log(randomString)
        let now = new Date()
        let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')

        let sharedPalettes = db.collection('shared_palettes')
        // let sharedPalette = db.collection('shared_palettes').doc(id)

        sharedPalettes
            .doc(id)
            .set({
                date: dateStringWithTime,
                name: palette.name,
                id: id,
                palette: palette
            })
            .then(
                setPaletteLink(`/palette/${id}`),
                setSharedPalette(palette),
                togglePaletteLinkModal(true)
            )
            .catch(err => {
                console.log('Error saving palette', err)
            })
    }

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
                                        <div className="share-link">
                                            <Tooltip
                                                // options
                                                title="Get shareable link"
                                                position="top"
                                                trigger="mouseenter"
                                                arrow={true}
                                            >
                                                <span
                                                    className={`export-css ${
                                                        accountLevel &&
                                                        accountLevel === 'high'
                                                            ? 'enabled'
                                                            : 'disabled'
                                                    }`}
                                                    onClick={() =>
                                                        shareLink(palette)
                                                    }
                                                >
                                                    <Links />
                                                </span>
                                            </Tooltip>
                                        </div>
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

                                        <div className="export-code">
                                            <Tooltip
                                                // options
                                                title="Export SCSS code"
                                                position="top"
                                                trigger="mouseenter"
                                                arrow={true}
                                            >
                                                <span
                                                    className={`export-css ${
                                                        accountLevel &&
                                                        accountLevel === 'high'
                                                            ? 'enabled'
                                                            : 'disabled'
                                                    }`}
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
                        Unlimited and Hexy Pro Lifetime accounts.
                        <Link to="/pro">Upgrade now</Link> to export SCSS.
                    </p>
                    <button className="button">
                        <Link to="/pro">Upgrade</Link>
                    </button>
                </div>
            </Modali.Modal>
            <Modali.Modal {...paletteLinkModal} animated={true} centered={true}>
                <div className="error-message">
                    <div className="error-header">
                        <Logo />
                        <h3>Your shareable palette link.</h3>
                    </div>
                    <p>Anyone with this link can view your palette:</p>
                    <p>
                        <Link
                            to={{
                                pathname: paletteLink,
                                palette: sharedPalette,
                                userId: currentUser && currentUser.uid
                            }}
                        >
                            {`${window.location.origin.toString()}${paletteLink}`}
                        </Link>
                    </p>
                </div>
            </Modali.Modal>
        </div>
    )
}

export default withRouter(UserPalettes)
