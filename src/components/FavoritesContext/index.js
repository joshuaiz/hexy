import React, { useState, useEffect, useCallback } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import Modali, { useModali } from 'modali'
import {
    getLocalStorage,
    setLocalStorage,
    getNumberOfFavorites,
    arrayDiffByKey,
    favoritesErrorContent
} from '../../utils/helpers'

const FavoritesContext = React.createContext()

const FavoritesContextWrapper = ({ currentUser, ...props }) => {
    const [favorites, setFavorites] = useState([])
    const [favoritesError, setFavoritesError] = useState(false)
    const [favErrorContent, setFavErrorContent] = useState()
    const [errorModal, toggleErrorModal] = useModali()
    const { user } = useAuthState(firebase.auth())

    let found

    const numFaves = getNumberOfFavorites(currentUser && currentUser)

    const getFavorites = useCallback(() => {
        const cachedFavorites = getLocalStorage('hexy_favorites')
        if (cachedFavorites) {
            setFavorites(cachedFavorites)
        } else {
            setFavorites([])
        }
    }, [])

    const handleFavorites = color => {
        if (!color) {
            return
        }
        if (favorites && favorites.length) {
            // check if color is already a favorite
            found = checkIfFavorite(color)
        }
        if (!found && !favorites.length) {
            let newFavorites = [color, ...favorites]
            setFavorites(newFavorites)
            setLocalStorage('hexy_favorites', newFavorites)
        } else if (user && !found && favorites.length < numFaves) {
            let newFavorites = [color, ...favorites]
            setFavorites(newFavorites)
            setLocalStorage('hexy_favorites', newFavorites)
        } else if (user && favorites && favorites.length === numFaves) {
            setFavoritesError(true)
            toggleErrorModal(true)
        } else if (!user && !found && favorites.length < 5) {
            let newFavorites = [color, ...favorites]
            setFavorites(newFavorites)
            setLocalStorage('hexy_favorites', newFavorites)
        } else if (!user && favorites && favorites.length === 5) {
            setFavoritesError(true)
            toggleErrorModal(true)
        }
    }

    const checkIfFavorite = color => {
        if (favorites && favorites.length) {
            // check if color is already a favorite
            found = favorites.some(el => el.hex === color.hex)
            // console.log(found, color.hex)
            // setFound(newFound)
        }
        return found
    }

    const removeFavorite = useCallback(
        color => {
            if (!color || !favorites) {
                return
            }
            let filteredFavorites = favorites.filter(
                item => item.hex !== color.hex
            )
            if (!filteredFavorites.length) {
                clearFavorites()
            } else {
                setFavorites(filteredFavorites)
                setLocalStorage('hexy_favorites', filteredFavorites)
            }
        },
        [favorites]
    )

    const clearFavorites = () => {
        setFavorites([])
        localStorage.removeItem('hexy_favorites')
        localStorage.removeItem('hexy_added_palettes')
    }

    const handleAddPaletteToFavorites = useCallback(
        palette => {
            const localAddedPalettes = getLocalStorage('hexy_added_palettes')
            const localFavorites = getLocalStorage('hexy_favorites')

            let addedPalette = {
                name: palette.name,
                pid: palette.pid
            }

            let p = palette.palette

            if (!palette) {
                return
            }

            // console.log('favorites.length', favorites.length)
            // console.log('p.length', p.length)
            // console.log('localFavorites.length', localFavorites && localFavorites.length)

            let newPalette = arrayDiffByKey('hex', p, favorites)
            let intersection = p.filter(x => favorites.includes(x))
            let difference = p.filter(x => !favorites.includes(x))
            let division = p.filter(x => !newPalette.includes(x))

            // check if color from palette already exists in favorites (returns boolean)
            const exists = favorites.some(i => p.some(j => j.name === i.name))

            // console.log('handleAddPaletteToFavorites', exists)
            // console.log('handleAddPaletteToFavorites: favorites', favorites)
            // console.log('handleAddPaletteToFavorites: newPalette', newPalette)
            // console.log('handleAddPaletteToFavorites: difference', difference)
            // console.log('handleAddPaletteToFavorites: division', division)
            // console.log('handleAddPaletteToFavorites: intersection', intersection)

            if (
                favorites.length > 15 ||
                (newPalette && newPalette.length > 15)
            ) {
                alert('The maximum number of Favorites is 15.')
                return
            }

            // if a color exists, add rest of colors from palette to favorites
            if (
                (exists && !localAddedPalettes) ||
                (exists && localAddedPalettes.length === 0)
            ) {
                console.log('exists, no local')
                let newFavorites = [...newPalette, ...division]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
                setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
                return
            }

            if (localAddedPalettes && localAddedPalettes.length) {
                const found = localAddedPalettes.some(
                    el => el.name === palette.name
                )
                if (!found) {
                    const newPalettes = [
                        ...localAddedPalettes,
                        { ...addedPalette }
                    ]
                    // console.log('!found')
                    let newFavorites = [...favorites, ...p]
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', newPalettes)
                } else if (exists) {
                    let filteredPalettes = localAddedPalettes.filter(
                        el => el.name !== palette.name
                    )
                    // console.log('exists')
                    let toRemove = [...division]
                    // console.log('exists toRemove', toRemove)
                    let newFavorites = favorites.filter(
                        el => !toRemove.includes(el)
                    )
                    // let newFavorites = [...newPalette]
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', filteredPalettes)
                } else {
                    let filteredPalettes = localAddedPalettes.filter(
                        el => el.name !== palette.name
                    )
                    let toRemove = [...intersection, ...difference]
                    let newFavorites = favorites.filter(
                        el => !toRemove.includes(el)
                    )
                    // console.log('else')
                    setFavorites(newFavorites)
                    setLocalStorage('hexy_favorites', newFavorites)
                    setLocalStorage('hexy_added_palettes', filteredPalettes)
                }
            } else if (!localAddedPalettes || localAddedPalettes.length === 0) {
                // console.log('nothing')
                let newFavorites = [...favorites, ...p]
                setFavorites(newFavorites)
                setLocalStorage('hexy_favorites', newFavorites)
                setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
            }
        },
        [favorites]
    )

    // const paletteExists = (palette) => {
    //     const localAddedPalettes = getLocalStorage('hexy_added_palettes')
    //     const exists = favorites.some(i => palette.some(j => j.name === i.name))
    // }

    useEffect(() => {
        let errorContent
        let timeout
        if (favoritesError) {
            errorContent = favoritesErrorContent(
                user,
                currentUser,
                numFaves,
                toggleErrorModal
            )
            setFavErrorContent(errorContent)
            timeout = setTimeout(() => {
                setFavoritesError(false)
            }, 4000)
        }
        return () => {
            clearTimeout(timeout)
            setFavoritesError(false)
        }
    }, [favoritesError, currentUser, user, numFaves, toggleErrorModal])

    useEffect(() => {
        getFavorites()
    }, [])

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                handleFavorites,
                setFavorites,
                getFavorites,
                removeFavorite,
                clearFavorites,
                handleAddPaletteToFavorites
            }}
        >
            {props.children}
            {toggleErrorModal && (
                <Modali.Modal {...errorModal} animated={true} centered={true}>
                    {favErrorContent}
                </Modali.Modal>
            )}
        </FavoritesContext.Provider>
    )
}

export { FavoritesContextWrapper, FavoritesContext }
