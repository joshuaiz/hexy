import React, { createContext } from 'react'

const FavoritesContext = createContext()

const FavoritesContextProvider = ({ children }) => {
    const values = { a: 'test1', b: 'test2' }

    return (
        <FavoritesContext.Provider value={values}>
            {children}
        </FavoritesContext.Provider>
    )
}

export { FavoritesContextProvider, FavoritesContext }
