import React from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import * as jsPDF from 'jspdf'
import { ReactComponent as Download } from '../../images/download.svg'
import { SFProHB } from '../../fonts/SFProHB'
import { SFProM } from '../../fonts/SFProM'

const PalettePDF = ({ palette, paletteName }) => {
    let now = new Date()

    let dateStringWithTime = moment(now).format('YYYY-MM-DD h:mm:ssa')

    let name = paletteName

    // console.log('paletteWasExported FavoritesPDF', paletteWasExported)

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'letter',
        fontSize: 12
    })

    // define custom font
    doc.addFileToVFS('SFProHB.ttf', SFProHB)

    doc.addFont('SFProHB.ttf', 'SFProHB', 'Bold')

    doc.setFont('SFProHB', 'Bold')

    doc.setFontSize(18)

    doc.text(`Hexy Palette${name ? ': ' + name : ''}`, 1, 0.5)

    doc.setTextColor(170, 170, 170)

    doc.text(dateStringWithTime, 7, 0.5)

    doc.addFileToVFS('SFProM.ttf', SFProM)

    doc.addFont('SFProM.ttf', 'SFProM', 'Normal')

    doc.setFont('SFProM', 'Normal')

    doc.setFontSize(11)

    doc.setTextColor(85, 85, 85)

    let n = palette && palette.length
    // let n = 5

    // let i = 0

    const yValues = [1, 3.5, 6]

    if (palette && palette.length) {
        for (let i = 0; i < n && i < 15; i++) {
            const x = 1 + (i % 5) * 1.875
            const y = yValues[Math.floor(i / 5)]
            doc.setFillColor(palette[i].hex)
            doc.rect(x, y, 1.5, 1, 'F')
            doc.text(palette[i].name.toString(), x, y + 1.25)
            doc.text(palette[i].hex.toString(), x, y + 1.5)
        }
    }

    function handlePDF() {
        doc.save('HexyPalette.pdf')
    }

    return (
        <div className="favorites-pdf">
            <Download
                className="download-favorites"
                // onClick={handlePDF}
                onClick={handlePDF}
                style={{ fill: '#555555' }}
            />
            <span>Export to PDF</span>
        </div>
    )
}

export default withRouter(PalettePDF)
