import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import { db } from '../../config/firebaseconfig'
import FeedList from './FeedList'
import './Feed.scss'

const Feed = ({ handleFavorites, removeFavorite, favorites }) => {
    const [feed, setFeed] = useState([])
    const [paletteLiked, setPaletteLiked] = useState(false)

    useEffect(() => {
        let didCancel = false

        async function getPalettes() {
            const palettes = []
            await firebase
                .firestore()
                .collection('palettes')
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        palettes.push(doc.data())
                    })
                })
            if (!didCancel) {
                setFeed(palettes)
                return palettes
            }
        }
        getPalettes()

        return () => {
            didCancel = true
        }
    }, [paletteLiked, feed])

    // console.log(feed)

    const handleLike = pid => {
        const increment = firebase.firestore.FieldValue.increment(1)
        const decrement = firebase.firestore.FieldValue.increment(-1)
        let palette = db.doc(`palettes/${pid}`)

        // Update likes count
        if (!paletteLiked) {
            palette.update({ likes: increment })
            setPaletteLiked(true)
        } else {
            palette.update({ likes: decrement })
            setPaletteLiked(false)
        }
    }

    return (
        <div className="feed">
            <h2>Latest Palettes</h2>
            {feed && feed.length ? (
                <FeedList
                    feed={feed}
                    handleLike={handleLike}
                    handleFavorites={handleFavorites}
                    removeFavorites={removeFavorite}
                />
            ) : null}
        </div>
    )
}

export default withRouter(Feed)
