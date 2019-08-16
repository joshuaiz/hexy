import React from 'react'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { getNumberOfNamedColors, humanize } from '../../utils/helpers'

let num = getNumberOfNamedColors()

const Wrapper = ({ children, location, match, user }) => {
    // console.log(location)
    let key = location.key
    let currentPath = window.location.pathname

    if (currentPath === '/') {
        currentPath = 'home'
    } else {
        currentPath = currentPath.substring(1)
    }

    // console.log('Wrapper', currentPath)

    return (

        <div
            className={`${currentPath}-page ${user ? 'user' : 'no-user'} ${
                key && key.length ? 'match' : 'no-match'
            }`}
        >
            <Helmet>
                <title>Hexy{currentPath && ` - ${humanize(currentPath)}`}</title>
                <meta name="description" content={`Explore ${num} named hex colors.`}  />

                
                <meta property="og:url" content={`${window.location.origin.toString()}/${currentPath}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Hexy${currentPath && ' - ' + humanize(currentPath)}`}/>
                <meta property="og:image" content={`${window.location.origin.toString()}/hexy.jpg`} />
                <meta property="og:image:alt" content="Hexy home page with colors" />
                <meta property="og:image:width" content="1200"/>                
                <meta property="og:image:height" content="630" />
                <meta property="og:description" ccontent={`Explore ${num} named hex colors.`} />
                <meta property="og:site_name" content="Hexy" />
                <meta property="og:locale" content="en_US" />

                <meta name="twitter:card" content={`Explore ${num} named hex colors.`} />
                <meta name="twitter:site" content="@studio_bio" />
                <meta name="twitter:creator" content="@studio_bio" />
                <meta name="twitter:url" content={`${window.location.origin.toString()}/${currentPath}`} />
                <meta name="twitter:title" content={`Hexy${currentPath && ' - ' + humanize(currentPath)}`}/>
                <meta name="twitter:description" content={`Explore ${num} named hex colors.`} />
                <meta name="twitter:image" content={`${window.location.origin.toString()}/hexy.jpg`} />
                <meta name="twitter:image:alt" content="Hexy home page with colors." />

            </Helmet>
            {children}
        </div>
    )
}

export default withRouter(Wrapper)
