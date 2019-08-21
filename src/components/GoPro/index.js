import React from 'react'
import { withRouter } from 'react-router-dom'
import PriceTable from './PriceTable'
import './GoPro.scss'
import ScrollToTop from '../ScrollToTop'

const GoPro = ({ cart, addToCart }) => {
    return (
        <div className="gopro">
            <ScrollToTop />
            <h1 className="page-title">Hexy Accounts</h1>
            <p className="gopro-intro">
                <strong>Hexy Pro</strong> accounts give you more ways to
                explore, save, and share your favorite colors
                <br />
                whether you're a design pro or just having fun.
            </p>
            <PriceTable cart={cart} addToCart={addToCart} />
        </div>
    )
}

export default withRouter(GoPro)
