import React from 'react'
import moment from 'moment'
import * as jsPDF from 'jspdf'
import { ReactComponent as Download } from '../../images/download.svg'

const FavoritesPDF = ({ favorites }) => {
    var now = new Date()

    var dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ss a')

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'letter',
        fontSize: 12
    })

    doc.text('Hexy Favorites ' + dateStringWithTime, 1, 0.5)

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
    }

    // doc.save('test.pdf')

    return (
        <div className="favorites-pdf">
            <Download
                className="download-favorites"
                onClick={handlePDF}
                style={{ fill: '#555555' }}
            />
            <span>Save to PDF</span>
        </div>
    )
}

export default FavoritesPDF
