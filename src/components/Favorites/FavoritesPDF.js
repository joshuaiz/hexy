import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import moment from 'moment'
import * as jsPDF from 'jspdf'
import { db } from '../../config/firebaseconfig'
import { ReactComponent as Download } from '../../images/download.svg'

const FavoritesPDF = ({ favorites, paletteName }) => {
    const { user } = useAuthState(firebase.auth())
    let now = new Date()

    let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')

    let dateStringSlug = moment(now).format('YYYY-MM-DD_hmmss')

    let name = paletteName

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
        doc.save('HexyFavorites.pdf')
        if (!user) {
            savePaletteToFeed()
        }
    }

    const savePaletteToFeed = () => {
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
    }

    // doc.save('test.pdf')

    return (
        <div className="favorites-pdf">
            <Download
                className="download-favorites"
                onClick={handlePDF}
                style={{ fill: '#555555' }}
            />
            <span>Export to PDF</span>
        </div>
    )
}

export default FavoritesPDF
