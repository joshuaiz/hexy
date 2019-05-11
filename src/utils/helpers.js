import namedColors from 'color-name-list'
import * as tinycolor from 'tinycolor2'

export function getNumberOfNamedColors() {
    const num = namedColors.length
    return numberWithCommas(num)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function getReadableColor(color) {
    if (color) {
        const readableColor = tinycolor
            .mostReadable(color.hex, ['#FFF', '#000'], {
                includeFallbackColors: true
            })
            .toHexString()
        return readableColor
    }
    return false
}

export function getColorByHex(hex) {
    let namedColor = namedColors.filter((item, index) => {
        if (hex !== '' && item.hex.toLowerCase().includes(hex)) {
            return item
        }
        return null
    })
    return namedColor
}

export function getNamedColor(color) {
    let namedColor = namedColors.filter((item, index) => {
        if (color.hex !== '' && item.hex.toLowerCase().includes(color.hex)) {
            return item
        }

        return null
    })
    return namedColor
}

export function generateRandoms(min, max, numOfRandoms, unique) {
    /* min is the smallest possible generated number */
    /* max is the largest possible generated number */
    /* numOfRandoms is the number of random numbers to generate */
    /* unique is a boolean specifying whether the generated random numbers need to be unique */
    var getRandom = function(x, y) {
        return Math.floor(Math.random() * (x - y + 1) + y)
    }
    var randoms = []
    while (randoms.length < numOfRandoms) {
        var random = getRandom(min, max)
        if (randoms.indexOf(random) === -1 || !unique) {
            randoms.push(random)
        }
    }
    return randoms
}

export function getRandomColors(num) {
    const randoms = generateRandoms(0, namedColors.length, num, true)
    const randomColors = namedColors.filter((d, i) => randoms.indexOf(i) !== -1)

    return randomColors
}

export function sortLightness(colors) {
    const brightSort = colors.sort(function(a, b) {
        let color1 = tinycolor(a.hex)
        let color2 = tinycolor(b.hex)
        return color1.toHsl().l < color2.toHsl().l ? 1 : -1
    })

    return brightSort
}

export function filterColorsBySearchText(text) {
    const filterList = namedColors.filter((item, index) => {
        if (
            (text !== '' && item.name.toLowerCase().includes(text)) ||
            (text !== '' && item.hex.toLowerCase().includes(text))
        ) {
            return item
        } else {
            return false
        }
    })
    return filterList
}

export function getTintsShades(adjustment, color) {
    const adj = adjustment
    // console.log('in getTintsShades', adjustment, color)
    const colors = [{ name: '', hex: color }]
    let shade, tint
    for (let i = 0, n = 10; i < 5; i++, n += 20) {
        // console.log(n)
        if (adj === 'darken') {
            shade = tinycolor.mix(color, 'black', n).toHexString()
            if (!colors.includes(shade)) {
                colors.push({ name: '', hex: shade })
            }
        } else if (adj === 'lighten') {
            tint = tinycolor.mix(color, 'white', n).toHexString()
            // console.log(tint)
            if (!colors.includes(tint)) {
                colors.push({ name: '', hex: tint })
            }
        } else {
            return []
        }
    }
    return colors
}
