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
    const readableColor = tinycolor
        .mostReadable(color.hex, ['#FFF', '#000'], {
            includeFallbackColors: true
        })
        .toHexString()
    return readableColor
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

export function getRandomColors() {
    const randoms = generateRandoms(0, namedColors.length, 1000, true)
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
