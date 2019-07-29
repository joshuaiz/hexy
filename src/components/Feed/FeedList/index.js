import React, { useState } from 'react'
// import Tippy from '@tippy.js/react'
// import { Tooltip } from 'react-tippy'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import FeedItem from '../FeedItem'
// import { ReactComponent as Heart } from '../../../images/heart.svg'
// import { ReactComponent as PlusCircle } from '../../../images/plus_circle.svg'
// import { ReactComponent as AddFavorites } from '../../../images/add_favorites.svg'
// import FeedItem from '../FeedItem'
// import Swatch from '../../Swatch'
// import FavoritesPDF from '../../Favorites/FavoritesPDF'

const FeedList = ({
    feed,
    handleLike,
    handleFavorites,
    handleAddPaletteToFavorites,
    removeFavorite,
    swatchInfo
}) => {
    const { user } = useAuthState(firebase.auth())

    return (
        <ul className={`nostyle feed-list ${swatchInfo ? 'no-info' : 'info'}`}>
            {feed.map((item, index) => {
                // console.log('FeedList', item.name, item.likes)
                return (
                    <FeedItem
                        key={item.date}
                        item={item}
                        handleLike={handleLike}
                        handleFavorites={handleFavorites}
                        handleAddPaletteToFavorites={
                            handleAddPaletteToFavorites
                        }
                        removeFavorite={removeFavorite}
                    />
                )
            })}
        </ul>
    )
}

export default FeedList
