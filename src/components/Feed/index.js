import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Toggle from 'react-toggle'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import { db } from '../../config/firebaseconfig'
import FeedList from './FeedList'
import './Feed.scss'

const Feed = ({
    handleFavorites,
    removeFavorite,
    favorites,
    paletteExported
}) => {
    const [feed, setFeed] = useState([])
    const [paletteLiked, setPaletteLiked] = useState(false)
    const [swatchInfo, setSwatchInfo] = useState(true)

    useEffect(() => {
        // used to cancel async fetch on unmount
        // see here: https://github.com/facebook/react/issues/14326
        let didCancel = false

        const palettes = []
        let palettesRef = db.collection('palettes').orderBy('date', 'desc')
        palettesRef
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    palettes.push(doc.data())
                    //   console.log(doc.id, '=>', doc.data());
                })
                if (!didCancel) {
                    setFeed(palettes)
                    return palettes
                }
            })
            .catch(err => {
                console.log('Error getting documents', err)
            })

        // cleanup function
        return () => {
            didCancel = true
        }
    }, [paletteLiked, paletteExported])

    const handleLike = (pid, likedPalette, paletteName) => {
        const increment = firebase.firestore.FieldValue.increment(1)
        const decrement = firebase.firestore.FieldValue.increment(-1)
        let palette = db.doc(`palettes/${pid}`)

        const likedPalettes = JSON.parse(
            localStorage.getItem('hexy_liked_palettes')
        )

        let addedPalette = {
            name: paletteName,
            palette: likedPalette
        }

        // keep liked palettes in localStorage so we can increment/decrement likes count
        if (likedPalettes && likedPalettes.length) {
            const found = likedPalettes.some(item => item.name === paletteName)
            // console.log(found)
            if (!found) {
                const newPalettes = [...likedPalettes, { ...addedPalette }]
                localStorage.setItem(
                    'hexy_liked_palettes',
                    JSON.stringify(newPalettes)
                )
                palette.update({ likes: increment })
                setPaletteLiked(true)
                setTimeout(() => {
                    setPaletteLiked(false)
                }, 1000)
            } else {
                let filteredPalettes = likedPalettes.filter(
                    item => item.name !== paletteName
                )

                localStorage.setItem(
                    'hexy_liked_palettes',
                    JSON.stringify(filteredPalettes)
                )
                palette.update({ likes: decrement })
                setPaletteLiked(true)
                setTimeout(() => {
                    setPaletteLiked(false)
                }, 1000)
            }
        } else if (!likedPalettes || likedPalettes.length === 0) {
            localStorage.setItem(
                'hexy_liked_palettes',
                JSON.stringify([{ ...addedPalette }])
            )
            palette.update({ likes: increment })
            setPaletteLiked(true)
            setTimeout(() => {
                setPaletteLiked(false)
            }, 1000)
        }
    }

    const handleToggle = () => {
        setSwatchInfo(!swatchInfo)
    }

    // console.log('paletteLiked', paletteLiked)

    return (
        <div className="feed">
            <div className="feed-header">
                <h2>Latest Palettes</h2>
                <div className="feed-toggle">
                    <label>
                        <Toggle
                            defaultChecked={!swatchInfo}
                            icons={false}
                            onChange={handleToggle}
                        />
                        <span>{swatchInfo ? 'Show' : 'Hide'} swatch info</span>
                    </label>
                </div>
            </div>

            <FeedList
                feed={feed}
                handleLike={handleLike}
                handleFavorites={handleFavorites}
                removeFavorites={removeFavorite}
                swatchInfo={swatchInfo}
            />
        </div>
    )
}

export default withRouter(Feed)
