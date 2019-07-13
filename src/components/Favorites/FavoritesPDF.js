import React, { useState, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import Modali, { useModali } from 'modali'
import * as Filter from 'bad-words'
import moment from 'moment'
import * as jsPDF from 'jspdf'
import { db } from '../../config/firebaseconfig'
import { checkInputChars } from '../../utils/helpers'
import { ReactComponent as Download } from '../../images/download.svg'

const FavoritesPDF = ({
    history,
    favorites,
    currentUser,
    paletteName,
    fromFeed,
    paletteWasExported,
    setPaletteNameError
}) => {
    const { user } = useAuthState(firebase.auth())
    const [accountError, setAccountError] = useState(false)
    const [accountModal, toggleAccountModal] = useModali({
        onHide: () => setAccountError(false)
    })

    let now = new Date()

    let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')

    let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')

    let name = paletteName

    const filter = new Filter()

    // console.log('paletteWasExported FavoritesPDF', paletteWasExported)

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'letter',
        fontSize: 12
    })

    doc.text(
        `Hexy Favorites ${dateStringWithTime}${name ? ': ' + name : ''}`,
        1,
        0.5
    )

    let n = favorites.length

    // let i = 0

    const yValues = [1, 3.5, 6]

    for (let i = 0; i < n && i < 15; i++) {
        const x = 1 + (i % 5) * 1.875
        const y = yValues[Math.floor(i / 5)]
        doc.setFillColor(favorites[i].hex)
        doc.rect(x, y, 1.5, 1, 'F')
        doc.text(favorites[i].name.toString(), x, y + 1.25)
        doc.text(favorites[i].hex.toString(), x, y + 1.5)
    }

    function handlePDF() {
        const bad = filter.isProfane(paletteName)
        if (bad) {
            alert("Don't be a jerk.")
            setPaletteNameError(true)
            return
        }
        if (!user) {
            setAccountError(true)
            toggleAccountModal(true)
            return
        }
        if (!paletteName) {
            alert('Please name your palette')
            setPaletteNameError(true)
            return
        } else if (paletteName && paletteName.length > 32) {
            alert('Palette names must be less than 32 characters.')
            setPaletteNameError(true)
            return
        } else if (paletteName && !checkInputChars(paletteName)) {
            setPaletteNameError(true)
            return
        } else {
            doc.save('HexyFavorites.pdf')
            if (
                user &&
                currentUser &&
                currentUser.accountType === 'standard' &&
                !fromFeed
            ) {
                savePaletteToFeed()
                paletteWasExported()
            }
        }
    }

    const savePaletteToFeed = () => {
        if (!paletteName) {
            alert('Please name your palette')
            setPaletteNameError(true)
            return
        } else if (paletteName && paletteName.length > 32) {
            alert(
                'Palette names must be less than 32 characters. Please rename your palette.'
            )
            return
        } else if (paletteName && paletteName.length <= 32) {
            let palettes = db.collection('palettes')
            palettes
                .doc(`${paletteName}_${dateStringSlug}`)
                .set({
                    date: dateStringWithTime,
                    likes: 0,
                    name: paletteName,
                    pid: `${paletteName}_${dateStringSlug}`,
                    palette: favorites
                })
                .catch(err => {
                    console.log('Error saving palette', err)
                })
        } else {
            alert('Sorry your palette could not be exported. Please try again.')
        }
    }

    // doc.save('test.pdf')

    const handleButtonClick = () => {
        toggleAccountModal(false)
        setAccountError(false)
        setTimeout(() => {
            history.push('/account')
        }, 500)
    }

    const handleLinkClick = () => {
        toggleAccountModal(false)
        setAccountError(false)
        setTimeout(() => {
            history.push('/pro')
        }, 500)
    }

    window.onbeforeunload = () => {
        toggleAccountModal(false)
        setAccountError(false)
    }

    return (
        <Fragment>
            <div className="favorites-pdf">
                <Download
                    className="download-favorites"
                    // onClick={handlePDF}
                    onClick={handlePDF}
                    style={{ fill: '#555555' }}
                />
                <span>Export to PDF</span>
            </div>
            {accountError && (
                <Modali.Modal {...accountModal} animated={true} centered={true}>
                    <div className="error-message">
                        <h3>
                            Exporting palettes requires a (free) Hexy account.
                        </h3>
                        <p>
                            <button
                                className="button"
                                onClick={handleButtonClick}
                            >
                                Log In/Sign Up
                            </button>
                        </p>
                        <p>
                            See{' '}
                            <span
                                className="like-link"
                                onClick={handleLinkClick}
                            >
                                Hexy account levels and pricing &rarr;
                            </span>
                            .
                        </p>
                    </div>
                </Modali.Modal>
            )}
        </Fragment>
    )
}

export default withRouter(FavoritesPDF)
