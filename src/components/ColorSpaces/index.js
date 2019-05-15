import React from 'react'
import * as tinycolor from 'tinycolor2'
import * as convert from 'color-convert'
import { rgbToXYZ, xyzToHunterLab, hexToCMYK } from '../../utils/helpers'

const ColorSpaces = ({ hexColor }) => {
    const hexNum = hexColor.substring(1)
    const hex = tinycolor(hexColor)

    const rgbColorObject = hex.toRgb()
    const hslColorObject = hex.toHsl() // { h: 0, s: 1, l: 0.5, a: 1 }
    const hsvColorObject = hex.toHsv()

    const rgbColorList = colorList(rgbColorObject)
    const hslColorList = colorList(hslColorObject)
    const hsvColorList = colorList(hsvColorObject)

    const rgb = hex.toRgb()
    const rgbArray = Object.values(rgb)
    const rgbArrayNoAlpha = rgbArray.slice(0, -1)
    const rgb100 = hex.toPercentageRgb()
    const rgbString = hex.toPercentageRgbString()
    const hslString = hex.toHslString()
    const hsvString = hex.toHsvString()

    const colorXYZ = rgbToXYZ(rgb)
    // const colorARGB = xyzToAdobeRGB(colorXYZ)
    const colorHLAB = xyzToHunterLab(colorXYZ)
    const colorCieLAB = convert.hex.lab(hexColor)
    // const colorRgbCmyk = convert.rgb.cmyk(rgbArrayNoAlpha)
    // // const colorHexCmyk = convert.hex.cmyk(hexColor)
    const colorHexCmyk = hexToCMYK(hexColor)
    // const colorHwb = convert.hex.hwb(hexColor)
    // const colorAnsi = convert.hex.ansi16(hexColor)
    // const colorKey = convert.hex.keyword(hexColor)
    // const colorDec = base.hex2dec(hexNum)
    // const colorBin = base.hex2bin(hexNum)
    // const colorOct = base.hex2oct(hexNum)

    const hlabColorList = colorList(colorHLAB)
    const cieColorList = colorList(colorCieLAB)

    const cmykColorList = colorList(colorHexCmyk)

    const cmyk100 = cmykPercent(colorHexCmyk)

    function colorList(obj) {
        const colorList = Object.keys(obj).map((key, index) => {
            let color = obj[key]
            let property = key.toUpperCase()
            if (obj === hslColorObject || obj === hsvColorObject) {
                if (color > 1) {
                    color = Math.round(color)
                } else if (color < 1) {
                    color = Math.round(color * 100)
                }
            }
            return (
                <ColorList
                    property={property}
                    key={key + index}
                    index={index}
                    color={color}
                />
            )
        })
        return colorList
    }

    function cmykPercent(obj) {
        let colorlist = Object.keys(obj).map((key, index) => {
            let color = obj[key]
            let property = key.toUpperCase()
            return (
                <CMYKPercentList
                    property={property}
                    key={key + index}
                    index={index}
                    color={color}
                />
            )
        })
        return colorlist
    }

    const rgb100List = Object.keys(rgb100).map((key, index) => {
        let color = rgb100[key]
        let property = key.toUpperCase()
        return (
            <PercentList
                property={property}
                key={key + index}
                index={index}
                color={color}
            />
        )
    })

    const readable = tinycolor
        .mostReadable(hexColor, ['#17181c', '#f2f1e6', '#fedf00'], {
            includeFallbackColors: true,
            level: 'AAA',
            size: 'large'
        })
        .toHexString()

    const colorStringStyle = {
        background: hexColor,
        color: readable
    }

    return (
        <div className="color-codes-outer color-section">
            <h3>Color Spaces</h3>
            <div className="color-codes">
                <div className="rgb-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>RGB</strong>
                        </span>
                        &nbsp;&nbsp;{rgbString}
                    </div>
                    <div className="color-lists">
                        <ul className="rgb-colors nostyle colorlist">
                            {rgbColorList}
                        </ul>
                        <ul className="rgb-100 nostyle percent-list">
                            {rgb100List}
                        </ul>
                    </div>
                </div>
                <div className="cmyk-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>CMYK</strong>
                        </span>
                        &nbsp;&nbsp;{null}
                    </div>
                    <div className="color-lists">
                        <ul className="cmyk-colors nostyle colorlist">
                            {cmykColorList}
                        </ul>
                        <ul className="rgb-100 nostyle percent-list">
                            {cmyk100}
                        </ul>
                    </div>
                </div>
                <div className="hsl-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>HSL</strong>
                        </span>
                        &nbsp;&nbsp;{hslString}
                    </div>
                    <div className="color-lists">
                        <ul className="hsl-colors nostyle colorlist">
                            {hslColorList}
                        </ul>
                    </div>
                </div>
                <div className="hslv-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>HSV</strong>
                        </span>
                        &nbsp;&nbsp;{hsvString}
                    </div>
                    <div className="color-lists">
                        <ul className="hsv-colors nostyle colorlist">
                            {hsvColorList}
                        </ul>
                    </div>
                </div>
                <div className="hlab-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>HLAB</strong>
                        </span>
                    </div>
                    <div className="color-lists">
                        <ul className="hsv-colors nostyle colorlist">
                            {hlabColorList}
                        </ul>
                    </div>
                </div>
                <div className="hlab-color color-code">
                    <div className="color-string" style={colorStringStyle}>
                        <span>
                            <strong>CIE Lab</strong>
                        </span>
                    </div>
                    <div className="color-lists">
                        <ul className="hsv-colors nostyle colorlist">
                            {cieColorList}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ColorSpaces

const ColorList = ({ property, index, color }) => {
    return (
        <li>
            <span className="color-property">{property.toUpperCase()}</span>:{' '}
            <span className="color-data">{Math.round(color)}</span>
        </li>
    )
}

const PercentList = ({ property, index, color }) => {
    let num = color.toString().replace('%', '')
    // const num = color.slice(-1)

    return (
        <li>
            <span className="color-property">{property.toUpperCase()}</span>:{' '}
            <div className="color-100-data">
                <span
                    className={`data-100 data-${property}`}
                    style={{ width: num + 'px' }}
                />
            </div>
            <span className="color-100-percent">{color}</span>
        </li>
    )
}

const CMYKPercentList = ({ property, index, color }) => {
    let num = Math.round(color).toString()
    // const num = color.slice(-1)

    return (
        <li className="cmyk-percent">
            <span className="color-property">{property.toUpperCase()}</span>:{' '}
            <div className="color-100-data">
                <span
                    className={`data-100 data-${property}`}
                    style={{ width: num + 'px' }}
                />
            </div>
            <span className="color-100-percent">{num + '%'}</span>
        </li>
    )
}
